function addClassSelectedMenuButton(id) {
    let currentMenuButton = document.getElementById(id);
    currentMenuButton.classList.add("menu-button-selected");
}

function addClassSelectedMenuBottomButton(id) {
    let currentMenuBottomButton = document.getElementById(id);
    currentMenuBottomButton.classList.add("menu-button-bottom-selected");
}

function accountClickMenu() {
    const subMenu = document.getElementById('subMenu');

    if (subMenu.classList.contains('d-none')) {
        subMenu.classList.remove('d-none');
    } else {
        subMenu.classList.add('d-none');
    }
}

document.onclick = function (event) {
    const subMenu = document.getElementById('subMenu');
    const submenuButton = document.getElementById('submenuButton');

    if (
        !subMenu.contains(event.target) && 
        event.target !== submenuButton
    ) {
        subMenu.classList.add('d-none');
    }
};