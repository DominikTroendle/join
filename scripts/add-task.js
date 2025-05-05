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
 * Processes subtask by checking the inputs value and determining whether to add the task (if boolean is true) or clear (if boolean is false) the input.
 * Clears the input value afterwards.
 * @param {Boolean} boolean - determines whether the subtask should be added (true) or the input should be cleared (false)
 */
function processSubtask(boolean) {
    let input = document.getElementById('subtasks');
    let invalidRef = document.getElementById('invalid-subtask');
    invalidRef.classList.add('d-none');
    document.getElementById('max-char-subtasks').classList.add('d-none')
    if (boolean && (input.value != "")) {
        addSubtask();
        input.value = "";
    } else if (!boolean && (input.value != "" || input.value == "")) {
        input.value = "";
    } else {
        invalidRef.classList.remove('d-none');
    }
}

/**
 * Toggles visibility of the edition options based on the boolean value by addind or removing classes
 * @param {String} id - id of the edition options whose visibility should be changed
 * @param {Boolean} boolean - determines whether classes should be added (false) or removed (true)
 */
function showEditOptions(id, boolean) {
    if (boolean) {
        document.getElementById(`icons-subtask-${id}`).classList.remove('d-none');
    } else {
        document.getElementById(`icons-subtask-${id}`).classList.add('d-none');
    }
}

/**
 * Checks if the pressed key is the Enter key
 * @param {KeyboardEvent} event - key press event triggered by the user
 */
function isEnterKey(event) {
    let subtasksInput = document.getElementById('subtasks')
    if (event.key === "Enter") {
        addSubtask();
        subtasksInput.value = "";
    }
}

/**
 * Adds subtask if the inputs value is not empty, otherwise throws error
 */
function addSubtask() {
    let input = document.getElementById('subtasks');
    let containerSubtasks = document.getElementById('container-subtasks');
    let subtaskObj = {"checked" : "false"};
    if (input.value !== "") {
        document.getElementById('invalid-subtask').classList.add('d-none');
        document.getElementById('container-input-subtask').classList.remove('input-unvalid');
        subtasksCount++;
        determineSubtaskStyle(containerSubtasks, subtasksCount);
        document.getElementById(`subtask-${subtasksCount}`).innerText = input.value;
        subtaskObj.subtask = input.value;
        subtasks.push(subtaskObj);
        checkForScrollableContainer(containerSubtasks);
    } else {
        throwSubtaskError();
    }
}

/**
 * Determines whether a mobile HTML template should be rendered by checking the innerWindow width
 * @param {HTMLElement} containerSubtasks - div element in which the HTML template is rendered
 * @param {Number} subtasksCount - number of the subtask
 */
function determineSubtaskStyle(containerSubtasks, subtasksCount) {
    if (window.innerWidth <= 1040) {
        containerSubtasks.innerHTML += returnSubtaskMobileHTML(subtasksCount);
    } else {
        containerSubtasks.innerHTML += returnSubtaskHTML(subtasksCount);
    }
}

/**
 * Deletes subtask by removing if from both the subtasks array and the DOM
 * @param {String} id - id of the subtask the user clicked to delete
 */
function deleteSubtask(id) {
    let subtaskContainer = document.getElementById(`container-subtask-${id}`);
    let containerSubtasks = document.getElementById('container-subtasks');
    subtasks.splice((id-1), 1);
    subtaskContainer.remove();
    subtasksCount--;
    checkForScrollableContainer(containerSubtasks);    
}

/**
 * Edits subtask by updating its value based on the users input and adjusts padding-related class by determining whether the element is the last child
 * @param {String} id - id of the subtask the user clicked to edit
 */
function editSubtask(id) {
    let child = document.getElementById(`container-subtask-${id}`);
    document.getElementById(`input-subtask-${id}`).value = document.getElementById(`subtask-${id}`).innerText;
    document.getElementById(`details-subtask-${id}`).classList.add('d-none');
    document.getElementById(`edit-subtask-${id}`).classList.remove('d-none');
    if (isLastChild(child)) {
        child.classList.add('padding-top');
    }
}

function isLastChild(child) {
    return (child === child.parentNode.children[child.parentNode.children.length-1]) 
}

function saveEditedSubtask(id) {
    let input = document.getElementById(`input-subtask-${id}`);
    let element = document.getElementById(`container-subtask-${id}`);
    document.getElementById(`details-subtask-${id}`).classList.remove('d-none');
    document.getElementById(`edit-subtask-${id}`).classList.add('d-none');
    document.getElementById(`subtask-${id}`).innerText = input.value;
    subtasks[`${id-1}`].subtask = input.value;
    input.value = "";
    if (window.innerWidth > 1040) {showEditOptions(id, false);}
    if (element.classList.contains('padding-top')) {
        element.classList.remove('padding-top');
    }
}

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

function validateInputs() {
    let valid = true;
    let inputs = ["title", "due-date", "category"];
    unvalidInputs = [];
    for (let i = 0; i < inputs.length; i++) {
        let inputValue = document.getElementById(`${inputs[i]}`).value;
        if (inputValue == "" || ((inputs[i] == "due-date") && !testDate())) {
            valid = false;
            unvalidInputs.push(inputs[i]);
        }
    }
    return valid;
}

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

function correctDateFormat(dateObj, day, month, year) {
    let validDate = dateObj.getFullYear() === year &&
                    (dateObj.getMonth() + 1) === month &&
                    dateObj.getDate() === day;
    if (!validDate) {
        return false;
    }
    return true;
}

function isPastDate(dateObj) {
    let today = new Date();
    if (dateObj < today) {
        return true;
    }
    return false;
}

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

function throwSubtaskError() {
    document.getElementById('invalid-subtask').classList.remove('d-none');
    document.getElementById('container-input-subtask').classList.add('input-unvalid');
}

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

function setTaskCategory() {
    let category;
    if(window.innerWidth <= 1040) {
        category = getTaskCategory();
    } else {
        category = "toDos";
    }
    return category;
}

function getTaskCategory() {
    if (sessionStorage.getItem("taskCategory") === "toDo" || sessionStorage.getItem("taskCategory") == null) {
        return "toDos";
    } else {
        return sessionStorage.getItem("taskCategory");
    }
}

async function saveToFirebase(path, task) {
    if (userId == "guest") {
        path = "guest/" + path;
        await postData(path, task);
    } else {
        path = `${userId}/` + path;
        await postData(path, task)
    }
}

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

function putDateToInput() {
    let datePicker = document.getElementById('date-picker');
    let input = document.getElementById('due-date');
    if (datePicker.value) {
        let [year, month, day] = datePicker.value.split('-');
        input.value = `${day}/${month}/${year}`;
    }
}