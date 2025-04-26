function sessionSorage(status) {
    sessionStorage.setItem("currentPage", window.location.pathname);
    sessionStorage.setItem("loginStatus", status);
}

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
}

function closeSideNav() {
    document.getElementById("sideNav").style.width = "0px";
    document.getElementById("mobileMenuOverlay").style.display = "none"
}

function saveMenuId(menuId) {
    localStorage.setItem('lastClickedMenu', menuId);
    console.log('Gespeicherte Menü-ID: ' + menuId);
}

function toLastClickedMenu() {
    const lastClickedMenu = localStorage.getItem('lastClickedMenu');
    if (lastClickedMenu) {
        let targetUrl;
        switch (lastClickedMenu) {
            case 'summary-menu-button':
                targetUrl = 'summary.html';
                break;
            case 'add-task-menu-button':
                targetUrl = 'add-task.html';
                break;
            case 'board-menu-button':
                targetUrl = 'board.html';
                break;
            case 'contacts-menu-button':
                targetUrl = 'contacts.html';
                break;
            case 'privacy-policy-menu-button-bottom':
                targetUrl = 'privacy-policy.html';
                break;
            case 'legal-notice-menu-button-bottom':
                targetUrl = 'legal-notice.html';
                break;
            default:
                targetUrl = 'summary.html';
                break;
        }
        window.location.href = targetUrl;
    }
}