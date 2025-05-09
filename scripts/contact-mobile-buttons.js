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
    }
    button = document.querySelector('.procressing-area-edit-button-mobile');
    button.classList.add('procressing-area-button-mobile-backgroundcolor');
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