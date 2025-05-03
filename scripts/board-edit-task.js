let contactsBigTaskCardEdit = [];
let selectedContactsBigTaskCardEdit = [];
let unvalidInputsBigTaskCardEdit = [];
let subtasksBigTaskCardEdit = [];
let subtasksCountBigTaskCardEdit = subtasksBigTaskCardEdit.length;
let selectedPriorityBigTaskCardEdit = "medium";
const BASE_URL_ADDTASK2 = "https://join-user-default-rtdb.europe-west1.firebasedatabase.app/users/";

async function loadAllContacts() {
    contactsBigTaskCardEdit.length = 0;
    let contactsObj = await getContacts2();
    loadContactInfo2(contactsObj);
}

async function getContacts2(path="") {
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

async function loadContactInfo2(contactsObj) {
    let keys = Object.keys(contactsObj.allContacts);
    for (let index = 0; index < keys.length; index++) {
        let key = keys[index];
        let contactObj = {
            color: contactsObj.allContacts[key].color,
            name: contactsObj.allContacts[key].name
        };
        contactsBigTaskCardEdit.push(contactObj);
    }
    sortContactsAlphabetically2(contactsBigTaskCardEdit);
}

function sortContactsAlphabetically2(contactsArray) {
    if (userId != "guest") {
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

function toggleAssignOptionsForBigTaskCardEdit() {
    renderAssignOptionsForBigTaskCardEdit(contactsBigTaskCardEdit);
    let container = document.getElementById('big-task-card-edit__dropdown-assign');
    let containerDropdown = document.getElementById('big-task-card-edit__assigned-to-dropdown');
    let input = document.getElementById('big-task-card-edit__assigned-to-input');
    container.classList.toggle('d-none');
    containerDropdown.classList.toggle('box-shadow');
    renderAssignOptionsForBigTaskCardEdit(contactsBigTaskCardEdit);
    if (input.placeholder == "Select contacts to assign") {
        input.placeholder = "";
        changeDropdownArrowForBigTaskCardEdit(true, 'assigned');
    } else if (input.placeholder == "") {
        input.placeholder = "Select contacts to assign";
        changeDropdownArrowForBigTaskCardEdit(false, 'assigned');
    }
}

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

function renderDefaultContactsForBigTaskCardEdit(array, dropDown) {
    for (let i = 0; i < array.length; i++) {
        let contactName = array[i].name;
        let color = array[i].color;
        renderContactAsDefaultForBigTaskCardEdit(dropDown, contactName, color);
    }
}

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

function renderContactAsSelectedForBigTaskCard(dropDown, contactName, color) {
    renderContactAsDefaultForBigTaskCardEdit(dropDown, contactName, color);
    let contactDiv = document.getElementById(`edit-container-${contactName}`);
    let icon = document.getElementById(`edit-icon-${contactName}`);
    toggleSelection(true, contactDiv, icon);
}

function isInSelectedContactsForBigTaskCardEdit(contactName) {
    let arr = [];
    selectedContactsBigTaskCardEdit.forEach(contact => arr.push(contact.name));
    return arr.includes(contactName);
}

function renderContactAsDefaultForBigTaskCardEdit(dropDown, contactName, color) {
    dropDown.innerHTML += returnAssignedContactHTMLForBigTaskCardEdit(contactName, color);
    document.getElementById(`edit-${contactName}`).innerText = contactName;
    document.getElementById(`edit-initials-${contactName}`).innerText = getInitials(contactName);
    document.getElementById(`edit-initials-${contactName}`).classList.add(`${color}`);
}

function changeDropdownArrowForBigTaskCardEdit(boolean, dropdown) {
    let dropwdownArrow = document.getElementById(`big-task-card-edit__arrow-dropdown-${dropdown}`);
    if (boolean) {
        dropwdownArrow.src = "./assets/icons/arrow_drop_down_mirrored.svg";
    } else {
        dropwdownArrow.src = "./assets/icons/arrow_drop_down.svg";
    }
}

function putDateToInputForBigTaskCardEdit() {
    let datePicker = document.getElementById('big-task-card-edit__input-date-picker');
    let input = document.getElementById('big-task-card-edit__input-due-date');
    if (datePicker.value) {
        let [year, month, day] = datePicker.value.split('-');
        input.value = `${day}/${month}/${year}`;
    }
}

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

function testDateForBigTaskCardEdit() {
    let value = document.getElementById('big-task-card-edit__input-due-date').value;
    let date = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (date === null) {
        return false;
    }
    let day = +date[1], month = +date[2], year = +date[3];
    let dateObj = new Date(`${year}-${month}-${day}`);
    if (!correctDateFormat(dateObj, day, month, year)) {
        return false;
    } else if (isPastDate(dateObj)) {
        document.getElementById('invalid-date-big-task-card-edit__input-due-date').innerText = "Due date can`t be in the past!";
        return false;
    }
    return true;
}

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

function isEnterKeyForBigTaskCard(event) {
    subtasksInput = document.getElementById('big-task-card-edit__subtask-input')
    if (event.key === "Enter") {
        addSubtaskForBigTaskCardEdit();
        subtasksInput.value = "";
    }
}

function addSubtaskForBigTaskCardEdit() {
    let input = document.getElementById('big-task-card-edit__subtask-input');
    let containerSubtasks = document.getElementById('big-task-card-edit__subtasks-box');
    let subtaskObj = {"checked" : "false"};
    if (input.value !== "") {
        document.getElementById('invalid-subtask-big-task-card-edit__subtask-input').classList.add('d-none');
        document.getElementById('big-task-card-edit__subtask-box').classList.remove('input-unvalid');
        // subtasksCountBigTaskCardEdit = subtasksBigTaskCardEdit === 0 ? 1 : subtasksBigTaskCardEdit.length + 1;
        determineSubtaskStyleForBigTaskCardEdit(containerSubtasks, subtasksCountBigTaskCardEdit);
        document.getElementById(`big-task-card-edit__subtask-${subtasksCountBigTaskCardEdit}`).innerText = input.value;
        subtaskObj.subtask = input.value;
        subtasksBigTaskCardEdit.push(subtaskObj);
        checkForScrollableContainerForBigTaskCardEdit(containerSubtasks);
    } else {
        throwSubtaskError();
    }
}

function saveEditedSubtaskForBigTaskCard(id) {
    let input = document.getElementById(`big-task-card-edit__input-subtask-${id}`);
    let element = document.getElementById(`big-task-card-edit__container-subtask-${id}`);
    document.getElementById(`big-task-card-edit__details-subtask-${id}`).classList.remove('d-none');
    document.getElementById(`big-task-card-edit__edit-subtask-${id}`).classList.add('d-none');
    document.getElementById(`big-task-card-edit__subtask-${id}`).innerText = input.value;
    subtasksBigTaskCardEdit[`${id-1}`].subtask = input.value;
    input.value = "";
    if (window.innerWidth > 1040) {showEditOptionsForBigTaskCardEdit(id, false);}
    if (element.classList.contains('padding-top')) {
        element.classList.remove('padding-top');
    }
}

function editSubtaskForBigTaskCard(id) {
    let child = document.getElementById(`big-task-card-edit__container-subtask-${id}`);
    document.getElementById(`big-task-card-edit__input-subtask-${id}`).value = document.getElementById(`big-task-card-edit__subtask-${id}`).innerText;
    document.getElementById(`big-task-card-edit__details-subtask-${id}`).classList.add('d-none');
    document.getElementById(`big-task-card-edit__edit-subtask-${id}`).classList.remove('d-none');
    if (isLastChild(child)) {
        child.classList.add('padding-top');
    }
}

function deleteSubtaskForBigTaskCardEdit(id) {
    let subtaskContainer = document.getElementById(`big-task-card-edit__container-subtask-${id}`);
    let containerSubtasks = document.getElementById('big-task-card-edit__subtasks-box');
    subtasksBigTaskCardEdit.splice((id-1), 1);
    subtaskContainer.remove();
    subtasksCountBigTaskCardEdit--;
    checkForScrollableContainerForBigTaskCardEdit(containerSubtasks);    
}

function showEditOptionsForBigTaskCardEdit(id, boolean) {
    if (boolean) {
        document.getElementById(`big-task-card-edit__icons-subtask-${id}`).classList.remove('d-none');
    } else {
        document.getElementById(`big-task-card-edit__icons-subtask-${id}`).classList.add('d-none');
    }
}

function determineSubtaskStyleForBigTaskCardEdit(containerSubtasks, subtasksCount) {
    if (window.innerWidth <= 1040) {
        containerSubtasks.innerHTML += returnSubtaskHTMLForBigTaskCardEdit(subtasksCount);
    } else {
        containerSubtasks.innerHTML += returnSubtaskMobileHTMLForBigTaskCardEdit(subtasksCount);
    }
}

function checkForScrollableContainerForBigTaskCardEdit(container) {
    if (((contacts.length < 6) && (container.id == "big-task-card-edit__dropdown-assign")) || ((subtasksCount <= 2) && (container.id == "big-task-card-edit__subtasks-box"))) {
        containerScrollableForBigTaskCardEdit(container);
    } else if ((subtasksCount >= 2) && (container.id == "big-task-card-edit__subtasks-box")) {
        containerNotScrollableForBigTaskCardEdit(container);
    }
}

function containerNotScrollableForBigTaskCardEdit(container) {
    if (container.id = "big-task-card-edit__subtasks-box") {
        let subtaskContainers = Array.from(document.getElementsByClassName('container-subtask'));
        subtaskContainers.forEach(element => {
            element.classList.add('subtask-scroll-margin');
        })
    }
}

function containerScrollableForBigTaskCardEdit(container) {
    if (container.id == "big-task-card-edit__dropdown-assign") {
        // container.style.width = "440px";
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

function selectPrioButtonForBigTaskCardEdit(prio) {
    if (prio !== "") {
        let priority = prio === "big-task-card-edit__urgent-button" ? "urgent" : prio === "big-task-card-edit__medium-button" ? "medium" : "low";
        let button = document.getElementById(`${prio}`);
        let svg = document.getElementById(`svg-${prio}`);
        if (button.classList.contains(priority)) {
            toggleButtonClasses(true, button, svg, priority);
            selectedPriorityBigTaskCardEdit = "";
        } else {
            clearPrioButtonsForBigTaskCardEdit();
            toggleButtonClasses(false, button, svg, priority);
            selectedPriorityBigTaskCardEdit = priority;
        }
    }
}

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

function displaySelectedContactsForBigTaskCard() {
    let container = document.getElementById('big-task-card-edit__assigned-contacts-box');
    container.innerHTML = "";
    for (let i = 0; i < selectedContactsBigTaskCardEdit.length; i++) {
        let name = selectedContactsBigTaskCardEdit[i].name;
        let color = selectedContactsBigTaskCardEdit[i].color;
        let initials = getInitials(name);
        container.innerHTML += returnAssignedContactPreviewHTML(initials, color);
    }
    if (selectedContactsBigTaskCardEdit.length > 8) {
        document.getElementById('big-task-card-edit__assigned-contacts-box').classList.add('padding-bottom-8');
    } else {
        document.getElementById('big-task-card-edit__assigned-contacts-box').classList.remove('padding-bottom-8');
    }
}

function toggleInputFocusForBigTaskCardEdit() {
    if (!document.getElementById('big-task-card-edit__dropdown-assign').classList.contains('d-none')) {
        document.getElementById('big-task-card-edit__assigned-to-input').focus();
    }
}

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

function updateSelectedContactsForBigTaskCard(boolean, contactName, contactColor) {
    let obj = {name: contactName, color: contactColor};
    if (boolean) {
        selectedContactsBigTaskCardEdit.push(obj);
        sortContactsAlphabetically2(selectedContactsBigTaskCardEdit);
    } else {
        let index = selectedContactsBigTaskCardEdit.map(e => e.name).indexOf(obj.name);
        selectedContactsBigTaskCardEdit.splice(index, 1);
    }
}

function changeInputButtonForBigTaskCardEdit(boolean) {
    if (boolean) {
        document.getElementById('big-task-card-edit__subtask-button-add').classList.add('d-none');
        document.getElementById('big-task-card-edit__subtask-buttons-box').classList.remove('d-none');
    } else {
        document.getElementById('big-task-card-edit__subtask-button-add').classList.remove('d-none');
        document.getElementById('big-task-card-edit__subtask-buttons-box').classList.add('d-none');
    }
}

function filterContactsForBigTaskCardEdit() {
    let searchValue = document.getElementById('big-task-card-edit__assigned-to-input').value.toLowerCase();
    let filteredContacts = contactsBigTaskCardEdit.filter(contact => contact.name.toLowerCase().includes(searchValue));
    renderAssignOptionsForBigTaskCardEdit(filteredContacts);
}

