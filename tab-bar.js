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
        return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`;
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
        const isSearch = currentPage === 'search-results.html';
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
            content: searchSvgHtml()
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
    }

    // ============================================================
    // INIT
    // ============================================================
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                injectTabbarStyles();
                renderTabBar();
            });
        } else {
            injectTabbarStyles();
            renderTabBar();
        }
    }

    // Expose for use in other scripts if needed
    window.SchoolTabBar = {
        render: renderTabBar,
        navigateToSearch: navigateToSearch,
        getCurrentPage: getCurrentPage,
        getRole: getRole
    };

    init();
})();