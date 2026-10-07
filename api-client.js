(function () {
    'use strict';

    // True when the page is being served by something that cannot execute PHP
    // (VS Code Live Server defaults to 5500/5501; file:// executes nothing).
    function isStaticPreview() {
        return location.protocol === 'file:' || location.port === '5500' || location.port === '5501';
    }

    // The PHP-served address for the page you are looking at right now, so the
    // error can tell the developer exactly where to go instead.
    function phpServerHint() {
        const scheme = location.protocol === 'https:' ? 'https:' : 'http:';
        const host = location.hostname || '127.0.0.1';
        return scheme + '//' + host + ':8000' + (location.pathname || '/') + (location.search || '');
    }

    function unreachableMessage() {
        return 'Cannot reach the UrSKOOL server from this page.' +
            (isStaticPreview()
                ? ' This page is a static copy served from ' + location.origin + ', which cannot run PHP.'
                : '') +
            ' Start the PHP server and open ' + phpServerHint() + ' instead.';
    }

    async function request(url, options) {
        const config = options || {};
        const headers = new Headers(config.headers || {});
        const requestOptions = {
            ...config,
            credentials: 'same-origin',
            headers
        };

        if (config.body && typeof config.body !== 'string') {
            headers.set('Content-Type', 'application/json');
            requestOptions.body = JSON.stringify(config.body);
        }

        let response;
        try {
            response = await fetch(url, requestOptions);
        } catch (networkError) {
            // DNS failure, connection refused, CORS block, file:// path, ...
            const apiError = new Error(unreachableMessage());
            apiError.status = 0;
            apiError.code = 'network_unreachable';
            apiError.cause = networkError;
            throw apiError;
        }

        // Read the raw body first so we can tell "the API rejected this" apart
        // from "something that is not PHP answered this request".
        const rawBody = await response.text().catch(() => '');
        let payload = null;
        try {
            payload = rawBody ? JSON.parse(rawBody) : null;
        } catch (parseError) {
            payload = null;
        }

        if (!payload) {
            // The request resolved, but the body was not JSON. A static server
            // (VS Code Live Server, http-server, ...) answers a POST to a .php
            // file with 405 and an empty/HTML body because it just hands back
            // the file instead of executing it.
            const apiError = new Error(
                location.origin + ' answered HTTP ' + response.status +
                ' without JSON' +
                (isStaticPreview()
                    ? ', because it is a static file server (for example VS Code Live Server) that cannot execute PHP'
                    : '') +
                '. Open the site through the PHP server instead: ' + phpServerHint() + '.'
            );
            apiError.status = response.status;
            apiError.code = 'invalid_response';
            throw apiError;
        }

        if (!response.ok || payload.ok !== true) {
            const detail = payload.error && typeof payload.error === 'object' ? payload.error : {};
            const apiError = new Error(detail.message || payload.message || 'The request could not be completed.');
            apiError.status = response.status;
            apiError.code = detail.code || 'request_failed';
            throw apiError;
        }

        return payload.data || {};
    }

    function cacheUser(user) {
        if (!user || typeof user !== 'object') return;
        const safeUser = { ...user };
        delete safeUser.password;
        delete safeUser.passwordHash;
        delete safeUser.password_hash;
        delete safeUser.adminPin;
        delete safeUser.admin_pin;
        localStorage.setItem('schoolProfileData', JSON.stringify(safeUser));
    }

    function cacheUsers(users) {
        if (!Array.isArray(users)) return;
        const safeUsers = users.map(user => {
            const safeUser = { ...user };
            delete safeUser.password;
            delete safeUser.passwordHash;
            delete safeUser.password_hash;
            delete safeUser.adminPin;
            delete safeUser.admin_pin;
            return safeUser;
        });
        localStorage.setItem('schoolUsersRegistry', JSON.stringify(safeUsers));
    }

    function clearAuthCache() {
        [
            'schoolSession',
            'pendingOtpLoginEmail',
            'schoolOtpCode',
            'otpSentAt',
            'emailVerified',
            'phoneVerified',
            'verifiedContactMethod',
            'schoolFailedPasswordAttempts'
        ].forEach(key => localStorage.removeItem(key));
    }

    function removeLegacySecrets() {
        try {
            const profile = JSON.parse(localStorage.getItem('schoolProfileData') || 'null');
            if (profile && typeof profile === 'object') {
                delete profile.password;
                delete profile.passwordHash;
                delete profile.password_hash;
                delete profile.adminPin;
                delete profile.admin_pin;
                localStorage.setItem('schoolProfileData', JSON.stringify(profile));
            }
        } catch (error) {
            localStorage.removeItem('schoolProfileData');
        }

        try {
            const registry = JSON.parse(localStorage.getItem('schoolUsersRegistry') || '[]');
            if (Array.isArray(registry)) {
                registry.forEach(user => {
                    delete user.password;
                    delete user.passwordHash;
                    delete user.password_hash;
                    delete user.adminPin;
                    delete user.admin_pin;
                });
                localStorage.setItem('schoolUsersRegistry', JSON.stringify(registry));
            }
        } catch (error) {
            localStorage.removeItem('schoolUsersRegistry');
        }

        clearAuthCache();
    }

    removeLegacySecrets();

    window.UrskoolApi = { request, cacheUser, cacheUsers, clearAuthCache };
})();