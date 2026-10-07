/* UrSKOOL school search for the profile picker.
 *
 * Order: 1) direct UniApplyForMe Labs call when a browser token exists
 *        (window.ENV.VITE_LABS_TOKEN in env.js):
 *        GET https://api.labs.org.za/v1/data/high-schools?search=<q>&page=1&per_page=10
 *        with `Authorization: Bearer <token>`.
 *        2) Secure same-origin proxy (token stays server-side, no CORS):
 *        GET api/schools.php?q=<q>.
 *
 * Empty queries return immediately without any API call. A multi-word query
 * with 0 results is retried once with its first word ("hazyview
 * comprehensive" -> "hazyview"). HTTP 401 -> "Invalid API key",
 * HTTP 429 -> "Too many requests". Network/CORS/non-JSON failures fall
 * through to the proxy, and finally to the bundled offline directory
 * (school-data.js), so the picker keeps working with no backend at all.
 */
(function () {
    'use strict';

    var LABS_ENDPOINT = 'https://api.labs.org.za/v1/data/high-schools';
    var PROXY_ENDPOINT = 'api/schools.php';
    var PER_PAGE = 10;
    var REQUEST_TIMEOUT_MS = 12000;

    function searchError(message, status, code) {
        return {
            name: 'SearchError',
            message: message,
            status: status || 0,
            code: code || 'search_failed'
        };
    }

    function normalizeToken(raw) {
        // Defensive: only non-empty strings can be bearer tokens.
        if (typeof raw !== 'string') return '';
        var token = raw.trim();
        if (!token) return '';
        // Strip accidental "Bearer " prefixes and surrounding quotes pasted
        // from docs/dashboards (e.g. in ?labs_token=... or env.js).
        token = token.replace(/^bearer\s+/i, '');
        if (token.length > 1 && (
            (token.charAt(0) === '"' && token.charAt(token.length - 1) === '"') ||
            (token.charAt(0) === "'" && token.charAt(token.length - 1) === "'")
        )) {
            token = token.slice(1, -1).trim();
        }
        // Reject obvious placeholder/HTML junk rather than sending it.
        if (!token || /[<>\s]/.test(token) || token.length < 8) return '';
        return token;
    }

    function tokenFromQueryString() {
        try {
            if (typeof window === 'undefined' || !window.location || !window.location.search) return '';
            var params = new URLSearchParams(window.location.search);
            var candidates = [params.get('labs_token'), params.get('token'), params.get('api_key')];
            for (var i = 0; i < candidates.length; i++) {
                var normalized = normalizeToken(candidates[i] || '');
                if (normalized) return normalized;
            }
        } catch (error) { /* URL parsing unavailable: ignore */ }
        return '';
    }

    function getClientToken() {
        var env = (typeof window !== 'undefined' && window.ENV) || {};
        var fromQuery = tokenFromQueryString();
        if (fromQuery) {
            // Cache a valid override so later keystrokes keep working.
            try { env.VITE_LABS_TOKEN = fromQuery; } catch (error) { /* ignore */ }
            return fromQuery;
        }
        var candidates = [env.VITE_LABS_TOKEN, env.LABS_TOKEN];
        if (typeof window !== 'undefined') candidates.push(window.LABS_TOKEN);
        for (var i = 0; i < candidates.length; i++) {
            var normalized = normalizeToken(candidates[i]);
            if (normalized) return normalized;
        }
        return '';
    }

    function firstWord(query) {
        var parts = String(query || '').split(/\s+/).filter(Boolean);
        return parts.length > 1 ? parts[0] : '';
    }

    /* ---- Province scoping -------------------------------------------------
     * Every search is limited to the learner's province. The comparison is
     * whitespace- and case-insensitive so the form value "GAUTENG" matches the
     * directory value "Gauteng". An entry with no province cannot be confirmed
     * as belonging to the selection, so it is excluded when filtering. */
    var PROVINCES = [
        'Gauteng',
        'KwaZulu-Natal',
        'Western Cape',
        'Eastern Cape',
        'Limpopo',
        'Mpumalanga',
        'North West',
        'Free State',
        'Northern Cape'
    ];

    // Returns the directory's own spelling for a province ("GAUTENG" ->
    // "Gauteng") so requests carry the canonical value upstream.
    function normalizeProvince(value) {
        var cleaned = String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
        if (!cleaned) return '';
        for (var i = 0; i < PROVINCES.length; i++) {
            if (PROVINCES[i].toLowerCase() === cleaned) return PROVINCES[i];
        }
        return cleaned;
    }

    function matchesProvince(school, province) {
        var wanted = normalizeProvince(province);
        if (!wanted) return true;
        var actual = normalizeProvince(school && school.province);
        return actual !== '' && actual === wanted;
    }

    function filterByProvince(schools, province) {
        if (!normalizeProvince(province)) return schools;
        return schools.filter(function (school) { return matchesProvince(school, province); });
    }

    /* ---- Query narrowing --------------------------------------------------
     * The directory's own `search` is loose: "grey college" answers 350 rows,
     * "bryanston high" 1008, and even a single word is matched fuzzily
     * ("hazyview" offers "HILLS VIEW COLLEGE"). Every offered name must
     * therefore actually contain all of the learner's words, so typing
     * "Hazyview Private" narrows to the one school - and auto-finish can never
     * select a school whose name does not match what was typed. Typos still
     * resolve through the bundled directory, which applies its own fuzzy
     * scoring as a fallback. */
    function matchesAllQueryWords(name, query) {
        var words = stripDiacritics(query).toLowerCase().split(/\s+/).filter(Boolean);
        if (!words.length) return true;
        var hay = stripDiacritics(name).toLowerCase();
        for (var i = 0; i < words.length; i++) {
            if (hay.indexOf(words[i]) === -1) return false;
        }
        return true;
    }

    function filterByQueryText(schools, query) {
        if (!String(query || '').trim()) return schools;
        return schools.filter(function (school) {
            return matchesAllQueryWords(school && school.name, query);
        });
    }

    function normalizeSchool(raw) {
        if (!raw || typeof raw !== 'object') return null;
        var name = String(raw.name || '').trim();
        if (!name) return null;
        var emis = String(raw.emis_number || raw.nat_emis || raw.emis || '').trim();
        var province = String(raw.province_name || raw.province || '').trim();
        var id = String(raw.id || raw.emis_number || raw.nat_emis || raw.emis || '').trim();
        return { id: id || name, name: name, province: province, emis: emis };
    }

    function normalizeList(rows) {
        var list = Array.isArray(rows) ? rows : [];
        return list
            .map(normalizeSchool)
            .filter(function (school) { return school !== null; })
            .slice(0, PER_PAGE);
    }

    function errorFromPayload(status, payload) {
        // Error envelopes seen in the wild:
        //   proxy: { ok: false, error: { code, message } } (HTTP 4xx/5xx)
        //   labs:  { error: { code, message } }            (HTTP 4xx/5xx)
        if (status === 401) return searchError('Invalid API key', 401, 'invalid_api_key');
        if (status === 429) return searchError('Too many requests', 429, 'rate_limited');
        var message = '';
        if (payload && typeof payload.error === 'object' && payload.error !== null) {
            message = String(payload.error.message || '');
        } else if (payload && typeof payload.error === 'string') {
            message = payload.error;
        }
        if (message) return searchError(message, status, 'request_failed');
        if (!payload) {
            // Not JSON at all (static-host 404 page, PHP not running, ...).
            return searchError('unreachable', status, 'unreachable');
        }
        return searchError('School search failed. Please try again.', status, 'request_failed');
    }

    function requestJson(url, options) {
        var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        var timer = null;
        var fetchOptions = options || {};
        if (controller) {
            fetchOptions = {
                method: fetchOptions.method || 'GET',
                headers: fetchOptions.headers,
                credentials: fetchOptions.credentials,
                signal: controller.signal
            };
            timer = window.setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS);
        }
        return fetch(url, fetchOptions).then(
            function (response) {
                if (timer) window.clearTimeout(timer);
                return response.json().catch(function () { return null; }).then(function (payload) {
                    if (!payload || !response.ok || payload.ok === false) {
                        throw errorFromPayload(response.status, payload);
                    }
                    return payload;
                });
            },
            function () {
                // Network failure, DNS failure, CORS block, abort, file://, ...
                if (timer) window.clearTimeout(timer);
                throw searchError('unreachable', 0, 'unreachable');
            }
        );
    }

    function searchLabs(query, token, province) {
        var url = LABS_ENDPOINT +
            '?search=' + encodeURIComponent(query) +
            '&page=1&per_page=' + PER_PAGE;
        // The directory filters by province natively, so one page is enough.
        if (province) url += '&province=' + encodeURIComponent(province);
        return requestJson(url, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token, 'Accept': 'application/json' }
        }).then(function (payload) {
            // Narrow loose multi-word matches before the result cap is read.
            return filterByQueryText(normalizeList(payload.data), query);
        });
    }

    function searchProxy(query, province) {
        var url = PROXY_ENDPOINT + '?q=' + encodeURIComponent(query);
        if (province) url += '&province=' + encodeURIComponent(province);
        return requestJson(url, {
            method: 'GET',
            credentials: 'same-origin',
            headers: { 'Accept': 'application/json' }
        }).then(function (payload) {
            // Proxy envelope: { ok: true, data: { schools, count, matchedQuery } }.
            var data = (payload.data && typeof payload.data === 'object') ? payload.data : payload;
            return {
                schools: filterByQueryText(normalizeList(data.schools), query),
                matchedQuery: String(data.matchedQuery || query)
            };
        });
    }

    function withPartialFallback(query, fetcher) {
        return fetcher(query).then(function (schools) {
            if (schools.length > 0) {
                return { schools: schools, query: query, matchedQuery: query };
            }
            var word = firstWord(query);
            if (!word) {
                return { schools: [], query: query, matchedQuery: query };
            }
            return fetcher(word).then(function (retry) {
                return {
                    schools: retry,
                    query: query,
                    matchedQuery: retry.length > 0 ? word : query
                };
            });
        });
    }

    function isHardError(error) {
        return !!error && (error.status === 401 || error.status === 429);
    }

    function offlineDirectory() {
        var list = (typeof window !== 'undefined' && window.URSKOOL_SCHOOL_DIRECTORY) || [];
        return Array.isArray(list) ? list : [];
    }

    function stripDiacritics(value) {
        return String(value || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    function searchOffline(query, province) {
        // Token-free fuzzy match over the bundled directory: every query word
        // must match (exact word, prefix, or substring) so typos like
        // "hazy comprehensive" still resolve to "Hazyview Comprehensive".
        var words = stripDiacritics(query).toLowerCase().split(/\s+/).filter(Boolean);
        if (!words.length) return [];
        var scored = [];
        var directory = offlineDirectory();
        for (var i = 0; i < directory.length; i++) {
            var entry = directory[i] || {};
            var name = String(entry.name || '').trim();
            if (!name) continue;
            // Scope to the learner's province before scoring, so the result cap
            // fills with in-province schools instead of other provinces.
            var school = {
                id: name,
                name: name,
                province: String(entry.province || '').trim(),
                emis: ''
            };
            if (!matchesProvince(school, province)) continue;
            var hayName = stripDiacritics(name).toLowerCase();
            var hayWords = hayName.split(/[^a-z0-9\u00C0-\u024F]+/).filter(Boolean);
            var ok = true;
            var score = 0;
            for (var w = 0; w < words.length; w++) {
                var word = words[w];
                var matched = false;
                for (var h = 0; h < hayWords.length; h++) {
                    var hay = hayWords[h];
                    if (hay === word) { matched = true; score += 3; break; }
                    if (hay.indexOf(word) === 0) { matched = true; score += 2; break; }
                    if (word.length >= 4 && hay.indexOf(word) > 0) { matched = true; score += 1; break; }
                    // One-character forgiveness for typos ("hazy" vs "hazyview"
                    // style prefixes are covered by startsWith above; this
                    // covers single-letter slips inside a word).
                    if (word.length >= 4 && hay.length >= 4 && oneEditAway(word, hay)) {
                        matched = true;
                        score += 1;
                        break;
                    }
                }
                if (!matched) { ok = false; break; }
            }
            if (ok) {
                scored.push({
                    school: school,
                    score: score,
                    index: i
                });
            }
        }
        scored.sort(function (a, b) {
            if (b.score !== a.score) return b.score - a.score;
            return a.index - b.index;
        });
        return scored
            .slice(0, PER_PAGE)
            .map(function (item) { return item.school; });
    }

    function oneEditAway(a, b) {
        if (a === b) return true;
        var lenA = a.length;
        var lenB = b.length;
        if (Math.abs(lenA - lenB) > 1) return false;
        var i = 0;
        var j = 0;
        var edits = 0;
        while (i < lenA && j < lenB) {
            if (a.charAt(i) === b.charAt(j)) { i++; j++; continue; }
            edits++;
            if (edits > 1) return false;
            if (lenA === lenB) { i++; j++; }
            else if (lenA > lenB) { i++; }
            else { j++; }
        }
        return edits + (lenA - i) + (lenB - j) <= 1;
    }

    function search(rawQuery, options) {
        var query = String(rawQuery || '').trim();
        var province = normalizeProvince(options && options.province);

        // Empty query must never hit the API.
        if (!query) {
            return Promise.resolve({ schools: [], query: '', matchedQuery: '', province: province });
        }

        // Last line of defence: whatever path produced the results, only schools
        // in the requested province are ever handed to the picker.
        function finalize(result) {
            return {
                schools: filterByProvince((result && result.schools) || [], province),
                query: (result && result.query) || query,
                matchedQuery: (result && result.matchedQuery) || query,
                offline: !!(result && result.offline === true),
                province: province
            };
        }

        var token = getClientToken();
        var hardError = null;

        var directAttempt = function () {
            // Skipped when no browser token exists so the secret can stay
            // server-side in the proxy.
            if (!token) return Promise.resolve(null);
            return withPartialFallback(query, function (q) {
                return searchLabs(q, token, province);
            }).catch(function (error) {
                if (isHardError(error)) hardError = error;
                return null; // fall through to the backend proxy
            });
        };

        return directAttempt().then(function (directResult) {
            // A direct answer that actually matched wins; an empty one must not
            // block the proxy/offline paths from supplying candidates.
            if (directResult && directResult.schools && directResult.schools.length > 0) return directResult;
            // The proxy applies its own first-word fallback server-side, so
            // one call per user query is enough here.
            return searchProxy(query, province).then(function (proxyResult) {
                // Proxy answered but found nothing and has no offline
                // knowledge: supplement with the bundled directory so the
                // picker still offers candidates.
                if (!proxyResult.schools || proxyResult.schools.length === 0) {
                    var local = searchOffline(query, province);
                    if (local.length > 0) {
                        return { schools: local, query: query, matchedQuery: firstWord(query) || query, offline: true };
                    }
                }
                return proxyResult;
            }).catch(function (error) {
                if (isHardError(error)) hardError = hardError || error;
                var local = searchOffline(query, province);
                if (local.length > 0) {
                    // Live paths failed, but we have local candidates: serve
                    // them rather than erroring.
                    return { schools: local, query: query, matchedQuery: query, offline: true };
                }
                if (hardError) throw hardError;
                if (error && error.code === 'unreachable') {
                    // Backend/proxy not reachable AND nothing local matched:
                    // report "no results" instead of an error so gibberish
                    // queries show "No matching schools found."
                    return { schools: [], query: query, matchedQuery: query, offline: true };
                }
                if (error && error.message) throw error;
                throw searchError(
                    'School search is unavailable right now. Please try again.',
                    0,
                    'search_unavailable'
                );
            });
        }).then(finalize);
    }

    window.UrskoolSchoolSearch = {
        // search(query, { province }) -> Promise<{ schools, query, matchedQuery, offline, province }>
        // Only schools in the given province are returned.
        search: search,
        perPage: PER_PAGE,
        provinces: PROVINCES
    };
})();
