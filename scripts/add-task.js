const BASE_URL_ADDTASK = "https://join-user-default-rtdb.europe-west1.firebasedatabase.app/users/";

let userId;

let contacts = [];

let selectedContacts = [];

let selectedPriority = "medium";

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

async function initialize() {
    let contactsObj = await getContacts();
    loadContactInfo(contactsObj);
    // renderAssignOptions(contacts);
    loadSmallInitials();
}

initialize();

function selectPrioButton(prio) {  
    let button = document.getElementById(`${prio}`);
    let svg = document.getElementById(`svg-${prio}`);
    if (button.classList.contains(`${prio}`)) {
        toggleButtonClasses(true, button, svg, prio);
        selectedPriority = "medium";
    } else {
        clearPrioButtons();
        toggleButtonClasses(false, button, svg, prio);
        selectedPriority = prio;
    }
}

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

function selectDefaultPrioButton() {
    let button = document.getElementById('medium');
    let svg = document.getElementById('svg-medium');
    button.classList.add('medium');
    button.classList.add('white');
    button.classList.remove('button-prio-hover');
    svg.classList.add('filter-white');
    // selectedPriority = "medium";
}

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

function changeDropdownArrow(boolean, dropdown) {
    let dropwdownArrow = document.getElementById(`arrow-dropdown-${dropdown}`);
    if (boolean) {
        dropwdownArrow.src = "./assets/icons/arrow_drop_down_mirrored.svg";
    } else {
        dropwdownArrow.src = "./assets/icons/arrow_drop_down.svg";
    }
}

function toggleInputFocus() {
    if (!document.getElementById('dropdown-assign').classList.contains('d-none')) {
        document.getElementById('assigned-to').focus();
    }
}

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
    document.getElementById('dropdown-category').classList.remove('box-shadow');
    document.getElementById('container-dropdown').classList.remove('box-shadow');
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
        checkForSelectedContacts(array, dropDown);
    }
    checkForScrollableContainer(dropDown);
}

function checkForScrollableContainer(container) {
    if (((contacts.length < 6) && (container.id == "dropdown-assign")) || ((subtasksCount <= 2) && (container.id == "container-subtasks"))) {
        containerScrollable(container);
    } else if ((subtasksCount >= 2) && (container.id == "container-subtasks")) {
        containerNotScrollable(container);
    }
}

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

function containerNotScrollable(container) {
    if (container.id = "container-subtasks") {
        let subtaskContainers = Array.from(document.getElementsByClassName('container-subtask'));
        subtaskContainers.forEach(element => {
            element.classList.add('subtask-scroll-margin');
        })
    }
}

function renderDefaultContacts(array, dropDown) {
    for (let i = 0; i < array.length; i++) {
        let contactName = array[i].name;
        let color = array[i].color;
        renderContactAsDefault(dropDown, contactName, color);
    }
}

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
    let name = contactName.trim().split(' ').filter(n => n);
    let initials = '';
    for (let i = 0; i < Math.min(name.length, 2); i++) {
        initials += name[i].charAt(0).toUpperCase();
    }
    return initials
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
    if (selectedContacts.length > 8) {
        document.getElementById('container-assigned-contacts').classList.add('padding-bottom-8');
    } else {
        document.getElementById('container-assigned-contacts').classList.remove('padding-bottom-8');
    }
}

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

function isContactSelected(contactDiv) {
    return contactDiv.classList.contains('selected');
}

function clearInputs() {
    removeError();
    subtasksCount = 0;
    document.getElementById('container-subtasks').innerHTML = "";
    document.getElementById('container-assigned-contacts').innerHTML = "";
    clearPrioButtons();
    selectDefaultPrioButton();
    let inputs = ["title", "description", "due-date", "subtasks"];
    for (let i = 0; i <inputs.length; i++) {
        document.getElementById(`${inputs[i]}`).value = "";
    }
    document.getElementById('category').value = "";
    selectedContacts = [];
    renderAssignOptions(contacts);
    document.getElementById('max-char-title').classList.add('d-none');
    document.getElementById('invalid-date').classList.remove('d-none');
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
    let input = document.getElementById('subtasks');
    let invalidRef = document.getElementById('invalid-subtask');
    invalidRef.classList.add('grey');
    document.getElementById('max-char-subtasks').classList.add('d-none')
    if (boolean && (input.value != "")) {
        addSubtask();
        input.value = "";
    } else if (!boolean && (input.value != "")) {
        input.value = "";
    } else {
        invalidRef.classList.remove('grey');
    }
}

function showEditOptions(id, boolean) {
    if (boolean) {
        document.getElementById(`icons-subtask-${id}`).classList.remove('d-none');
    } else {
        document.getElementById(`icons-subtask-${id}`).classList.add('d-none');
    }
}

const subtasksInput = document.getElementById('subtasks');
subtasksInput.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        addSubtask();
        subtasksInput.value = "";
    }
})

function addSubtask() {
    let input = document.getElementById('subtasks');
    let containerSubtasks = document.getElementById('container-subtasks');
    let subtaskObj = {"checked" : "false"};
    if (input.value !== "") {
        document.getElementById('invalid-subtask').classList.add('grey');
        document.getElementById('container-input-subtask').classList.remove('input-unvalid');
        subtasksCount++;
        containerSubtasks.innerHTML += returnSubtaskHTML(subtasksCount);
        document.getElementById(`subtask-${subtasksCount}`).innerText = input.value;
        subtaskObj.subtask = input.value;
        subtasks.push(subtaskObj);
        checkForScrollableContainer(containerSubtasks);
    } else {
        throwSubtaskError();
    }
    console.log(subtasks);
}

function deleteSubtask(id) {
    let subtaskContainer = document.getElementById(`container-subtask-${id}`);
    let containerSubtasks = document.getElementById('container-subtasks');
    subtasks.splice((id-1), 1);
    subtaskContainer.remove();
    subtasksCount--;
    checkForScrollableContainer(containerSubtasks);    
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
    subtasks[`${id-1}`].subtask = input.value;
    input.value = "";
    showEditOptions(id, false)
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
        document.getElementById(`required-${element}`).classList.remove('grey');
        if (element == "category" || element == "due-date") {
            document.getElementById(`container-input-${element}`).classList.add('input-unvalid')
        } else {
            document.getElementById(`${element}`).classList.add('input-unvalid');
        };
    });
}

function throwSubtaskError() {
    document.getElementById('invalid-subtask').classList.remove('grey');
    document.getElementById('container-input-subtask').classList.add('input-unvalid');
}

function removeError() {
    unvalidInputs.forEach(element => {
        document.getElementById(`required-${element}`).classList.add('grey');
        if (element == "category" || element == "due-date") {
            document.getElementById(`container-input-${element}`).classList.remove('input-unvalid')
        } else {
            document.getElementById(`${element}`).classList.remove('input-unvalid');
        };
    });
    document.getElementById('invalid-date').classList.add('grey');
    document.getElementById('invalid-subtask').classList.add('grey');
}

function saveTask() {
    task.category = "toDos";
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
    let user = contactsArray.splice(0, 1);
    contactsArray.sort((a, b) => a.name.localeCompare(b.name));
    if (contactsArray == contacts) {
        contacts = user.concat(contactsArray);
    } else if (contactsArray == selectedContacts) {
        selectedContacts = user.concat(contactsArray);
    }
}

function checkInputLength(inputField) {
    let input = document.getElementById(`${inputField}`);
    let errorElement = document.getElementById(`max-char-${inputField}`);
    let inputSettings = {"title": {invalidElement: null}, "subtasks": {invalidElement: "invalid-subtask"}};
    let maxLength = 50;
    let invalidElement = inputSettings[inputField].invalidElement;
    if (input.value.length == maxLength) {
        errorElement.classList.remove('grey', 'd-none');
        if (invalidElement) document.getElementById(invalidElement).classList.add('d-none');
    } else {
        errorElement.classList.add('grey', 'd-none');
        if (invalidElement) document.getElementById(invalidElement).classList.remove('d-none');
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