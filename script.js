/**
 * Stores current page path and login status in sessionStorage.
 * @param {string} status - The user's login status.
 */
function logOut() {
    localStorage.removeItem("userId", "guest");
    sessionStorage.removeItem("loggedIn");
}

/**
 * Adds selected class to a menu button and saves its state.
 * @param {string} id - The ID of the menu button.
 * @param {any} status - The status to store in session storage.
 */
function addClassSelectedMenuButton(id, status) {
    let currentMenuButton = document.getElementById(id);
    currentMenuButton.classList.add("menu-button-selected");
    saveMenuId(id)
    sessionStorage.getItem("status");
}

/**
 * Adds the "menu-button-bottom-selected" class to the specified element.
 * @param {string} id - The ID of the target element.
 */
function addClassSelectedMenuBottomButton(id) {
    let currentMenuBottomButton = document.getElementById(id);
    currentMenuBottomButton.classList.add("menu-button-bottom-selected");
}

/**
 * Toggles the account submenu visibility.
 */
function accountClickMenu() {
    let overlay = document.getElementById('subMenuOverlayContent');
    let menuBox = document.querySelector('.menu-box');
    let supportBox = document.querySelector('.account-submenu-container');
    toggleMenu(overlay, menuBox, supportBox);
}

/**
 * Toggles menu visibility by adding/removing CSS classes on overlay, menuBox, and supportBox.
 * @param {HTMLElement} overlay - The overlay element.
 * @param {HTMLElement} menuBox - The menu container.
 * @param {HTMLElement} supportBox - The supporting content box.
 */
function toggleMenu(overlay, menuBox, supportBox) {
    if (overlay.classList.contains('active')) {
        supportBox.classList.remove('active');
        setTimeout(() => {
            overlay.classList.remove('active');
            menuBox.classList.remove('inactive');
        }, 150);
    } else {
        overlay.classList.add('active');
        menuBox.classList.add('inactive');
        setTimeout(() => {
            supportBox.classList.add('active');
        }, 10);
    }
}

/**
 * Opens the side navigation with a delayed slide-in effect and shows the overlay.
 */
function openSideNav() {
    setTimeout(() => {
        document.getElementById("sideNav").style.width = "300px";
    }, 200)
    document.getElementById("mobileMenuOverlay").style.display = "flex"
    document.getElementById("sideNav").style.width = "0";
}

/**
 * Closes the side navigation and hides the mobile menu overlay.
 */
function closeSideNav() {
    document.getElementById("sideNav").style.width = "0px";
    document.getElementById("mobileMenuOverlay").style.display = "none"
}

/**
 * Saves the given menu ID to localStorage.
 * @param {string} menuId - The ID of the clicked menu item.
 */
function saveMenuId(menuId) {
    localStorage.setItem('lastClickedMenu', menuId);
}

/**
 * Redirects to the last clicked menu URL stored in localStorage, or to the summary page by default.
 */
function toLastClickedMenu() {
    const lastClickedMenu = localStorage.getItem('lastClickedMenu');
    const menuUrls = {
        'summary-menu-button': getSummaryUrl,
        'add-task-menu-button': getAddTaskUrl,
        'board-menu-button': getBoardUrl,
        'board-menu-button-mobile': getBoardUrlMobile,
        'contacts-menu-button': getContactsUrl,
        'privacy-policy-menu-button-bottom': getPrivacyPolicyUrl,
        'legal-notice-menu-button-bottom': getLegalNoticeUrl,
    };
    const targetUrl = (lastClickedMenu && menuUrls[lastClickedMenu]) ? menuUrls[lastClickedMenu]() : getSummaryUrl();
    window.location.href = targetUrl;
}

/** Returns the URL for the summary page. */
function getSummaryUrl() { return 'summary.html'; }

/** Returns the URL for the add task page. */
function getAddTaskUrl() { return 'add-task.html'; }

/** Returns the URL for the board page. */
function getBoardUrl() { return 'board.html'; }

/** Returns the URL for the mobile board page. */
function getBoardUrlMobile() { return 'board.html'; }

/** Returns the URL for the contacts page. */
function getContactsUrl() { return 'contacts.html'; }

/** Returns the URL for the privacy policy page. */
function getPrivacyPolicyUrl() { return 'privacy-policy.html'; }

/** Returns the URL for the legal notice page. */
function getLegalNoticeUrl() { return 'legal-notice.html'; }