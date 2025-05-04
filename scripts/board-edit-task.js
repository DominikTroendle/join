let contactsBigTaskCardEdit = [];
let selectedContactsBigTaskCardEdit = [];
let unvalidInputsBigTaskCardEdit = [];
let subtasksBigTaskCardEdit = [];
let subtasksCountBigTaskCardEdit = subtasksBigTaskCardEdit.length;
let selectedPriorityBigTaskCardEdit = "medium";
const BASE_URL_ADDTASK2 = "https://join-user-default-rtdb.europe-west1.firebasedatabase.app/users/";

/**
 * Asynchronously loads all contacts and updates the `contactsBigTaskCardEdit` array.
 * 
 * This function clears the existing `contactsBigTaskCardEdit` array, retrieves the updated
 * contact list using `getContactsForBigTaskCardEdit()`, and then processes the retrieved contacts through
 * `loadContactInfoForBigTaskCardEdit()` for rendering or further use in the UI (e.g., in the Big Task Card Edit view).
 * 
 * @async
 * @function
 * 
 * @returns {Promise<void>} A promise that resolves when all contacts are fetched and loaded.
 * 
 * @example
 * await loadAllContacts();
 */
async function loadAllContacts() {
    contactsBigTaskCardEdit.length = 0;
    let contactsObj = await getContactsForBigTaskCardEdit();
    loadContactInfoForBigTaskCardEdit(contactsObj);
}

/**
 * Asynchronously retrieves contact data for the current user or guest from the backend.
 * 
 * Determines the user ID from `localStorage` and fetches the corresponding JSON file
 * from the specified `BASE_URL_ADDTASK2` path. If the user is a guest, it fetches the
 * data from the "guest.json" file. Otherwise, it uses the user's ID.
 * 
 * @async
 * @function
 * 
 * @param {string} [path=""] - Optional override path (unused in current logic, overwritten by `userId`).
 * @returns {Promise<Object>} A promise that resolves to the contact data as a JavaScript object.
 * 
 * @example
 * const contacts = await getContactsForBigTaskCardEdit();
 */
async function getContactsForBigTaskCardEdit(path = "") {
    userId = localStorage.getItem('userId');
    if (userId !== "guest") {
        path = userId;
        let response = await fetch(BASE_URL_ADDTASK2 + path + ".json");
        let responseJson = await response.json();
        return responseJson;
    } else {
        path = "guest";
        let response = await fetch(BASE_URL_ADDTASK2 + path + ".json");
        let responseJson = await response.json();
        return responseJson;
    }
}

/**
 * Loads contact information from the provided contacts object into the global 
 * `contactsBigTaskCardEdit` array and sorts them alphabetically by name.
 * 
 * Iterates over the keys in `contactsObj.allContacts`, extracts the `name` and `color` 
 * of each contact, and pushes them as simplified objects into the global array. 
 * Finally, it calls `sortContactsAlphabeticallyForBigTaskCardEdit` to sort the array.
 * 
 * @async
 * @function
 * @param {Object} contactsObj - An object containing all contact data under the `allContacts` key.
 * @param {Object.<string, {name: string, color: string}>} contactsObj.allContacts - The contacts mapped by ID or key.
 * 
 * @returns {void}
 * 
 * @example
 * const contactData = await getContactsForBigTaskCardEdit();
 * await loadContactInfoForBigTaskCardEdit(contactData);
 */
async function loadContactInfoForBigTaskCardEdit(contactsObj) {
    let keys = Object.keys(contactsObj.allContacts);
    for (let index = 0; index < keys.length; index++) {
        let key = keys[index];
        let contactObj = {
            color: contactsObj.allContacts[key].color,
            name: contactsObj.allContacts[key].name
        };
        contactsBigTaskCardEdit.push(contactObj);
    }
    sortContactsAlphabeticallyForBigTaskCardEdit(contactsBigTaskCardEdit);
}

/**
 * Sorts a given array of contact objects alphabetically by the `name` property.
 * 
 * If the user is not a guest and the array has more than one contact, it removes 
 * the first contact (assumed to be the user), sorts the remaining contacts alphabetically, 
 * then re-adds the user at the top. It also updates specific global arrays (`contacts` 
 * or `selectedContactsBigTaskCardEdit`) if the sorted array is the same reference.
 * 
 * @function
 * @param {Array<{name: string, color: string}>} contactsArray - The array of contact objects to sort.
 * 
 * @returns {void}
 * 
 * @example
 * sortContactsAlphabeticallyForBigTaskCardEdit(contactsBigTaskCardEdit);
 */
function sortContactsAlphabeticallyForBigTaskCardEdit(contactsArray) {
    if (userId != "guest" && contactsArray.length > 1) {
        let user = contactsArray.splice(0, 1);
        contactsArray.sort((a, b) => a.name.localeCompare(b.name));
        if (contactsArray == contacts) {
            contacts = user.concat(contactsArray);
        } else if (contactsArray == selectedContactsBigTaskCardEdit) {
            selectedContactsBigTaskCardEdit = user.concat(contactsArray);
        }
    } else {
        contactsArray.sort((a, b) => a.name.localeCompare(b.name));
    }
}

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
 * Renders the list of contact assignment options in the dropdown for the Big Task Card edit view.
 *
 * - If no contacts are selected, renders the full list using `renderDefaultContactsForBigTaskCardEdit`.
 * - If contacts are already selected, calls `checkForSelectedContactsForBigTaskCard` to handle rendering.
 * - Ensures scrollability if the dropdown content exceeds its container height.
 *
 * @param {Array<Object>} array - Array of contact objects to be displayed in the dropdown.
 * Each object should have at least a `name` and `color` property.
 *
 * Dependencies:
 * - `selectedContactsBigTaskCardEdit` (global state)
 * - `renderDefaultContactsForBigTaskCardEdit(array, container)`
 * - `checkForSelectedContactsForBigTaskCard(array, container)`
 * - `checkForScrollableContainerForBigTaskCardEdit(container)`
 */
function renderAssignOptionsForBigTaskCardEdit(array) {
    let dropDown = document.getElementById('big-task-card-edit__dropdown-assign');
    dropDown.innerHTML = "";
    if (selectedContactsBigTaskCardEdit.length == 0) {
        renderDefaultContactsForBigTaskCardEdit(array, dropDown);
    } else {
        checkForSelectedContactsForBigTaskCard(array, dropDown);
    }
    checkForScrollableContainerForBigTaskCardEdit(dropDown);
}

/**
 * Renders the default list of contact options into the assignment dropdown 
 * for the Big Task Card edit view when no contacts are selected.
 *
 * Iterates over the provided contact array and calls 
 * `renderContactAsDefaultForBigTaskCardEdit` for each contact to append them to the dropdown.
 *
 * @param {Array<Object>} array - An array of contact objects with `name` and `color` properties.
 * @param {HTMLElement} dropDown - The DOM element representing the dropdown container where contact options will be appended.
 *
 * Dependencies:
 * - `renderContactAsDefaultForBigTaskCardEdit(container, name, color)`
 */
function renderDefaultContactsForBigTaskCardEdit(array, dropDown) {
    for (let i = 0; i < array.length; i++) {
        let contactName = array[i].name;
        let color = array[i].color;
        renderContactAsDefaultForBigTaskCardEdit(dropDown, contactName, color);
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
 * Renders a contact as selected in the assignment dropdown for the Big Task Card edit view.
 *
 * This function first renders the contact as a default contact using 
 * `renderContactAsDefaultForBigTaskCardEdit`. Then, it updates the contact's visual 
 * state by adding a selection icon and changing the contact's appearance to indicate 
 * that it has been selected. This is achieved by calling `toggleSelection`.
 *
 * @param {HTMLElement} dropDown - The DOM element representing the dropdown container where the contact options are rendered.
 * @param {string} contactName - The name of the contact being rendered as selected.
 * @param {string} color - The color associated with the contact for styling purposes.
 *
 * Dependencies:
 * - `renderContactAsDefaultForBigTaskCardEdit(container, name, color)`
 * - `toggleSelection(isSelected, contactDiv, icon)`
 */
function renderContactAsSelectedForBigTaskCard(dropDown, contactName, color) {
    renderContactAsDefaultForBigTaskCardEdit(dropDown, contactName, color);
    let contactDiv = document.getElementById(`edit-container-${contactName}`);
    let icon = document.getElementById(`edit-icon-${contactName}`);
    toggleSelection(true, contactDiv, icon);
}

/**
 * Checks if a contact is included in the list of selected contacts for the Big Task Card edit view.
 *
 * This function iterates through the `selectedContactsBigTaskCardEdit` array, extracting the names 
 * of the contacts into a new array and checks if the provided `contactName` is present in that array.
 * It returns `true` if the contact is found in the selected list, otherwise `false`.
 *
 * @param {string} contactName - The name of the contact to check for in the selected contacts list.
 * @returns {boolean} - Returns `true` if the contact is selected, `false` otherwise.
 */
function isInSelectedContactsForBigTaskCardEdit(contactName) {
    let arr = [];
    selectedContactsBigTaskCardEdit.forEach(contact => arr.push(contact.name));
    return arr.includes(contactName);
}

/**
 * Renders a contact as a default (non-selected) option in the Big Task Card edit dropdown.
 *
 * This function appends a contact's HTML representation to the dropdown and updates the contact's
 * name and initials. The contact's initials are displayed with the specified color, and the name 
 * is used to uniquely identify the contact in the DOM. It does not mark the contact as selected.
 *
 * @param {HTMLElement} dropDown - The dropdown container where the contact is rendered.
 * @param {string} contactName - The name of the contact to render in the dropdown.
 * @param {string} color - The color to be applied to the contact's initials for styling.
 */
function renderContactAsDefaultForBigTaskCardEdit(dropDown, contactName, color) {
    dropDown.innerHTML += returnAssignedContactHTMLForBigTaskCardEdit(contactName, color);
    document.getElementById(`edit-${contactName}`).innerText = contactName;
    document.getElementById(`edit-initials-${contactName}`).innerText = getInitials(contactName);
    document.getElementById(`edit-initials-${contactName}`).classList.add(`${color}`);
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
        dropwdownArrow.src = "./assets/icons/arrow_drop_down_mirrored.svg";
    } else {
        dropwdownArrow.src = "./assets/icons/arrow_drop_down.svg";
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
 * Validates the inputs for the "Big Task Card Edit" form.
 *
 * This function checks whether the essential input fields (title and due date) are filled.
 * It also checks if the due date is in a valid format using a helper function `testDateForBigTaskCardEdit`.
 * 
 * The function will set the validation result to `false` if any input field is empty or if the due date is invalid.
 * It tracks any invalid input fields in the `unvalidInputsBigTaskCardEdit` array.
 * 
 * @returns {boolean} `true` if all inputs are valid, `false` otherwise.
 */
function validateInputsForBigTaskCardEdit() {
    let valid = true;
    let inputs = ["big-task-card-edit__input-title", "big-task-card-edit__input-due-date"];
    unvalidInputsBigTaskCardEdit = [];
    for (let i = 0; i < inputs.length; i++) {
        let inputValue = document.getElementById(`${inputs[i]}`).value;
        if (inputValue == "" || ((inputs[i] == "big-task-card-edit__input-due-date") && !testDateForBigTaskCardEdit())) {
            valid = false;
            unvalidInputsBigTaskCardEdit.push(inputs[i]);
        }
    }
    return valid;
}

/**
 * Validates the due date input for the Big Task Card Edit form.
 * 
 * The function checks if the input value matches the required date format (DD/MM/YYYY).
 * If the format is correct, it checks if the date is valid and whether it is not a past date.
 * 
 * @returns {boolean} Returns false if the date format is invalid or if the date is in the past.
 */
function testDateForBigTaskCardEdit() {
    let value = document.getElementById('big-task-card-edit__input-due-date').value;
    let date = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (date === null) {
        return false;
    }
    let day = +date[1], month = +date[2], year = +date[3];
    let dateObj = new Date(`${year}-${month}-${day}`);
    validateDueDateForBigTaskCardEdit(day, dateObj);
}

/**
 * Validates the due date for the Big Task Card Edit form.
 * 
 * This function checks if the given date is in the correct format and whether it is not a past date.
 * If the date is invalid or in the past, an appropriate error message is displayed.
 * 
 * @param {number} day - The day of the due date.
 * @param {Date} dateObj - The Date object representing the due date.
 * @returns {boolean} Returns `true` if the due date is valid, otherwise `false`.
 */
function validateDueDateForBigTaskCardEdit(day, dateObj) {
    if (!correctDateFormat(dateObj, day, month, year)) {
        return false;
    } else if (isPastDate(dateObj)) {
        document.getElementById('invalid-date-big-task-card-edit__input-due-date').innerText = "Due date can`t be in the past!";
        return false;
    }
    return true;
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
    if (input.value !== "") {
        document.getElementById('invalid-subtask-big-task-card-edit__subtask-input').classList.add('d-none');
        document.getElementById('big-task-card-edit__subtask-box').classList.remove('input-unvalid');
        determineSubtaskStyleForBigTaskCardEdit(containerSubtasks, subtasksCountBigTaskCardEdit);
        document.getElementById(`big-task-card-edit__subtask-${subtasksCountBigTaskCardEdit}`).innerText = input.value;
        subtaskObj.subtask = input.value;
        subtasksBigTaskCardEdit.push(subtaskObj);
        checkForScrollableContainerForBigTaskCardEdit(containerSubtasks);
    } else {
        throwSubtaskError();
    }
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
    } else {
        invalidRef.classList.remove('d-none');
    }
}

/**
 * Displays error messages for invalid inputs in the "Big Task Card Edit" section.
 * The function loops through the array of invalid inputs and displays an error message for each,
 * highlighting the respective input field as invalid. It also adds a specific style to certain fields
 * like "category" and "due date".
 *
 * @returns {void}
 */
function throwErrorForBigTaskCardEdit() {
    unvalidInputsBigTaskCardEdit.forEach(element => {
        document.getElementById(`required-${element}`).classList.remove('hidden');
        if (element == "category" || element == "big-task-card-edit__input-due-date") {
            document.getElementById(`${element}-box`).classList.add('input-unvalid')
        } else {
            document.getElementById(`${element}`).classList.add('input-unvalid');
        };
    });
}

/**
 * Hides the error messages and removes invalid styles for input fields in the "Big Task Card Edit" section.
 * The function loops through the array of previously invalid inputs and hides any displayed error messages,
 * and removes the "input-unvalid" style from the corresponding input fields. It also hides the error messages 
 * related to the "due date" and "subtask" inputs.
 *
 * @returns {void}
 */
function removeErrorForBigTaskCardEdit() {
    unvalidInputsBigTaskCardEdit.forEach(element => {
        document.getElementById(`required-${element}`).classList.add('hidden');
        if (element == "category" || element == "big-task-card-edit__input-due-date") {
            document.getElementById(`${element}-box`).classList.remove('input-unvalid')
        } else {
            document.getElementById(`${element}`).classList.remove('input-unvalid');
        };
    });
    document.getElementById('invalid-date-big-task-card-edit__input-due-date').classList.add('hidden');
    document.getElementById('invalid-subtask-big-task-card-edit__subtask-input').classList.add('d-none');
}

/**
 * Selects and toggles the priority button for a big task card edit.
 * 
 * This function determines the priority type based on the button's id and
 * then calls the `togglePriorityForBigTaskCardEdit` function to toggle 
 * the button's class and update the selected priority.
 *
 * @param {string} prio - The id of the priority button (e.g., 'big-task-card-edit__urgent-button').
 * 
 * @example
 * selectPrioButtonForBigTaskCardEdit('big-task-card-edit__urgent-button');
 * // This will set the priority to "urgent" and toggle the respective button.
 */
function selectPrioButtonForBigTaskCardEdit(prio) {
    if (prio !== "") {
        let priority = prio === "big-task-card-edit__urgent-button" ? "urgent" : prio === "big-task-card-edit__medium-button" ? "medium" : "low";
        let button = document.getElementById(`${prio}`);
        let svg = document.getElementById(`svg-${prio}`);
        togglePriorityForBigTaskCardEdit(priority, button, svg);
    }
}

/**
 * Toggles the priority button for a big task card edit.
 * 
 * This function checks whether the provided button already contains the selected
 * priority class. If it does, it clears the priority selection. Otherwise, it
 * updates the button's class to reflect the selected priority and clears any 
 * previously selected priority buttons.
 * 
 * @param {string} priority - The priority level to toggle ("urgent", "medium", or "low").
 * @param {HTMLElement} button - The button element representing the priority.
 * @param {HTMLElement} svg - The SVG element inside the button to be updated based on priority.
 * 
 * @example
 * togglePriorityForBigTaskCardEdit("urgent", urgentButton, svgElement);
 * // This will toggle the 'urgent' priority on the button and update the selected priority.
 */
function togglePriorityForBigTaskCardEdit(priority, button, svg) {
    if (button.classList.contains(priority)) {
        toggleButtonClasses(true, button, svg, priority);
        selectedPriorityBigTaskCardEdit = "";
    } else {
        clearPrioButtonsForBigTaskCardEdit();
        toggleButtonClasses(false, button, svg, priority);
        selectedPriorityBigTaskCardEdit = priority;
    }
}

/**
 * Clears the priority selection from all priority buttons in the big task card edit.
 * 
 * This function removes the priority-related classes from all priority buttons 
 * and resets the button styling to its default state. It ensures that no priority 
 * is selected by removing the "urgent", "medium", or "low" classes and restoring 
 * the default button appearance.
 * 
 * @example
 * clearPrioButtonsForBigTaskCardEdit();
 * // This will clear all priority selections and reset the button styles.
 */
function clearPrioButtonsForBigTaskCardEdit() {
    let prios = ["urgent", "medium", "low"];
    let prioButtons = ["big-task-card-edit__urgent-button", "big-task-card-edit__medium-button", "big-task-card-edit__low-button"];
    for (let i = 0; i < prios.length; i++) {
        let button = document.getElementById(`${prioButtons[i]}`);
        let svg = document.getElementById(`svg-${prioButtons[i]}`);
        button.classList.remove(`${prios[i]}`);
        button.classList.remove('white');
        button.classList.add('button-prio-hover');
        svg.classList.remove('filter-white');
    }
}

/**
 * Displays the selected contacts for the big task card edit.
 * 
 * This function clears the existing assigned contacts from the container, 
 * renders the selected contacts preview, and adds or removes padding 
 * based on the number of selected contacts.
 * 
 * @example
 * displaySelectedContactsForBigTaskCard();
 * // This will update the UI with the selected contacts and apply appropriate padding.
 */
function displaySelectedContactsForBigTaskCard() {
    let container = document.getElementById('big-task-card-edit__assigned-contacts-box');
    container.innerHTML = "";
    renderSelectedContactsPreviewForBigTaskCardEdit(container);
    if (selectedContactsBigTaskCardEdit.length > 8) {
        document.getElementById('big-task-card-edit__assigned-contacts-box').classList.add('padding-bottom-8');
    } else {
        document.getElementById('big-task-card-edit__assigned-contacts-box').classList.remove('padding-bottom-8');
    }
}

/**
 * Renders the preview of the selected contacts for the big task card edit.
 * 
 * This function loops through the `selectedContactsBigTaskCardEdit` array, 
 * extracts each contact's name and color, calculates their initials, 
 * and appends the corresponding contact preview HTML to the provided container.
 * 
 * @param {HTMLElement} container - The DOM element where the selected contact previews will be rendered.
 * 
 * @example
 * renderSelectedContactsPreviewForBigTaskCardEdit(document.getElementById('contact-preview-container'));
 * // This will display the previews of selected contacts inside the specified container.
 */
function renderSelectedContactsPreviewForBigTaskCardEdit(container) {
    for (let i = 0; i < selectedContactsBigTaskCardEdit.length; i++) {
        let name = selectedContactsBigTaskCardEdit[i].name;
        let color = selectedContactsBigTaskCardEdit[i].color;
        let initials = getInitials(name);
        container.innerHTML += returnAssignedContactPreviewHTML(initials, color);
    }
}

/**
 * Toggles the focus on the "Assigned To" input field in the Big Task Card edit view.
 * 
 * This function checks if the dropdown for assigning contacts is visible. 
 * If it is, it sets focus on the input field for assigning contacts.
 * 
 * @example
 * toggleInputFocusForBigTaskCardEdit();
 * // This will focus on the 'Assigned To' input if the dropdown is visible.
 */
function toggleInputFocusForBigTaskCardEdit() {
    if (!document.getElementById('big-task-card-edit__dropdown-assign').classList.contains('d-none')) {
        document.getElementById('big-task-card-edit__assigned-to-input').focus();
    }
}

/**
 * Toggles the selection of a contact for the Big Task Card edit view.
 * 
 * This function checks if the contact is already selected. If the contact is not selected, it adds the contact to the 
 * selected contacts list and updates the UI to reflect the selection. If the contact is already selected, it removes 
 * the contact from the selected contacts list and updates the UI accordingly.
 * 
 * @param {string} name - The name of the contact to be selected or deselected.
 * @param {string} color - The color associated with the contact.
 * 
 * @example
 * selectContactForBigTaskCardEdit('John Doe', 'red');
 * // This will select or deselect the contact 'John Doe' and update the UI accordingly.
 */
function selectContactForBigTaskCardEdit(name, color) {
    let contactDiv = document.getElementById(`edit-container-${name}`);
    let icon = document.getElementById(`edit-icon-${name}`);
    if (!isContactSelected(contactDiv)) {
        toggleSelection(true, contactDiv, icon);
        updateSelectedContactsForBigTaskCard(true, name, color);
    } else {
        toggleSelection(false, contactDiv, icon);
        updateSelectedContactsForBigTaskCard(false, name, color);
    }
    displaySelectedContactsForBigTaskCard();
}

/**
 * Updates the list of selected contacts for the Big Task Card edit view.
 * 
 * This function adds or removes a contact from the `selectedContactsBigTaskCardEdit` array based on the boolean flag.
 * If the boolean is `true`, the contact is added to the selected list, and the list is sorted alphabetically.
 * If the boolean is `false`, the contact is removed from the selected list.
 * 
 * @param {boolean} boolean - A flag indicating whether to add (`true`) or remove (`false`) the contact.
 * @param {string} contactName - The name of the contact to be added or removed from the list.
 * @param {string} contactColor - The color associated with the contact.
 * 
 * @example
 * updateSelectedContactsForBigTaskCard(true, 'John Doe', 'blue');
 * // This will add 'John Doe' to the selected contacts list with a blue color.
 * 
 * updateSelectedContactsForBigTaskCard(false, 'John Doe', 'blue');
 * // This will remove 'John Doe' from the selected contacts list.
 */
function updateSelectedContactsForBigTaskCard(boolean, contactName, contactColor) {
    let obj = { name: contactName, color: contactColor };
    if (boolean) {
        selectedContactsBigTaskCardEdit.push(obj);
        sortContactsAlphabeticallyForBigTaskCardEdit(selectedContactsBigTaskCardEdit);
    } else {
        let index = selectedContactsBigTaskCardEdit.map(e => e.name).indexOf(obj.name);
        selectedContactsBigTaskCardEdit.splice(index, 1);
    }
}

/**
 * Toggles the visibility of the input button and subtask buttons in the Big Task Card edit view.
 * 
 * This function shows or hides the subtask input button and subtask buttons based on the provided boolean flag.
 * - If the boolean is `true`, the subtask input button is hidden, and the subtask buttons are displayed.
 * - If the boolean is `false`, the subtask input button is shown, and the subtask buttons are hidden.
 * 
 * @param {boolean} boolean - A flag to determine whether to show the subtask buttons (`true`) or the subtask input button (`false`).
 * 
 * @example
 * changeInputButtonForBigTaskCardEdit(true);
 * // This will hide the subtask input button and show the subtask buttons.
 * 
 * changeInputButtonForBigTaskCardEdit(false);
 * // This will show the subtask input button and hide the subtask buttons.
 */
function changeInputButtonForBigTaskCardEdit(boolean) {
    if (boolean) {
        document.getElementById('big-task-card-edit__subtask-button-add').classList.add('d-none');
        document.getElementById('big-task-card-edit__subtask-buttons-box').classList.remove('d-none');
    } else {
        document.getElementById('big-task-card-edit__subtask-button-add').classList.remove('d-none');
        document.getElementById('big-task-card-edit__subtask-buttons-box').classList.add('d-none');
    }
}

/**
 * Filters the contacts based on the search value entered in the assigned-to input field and updates the contact display.
 * 
 * This function retrieves the value from the assigned-to input field, performs a case-insensitive search on the contacts list, 
 * and displays the filtered contacts. The contacts whose names contain the search value are displayed in the Big Task Card 
 * edit view.
 * 
 * @example
 * filterContactsForBigTaskCardEdit();
 * // This will filter contacts based on the value entered in the assigned-to input field and update the contact display.
 */
function filterContactsForBigTaskCardEdit() {
    let searchValue = document.getElementById('big-task-card-edit__assigned-to-input').value.toLowerCase();
    let filteredContacts = contactsBigTaskCardEdit.filter(contact => contact.name.toLowerCase().includes(searchValue));
    renderAssignOptionsForBigTaskCardEdit(filteredContacts);
}