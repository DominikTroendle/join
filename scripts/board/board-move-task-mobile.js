/**
 * Opens the move menu for a mobile user story card, highlights the current category, 
 * disables interaction with the active segment, and triggers the opening animation.
 * 
 * @param {Event} event - The click event triggered from a mobile button inside a user story card.
 */
function openMobileMoveMenu(event) {
    let currentCardClicked = event.currentTarget.closest(".user-story__all-content-box");
    let currentUserStoryBox = currentCardClicked.querySelector(".user-story__box");
    let currentMoveMenu = currentCardClicked.querySelector(".user-story__mobile-move-menu");
    let currentCenterButtonText = currentCardClicked.querySelector('.user-story__mobile-move-menu__center-button-text');
    let currentCategoryName = currentCardClicked.closest(".drag-field").getAttribute("data-category");
    let currentCenterButton = currentCardClicked.querySelector(".user-story__mobile-move-menu__center-button");
    closeOtherMoveMenus(currentCenterButton)
    currentMoveMenu.querySelector(`.${currentCategoryName}`).style.fill = "#D08770";
    currentMoveMenu.querySelector(`.${currentCategoryName}`).style.pointerEvents = "none";
    currentUserStoryBox.style.pointerEvents = "none";
    setPointerEventsFromMobileButtons("none", 0);
    openMoveMenuWithAnimation(currentUserStoryBox, currentMoveMenu, currentCenterButtonText);
}

/**
 * Displays and animates the opening of the mobile move menu for a user story card.
 * Disables pointer events during animation and updates the center button text to "Close" after animation.
 *
 * @param {HTMLElement} currentUserStoryBox - The container element of the current user story card.
 * @param {HTMLElement} currentMoveMenu - The SVG-based move menu element to be shown.
 * @param {HTMLElement} currentCenterButtonText - The text element of the center button to update.
 */
function openMoveMenuWithAnimation(currentUserStoryBox, currentMoveMenu, currentCenterButtonText) {
    currentMoveMenu.style.display = "flex";
    currentMoveMenu.style.pointerEvents = "none";
    addAnimationClassToTaskContent(currentUserStoryBox);
    setTimeout(() => {
        currentCenterButtonText.classList.add('fade-out');
        setTimeout(() => {
            currentCenterButtonText.textContent = 'Close';
            currentCenterButtonText.classList.remove('fade-out');
            currentMoveMenu.style.pointerEvents = "auto";
            setPointerEventsFromMobileButtons("auto", 200);
        }, 300);
    }, 1200);
}

/**
 * Sets the CSS `pointer-events` property for all elements with the class `.user-story__mobile-button`
 * after a specified delay.
 *
 * @param {string} propertyValue - The value to set for `pointer-events` (e.g., "none" or "auto").
 * @param {number} time - The delay in milliseconds before applying the change.
 */
function setPointerEventsFromMobileButtons(propertyValue, time) {
    let allUserStoryMobileButtons = Array.from(document.querySelectorAll(".user-story__mobile-button"));
    setTimeout(() => {
        allUserStoryMobileButtons.forEach(element => element.style.pointerEvents = propertyValue);
    }, time);
}

/**
 * Adds an animation class to the given task content after a slight delay.
 * This function applies a `blur-out` animation to the task content box after a 200ms timeout.
 *
 * @param {HTMLElement} currentUserStoryBox - The DOM element representing the task content box to which the animation will be applied.
 * 
 * @returns {void} This function does not return any value. It modifies the DOM element by adding an animation class.
 */
function addAnimationClassToTaskContent(currentUserStoryBox) {
    setTimeout(() => {
        currentUserStoryBox.classList.add("blur-out");
    }, 200);
}

/**
 * Removes the animation class from the given task content after a delay.
 * This function removes the `blur-out` animation class from the task content box after a 1600ms timeout.
 *
 * @param {HTMLElement} currentUserStoryBox - The DOM element representing the task content box from which the animation class will be removed.
 * 
 * @returns {void} This function does not return any value. It modifies the DOM element by removing an animation class.
 */
function removeAnimationClassToTaskContent(currentUserStoryBox) {
    setTimeout(() => {
        currentUserStoryBox.classList.remove("blur-out");
    }, 1600);
}

/**
 * Reverses the animation of the mobile move menu by resetting the CSS classes and closing the menu.
 * 
 * This function is triggered by an event, typically when a user interacts with the move menu or
 * clicks the close button. It updates the CSS classes of various elements within the mobile move
 * menu to reverse the opening animation, and it also triggers the closing of the move menu with a
 * smooth animation.
 *
 * @function animationReverse
 * @param {Event} event - The event triggered by the user interaction (e.g., clicking a button or element).
 * @returns {void} - No value is returned, but it manipulates DOM elements to close the mobile move menu and reverse the animation.
 */
function animationReverse(event) {
    let currentCardClicked = event.currentTarget.closest(".user-story__all-content-box");
    let currentUserStoryBox = currentCardClicked.querySelector(".user-story__box");
    let currentMoveMenu = currentCardClicked.querySelector(".user-story__mobile-move-menu");
    let currentCenterButtonText = currentCardClicked.querySelector('.user-story__mobile-move-menu__center-button-text');
    currentCardClicked.querySelectorAll(".currentMoveMenu").forEach((element, index) => element.classList.remove(`delay-${index + 1}-open`, "open"));
    currentCardClicked.querySelectorAll(".user-story__mobile-move-menu__segment-text").forEach((element, index) => element.classList.add(`delay-${index + 1}-close`, "close"));
    currentCardClicked.querySelectorAll(".user-story__mobile-move-menu__segment").forEach((element, index) => element.classList.remove(`delay-${index + 1}-open`, "open"));
    currentCardClicked.querySelectorAll(".user-story__mobile-move-menu__segment").forEach((element, index) => element.classList.add(`delay-${index + 1}-close`, "close"));
    currentCardClicked.querySelector(".user-story__mobile-move-menu__center-button").classList.remove("open");
    currentCardClicked.querySelector(".user-story__mobile-move-menu__center-button").classList.add("close");
    closeMoveMenuWithAnimation(currentCardClicked, currentCenterButtonText, currentUserStoryBox, currentMoveMenu);
}

/**
 * Closes the mobile move menu with animation by updating CSS classes and triggering visual transitions.
 * 
 * This function is responsible for smoothly closing the move menu by reversing any animation effects applied
 * during the opening of the menu. It does this by fading out the center button text, removing animation classes
 * from the task content, and resetting all CSS classes for the move menu elements.
 *
 * @function closeMoveMenuWithAnimation
 * @param {HTMLElement} currentCardClicked - The DOM element representing the card that was clicked, containing the mobile move menu.
 * @param {HTMLElement} currentCenterButtonText - The DOM element representing the text within the center button of the move menu.
 * @param {HTMLElement} currentUserStoryBox - The DOM element representing the user story box to be animated.
 * @param {HTMLElement} currentMoveMenu - The DOM element representing the move menu that is being closed.
 * @returns {void} - No value is returned, but the function performs DOM manipulations to close the move menu and reverse animations.
 */
function closeMoveMenuWithAnimation(currentCardClicked, currentCenterButtonText, currentUserStoryBox, currentMoveMenu) {
    fadeOutCenterButtonText(currentCenterButtonText);
    removeAnimationClassToTaskContent(currentUserStoryBox);
    resetAllClassesFromMoveMenu(currentCardClicked, currentUserStoryBox, currentMoveMenu);
}

/**
 * Closes all open move menus except the one clicked.
 * This function checks for all open move menu buttons and closes them (reverses the animation) unless they are the current clicked button.
 * 
 * @param {HTMLElement} currentCenterButton - The button element that was clicked, which will remain open.
 * 
 * @returns {void} This function does not return any value. It modifies the state of the DOM elements by reversing the animation on other buttons.
 */
function closeOtherMoveMenus(currentCenterButton) {
    const allButtons = document.querySelectorAll(".user-story__mobile-move-menu__center-button.open");
    allButtons.forEach(button => {
        if (button !== currentCenterButton) {
            animationReverse({ currentTarget: button });
        }
    });
}

/**
 * Fades out the text content of a button and changes it to a new value.
 * The function applies a fade-out animation to the button text, waits for the animation to complete, 
 * and then changes the text content to 'Move to' before removing the fade-out animation.
 *
 * @param {HTMLElement} currentCenterButtonText - The text element of the button whose text will be faded out and changed.
 * 
 * @returns {void} This function does not return any value. It modifies the text content and applies/removes CSS classes to the DOM element.
 */
function fadeOutCenterButtonText(currentCenterButtonText) {
    setTimeout(() => {
        currentCenterButtonText.classList.add('fade-out');
        setTimeout(() => {
            currentCenterButtonText.textContent = 'Move to';
            currentCenterButtonText.classList.remove('fade-out');
        }, 300);
    }, 100);
}

/**
 * Resets the CSS classes and visual state of the move menu for a given task card.
 * This function modifies various elements within the task card, removing specific animation classes,
 * and restoring them to their initial "open" state after a set timeout.
 * 
 * @param {HTMLElement} currentCardClicked - The task card that was clicked, containing the move menu.
 * @param {HTMLElement} currentUserStoryBox - The user story box that holds the task card and move menu.
 * @param {HTMLElement} currentMoveMenu - The move menu element that is being reset.
 * 
 * @returns {void} This function does not return any value. It modifies the DOM elements by adding/removing CSS classes
 * and changing the display styles of the elements.
 */
function resetAllClassesFromMoveMenu(currentCardClicked, currentUserStoryBox, currentMoveMenu) {
    setTimeout(() => {
        currentUserStoryBox.style.pointerEvents = "auto";
        currentMoveMenu.style.display = "none";
        currentCardClicked.querySelectorAll(".user-story__mobile-move-menu__segment-text").forEach((element, index) => element.classList.remove(`delay-${index + 1}-close`, "close"));
        currentCardClicked.querySelectorAll(".user-story__mobile-move-menu__segment-text").forEach((element, index) => element.classList.add(`delay-${index + 1}-open`, "open"));
        currentCardClicked.querySelectorAll(".user-story__mobile-move-menu__segment").forEach((element, index) => element.classList.remove(`delay-${index + 1}-close`, "close"));
        currentCardClicked.querySelectorAll(".user-story__mobile-move-menu__segment").forEach((element, index) => element.classList.add(`delay-${index + 1}-open`, "open"));
        currentCardClicked.querySelector(".user-story__mobile-move-menu__center-button").classList.remove("close");
        currentCardClicked.querySelector(".user-story__mobile-move-menu__center-button").classList.add("open");
    }, 1800);
}

/**
 * Handles moving a task card to a new category when triggered from a mobile interface.
 * 
 * This function identifies the current card and its associated DOM and data properties,
 * checks if the category has changed, and if so, moves the task to the new category.
 * 
 * @async
 * @function moveTaskCardMobile
 * @param {Event} event - The click event triggered from the mobile move menu.
 * @param {string} newMoveCategory - The ID of the new category the task will be moved to.
 * @param {Array} newMoveArray - The array representing the task list of the new category.
 * @param {string} newMoveCategoryName - The name of the new category.
 * @returns {Promise<void>} - Resolves after the move operation is completed or returns early if no move is needed.
 */
async function moveTaskCardMobile(event, newMoveCategory, newMoveArray, newMoveCategoryName) {
    let currentCardClicked = event.currentTarget.closest(".user-story__all-content-box");
    let oldDragField = event.currentTarget.closest(".drag-field");
    cardId = currentCardClicked.querySelector(".user-story__box").id;
    currentCardId = currentCardClicked.querySelector(".user-story__box").id;
    oldCategoryName = oldDragField.getAttribute("data-category");
    oldArray = arrays[oldDragField.getAttribute("data-array")];
    oldCategory = oldDragField.id;
    newCategory = newMoveCategory;
    newArray = newMoveArray;
    newCategoryName = newMoveCategoryName;
    if (oldCategory === newCategory) return;
    moveTaskToCategory();
}

/**
 * Moves a task object from the old category array to the new one and updates its category property.
 * 
 * This function modifies the global task arrays by transferring a task to the new category's array,
 * updates its `category` property accordingly, and triggers a UI re-render.
 * 
 * @function moveTaskToCategory
 * @returns {void}
 */
function moveTaskToCategory() {
    findObjectInArrayAndSaveData(oldArray, newCategoryName);
    let index = oldArray.findIndex(element => element.id == currentCardId);
    newArray.push(oldArray.splice(index, 1)[0]);
    let taskCardObjectinNewArray = newArray.find(element => element.id == currentCardId);
    taskCardObjectinNewArray.category = newCategoryName;
    updateCategoryRender();
}

/**
 * Scrolls the task card into view and applies a temporary highlight animation.
 * 
 * This function ensures the moved or updated task card is brought into the user's viewport 
 * with a smooth scroll and briefly highlights it using a CSS class for visual feedback.
 * 
 * @function highlightTaskCardWithAnimation
 * @returns {void}
 */
function highlightTaskCardWithAnimation() {
    setTimeout(() => {
        document.getElementById(currentCardId).scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById(currentCardId).classList.add('highlight-flash');
    }, 300);
    setTimeout(() => {
        document.getElementById(currentCardId).classList.remove('highlight-flash');
    }, 3300);
}

/**
 * Finds the newly created task based on the provided title and description,
 * then highlights and scrolls to it.
 *
 * @function findAndHighlightNewlyCreatedTask
 * @param {HTMLInputElement} titleInput - The input element containing the task title.
 * @param {HTMLInputElement} descriptionInput - The input element containing the task description.
 * @returns {void} This function does not return any value.
 * 
 * @description
 * This function performs the following steps:
 * 1. Hides the "task-added" overlay once the task is saved.
 * 2. Searches for the task in the DOM by comparing the title and description values.
 * 3. Highlights and scrolls to the newly created task if found.
 */
function findAndHighlightNewlyCreatedTask(titleInput, descriptionInput) {
    document.getElementById('overlay-task-added').classList.add('d-none');
    let allUserStoryTitle = Array.from(document.querySelectorAll(".user-story__title"));
    let findNewCreateTask = allUserStoryTitle.find(element => {
        let userStoryBox = element.closest(".user-story__box");
        let description = userStoryBox.querySelector(".user-story__description");
        return (
            element.innerText.trim() === titleInput.value.trim() && description?.innerText.trim() === descriptionInput.value.trim()
        )
    });
    highlightAndScrollToNewTask(findNewCreateTask);
}

/**
 * Highlights and scrolls to the newly created task in the DOM.
 * 
 * If the task is found, it will be scrolled into view, and a highlight animation will be applied.
 * After the animation, the highlight class will be removed. Additionally, the task overlay will be hidden.
 *
 * @function highlightAndScrollToNewTask
 * @param {HTMLElement} findNewCreateTask - The task element that was newly created and needs to be highlighted.
 * @returns {void} This function does not return any value.
 *
 * @description
 * This function performs the following steps:
 * 1. Checks if the new task element is found.
 * 2. Scrolls to the task and applies a 'highlight-flash' class for visual emphasis.
 * 3. Removes the 'highlight-flash' class after 3.3 seconds.
 * 4. Hides the task overlay by toggling the visibility of the overlay.
 */
function highlightAndScrollToNewTask(findNewCreateTask) {
    if (findNewCreateTask) {
        let currentNewCreateTaskId = findNewCreateTask.closest(".user-story__box").id;
        document.getElementById(currentNewCreateTaskId).scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById(currentNewCreateTaskId).classList.add('highlight-flash');
        setTimeout(() => {
            document.getElementById(currentNewCreateTaskId).classList.remove('highlight-flash');
        }, 3300);
    }
    document.getElementById("add-task__overlay").classList.remove("fade-out");
    document.getElementById('add-task__overlay').classList.toggle('d-none');
}