/**
 * Toggles the custom dropdown menu with ID "dropdown-assigned" on click and toggles the inputs placeholder to be hidden (if dropdown is opened) or shown (if dropdown is closed)
 */
function toggleAssignOptions() {
    renderAssignOptions(contacts);
    let container = document.getElementById('dropdown-assign');
    let containerDropdown = document.getElementById('container-dropdown');
    let input = document.getElementById('assigned-to');
    container.classList.toggle('d-none');
    containerDropdown.classList.toggle('box-shadow');
    renderAssignOptions(contacts);
    if (input.placeholder == "Select contacts to assign") {
        input.placeholder = "";
        changeDropdownArrow(true, 'assigned');
    } else if (input.placeholder == "") {
        input.placeholder = "Select contacts to assign";
        changeDropdownArrow(false, 'assigned');
    }
}

/**
 * Changes the image source of the dropdown menu arrow
 * @param {Boolean} boolean - boolean to determine which image source should be used
 * @param {String} dropdown - name of the dropdown menu whose image source should be changed
 */
function changeDropdownArrow(boolean, dropdown) {
    let dropwdownArrow = document.getElementById(`arrow-dropdown-${dropdown}`);
    if (boolean) {
        dropwdownArrow.src = "../assets/icons/arrow_drop_down_mirrored.svg";
    } else {
        dropwdownArrow.src = "../assets/icons/arrow_drop_down.svg";
    }
}

/**
 * Toggles focus on the input element with ID "assigned-to"
 */
function toggleInputFocus() {
    if (!document.getElementById('dropdown-assign').classList.contains('d-none')) {
        document.getElementById('assigned-to').focus();
    }
}

/**
 * Toggles the custom dropdown menu with ID "dropdown-category" on click and determines whether the dropdow arrow should be changed (if dropwodn is closed)
 */
function toggleCategoryOptions() {
    let container = document.getElementById('dropdown-category');
    container.classList.toggle('d-none');
    container.classList.toggle('box-shadow');
    if (!container.classList.contains('d-none')) {
        changeDropdownArrow(true, 'category');
    } else {
        changeDropdownArrow(false, 'category');
    }
}

/**
 * Changes the value of the input with ID "category" to the passed category
 * @param {String} category - name of the selected category
 */
function displayCategory(category) {
    document.getElementById('category').value = category;
    closeDropdown();
}

/**
 * Closes all dropdown menus and changes the dropdown arrows back to their default state
 */
function closeDropdown() {
    document.getElementById('dropdown-assign').classList.add('d-none');
    document.getElementById('dropdown-category').classList.add('d-none');
    document.getElementById('dropdown-category').classList.remove('box-shadow');
    document.getElementById('container-dropdown').classList.remove('box-shadow');
    document.getElementById('assigned-to').value = "";
    document.getElementById('assigned-to').placeholder = "Select contacts to assign";
    changeDropdownArrow(false, 'assigned');
    changeDropdownArrow(false, 'category');
}

/**
 * Renders the select options of the dropdown menu with ID "dropdown-assigned" based on whether there are alöready selected options or not
 * @param {Array} array - array of the select options to be rendered
 */
function renderAssignOptions(array) {
    let dropDown = document.getElementById('dropdown-assign');
    dropDown.innerHTML = "";
    if (selectedContacts.length == 0) {
        renderDefaultContacts(array, dropDown);
    } else {
        checkForSelectedContacts(array, dropDown);
    }
    checkForScrollableContainer(dropDown);
}

/**
 * Checks whether the given container should be scrollable based on the number of contacts or subtasks to be rendered
 * Applies the appropriate scroll behavior by calling helper functions
 * @param {HTMLElement} container - div element to apply scroll behaviour to
 */
function checkForScrollableContainer(container) {
    if (((contacts.length < 6) && (container.id == "dropdown-assign")) || ((subtasksCount <= 2) && (container.id == "container-subtasks"))) {
        containerScrollable(container);
    } else if ((subtasksCount >= 2) && (container.id == "container-subtasks")) {
        containerNotScrollable(container);
    }
}

/**
 * Applies different styles to the given container to adjust its width and remove scroll-related margin classes
 * @param {HTMLElement} container - div element to add classes to
 */
function containerScrollable(container) {
    if (container.id == "dropdown-assign") {
        container.style.width = "440px";
        let selectOptionsArray = Array.from(document.getElementsByClassName('container-custom-select-option'));
        selectOptionsArray.forEach(element => {
            element.classList.remove('select-option-with-scrollbar');
        });
    } else if (container.id == "container-subtasks") {
        let subtaskContainers = Array.from(document.getElementsByClassName('container-subtask'));
        subtaskContainers.forEach(element => {
            element.classList.remove('subtask-scroll-margin');
        });
    }
}

/**
 * Applies scroll-related margin classes to the given container
 * @param {HTMLElement} container - div element to add classes to
 */
function containerNotScrollable(container) {
    if (container.id = "container-subtasks") {
        let subtaskContainers = Array.from(document.getElementsByClassName('container-subtask'));
        subtaskContainers.forEach(element => {
            element.classList.add('subtask-scroll-margin');
        })
    }
}

/**
 * Renders contacts from a given array to the given dropdown element
 * @param {Array} array - array whose contacts are rendered
 * @param {HTMLElement} dropDown - dropdown element in which contacts are rendered
 */
function renderDefaultContacts(array, dropDown) {
    for (let i = 0; i < array.length; i++) {
        let contactName = array[i].name;
        let color = array[i].color;
        renderContactAsDefault(dropDown, contactName, color);
    }
}

/**
 * Iterates over the given array and updates their display in the dropdown based on whether each contact is curretly selected
 * @param {Array} array - array of contacts to check
 * @param {HTMLElement} dropDown - dropdown element in which contacts are rendered
 */
function checkForSelectedContacts(array, dropDown) {
    for (let i = 0; i < array.length; i++) {
        let contactName = array[i].name;
        let color = array[i].color;
        if (isInSelectedContacts(contactName)) {
            renderContactAsSelected(dropDown, contactName, color);
        } else {
            renderContactAsDefault(dropDown, contactName, color);
        }
    }
}

/**
 * Renders the given contact info (contactName and color) as selected to the given dropdown
 * @param {HTMLElement} dropDown - dropdown element in which contacts are rendered
 * @param {String} contactName - name of the contact to be rendered
 * @param {String} color - name of the color that is assigned to the contact
 */
function renderContactAsSelected(dropDown, contactName, color) {
    renderContactAsDefault(dropDown, contactName, color);
    let contactDiv = document.getElementById(`container-${contactName}`);
    let icon = document.getElementById(`icon-${contactName}`);
    toggleSelection(true, contactDiv, icon);
}

/**
 * Renders the given contact info (contactName and color) as default to the given dropdown
 * @param {HTMLElement} dropDown - dropdown element in which contacts are rendered
 * @param {String} contactName - name of the contact to be rendered
 * @param {String} color - name of the color that is assigned to the contact
 */
function renderContactAsDefault(dropDown, contactName, color) {
    dropDown.innerHTML += returnAssignedContactHTML(contactName, color);
    document.getElementById(`${contactName}`).innerText = contactName;
    document.getElementById(`initials-${contactName}`).innerText = getInitials(contactName);
    document.getElementById(`initials-${contactName}`).classList.add(`${color}`);
}

/**
 * Checks if the given contact is in the array of selected contacts
 * @param {String} contactName - name of the contact to check
 * @returns {Boolean} - true if the contact is in the array, otherwise false
 */
function isInSelectedContacts(contactName) {
    let arr = [];
    selectedContacts.forEach(contact => arr.push(contact.name));
    return arr.includes(contactName);
}

/**
 * Generates initials from a contacts full name
 * @param {String} contactName - name of the contact to generate initials from
 * @returns {String} - returns generated initials
 */
function getInitials(contactName) {
    let name = contactName.trim().split(' ').filter(n => n);
    let initials = '';
    for (let i = 0; i < Math.min(name.length, 2); i++) {
        initials += name[i].charAt(0).toUpperCase();
    }
    return initials
}

/**
 * Toggles selection of the given contact, updates the selected contacts and displays all selected contacts
 * @param {String} name - name of the contact being selected
 * @param {String} color - assigned color of the contact
 */
function selectContact(name, color) {
    let contactDiv = document.getElementById(`container-${name}`);
    let icon = document.getElementById(`icon-${name}`);
    if (!isContactSelected(contactDiv)) {
        toggleSelection(true, contactDiv, icon);
        updateSelectedContacts(true, name, color);
    } else {
        toggleSelection(false, contactDiv, icon);
        updateSelectedContacts(false, name, color);
    }
    displaySelectedContacts();
}

/**
 * Toggles selection of the given contactDiv by adding (if boolean is true) or removing (if boolean is false) differnet classes
 * @param {Boolean} boolean - determines whether classes should be added or removed depending on the boolean
 * @param {HTMLElement} contactDiv - div element whose classes are added or removed depending on the boolean
 * @param {SVGElement} icon - svg icon whose source is changed depending on the boolean
 */
function toggleSelection(boolean, contactDiv, icon) {
    if (boolean) {
        contactDiv.classList.add('selected');
        contactDiv.classList.add('selected-hover');
        contactDiv.classList.add('white');
        icon.src = "../assets/icons/checked.svg";
        icon.classList.add('filter-white');
    } else {
        contactDiv.classList.remove('selected');
        contactDiv.classList.remove('selected-hover');
        contactDiv.classList.remove('white');
        icon.src = "../assets/icons/unchecked.svg";
        icon.classList.remove('filter-white');
    }
}

/**
 * Filters contacts of an array by searchValue and renders them
 */
function filterContacts() {
    let searchValue = document.getElementById('assigned-to').value.toLowerCase();
    let filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(searchValue));
    renderAssignOptions(filteredContacts);
}

/**
 * Displays contacts in the corresponding container and adjusts padding-related classes depending on the number of contacts
 */
function displaySelectedContacts() {
    let container = document.getElementById('container-assigned-contacts');
    container.innerHTML = "";
    for (let i = 0; i < selectedContacts.length; i++) {
        let name = selectedContacts[i].name;
        let color = selectedContacts[i].color;
        let initials = getInitials(name);
        container.innerHTML += returnAssignedContactPreviewHTML(initials, color);
    }
    if (selectedContacts.length > 8) {
        document.getElementById('container-assigned-contacts').classList.add('padding-bottom-8');
    } else {
        document.getElementById('container-assigned-contacts').classList.remove('padding-bottom-8');
    }
}

/**
 * Updates the selectedContacts array by adding (if boolean is true) or removing (if boolean is false) an object of the given contactName and contactColor to the array
 * @param {Boolean} boolean - determines whether the array should be added to (true) or removed from (false)
 * @param {String} contactName - name of the contact to add to or remove from array
 * @param {String} contactColor - color of the contact to add to or remove from array
 */
function updateSelectedContacts(boolean, contactName, contactColor) {
    let obj = { name: contactName, color: contactColor };
    if (boolean) {
        selectedContacts.push(obj);
        sortContactsAlphabetically(selectedContacts);
    } else {
        let index = selectedContacts.map(e => e.name).indexOf(obj.name);
        selectedContacts.splice(index, 1);
    }
}

/**
 * Checks if the given contactDiv is selected
 * @param {HTMLElement} contactDiv - div element whose classes are checked
 * @returns true if contactDiv contains a specific class, otherwise false
 */
function isContactSelected(contactDiv) {
    return contactDiv.classList.contains('selected');
}

/**
 * Loads contact information from the given contacts object and saves them in a global array
 * @param {Object} contactsObj - object of contacts
 */
async function loadContactInfo(contactsObj) {
    let keys = Object.keys(contactsObj.allContacts);
    for (let index = 0; index < keys.length; index++) {
        let key = keys[index];
        let contactObj = {
            color: contactsObj.allContacts[key].color,
            name: contactsObj.allContacts[key].name
        };
        contacts.push(contactObj);
    }
    sortContactsAlphabetically(contacts);
}

/**
 * /**
 * Sorts a given array of contact objects alphabetically by name
 * @param {Array} contactsArray - array of contact objects to sort
 */
function sortContactsAlphabetically(contactsArray) {
    if (userId != "guest") {
        let user = contactsArray.splice(0, 1);
        contactsArray.sort((a, b) => a.name.localeCompare(b.name));
        if (contactsArray == contacts) {
            contacts = user.concat(contactsArray);
        } else if (contactsArray == selectedContacts) {
            selectedContacts = user.concat(contactsArray);
        }
    } else {
        contactsArray.sort((a, b) => a.name.localeCompare(b.name));
    }
}

/**
 * Saves the task title and description input values to sessionStorage.
 *
 * Retrieves values from input fields with IDs "title" and "description"
 * and stores them under the keys "title" and "description" in sessionStorage.
 * Also sets the flag "add-task" to true to indicate a task should be added.
 *
 * @function saveTaskToSession
 * @returns {void}
 */
function saveTaskToSession() {
    let titleInput = document.getElementById("title");
    let descriptionInput = document.getElementById("description");
    sessionStorage.setItem("add-task", "true");
    sessionStorage.setItem("title", titleInput.value);
    sessionStorage.setItem("description", descriptionInput.value);
}

/**
 * Disables the selection of past dates in a specific date picker input
 * by setting the minimum allowed date to today's date.
 *
 * @function deactivatePastDays
 * @param {string} id - The ID of the input element to modify.
 * @returns {void} This function does not return anything.
 *
 * @description
 * Calculates the current date in ISO format and sets it as the `min` attribute
 * on the input element with the given ID. This ensures that the user cannot select
 * a date earlier than today.
 */
function deactivatePastDays(id) {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById(id).setAttribute("min", today);
}