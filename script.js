function sessionSorage() {
    sessionStorage.setItem("currentPage", window.location.pathname);
}

function logOut() {
    localStorage.removeItem("userId", "guest");
}

function addClassSelectedMenuButton(id) {
    let currentMenuButton = document.getElementById(id);
    currentMenuButton.classList.add("menu-button-selected");
    saveMenuId(id)
    sessionSorage()
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
        // Falls das Menü gerade sichtbar ist, erst ausblenden lassen, dann das Overlay schließen
        supportBox.classList.remove('active');

        setTimeout(() => {
            overlay.classList.remove('active');
            menuBox.classList.remove('inactive');
        }, 150); // Timeout muss zur CSS-Transition-Dauer passen (0.6s)
    } else {
        // Falls das Menü nicht sichtbar ist, normal öffnen
        overlay.classList.add('active');
        menuBox.classList.add('inactive');
        
        setTimeout(() => {
            supportBox.classList.add('active');
        }, 10);
    }
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