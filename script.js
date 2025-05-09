/**
 * Stores current page path and login status in sessionStorage.
 * @param {string} status - The user's login status.
 */
function logOut() {
    localStorage.removeItem("userId", "guest");
}

function addClassSelectedMenuButton(id, status) {
    let currentMenuButton = document.getElementById(id);
    currentMenuButton.classList.add("menu-button-selected");
    saveMenuId(id)
    sessionSorage(status);
}

function addClassSelectedMenuBottomButton(id) {
    let currentMenuBottomButton = document.getElementById(id);
    currentMenuBottomButton.classList.add("menu-button-bottom-selected");
}

function accountClickMenu() {
    let overlay = document.getElementById('subMenuOverlayContent');
    let menuBox = document.querySelector('.menu-box');
    let supportBox = document.querySelector('.account-submenu-container');
    toggleMenu(overlay, menuBox, supportBox);
}

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

function openSideNav() {
    setTimeout(() => {
        document.getElementById("sideNav").style.width = "300px";
    }, 200)
    
    document.getElementById("mobileMenuOverlay").style.display = "flex"
    document.getElementById("sideNav").style.width = "0";
}

function closeSideNav() {
    document.getElementById("sideNav").style.width = "0px";
    document.getElementById("mobileMenuOverlay").style.display = "none"
}

function saveMenuId(menuId) {
    localStorage.setItem('lastClickedMenu', menuId);
}

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

function getSummaryUrl() { return 'summary.html'; }
function getAddTaskUrl() { return 'add-task.html'; }
function getBoardUrl() { return 'board.html'; }
function getBoardUrlMobile() { return 'board.html'; }
function getContactsUrl() { return 'contacts.html'; }
function getPrivacyPolicyUrl() { return 'privacy-policy.html'; }
function getLegalNoticeUrl() { return 'legal-notice.html'; }