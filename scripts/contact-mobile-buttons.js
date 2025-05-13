/**
 * Handles the click event when the overlay is clicked.
 */
function handleOverlayClickEvent(event, procressOverlay, menuBox, supportBox, procressButton, procressMenu) {
    if (event.target === procressOverlay) {
        handleOverlayClick(procressOverlay, menuBox, supportBox, procressButton, procressMenu);
    }
}

/**
 * Handles click event to toggle overlay and menu visibility.
 * 
 * @param {HTMLElement} procressOverlay - The overlay element.
 * 
 * @param {HTMLElement} menuBox - The menu box element.
 * 
 * @param {HTMLElement} supportBox - The support box element.
 * 
 * @param {HTMLElement} procressButton - The process button element.
 */
function handleOverlayClick(procressOverlay, menuBox, supportBox, procressButton, procressMenu) {
    let backgroundColor = document.querySelector('.procressing-area-edit-button-mobile');
    procressOverlay.classList.add('close');
    procressOverlay.classList.remove('active');
    menuBox.classList.remove('inactive');
    supportBox.classList.remove('inactive');
    procressMenu.style.disply = ('none')
    setTimeout(() => {
        procressButton.classList.remove('active');
        backgroundColor.classList.remove('active')
    }, 1000);
}

/**
 * Handles click events for the mobile processing menu, toggling visibility of UI elements.
 */
function procressingClickMenu(button) {
    let procressOverlay = document.querySelector('.mobile-procressing-area-overlay');
    let menuBox = document.querySelector('.menu-box');
    let supportBox = document.querySelector('.small-menu-button');
    let procressButton = document.querySelector('.mobile-procressing-area-button');
    let procressMenu = document.querySelector('.procressing-mobile-menu-container');
    procressOverlay.classList.add('active');
    procressOverlay.classList.remove('close');
    menuBox.classList.add('inactive');
    supportBox.classList.add('inactive');
    procressButton.classList.add('active');
    toggleButtonColor(button)
    procressOverlay.onclick = (event) => handleOverlayClickEvent(event, procressOverlay, menuBox, supportBox, procressButton, procressMenu);
}

/**
 * Toggles the background color of a button between two colors.
 * 
 * @param {HTMLButtonElement} button - The button element to toggle.
 */
function toggleButtonBackgroundcolor(button) {
    if (!button.style.backgroundColor || button.style.backgroundColor === '#2A3647') {
        button.style.backgroundColor = '#29abe2';
    } else {
        button.style.backgroundColor = '#2A3647';
    }
}

/**
 * Toggles the color of a button and updates its background.
 * 
 * @param {HTMLElement} button - The button element to modify.
 */
function toggleButtonColor(button) {
    if (!button.style.color || button.style.color === 'rgb(42, 54, 71)') {
        button.style.color = '#29abe2';
    }else{
        toggleRemoveButtonColor(button)
    }
}

function toggleBackgroundProcressButton() {
    let backgroundColor = document.querySelector('.procressing-area-edit-button-mobile');
    backgroundColor.classList.add('active')
}

/**
 * Toggles the color of the remove button and updates the mobile edit button style.
 * 
 * @param {HTMLElement} button - The button element to toggle the color of.
 */
function toggleRemoveButtonColor(button) {
    if (!button.style.color || button.style.color === '#29abe2') {
        button.style.color = 'rgb(42, 54, 71)';
    }
    button = document.querySelector('.procressing-area-edit-button-mobile');
    button.classList.remove('procressing-area-button-mobile-backgroundcolor');
    button.style.color = 'rgb(42, 54, 71)';
}