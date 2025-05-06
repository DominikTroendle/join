const BASE_URL_ADDTASK = "https://join-user-default-rtdb.europe-west1.firebasedatabase.app/users/";

let userId;

let contacts = [];

let selectedContacts = [];

let selectedPriority = "medium";

let subtasksCount = 0;

let subtasks = [];

let task = {};

let unvalidInputs = [];

/**
 * Initializes different functions on page load
 */
async function initialize() {
    let contactsObj = await getContacts();
    loadContactInfo(contactsObj);
    loadSmallInitials();
}

initialize();

/**
 * Selects or deselects the clicked button
 * @param {String} prio - name of the selected priority button
 */
function selectPrioButton(prio) {
    let button = document.getElementById(`${prio}`);
    let svg = document.getElementById(`svg-${prio}`);
    if (button.classList.contains(`${prio}`)) {
        toggleButtonClasses(true, button, svg, prio);
        selectedPriority = "";
    } else {
        clearPrioButtons();
        toggleButtonClasses(false, button, svg, prio);
        selectedPriority = prio;
    }
}

/**
 * Toggles different classes on clicked button and svg
 * @param {Boolean} boolean - boolean to define whether the classes should be added (true) or removed (false)
 * @param {HTMLElement} button - button element whose classes should be change
 * @param {HTMLElement} svg - svg element whose classes should be changed
 * @param {String} prio - name of the selected priority
 */
function toggleButtonClasses(boolean, button, svg, prio) {
    if (boolean) {
        button.classList.remove(`${prio}`);
        button.classList.remove('white');
        button.classList.add('button-prio-hover');
        svg.classList.remove('filter-white');
    } else {
        button.classList.add(`${prio}`);
        button.classList.add('white');
        button.classList.remove('button-prio-hover');
        svg.classList.add('filter-white');
    }
}

/**
 * Removes all classes from priority buttons to restore default state
 */
function clearPrioButtons() {
    let prios = ["urgent", "medium", "low"];
    for (let i = 0; i < prios.length; i++) {
        let button = document.getElementById(`${prios[i]}`);
        let svg = document.getElementById(`svg-${prios[i]}`);
        button.classList.remove(`${prios[i]}`);
        button.classList.remove('white');
        button.classList.add('button-prio-hover');
        svg.classList.remove('filter-white');
    }
}

/**
 * Selects default (medium) priority button
 */
function selectDefaultPrioButton() {
    let button = document.getElementById('medium');
    let svg = document.getElementById('svg-medium');
    button.classList.add('medium');
    button.classList.add('white');
    button.classList.remove('button-prio-hover');
    svg.classList.add('filter-white');
}

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
        dropwdownArrow.src = "./assets/icons/arrow_drop_down_mirrored.svg";
    } else {
        dropwdownArrow.src = "./assets/icons/arrow_drop_down.svg";
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
 * Prevents the default behavior of the given event
 * @param {Event} event - event object whose default action should be prevented
 */
function preventDefault(event) {
    event.preventDefault();
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
 * Stops the propagation of the given event, preventing it from bubbling up the DOM tree
 * @param {Event} event - event object whose propagation should be stopped
 */
function stopPropagation(event) {
    event.stopPropagation();
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
        icon.src = "./assets/icons/checked.svg";
        icon.classList.add('filter-white');
    } else {
        contactDiv.classList.remove('selected');
        contactDiv.classList.remove('selected-hover');
        contactDiv.classList.remove('white');
        icon.src = "./assets/icons/unchecked.svg";
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
    let obj = {name: contactName, color: contactColor};
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
 * Clears all inputs, removes thrown error messages and resets variables to their default values
 */
function clearInputs() {
    removeError();
    subtasksCount = 0;
    document.getElementById('container-subtasks').innerHTML = "";
    document.getElementById('container-assigned-contacts').innerHTML = "";
    clearPrioButtons();
    selectDefaultPrioButton();
    clearInputValues();
    document.getElementById('category').value = "";
    selectedContacts = [];
    renderAssignOptions(contacts);
    document.getElementById('max-char-title').classList.add('d-none');
    document.getElementById('invalid-date').classList.add('d-none');
    document.getElementById('container-input-subtask').classList.remove('input-unvalid');
}

/**
 * Clears the values of all inputs defined in the array
 */
function clearInputValues() {
    let inputs = ["title", "description", "due-date", "subtasks"];
    for (let i = 0; i <inputs.length; i++) {
        document.getElementById(`${inputs[i]}`).value = "";
    }
}

/**
 * Changes the visibility of two buttons to be displayed or hidden, depending on the boolean value
 * @param {Boolean} boolean - determines which classes should be added to or removed from the buttons
 */
function changeInputButton(boolean) {
    if (boolean) {
        document.getElementById('button-add').classList.add('d-none');
        document.getElementById('container-buttons').classList.remove('d-none');
    } else {
        document.getElementById('button-add').classList.remove('d-none');
        document.getElementById('container-buttons').classList.add('d-none');
    }
}

/**
 * Creates task by validating all inputs and saving the task if all inputs are valid or throwing errors if inputs are unvalid
 */
function createTask() {
    removeError();
    let valid = validateInputs();
    let validDateFormat = testDate();
    if (valid && validDateFormat) {
        saveTask();
        document.getElementById('overlay-task-added').classList.remove('d-none');
        setTimeout(() => {
            window.location.href = 'board.html';
        }, "900");
    } else if (!validDateFormat && document.getElementById('due-date').value !== "") {
        throwError();
        document.getElementById('invalid-date').classList.remove('hidden');
    } else {
        throwError();
    }
}

/**
 * Validates a set of required form inputs and adds unvalid inputs to the unvalidInput array
 * @returns true if all inputs are valid, otherwise false
 */
function validateInputs() {
    let valid = true;
    let inputs = ["title", "due-date", "category"];
    unvalidInputs = [];
    for (let i = 0; i < inputs.length; i++) {
        let inputValue = document.getElementById(`${inputs[i]}`).value;
        inputValue = inputValue.trim();
        if (inputValue == "" || ((inputs[i] == "due-date") && !testDate())) {
            valid = false;
            unvalidInputs.push(inputs[i]);
        }
    }
    return valid;
}

/**
 * Tests date input value to match a specific format order and to be in the future
 * @returns true if input value is valid or in the past, otherwise false
 */
function testDate() {
    let value = document.getElementById('due-date').value;
    let date = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (date === null) {
        return false;
    }
    let day = +date[1], month = +date[2], year = +date[3];
    let dateObj = new Date(`${year}-${month}-${day}`);
    if (!correctDateFormat(dateObj, day, month, year)) {
        return false;
    } else if (isPastDate(dateObj)) {
        document.getElementById('invalid-date').innerText = "Due date can`t be in the past!";
        return false;
    }
    return true;
}

/**
 * Checks if a given Date object matches the specified day, month, and year
 * @param {Object} dateObj - date object to validate
 * @param {Number} day - the expected day
 * @param {Number} month - the expected month
 * @param {Number} year - the expected year
 * @returns false if the given date object is in the wrong format, otherwise true
 */
function correctDateFormat(dateObj, day, month, year) {
    let validDate = dateObj.getFullYear() === year &&
                    (dateObj.getMonth() + 1) === month &&
                    dateObj.getDate() === day;
    if (!validDate) {
        return false;
    }
    return true;
}

/**
 * Checks if the given date is in the past
 * @param {Object} dateObj - date object to validate
 * @returns true if the given date is in the past, otherwise false
 */
function isPastDate(dateObj) {
    let today = new Date();
    if (dateObj < today) {
        return true;
    }
    return false;
}

/**
 * Throws error by removing classes from elements in the unvalidInputs array to show error messages
 */
function throwError() {
    unvalidInputs.forEach(element => {
        document.getElementById(`required-${element}`).classList.remove('hidden');
        if (element == "category" || element == "due-date") {
            document.getElementById(`container-input-${element}`).classList.add('input-unvalid')
        } else {
            document.getElementById(`${element}`).classList.add('input-unvalid');
        };
    });
}

/**
 * Removes error messages by adding classes to elements in the unvalidInputs array to hide error messages
 */
function removeError() {
    unvalidInputs.forEach(element => {
        document.getElementById(`required-${element}`).classList.add('hidden');
        if (element == "category" || element == "due-date") {
            document.getElementById(`container-input-${element}`).classList.remove('input-unvalid')
        } else {
            document.getElementById(`${element}`).classList.remove('input-unvalid');
        };
    });
    document.getElementById('invalid-date').classList.add('hidden');
    document.getElementById('invalid-subtask').classList.add('d-none');
}

/**
 * Saves task by setting key-value pairs of the task object
 */
function saveTask() {
    task.category = setTaskCategory();
    task.taskType = document.getElementById('category').value;
    task.taskTitle = document.getElementById('title').value;
    task.taskDescription = document.getElementById('description').value;
    task.taskPriority = selectedPriority;
    task.numberOfSubtasks = subtasksCount;
    task.numberOfCompletedSubtasks = 0;
    task.subtasks = subtasks;
    task.taskDueDate = document.getElementById('due-date').value;
    task.assignedContacts = selectedContacts;
    saveToFirebase("tasks/", task);
    task = {};
}

/**
 * Determines the task category based on the current window width
 * @returns the determined task category
 */
function setTaskCategory() {
    let category;
    if(window.innerWidth <= 1040) {
        category = getTaskCategory();
    } else {
        category = "toDos";
    }
    return category;
}

/**
 * Gets the tasks category by reading it from the session storage
 * @returns the tasks category read from the session storage
 */
function getTaskCategory() {
    if (sessionStorage.getItem("taskCategory") === "toDo" || sessionStorage.getItem("taskCategory") == null) {
        return "toDos";
    } else {
        return sessionStorage.getItem("taskCategory");
    }
}

/**
 * Saves the task object to a specified path of a firebase database
 * @param {String} path - path of the location where the task is saved
 * @param {Object} task - task object which is saved
 */
async function saveToFirebase(path, task) {
    if (userId == "guest") {
        path = "guest/" + path;
        await postData(path, task);
    } else {
        path = `${userId}/` + path;
        await postData(path, task)
    }
}

/**
 * Sends a POST request with JSON data to a specified endpoint
 * @param {String} path - path of the location where the task is saved
 * @param {Object} data - data object which is sent to the database
 * @returns a promise that resolves to the Fetch API Response object
 */
async function postData(path="", data={}) {
    let response = await fetch(BASE_URL_ADDTASK + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return response;
}

/**
 * Retrieves contact data from an endpoint based on the current user's ID
 * @param {*} path - path of the location where the contact data is retrieved from
 * @returns a promise that resolves to the parsed JSON response containing the contact data
 */
async function getContacts(path="") {
    userId = localStorage.getItem('userId');
    if (userId !== "guest") {
        path = userId;
        let response = await fetch(BASE_URL_ADDTASK + path + ".json");
        let responseJson = await response.json();
        return responseJson;
    } else {
        path = "guest";
        let response = await fetch(BASE_URL_ADDTASK + path + ".json");
        let responseJson = await response.json();
        return responseJson;
    }
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
 * Loads and displays the user's initials in the specified element
 * @returns a window.location object
 */
async function loadSmallInitials() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        return window.location.href = "index.html?";
    }
    let dataPath = userId === "guest" ? "guest.json" : `${userId}.json`;
    let response = await fetch(BASE_URL_ADDTASK + dataPath);
    let userData = await response.json();
    document.getElementById('smallInitials').innerText = getInitials(userData.userDatas.name) || "G";
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
 * Checks the length of the given inputField and shows an errorElement when the input is too long
 * @param {String} inputField - name of the input whose values length is checked
 */
function checkInputLength(inputField) {
    let input = document.getElementById(`${inputField}`);
    let errorElement = document.getElementById(`max-char-${inputField}`);
    let inputSettings = {"title": {invalidElement: null}, "subtasks": {invalidElement: "invalid-subtask"}};
    let maxLength = 50;
    let invalidElement = inputSettings[inputField].invalidElement;
    if (input.value.length == maxLength) {
        errorElement.classList.remove('d-none');
        if (invalidElement) document.getElementById(invalidElement).classList.add('d-none');
    } else {
        errorElement.classList.add('d-none');
    }
}

/**
 * Displays the value of the date picker as the inputs value
 */
function putDateToInput() {
    let datePicker = document.getElementById('date-picker');
    let input = document.getElementById('due-date');
    if (datePicker.value) {
        let [year, month, day] = datePicker.value.split('-');
        input.value = `${day}/${month}/${year}`;
    }
}