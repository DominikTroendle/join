const BASE_URL_TEST = "https://join-demo-87ca4-default-rtdb.europe-west1.firebasedatabase.app/";
const BASE_URL = "https://join-user-default-rtdb.europe-west1.firebasedatabase.app/users/";

let userId;

let contacts = [];

let selectedContacts = [];

let selectedPriority = "";

let subtasksCount = 0;

let subtasks = [];

let task = {};

// default taskObj construction
/* task = {
    id: 1,
    taskDescription: "",
    taskTitle: "",
    taskType: "User Story",
    taskDate: "",
    taskPriority: "",
    taskSubtasks:
    [
        {
            subtask1: "",
            done: false
        },
        {
            subtask2: "",
            done: false
        }
    ],
    taskAssigned:
    [
        {
            name: "David Müller",
            initials:  "",
            color: ""
        }
    ]
}; */

let unvalidInputs = [];

/**
 * loads initial functions
 */
async function init() {
    let contactsObj = await getContacts();
    loadContactInfo(contactsObj);
    renderAssignOptions(contacts);
    loadSmallInitials();
}

/**
 * Selects a priority button
 * @param {string} prio - name of the selected priority by onclick
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
 * toggles classes to show button as selected or deselected
 * @param {boolean} boolean - determines whether button is selected or deselected
 * @param {string} button - reference of the button-element
 * @param {string} svg - reference of the svg-element
 * @param {string} prio - name of the selected priority
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
 * removes classes from all buttons to deselect them
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
 * toggles the assigned-to dropdown
 */
function toggleAssignOptions() {
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
 * changes src of dropdown arrow img
 * @param {boolean} boolean - determines whether the dropdown is opened or closed onclick
 * @param {string} dropdown - reference of the dropdown element
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
 * toggles the input focus
 */
function toggleInputFocus() {
    if (!document.getElementById('dropdown-assign').classList.contains('d-none')) {
        document.getElementById('assigned-to').focus();
    }
}

/**
 * toggles the category dropdown
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
 * prevents triggering of the HTML event
 * @param {*} event - the elements HTML event
 */
function preventDefault(event) {
    event.preventDefault();
}

/**
 * shows the selected dropdown option in the input field
 * @param {string} category - value of the selected dropdown option
 */
function displayCategory(category) {
    document.getElementById('category').value = category;
    closeDropdown();
}

/**
 * closes all dropdown menus
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
 * prevents propagation of the HTML event
 * @param {*} event -  the elements HTML event
 */
function stopPropagation(event) {
    event.stopPropagation();
}

/**
 * renders the dropdown options of the assigned-to dropdown
 * @param {string} array - array which contains the contacts to be rendered
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

function checkForScrollableContainer() {
    if (contacts.length < 5) {
        dropDown.style.width = "440px";
        let selectOptionsArray = Array.from(document.getElementsByClassName('container-custom-select-option'));
        selectOptionsArray.forEach(element => {
            element.classList.remove('select-option-with-scrollbar');
        });
    }
}

/**
 * renders all contacts as options into the specified dropdown
 * @param {string} array - array which contains the contacts to be rendered
 * @param {string} dropDown - determines the dropdown menu
 */
function renderDefaultContacts(array, dropDown) {
    for (let i = 0; i < array.length; i++) {
        let contactName = array[i].name;
        let color = array[i].color;
        renderContactAsDefault(dropDown, contactName, color);
    }
}
 /**
  * checks for selected contacts in an array
  * @param {*} array - array which contains the contacts to be rendered
  * @param {*} dropDown - determines the dropdown menu
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
 * renders a single contact as selected dropdown option
 * @param {*} dropDown - determines the dropdown menu
 * @param {*} contactName - name of the selected contact
 * @param {*} color - color of the selected contact
 */
function renderContactAsSelected(dropDown, contactName, color) {
    renderContactAsDefault(dropDown, contactName, color);
    let contactDiv = document.getElementById(`container-${contactName}`);
    let icon = document.getElementById(`icon-${contactName}`);
    toggleSelection(true, contactDiv, icon);
}

/**
 * renders a single contact as default dropdown option
 * @param {*} dropDown - determines the dropdown menu
 * @param {*} contactName - name of the contact
 * @param {*} color - color of the contact
 */
function renderContactAsDefault(dropDown, contactName, color) {
    dropDown.innerHTML += returnAssignedContactHTML(contactName, color);
    document.getElementById(`${contactName}`).innerText = contactName;
    document.getElementById(`initials-${contactName}`).innerText = getInitials(contactName);
    document.getElementById(`initials-${contactName}`).classList.add(`${color}`);
}

/**
 * checks if the contact exists in an array
 * @param {*} contactName - name of the contact
 * @returns - true if contact exists in array, otherwise false
 */
function isInSelectedContacts(contactName) {
    let arr = [];
    selectedContacts.forEach(contact => arr.push(contact.name));
    return arr.includes(contactName);
}

/**
 * returns initials of a contact name
 * @param {*} contactName - name of the contact 
 * @returns initials of the contact
 */
function getInitials(contactName) {
    let names = contactName.split(' ');
    let initials = "";
    for (let i = 0; i < names.length; i++) {
        initials += names[i].substring(0, 1).toUpperCase();
    }
    return initials;
}

/**
 * selects the clicked dropdown option
 * @param {*} name - name of the contact
 * @param {*} color - color of the contact
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
 * toggles selection of dropdown option onclick
 * @param {*} boolean - determines whether option is selected or deselected
 * @param {*} contactDiv - reference of the dropdown option
 * @param {*} icon - icon of the dropdown menu
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
 * filters contacts
 */
function filterContacts() {
    let searchValue = document.getElementById('assigned-to').value.toLowerCase();
    let filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(searchValue));
    renderAssignOptions(filteredContacts);
}

/**
 * displays selected contacts in separate container below dropwdown
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
}

/**
 * adds to or removes items from array
 * @param {*} boolean - determines whether item should be added or removed
 * @param {*} contactName - name of the contact
 * @param {*} contactColor - color of the contact
 */
function updateSelectedContacts(boolean, contactName, contactColor) {
    let obj = {name: contactName, color: contactColor};
    if (boolean) {
        selectedContacts.push(obj);
    } else {
        let index = selectedContacts.map(e => e.name).indexOf(obj.name);
        selectedContacts.splice(index, 1);
    }
}

/**
 * checks if dropdown option is selected
 * @param {*} contactDiv - referencte of the dropdown option
 * @returns - true if option is selected
 */
function isContactSelected(contactDiv) {
    return contactDiv.classList.contains('selected');
}

/**
 * clears all input fields
 */
function clearInputs() {
    removeError();
    subtasksCount = 0;
    document.getElementById('container-subtasks').innerHTML = "";
    document.getElementById('container-assigned-contacts').innerHTML = "";
    clearPrioButtons();
    let inputs = ["title", "description", "due-date", "subtasks"];
    for (let i = 0; i <inputs.length; i++) {
        document.getElementById(`${inputs[i]}`).value = "";
    }
    document.getElementById('category').value = "";
    selectedContacts = [];
    renderAssignOptions(contacts);
}

/**
 * switches button of the input
 * @param {*} boolean - determines which button should be shown
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
 * processes if subtask should be saved or aborted
 * @param {*} boolean - determines whether the task should be saved or aborted
 */
function processSubtask(boolean) {
    let input = document.getElementById('subtasks');
    let invalidRef = document.getElementById('invalid-subtask');
    invalidRef.classList.add('grey');
    if (boolean && (input.value != "")) {
        addSubtask();
        input.value = "";
    } else if (!boolean && (input.value != "")) {
        input.value = "";
    } else {
        invalidRef.classList.remove('grey');
    }
}

/**
 * shows edit options of subtask
 * @param {*} id - id of the subtask
 * @param {*} boolean - determines whether edit options should be shown or hidden
 */
function showEditOptions(id, boolean) {
    if (boolean) {
        document.getElementById(`icons-subtask-${id}`).classList.remove('d-none');
    } else {
        document.getElementById(`icons-subtask-${id}`).classList.add('d-none');
    }
}

/**
 * adds subtask to a container
 */
function addSubtask() {
    let input = document.getElementById('subtasks');
    subtasksCount++;
    document.getElementById('container-subtasks').innerHTML += returnSubtaskHTML(subtasksCount);
    document.getElementById(`subtask-${subtasksCount}`).innerText = input.value;
    subtasks.push(input.value);
}

/**
 * deletes subtask from container
 * @param {*} id - id of the subtask
 */
function deleteSubtask(id) {
    let subtask = document.getElementById(`subtask-${id}`);
    let subtaskContainer = document.getElementById(`container-subtask-${id}`);
    let index = subtasks.indexOf(subtask.value);
    subtasks.splice(index, 1);
    subtaskContainer.remove();
    subtasksCount--;
}

/**
 * opens edition menu for subtask
 * @param {*} id - id of the subtask
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

/**
 * checks for last child in subtask container
 * @param {*} child - reference of the subtask
 * @returns - true if it is the last child
 */
function isLastChild(child) {
    return (child === child.parentNode.children[child.parentNode.children.length-1]) 
}

/**
 * saves edited subtask
 * @param {*} id - id of the subtask
 */
function saveEditedSubtask(id) {
    let input = document.getElementById(`input-subtask-${id}`);
    let element = document.getElementById(`container-subtask-${id}`);
    document.getElementById(`details-subtask-${id}`).classList.remove('d-none');
    document.getElementById(`edit-subtask-${id}`).classList.add('d-none');
    document.getElementById(`subtask-${id}`).innerText = input.value;
    document.getElementById(`input-subtask-${id}`).value = "";
    toggleEditOptions(id);
    if (element.classList.contains('padding-top')) {
        element.classList.remove('padding-top');
    }
}

/**
 * creates task to be shown on the board or throws error if inputs are unvalid
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
        document.getElementById('invalid-date').classList.remove('grey');
    } else {
        throwError();
    }
}

/**
 * validates input fields
 * @returns - true if all inputs are filled with value
 */
function validateInputs() {
    let valid = true;
    let inputs = ["title", "due-date", "category"];
    unvalidInputs = [];
    for (let i = 0; i < inputs.length; i++) {
        let inputValue = document.getElementById(`${inputs[i]}`).value;
        if (inputValue == "") {
            valid = false;
            unvalidInputs.push(inputs[i]);
        }
    }
    return valid;
}

/**
 * tests date for valid format
 * @returns - true if date format is valid
 */
function testDate() {
    let value = document.getElementById('due-date').value;
    let date = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (date === null) {
        return false;
    }
    let day = +date[1], month = +date[2], year = +date[3];
    let dateObj = new Date(`${year}-${month}-${day}`);
    return dateObj.getFullYear() === year &&
           (dateObj.getMonth() + 1) === month &&
           dateObj.getDate() === day;
}

/**
 * shows error messages on unvalid inputs
 */
function throwError() {
    unvalidInputs.forEach(element => {
        document.getElementById(`required-${element}`).classList.remove('grey');
    });
}

/**
 * removes error message on valid inputs
 */
function removeError() {
    unvalidInputs.forEach(element => {
        document.getElementById(`required-${element}`).classList.add('grey');
    });
    document.getElementById('invalid-date').classList.add('grey');
    document.getElementById('invalid-subtask').classList.add('grey');
}

/**
 * saves task as object
 */
function saveTask() {
    // task.taskId = 3;
    task.taskType = document.getElementById('category').value;
    task.taskTitle = document.getElementById('title').value;
    task.taskDescription = document.getElementById('description').value;
    task.taskPriority = selectedPriority;
    // task.taskDate = document.getElementById('due-date').value;
    task.numberOfSubtasks = subtasksCount;
    task.numberOfCompletedSubtasks = 0;
    // task.taskSubtasks = subtasks;
    task.assignedContacts = selectedContacts;
    saveToFirebase("todos", task);
    task = {};
}

/**
 * hands over the object to be saved on firebase
 * @param {*} path - path of firebase save location
 * @param {*} task - task to be saved
 */
async function saveToFirebase(path, task) {
    if (userId == "guest") {
        path = "guest/tasks/" + path;
        await postData(path, task);
    } else {
        path = `${userId}/tasks/` + path;
        await postData(path, task)
    }
}

/**
 * posts data to firebase
 * @param {*} path - specifies save location
 * @param {*} data - data to be saved
 * @returns - saved object in case of success, else error 
 */
async function postData(path="", data={}) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return response;
}

/**
 * loads contacts from database
 * @param {*} path - path of the data to be loaded
 * @param {*} data - data to be loaded
 * @returns - retrieved data in case of success, else error
 */
async function getContacts(path="") {
    userId = localStorage.getItem('userId');
    if (userId !== "guest") {
        path = userId;
        let response = await fetch(BASE_URL + path + ".json");
        let responseJson = await response.json();
        return responseJson;
    } else {
        path = "guest";
        let response = await fetch(BASE_URL + path + ".json");
        let responseJson = await response.json();
        return responseJson;
    }
}

/**
 * saves relevant contact info in local contacts array
 * @param {object} contactsObj - JSON with contacts retrieved from database 
 */
function loadContactInfo(contactsObj) {
    let keys = Object.keys(contactsObj.allContacts);
    for (let index = 0; index < keys.length; index++) {
        let key = keys[index];
        let contactObj = {
            color: contactsObj.allContacts[key].color,
            name: contactsObj.allContacts[key].name
        };
        contacts.push(contactObj);
    }
}

/**
 * loads and displays the initials of the signed-in user
 * @returns - forwards to login page if no user is signed-in
 */
async function loadSmallInitials() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        return window.location.href = "index.html?";
    }
    let dataPath = userId === "guest" ? "guest.json" : `${userId}.json`;
    let response = await fetch(BASE_URL + dataPath);
    let userData = await response.json();
    document.getElementById('smallInitials').innerText = getInitials(userData.userDatas.user) || "G";
}