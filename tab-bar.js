// ============================================================
// SHARED TAB BAR SCRIPT
// Ensures icons function properly from any page
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // ICON SVG TEMPLATES
    // ============================================================
    function homeSvgHtml() {
        return `
            <svg class="home-icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
        `;
    }

    function searchSvgHtml() {
        return `
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
        `;
    }

    function inboxSvgHtml() {
        return `
            <svg class="inbox-icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
        `;
    }

    function folderSvgHtml() {
        return `
            <svg class="folder-icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
        `;
    }

    function timetableSvgHtml() {
        return `
            <svg class="schedule-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="30" height="30" aria-hidden="true">
                <style>
                    .schedule-icon { fill: none; stroke: currentColor; stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; }
                    .schedule-icon .filled-block { fill: currentColor; stroke: none; }
                </style>
                <path d="M 12 35 L 12 82 A 6 6 0 0 0 18 88 L 47 88" />
                <path d="M 85 42 L 85 24 A 6 6 0 0 0 79 18 L 18 18 A 6 6 0 0 0 12 24 L 12 35 Z" />
                <line x1="12" y1="38" x2="85" y2="38" />
                <line x1="30" y1="8" x2="30" y2="24" />
                <line x1="65" y1="8" x2="65" y2="24" />
                <rect class="filled-block" x="20" y="47" width="10" height="8" rx="1" />
                <rect class="filled-block" x="36" y="47" width="10" height="8" rx="1" />
                <rect class="filled-block" x="52" y="47" width="10" height="8" rx="1" />
                <rect class="filled-block" x="20" y="62" width="10" height="8" rx="1" />
                <rect class="filled-block" x="36" y="62" width="10" height="8" rx="1" />
                <circle cx="73" cy="71" r="21" fill="white" />
                <path d="M 73 57 L 73 71 L 83 71" />
            </svg>
        `;
    }

    function profileSvgHtml() {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`;
    }

    function cultureSvgHtml() {
        // Ported 1:1 from the brand mark (1.jpg, 2000x2000): a flat mitered mortarboard
        // rhombus whose left vertex carries the tassel, a large head circle tucked up under
        // the cap, and a wide shoulders arc whose ends are rounded. Every number below was
        // measured off 1.jpg and normalised into this 100x100 box, in which the mark fills
        // x 0..100 and y 1.99..98.01 (yes, the cap really is that flat - 731x277.5px in the
        // source, drawn with a 45px stroke).
        // The cap-over-head and head-over-shoulders stacking is done with masks rather than
        // opaque fills so the glyph stays transparent and keeps inheriting currentColor in
        // light, dark and active states.
        // The viewBox is padded (-9.5 -9.5 119 119) instead of 0 0 100 100: the cap's sharp
        // left/right vertices miter out to x 0/100, so in a 0 0 100 100 box the glyph fills
        // 100% of its slot and renders visibly bigger than the 24-box tab icons, whose
        // artwork only spans ~83-92% of theirs. The padding scales the mark to 84% wide /
        // 81% tall, i.e. the same optical size as Home / Timetable / Inbox / Profile.
        const capPath = 'M50 5.29 L91.32 20.97 L50 36.65 L8.68 20.97 Z';
        return `
            <svg class="culture-icon" xmlns="http://www.w3.org/2000/svg" viewBox="-9.5 -9.5 119 119" width="30" height="30" fill="none" stroke="currentColor" stroke-width="6.16" stroke-linecap="round" stroke-linejoin="miter" aria-hidden="true">
                <defs>
                    <mask id="urskool-culture-cap-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
                        <rect x="0" y="0" width="100" height="100" fill="#fff" stroke="none"></rect>
                        <path d="${capPath}" fill="#000" stroke="#000" stroke-width="6.16" stroke-linejoin="miter"></path>
                    </mask>
                    <mask id="urskool-culture-head-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
                        <rect x="0" y="0" width="100" height="100" fill="#fff" stroke="none"></rect>
                        <circle cx="50" cy="47.87" r="30.53" fill="#000" stroke="none"></circle>
                    </mask>
                </defs>
                <path d="M13.95 94.95 A 37.59 27.02 0 0 1 86.05 94.95" mask="url(#urskool-culture-head-mask)"></path>
                <circle cx="50" cy="47.87" r="27.45" mask="url(#urskool-culture-cap-mask)"></circle>
                <path d="${capPath}"></path>
                <rect x="0" y="18.4" width="5.75" height="44.73" fill="currentColor" stroke="none"></rect>
            </svg>
        `;
    }

    function backArrowSvgHtml() {
        return `
            <svg class="back-arrow-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
        `;
    }

    // ============================================================
    // STYLES
    // ============================================================
    function injectTabbarStyles() {
        if (document.getElementById('tabbar-responsive-style')) return;
        const style = document.createElement('style');
        style.id = 'tabbar-responsive-style';
        style.textContent = `
            .tab-btn {
                display: grid;
                place-items: center;
                width: 56px;
                height: 56px;
                padding: 0;
                line-height: 0;
            }
            .tab-btn svg {
                width: 30px;
                height: 30px;
                display: block;
                margin: auto;
            }
            .tab-btn {
                font-size: 30px;
            }
            .back-link, .back-btn, .about-back-btn, .back-to-list {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                line-height: 1;
                vertical-align: middle;
            }
            .back-link svg, .back-btn svg, .about-back-btn svg, .back-to-list svg, .back-arrow-svg {
                display: inline-block;
                flex-shrink: 0;
                vertical-align: middle;
            }
            a:not(.tab-btn)[href$="admin-feed.html"], a:not(.tab-btn)[href*="#back"] {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                vertical-align: middle;
            }
            @media (max-width: 380px) {
                .tab-btn svg {
                    width: 24px;
                    height: 24px;
                }
                .tab-btn {
                    font-size: 24px;
                }
            }
            @media (min-width: 381px) and (max-width: 599px) {
                .tab-btn svg {
                    width: 27px;
                    height: 27px;
                }
                .tab-btn {
                    font-size: 27px;
                }
            }
            @media (min-width: 600px) and (max-width: 1024px) {
                .tab-btn svg {
                    width: 34px;
                    height: 34px;
                }
                .tab-btn {
                    font-size: 32px;
                }
            }
            @media (min-width: 1025px) {
                .tab-btn svg {
                    width: 36px;
                    height: 36px;
                }
                .tab-btn {
                    font-size: 34px;
                }
            }
            /* Student Culture icon: no size overrides any more - it is sized by the
               .tab-btn svg rules above, exactly like every other tab icon. Its artwork
               fills its own box (the cap's miters reach x 0/100), so cultureSvgHtml()
               draws inside a padded viewBox and lands at the neighbors' optical size. */
        `;
        document.head.appendChild(style);
    }

    // ============================================================
    // HELPERS
    // ============================================================
    function getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename;
    }

    async function hasAuthenticatedSession() {
        try {
            const response = await fetch('api/auth.php?action=me', { credentials: 'same-origin' });
            const payload = await response.json();
            if (!response.ok || !payload || payload.ok !== true || !payload.data.user) return false;

            localStorage.setItem('schoolProfileData', JSON.stringify(payload.data.user));
            try {
                const usersResponse = await fetch('api/users.php', { credentials: 'same-origin' });
                const usersPayload = await usersResponse.json();
                if (usersResponse.ok && usersPayload.ok && Array.isArray(usersPayload.data.users)) {
                    localStorage.setItem('schoolUsersRegistry', JSON.stringify(usersPayload.data.users));
                }
            } catch (error) {
                localStorage.removeItem('schoolUsersRegistry');
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    async function enforceAuthenticatedPage() {
        const page = getCurrentPage().toLowerCase();
        const publicPages = ['index.html', 'index.htm', 'about.html', '_tabbar-icon-check.html'];
        if (publicPages.includes(page)) return true;

        document.documentElement.style.visibility = 'hidden';
        if (await hasAuthenticatedSession()) {
            document.documentElement.style.visibility = '';
            return true;
        }
        localStorage.removeItem('schoolSession');
        window.location.replace('login.html');
        return false;
    }

    function getSavedProfile() {
        try {
            return JSON.parse(localStorage.getItem('schoolProfileData') || '{}');
        } catch (error) {
            return {};
        }
    }

    function getRole() {
        const profile = getSavedProfile();
        return (profile.role || '').toString().trim().toLowerCase();
    }

    function isAdminRole(role) {
        return role === 'administrator' || role === 'admin';
    }

    function isStudentRole(role) {
        return role === 'student';
    }

    function getSearchQuery() {
        // Try to get query from the current page's search input if present
        const searchInput = document.getElementById('searchInput') || document.getElementById('feedSearchInput') || document.getElementById('learnerSearchInput');
        if (searchInput) {
            return searchInput.value.trim();
        }
        // Fall back to URL query param
        const params = new URLSearchParams(window.location.search);
        return params.get('q') || '';
    }

    function navigateToSearch() {
        const query = getSearchQuery();
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        window.location.href = `search-results.html${params.toString() ? '?' + params.toString() : ''}`;
    }

    // ============================================================
    // TAB BAR RENDERING
    // ============================================================
    function renderTabBar() {
        const bottomBar = document.getElementById('bottomTabBar');
        if (!bottomBar) return;

        const currentPage = getCurrentPage();
        const role = getRole();

        // Determine which tab is active based on current page
        const isHome = currentPage === 'admin-feed.html';
        const isSearch = currentPage === 'search-results.html' || currentPage === 'search-students.html';
        const isLearners = currentPage === 'school-learners.html';
        const isTimetable = currentPage === 'timetable.html';
        const isSettings = currentPage === 'settings.html';
        const isInbox = currentPage === 'inbox.html';

        // Build tab items based on role
        let tabs = [];

        // Home tab (always present)
        tabs.push({
            type: 'link',
            href: 'admin-feed.html',
            label: 'Home',
            title: 'Home',
            active: isHome,
            content: homeSvgHtml(),
            extraClass: 'home-tab'
        });

        // Search tab (always present)
        tabs.push({
            type: 'button',
            id: 'searchBtn',
            label: 'Search',
            title: 'Search',
            active: isSearch,
            content: searchSvgHtml(),
            extraClass: isHome ? 'home-search-tab' : ''
        });

        if (isAdminRole(role)) {
            // Admin: School learners (folder icon)
            tabs.push({
                type: 'link',
                href: 'school-learners.html',
                label: 'School learners',
                title: 'School learners',
                active: isLearners,
                content: folderSvgHtml(),
                extraClass: 'file-tab-btn'
            });
        } else if (isStudentRole(role)) {
            // Student: Timetable
            tabs.push({
                type: 'link',
                href: 'timetable.html',
                label: 'Timetable',
                title: 'Timetable',
                active: isTimetable,
                content: timetableSvgHtml(),
                extraClass: 'timetable-tab'
            });
        } else if (role === 'parent' || role === 'teacher') {
            // Parent/Teacher: Inbox
            tabs.push({
                type: 'link',
                href: 'inbox.html',
                label: 'Inbox',
                title: 'Inbox',
                active: isInbox,
                content: inboxSvgHtml()
            });
            if (role === 'teacher') {
                tabs.push({
                    type: 'link',
                    href: 'attendance.html',
                    label: 'Attendance',
                    title: 'Attendance',
                    active: currentPage === 'attendance.html',
                    content: timetableSvgHtml(),
                    extraClass: 'attendance-tab'
                });
            }
        }

        // Settings tab (always present)
        tabs.push({
            type: 'link',
            href: 'settings.html',
            label: 'Profile',
            title: 'Profile',
            active: isSettings,
            content: profileSvgHtml()
        });

        // Student Culture tab (Students only, placed in the middle of the bar)
        if (isStudentRole(role)) {
            tabs.splice(Math.round(tabs.length / 2), 0, {
                type: 'link',
                href: 'student-culture.html',
                label: 'Student Culture',
                title: 'Student Culture',
                active: currentPage === 'student-culture.html',
                content: cultureSvgHtml(),
                extraClass: 'culture-tab'
            });
        }

        // Render the tab bar
        bottomBar.innerHTML = tabs.map(tab => {
            const activeClass = tab.active ? ' active' : '';
            const extraClass = tab.extraClass ? ' ' + tab.extraClass : '';

            if (tab.type === 'link') {
                return `<a class="tab-btn${activeClass}${extraClass}" href="${tab.href}" aria-label="${tab.label}" title="${tab.title}">${tab.content}</a>`;
            } else {
                return `<button class="tab-btn${activeClass}${extraClass}" id="${tab.id}" type="button" aria-label="${tab.label}" title="${tab.title}">${tab.content}</button>`;
            }
        }).join('');

        // Wire up the search button
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', navigateToSearch);
        }

        if (isHome) {
            const homeSearchStyle = document.createElement('style');
            homeSearchStyle.textContent = `
                body:not(.dark-mode) .home-search-tab,
                body:not(.dark-mode) .home-search-tab:hover {
                    background: transparent;
                    box-shadow: none;
                }
            `;
            document.head.appendChild(homeSearchStyle);
        }
    }

    // ============================================================
    // COOKIE CONSENT (homepage banner only - shows once)
    // ============================================================
    function readCookieConsent() {
        try {
            const raw = localStorage.getItem('urskoolCookieConsent');
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) { return null; }
    }

    function writeCookieConsent(status) {
        try {
            localStorage.setItem('urskoolCookieConsent', JSON.stringify({ status: status, at: new Date().toISOString() }));
        } catch (e) {}
        hideCookieBanner();
    }

    function ensureCookieStyles() {
        if (document.getElementById('urskool-cookie-style')) return;
        const style = document.createElement('style');
        style.id = 'urskool-cookie-style';
        style.textContent = `
            .urskool-cookie-banner{position:fixed;left:50%;transform:translateX(-50%) translateY(20px);bottom:86px;width:min(560px,calc(100% - 24px));background:#fff;border:1px solid rgba(23,59,94,.14);border-radius:18px;box-shadow:0 18px 40px rgba(13,41,68,.22);padding:16px 18px;display:none;gap:12px;z-index:2000;font-family:inherit;}
            .urskool-cookie-banner.show{display:grid;}
            .urskool-cookie-banner p{font-size:13px;line-height:1.6;color:#314a62;margin:0;}
            .urskool-cookie-actions{display:flex;flex-wrap:wrap;gap:8px;}
            .urskool-cookie-actions button{border:0;border-radius:10px;padding:10px 16px;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;}
            .urskool-cookie-accept{background:linear-gradient(135deg,#173b5e,#3a79b8);color:#fff;}
            .urskool-cookie-decline{background:#eef4fb;color:#173b5e;border:1px solid rgba(23,59,94,.15);}
        `;
        document.head.appendChild(style);
    }

    function hideCookieBanner() {
        const banner = document.getElementById('urskoolCookieBanner');
        if (banner) banner.classList.remove('show');
    }

    function showCookieBanner() {
        // Homepage only, and only once (until user chooses)
        const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
        if (page !== '' && page !== 'index.html' && page !== 'index.htm') return;
        if (readCookieConsent()) return;
        ensureCookieStyles();
        let banner = document.getElementById('urskoolCookieBanner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'urskoolCookieBanner';
            banner.className = 'urskool-cookie-banner';
            banner.setAttribute('role', 'dialog');
            banner.setAttribute('aria-label', 'Cookie consent');
            banner.innerHTML = '<p>We use cookies to improve your experience on UrSkool.co.za. By continuing you accept our use of cookies. See <a href="privacy-policy.html" style="color:#3a79b8;font-weight:700;">Privacy Policy</a>.</p>' +
                '<div class="urskool-cookie-actions">' +
                '<button type="button" class="urskool-cookie-accept" data-cookie="accept">Accept</button>' +
                '<button type="button" class="urskool-cookie-decline" data-cookie="decline">Decline</button>' +
                '</div>';
            document.body.appendChild(banner);
            banner.addEventListener('click', function(e) {
                const action = e.target && e.target.getAttribute ? e.target.getAttribute('data-cookie') : null;
                if (action === 'accept') writeCookieConsent('accepted');
                else if (action === 'decline') writeCookieConsent('declined');
            });
        }
        setTimeout(function() {
            if (!readCookieConsent()) banner.classList.add('show');
        }, 900);
    }

    // ============================================================
    // INIT
    // ============================================================
    async function init() {
        if (!(await enforceAuthenticatedPage())) return;

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                injectTabbarStyles();
                renderTabBar();
                showCookieBanner();
            });
        } else {
            injectTabbarStyles();
            renderTabBar();
            showCookieBanner();
        }
    }

    // Expose for use in other scripts if needed
    window.SchoolTabBar = {
        render: renderTabBar,
        navigateToSearch: navigateToSearch,
        getCurrentPage: getCurrentPage,
        getRole: getRole
    };

    window.UrsKoolCookies = {
        show: showCookieBanner,
        hide: hideCookieBanner,
        read: readCookieConsent,
        accept: function() { writeCookieConsent('accepted'); },
        decline: function() { writeCookieConsent('declined'); }
    };

    window.addEventListener('pageshow', function(event) {
        if (event.persisted) enforceAuthenticatedPage();
    });
    init();
})();
