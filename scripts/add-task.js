let contacts = [
    {
        name: "David Müller",
        color: "bg-orange"
    },
    {
        name: "Daniel Meier",
        color: "bg-orange"
    },
    {
        name: "Richard Renner",
        color: "bg-pink"
    },
    {
        name: "Paul Poost",
        color: "bg-bluepurple"
    },
    {
        name: "Franz Ferdinand",
        color: "bg-turquoise"
    },
    {
        name: "Thomas Deller",
        color: "bg-rose"
    }
];

let selectedContacts = [];

let selectedPriority = "";

let subtasks = 0;

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
    {
         subtask1: "",
         subtask2: ""
    },
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


function init() {
    renderAssignOptions(contacts);
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
    let input = document.getElementById('assigned-to');
    container.classList.toggle('d-none');
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

function displayCategory(category) {
    document.getElementById('category').value = category;
    closeDropdown();
}

function closeDropdown() {
    document.getElementById('dropdown-assign').classList.add('d-none');
    document.getElementById('dropdown-category').classList.add('d-none');
    document.getElementById('assigned-to').value = "";
    document.getElementById('assigned-to').placeholder = "Select contacts to assign";
    changeDropdownArrow(false, 'assigned');
    changeDropdownArrow(false, 'category');
}

function stopPropagation(event) {
    event.stopPropagation();
}

function renderAssignOptions(array) {
    let dropDown = document.getElementById('dropdown-assign');
    dropDown.innerHTML = "";
    if (selectedContacts.length == 0) {
       renderDefaultContacts(array, dropDown);
    } else {
        renderSelectedContacts(array, dropDown);
    }
}

function renderDefaultContacts(array, dropDown) {
    for (let i = 0; i < array.length; i++) {
        let contactName = array[i].name;
        let color = array[i].color;
        renderContactAsDefault(dropDown, contactName, color);
    }
}

function renderSelectedContacts(array, dropDown) {
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

function renderContactAsSelected(dropDown, contactName, color) {
    renderContactAsDefault(dropDown, contactName, color);
    let contactDiv = document.getElementById(`container-${contactName}`);
    let icon = document.getElementById(`icon-${contactName}`);
    toggleSelection(true, contactDiv, icon);
}

function renderContactAsDefault(dropDown, contactName, color) {
    dropDown.innerHTML += returnAssignedContactHTML(contactName, color);
    document.getElementById(`${contactName}`).innerText = contactName;
    document.getElementById(`initials-${contactName}`).innerText = getInitials(contactName);
    document.getElementById(`initials-${contactName}`).classList.add(`${color}`);
}

function isInSelectedContacts(contactName) {
    let arr = [];
    selectedContacts.forEach(contact => arr.push(contact.name));
    return arr.includes(contactName);
}

function getInitials(contactName) {
    let names = contactName.split(' ');
    let initials = "";
    for (let i = 0; i < names.length; i++) {
        initials += names[i].substring(0, 1).toUpperCase();
    }
    return initials;
}

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

function toggleSelection(boolean, contactDiv, icon) {
    if (boolean) {
        contactDiv.classList.add('bg-blue');
        contactDiv.classList.add('selected-hover');
        contactDiv.classList.add('white');
        icon.src = "./assets/icons/checked.svg";
        icon.classList.add('filter-white');
    } else {
        contactDiv.classList.remove('bg-blue');
        contactDiv.classList.remove('selected-hover');
        contactDiv.classList.remove('white');
        icon.src = "./assets/icons/unchecked.svg";
        icon.classList.remove('filter-white');
    }
}

function filterContacts() {
    let searchValue = document.getElementById('assigned-to').value.toLowerCase();
    let filteredContacts = contacts.filter(contact => contact.name.toLowerCase().includes(searchValue));
    renderAssignOptions(filteredContacts);
}

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

function updateSelectedContacts(boolean, contactName, contactColor) {
    let obj = {name: contactName, color: contactColor};
    if (boolean) {
        selectedContacts.push(obj);
    } else {
        let index = selectedContacts.map(e => e.name).indexOf(obj.name);
        selectedContacts.splice(index, 1);
    }
}

function isContactSelected(contactDiv) {
    return contactDiv.classList.contains('bg-blue');
}

function clearInputs() {
    removeError();
    subtasks = 0;
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

function changeInputButton(boolean) {
    if (boolean) {
        document.getElementById('button-add').classList.add('d-none');
        document.getElementById('container-buttons').classList.remove('d-none');
    } else {
        document.getElementById('button-add').classList.remove('d-none');
        document.getElementById('container-buttons').classList.add('d-none');
    }
}

function processSubtask(boolean) {
    if (boolean) {
        addSubtask();
        document.getElementById('subtasks').value = "";
    } else {
        document.getElementById('subtasks').value = "";
    }
}

function showEditOptions(id, boolean) {
    if (boolean) {
        document.getElementById(`icons-subtask-${id}`).classList.remove('d-none');
    } else {
        document.getElementById(`icons-subtask-${id}`).classList.add('d-none');
    }
}

function addSubtask() {
    let input = document.getElementById('subtasks');
    subtasks++;
    document.getElementById('container-subtasks').innerHTML += returnSubtaskHTML(subtasks);
    document.getElementById(`subtask-${subtasks}`).innerText = input.value;
}

function deleteSubtask(id) {
    document.getElementById(`container-subtask-${id}`).remove();
    subtasks--;
}

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
    document.getElementById(`input-subtask-${id}`).value = "";
    toggleEditOptions(id);
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
        document.getElementById('invalid-date').classList.remove('grey');
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
        if (inputValue == "") {
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
    return dateObj.getFullYear() === year &&
           (dateObj.getMonth() + 1) === month &&
           dateObj.getDate() === day;
}

function throwError() {
    unvalidInputs.forEach(element => {
        document.getElementById(`required-${element}`).classList.remove('grey');
    });
}

function removeError() {
    unvalidInputs.forEach(element => {
        document.getElementById(`required-${element}`).classList.add('grey');
    });
    document.getElementById('invalid-date').classList.add('grey');
}

function saveTask() {
    task.taskId = 3;
    task.taskType = document.getElementById('category').value;
    task.taskTitle = document.getElementById('title').value;
    task.taskDescription = document.getElementById('description').value;
    task.taskPriority = selectedPriority;
    toDoArray.push(task);
    console.log(toDoArray);
    // task.taskDate dueDate = document.getElementById('due-date').value;
    // task.taskSubtasks = [];
    // saveToFirebase();
    task = {};
}