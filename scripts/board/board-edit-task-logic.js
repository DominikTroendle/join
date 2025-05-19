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
        inputValue = inputValue.trim();
        if (inputValue == "" || ((inputs[i] == "big-task-card-edit__input-due-date") && !testDateForBigTaskCardEdit())) {
            valid = false;
            unvalidInputsBigTaskCardEdit.push(inputs[i]);
        }
    }
    return valid;
}

/**
 * Validates the due date input from the big task card edit form.
 * 
 * The function expects a date in the format "dd/mm/yyyy" from the input field,
 * parses it into a JavaScript `Date` object, and passes it to a validator.
 * 
 * @returns {boolean} - Returns `true` if the date is valid and not in the past, otherwise `false`.
 */
function testDateForBigTaskCardEdit() {
    let value = document.getElementById('big-task-card-edit__input-due-date').value;
    let date = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (date === null) {
        return false;
    }
    let day = +date[1], month = +date[2], year = +date[3];
    let dateObj = new Date(year, month - 1, day);
    return validateDueDateForBigTaskCardEdit(dateObj, day, month, year);
}

/**
 * Validates the correctness and logical validity of a given due date.
 *
 * Checks whether the provided date corresponds to a valid calendar date and is not in the past.
 * If the date is invalid or in the past, displays an error message in the UI.
 *
 * @param {Date} dateObj - The Date object created from the input.
 * @param {number} day - The day portion extracted from the input string.
 * @param {number} month - The month portion extracted from the input string (1-based).
 * @param {number} year - The year portion extracted from the input string.
 * @returns {boolean} - Returns `true` if the date is valid and not in the past, otherwise `false`.
 */
function validateDueDateForBigTaskCardEdit(dateObj, day, month, year) {
    if (!correctDateFormat(dateObj, day, month, year)) {
        return false;
    } else if (isPastDate(dateObj)) {
        document.getElementById('invalid-date-big-task-card-edit__input-due-date').innerText = "Due date can`t be in the past!";
        return false;
    }
    return true;
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
 * This will select or deselect the contact 'John Doe' and update the UI accordingly.
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
 * This will add 'John Doe' to the selected contacts list with a blue color.
 * 
 * updateSelectedContactsForBigTaskCard(false, 'John Doe', 'blue');
 * This will remove 'John Doe' from the selected contacts list.
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
 * This will hide the subtask input button and show the subtask buttons.
 * 
 * changeInputButtonForBigTaskCardEdit(false);
 * This will show the subtask input button and hide the subtask buttons.
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
 * This will filter contacts based on the value entered in the assigned-to input field and update the contact display.
 */
function filterContactsForBigTaskCardEdit() {
    let searchValue = document.getElementById('big-task-card-edit__assigned-to-input').value.toLowerCase();
    let filteredContacts = contactsBigTaskCardEdit.filter(contact => contact.name.toLowerCase().includes(searchValue));
    renderAssignOptionsForBigTaskCardEdit(filteredContacts);
}