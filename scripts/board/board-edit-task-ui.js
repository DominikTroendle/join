/**
 * Toggles the visibility and styling of the assign-to dropdown in the big task card edit view.
 * 
 * - Renders the list of contacts to assign.
 * - Shows or hides the dropdown container.
 * - Applies or removes box-shadow styling to the dropdown wrapper.
 * - Toggles the input placeholder and updates the dropdown arrow direction accordingly.
 * 
 * Dependencies:
 * - `renderAssignOptionsForBigTaskCardEdit(contacts)`
 * - `toggleAssignedPlaceholder(input)`
 * 
 * DOM Elements Affected:
 * - `#big-task-card-edit__dropdown-assign`
 * - `#big-task-card-edit__assigned-to-dropdown`
 * - `#big-task-card-edit__assigned-to-input`
 */
function toggleAssignOptionsForBigTaskCardEdit() {
    renderAssignOptionsForBigTaskCardEdit(contactsBigTaskCardEdit);
    let container = document.getElementById('big-task-card-edit__dropdown-assign');
    let containerDropdown = document.getElementById('big-task-card-edit__assigned-to-dropdown');
    let input = document.getElementById('big-task-card-edit__assigned-to-input');
    container.classList.toggle('d-none');
    containerDropdown.classList.toggle('box-shadow');
    renderAssignOptionsForBigTaskCardEdit(contactsBigTaskCardEdit);
    toggleAssignedPlaceholder(input);
}

/**
 * Toggles the placeholder text of the assigned-to input field and updates the dropdown arrow direction.
 *
 * - If the placeholder is "Select contacts to assign", it clears the placeholder and changes the arrow to "expanded" state.
 * - If the placeholder is empty, it resets it back to "Select contacts to assign" and changes the arrow to "collapsed" state.
 *
 * @param {HTMLInputElement} input - The input element whose placeholder and dropdown arrow state should be toggled.
 *
 * Dependencies:
 * - `changeDropdownArrowForBigTaskCardEdit(isExpanded: boolean, type: string)`
 */
function toggleAssignedPlaceholder(input) {
    if (input.placeholder == "Select contacts to assign") {
        input.placeholder = "";
        changeDropdownArrowForBigTaskCardEdit(true, 'assigned');
    } else if (input.placeholder == "") {
        input.placeholder = "Select contacts to assign";
        changeDropdownArrowForBigTaskCardEdit(false, 'assigned');
    }
}

/**
 * Renders contact options in the assignment dropdown for the Big Task Card edit view,
 * distinguishing between selected and unselected contacts.
 *
 * Iterates over the provided contact array and checks if each contact is in the
 * `selectedContactsBigTaskCardEdit` list. Selected contacts are rendered using 
 * `renderContactAsSelectedForBigTaskCard`, while others are rendered using 
 * `renderContactAsDefaultForBigTaskCardEdit`.
 *
 * @param {Array<Object>} array - An array of contact objects with `name` and `color` properties.
 * @param {HTMLElement} dropDown - The DOM element representing the dropdown container where contact options will be rendered.
 *
 * Dependencies:
 * - `isInSelectedContactsForBigTaskCardEdit(name)`
 * - `renderContactAsSelectedForBigTaskCard(container, name, color)`
 * - `renderContactAsDefaultForBigTaskCardEdit(container, name, color)`
 */
function checkForSelectedContactsForBigTaskCard(array, dropDown) {
    for (let i = 0; i < array.length; i++) {
        let contactName = array[i].name;
        let color = array[i].color;
        if (isInSelectedContactsForBigTaskCardEdit(contactName)) {
            renderContactAsSelectedForBigTaskCard(dropDown, contactName, color);
        } else {
            renderContactAsDefaultForBigTaskCardEdit(dropDown, contactName, color);
        }
    }
}

/**
 * Changes the arrow icon of a dropdown based on the specified boolean value.
 *
 * This function updates the source of the dropdown arrow icon depending on whether the 
 * dropdown is expanded or collapsed. If the boolean is `true`, the arrow icon will be 
 * mirrored (indicating an expanded dropdown). If `false`, it will display the default arrow 
 * (indicating a collapsed dropdown).
 *
 * @param {boolean} boolean - A flag indicating whether the dropdown is expanded (`true`) or collapsed (`false`).
 * @param {string} dropdown - The identifier of the dropdown (used to target the specific dropdown arrow).
 */
function changeDropdownArrowForBigTaskCardEdit(boolean, dropdown) {
    let dropwdownArrow = document.getElementById(`big-task-card-edit__arrow-dropdown-${dropdown}`);
    if (boolean) {
        dropwdownArrow.src = "../assets/icons/arrow_drop_down_mirrored.svg";
    } else {
        dropwdownArrow.src = "../assets/icons/arrow_drop_down.svg";
    }
}

/**
 * Converts a date from the date picker format to a different format and sets it to the input field.
 *
 * This function takes the value from the date picker input (which is in `YYYY-MM-DD` format),
 * splits the date into individual components (year, month, and day), and reassigns the date to
 * another input field in `DD/MM/YYYY` format.
 * 
 * It ensures that the user sees the date in a more readable format in the input field.
 *
 * @returns {void} 
 */
function putDateToInputForBigTaskCardEdit() {
    let datePicker = document.getElementById('big-task-card-edit__input-date-picker');
    let input = document.getElementById('big-task-card-edit__input-due-date');
    if (datePicker.value) {
        let [year, month, day] = datePicker.value.split('-');
        input.value = `${day}/${month}/${year}`;
    }
}

/**
 * Checks the length of the input value for the Big Task Card Edit form.
 * 
 * This function ensures that the input value doesn't exceed the maximum allowed length for either
 * the title or subtask fields. If the length reaches the limit, an error message is displayed.
 * The maximum allowed length for both title and subtask fields is 50 characters.
 * 
 * @param {string} inputField - The ID of the input field to check. It can be either `big-task-card-edit__input-title` or `big-task-card-edit__input-subtask`.
 */
function checkInputLengthForBigTaskCardEdit(inputField) {
    let inputSetting = inputField === "big-task-card-edit__input-title" ? 'title' : 'subtask';
    let input = document.getElementById(`${inputField}`);
    let errorElement = document.getElementById(`max-char-${inputField}`);
    let inputSettings = { "title": { invalidElement: null }, "subtask": { invalidElement: "invalid-subtask-big-task-card-edit__subtask-input" } };
    let maxLength = 50;
    let invalidElement = inputSettings[inputSetting].invalidElement;
    if (input.value.length == maxLength) {
        errorElement.classList.remove('d-none');
        if (invalidElement) document.getElementById(invalidElement).classList.add('d-none');
    } else {
        errorElement.classList.add('d-none');
    }
}

/**
 * Handles the "Enter" key press event for the Big Task Card Edit subtask input field.
 * 
 * This function listens for the "Enter" key press in the subtask input field. When the "Enter" key
 * is pressed, it triggers the function to add a new subtask to the task card, and then clears the
 * input field for the next subtask.
 * 
 * @param {KeyboardEvent} event - The keyboard event triggered when a key is pressed.
 */
function isEnterKeyForBigTaskCard(event) {
    subtasksInput = document.getElementById('big-task-card-edit__subtask-input')
    if (event.key === "Enter") {
        addSubtaskForBigTaskCardEdit();
        subtasksInput.value = "";
    }
}

/**
 * Adds a subtask to the task card by processing the input value. 
 * It retrieves the subtask input, processes it through the helper function, 
 * and updates the task card with the new subtask if the input is valid.
 *
 * @returns {void} 
 */
function addSubtaskForBigTaskCardEdit() {
    let input = document.getElementById('big-task-card-edit__subtask-input');
    let containerSubtasks = document.getElementById('big-task-card-edit__subtasks-box');
    let subtaskObj = { "checked": "false" };
    processSubtaskInput(input, containerSubtasks, subtaskObj);
}

/**
 * Processes the input for a subtask and updates the task card. 
 * If the input is valid (non-empty), it adds the subtask to the list, 
 * updates the visual style of the task card, and checks for scrollable containers.
 * If the input is invalid, an error is thrown.
 *
 * @param {HTMLInputElement} input - The input element where the subtask is entered.
 * @param {HTMLElement} containerSubtasks - The container element that holds the list of subtasks.
 * @param {Object} subtaskObj - The object representing the subtask, including its status (e.g., "checked").
 * @returns {void} 
 */
function processSubtaskInput(input, containerSubtasks, subtaskObj) {
    inputValue = input.value;
    inputValue = inputValue.trim();
    if (inputValue !== "") {
        document.getElementById('invalid-subtask-big-task-card-edit__subtask-input').classList.add('d-none');
        document.getElementById('big-task-card-edit__subtask-box').classList.remove('input-unvalid');
        determineSubtaskStyleForBigTaskCardEdit(containerSubtasks, subtasksCountBigTaskCardEdit);
        document.getElementById(`big-task-card-edit__subtask-${subtasksCountBigTaskCardEdit}`).innerText = inputValue;
        subtaskObj.subtask = inputValue;
        subtasksBigTaskCardEdit.push(subtaskObj);
        checkForScrollableContainerForBigTaskCardEdit(containerSubtasks);
    } else throwSubtaskError();
}

/**
 * Saves the edited subtask and updates the task card display.
 * The subtask is updated with the new value entered by the user, and the edit view is replaced with the details view.
 * Additionally, the input field is cleared, and any relevant styles or options are adjusted based on the screen size.
 *
 * @param {number} id - The unique identifier for the subtask being edited.
 * @returns {void} 
 */
function saveEditedSubtaskForBigTaskCard(id) {
    let input = document.getElementById(`big-task-card-edit__input-subtask-${id}`);
    let element = document.getElementById(`big-task-card-edit__container-subtask-${id}`);
    document.getElementById(`big-task-card-edit__details-subtask-${id}`).classList.remove('d-none');
    document.getElementById(`big-task-card-edit__edit-subtask-${id}`).classList.add('d-none');
    document.getElementById(`big-task-card-edit__subtask-${id}`).innerText = input.value;
    subtasksBigTaskCardEdit[`${id - 1}`].subtask = input.value;
    input.value = "";
    if (window.innerWidth > 1040) { showEditOptionsForBigTaskCardEdit(id, false); }
    if (element.classList.contains('padding-top')) {
        element.classList.remove('padding-top');
    }
}

/**
 * Initiates the editing process for a subtask by displaying the input field with the current subtask text.
 * The subtask's current text is populated into the input field, and the edit view is shown while hiding the details view.
 * If the subtask is the last one in the list, additional styling is applied to it.
 *
 * @param {number} id - The unique identifier for the subtask being edited.
 * @returns {void} 
 */
function editSubtaskForBigTaskCard(id) {
    let child = document.getElementById(`big-task-card-edit__container-subtask-${id}`);
    document.getElementById(`big-task-card-edit__input-subtask-${id}`).value = document.getElementById(`big-task-card-edit__subtask-${id}`).innerText;
    document.getElementById(`big-task-card-edit__details-subtask-${id}`).classList.add('d-none');
    document.getElementById(`big-task-card-edit__edit-subtask-${id}`).classList.remove('d-none');
    if (isLastChild(child)) {
        child.classList.add('padding-top');
    }
}

/**
 * Deletes a subtask from the list of subtasks and updates the task view.
 * The subtask is removed from both the displayed UI and the internal data structure.
 * The count of subtasks is decremented, and the scrollability of the subtask container is rechecked.
 *
 * @param {number} id - The unique identifier of the subtask to be deleted.
 * @returns {void}
 */
function deleteSubtaskForBigTaskCardEdit(id) {
    let subtaskContainer = document.getElementById(`big-task-card-edit__container-subtask-${id}`);
    let containerSubtasks = document.getElementById('big-task-card-edit__subtasks-box');
    subtasksBigTaskCardEdit.splice((id - 1), 1);
    subtaskContainer.remove();
    subtasksCountBigTaskCardEdit--;
    checkForScrollableContainerForBigTaskCardEdit(containerSubtasks);
}

/**
 * Toggles the visibility of the edit options for a specific subtask in the task card.
 * If the boolean parameter is true, the edit icons for the subtask are displayed. If false, they are hidden.
 *
 * @param {number} id - The unique identifier of the subtask for which edit options should be toggled.
 * @param {boolean} boolean - A boolean indicating whether the edit options should be shown (true) or hidden (false).
 * @returns {void}
 */
function showEditOptionsForBigTaskCardEdit(id, boolean) {
    if (boolean) {
        document.getElementById(`big-task-card-edit__icons-subtask-${id}`).classList.remove('d-none');
    } else {
        document.getElementById(`big-task-card-edit__icons-subtask-${id}`).classList.add('d-none');
    }
}

/**
 * Determines and applies the appropriate HTML structure for a subtask based on the screen size.
 * If the window width is less than or equal to 1040px, the mobile-specific HTML structure is used.
 * Otherwise, the desktop-specific HTML structure is used.
 *
 * @param {HTMLElement} containerSubtasks - The container element where the subtask HTML will be appended.
 * @param {number} subtasksCount - The current count of subtasks, used to generate the correct subtask identifier.
 * @returns {void}
 */
function determineSubtaskStyleForBigTaskCardEdit(containerSubtasks, subtasksCount) {
    if (window.innerWidth <= 1040) {
        containerSubtasks.innerHTML += returnSubtaskHTMLForBigTaskCardEdit(subtasksCount);
    } else {
        containerSubtasks.innerHTML += returnSubtaskMobileHTMLForBigTaskCardEdit(subtasksCount);
    }
}

/**
 * Checks if the given container should be scrollable based on certain conditions, such as the number of contacts or subtasks.
 * If the number of contacts is less than 6 and the container is the contacts dropdown, or if the number of subtasks is 2 or fewer 
 * and the container is the subtasks box, it will make the container scrollable.
 * Otherwise, if the subtasks count is greater than or equal to 2, the subtasks box will be set to non-scrollable.
 *
 * @param {HTMLElement} container - The container element to check and modify for scrolling.
 * @returns {void}
 */
function checkForScrollableContainerForBigTaskCardEdit(container) {
    if (((contacts.length < 6) && (container.id == "big-task-card-edit__dropdown-assign")) || ((subtasksCount <= 2) && (container.id == "big-task-card-edit__subtasks-box"))) {
        containerScrollableForBigTaskCardEdit(container);
    } else if ((subtasksCount >= 2) && (container.id == "big-task-card-edit__subtasks-box")) {
        containerNotScrollableForBigTaskCardEdit(container);
    }
}

/**
 * Modifies the subtask container to make it non-scrollable by adding specific CSS classes.
 * This function is intended to be called when the subtasks container has a low number of subtasks
 * and should not be scrollable. It adds a margin to each subtask element within the container to prevent scrolling.
 *
 * @param {HTMLElement} container - The container element (typically the subtasks box) that will have its subtasks adjusted.
 * @returns {void}
 */
function containerNotScrollableForBigTaskCardEdit(container) {
    if (container.id = "big-task-card-edit__subtasks-box") {
        let subtaskContainers = Array.from(document.getElementsByClassName('container-subtask'));
        subtaskContainers.forEach(element => {
            element.classList.add('subtask-scroll-margin');
        })
    }
}

/**
 * Modifies the given container to make it scrollable by removing specific CSS classes.
 * This function is intended to be called when the container has enough content to require scrolling.
 * It removes the margin from each subtask element or the scrollbar class from the select options,
 * depending on the container type.
 *
 * @param {HTMLElement} container - The container element (either the subtasks box or the assign dropdown) that will be modified.
 * @returns {void}
 */
function containerScrollableForBigTaskCardEdit(container) {
    if (container.id == "big-task-card-edit__dropdown-assign") {
        let selectOptionsArray = Array.from(document.getElementsByClassName('container-custom-select-option'));
        selectOptionsArray.forEach(element => {
            element.classList.remove('select-option-with-scrollbar');
        });
    } else if (container.id == "big-task-card-edit__subtasks-box") {
        let subtaskContainers = Array.from(document.getElementsByClassName('container-subtask'));
        subtaskContainers.forEach(element => {
            element.classList.remove('subtask-scroll-margin');
        });
    }
}

/**
 * Processes the subtask input for the "Big Task Card Edit" feature.
 * This function checks if the input is valid based on a boolean condition:
 * - If the condition is true and the input is not empty, it adds the subtask and clears the input field.
 * - If the condition is false, it clears the input field, regardless of the input content.
 * - If the input is invalid, it shows the error message.
 *
 * @param {boolean} boolean - A flag that determines whether to add the subtask or simply clear the input.
 * @returns {void}
 */
function processSubtaskForBigTaskCardEdit(boolean) {
    let input = document.getElementById('big-task-card-edit__subtask-input');
    let invalidRef = document.getElementById('invalid-subtask-big-task-card-edit__subtask-input');
    invalidRef.classList.add('d-none');
    document.getElementById('max-char-big-task-card-edit__subtask-input').classList.add('d-none')
    if (boolean && (input.value != "")) {
        addSubtaskForBigTaskCardEdit();
        input.value = "";
    } else if (!boolean && (input.value != "" || input.value == "")) {
        input.value = "";
    } else invalidRef.classList.remove('d-none');
}