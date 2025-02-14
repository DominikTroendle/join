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

let subtasks = 0;

let task = {};

function init() {
    renderAssignOptions(contacts);
}

function selectPrioButton(prio) {  
    let button = document.getElementById(`${prio}`);
    let svg = document.getElementById(`svg-${prio}`);
    if (button.classList.contains(`${prio}`)) {
        button.classList.remove(`${prio}`);
        button.classList.remove('white');
        button.classList.add('button-prio-hover');
        svg.classList.remove('filter-white');
    } else {
        clearPrioButtons();
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
    // saveTask();
    document.getElementById('overlay-task-added').classList.remove('d-none');
    setTimeout(() => {
        window.location.href = 'board.html';
    }, "900");
}

function saveTask() {
    let title = document.getElementById('').value;
    let description = document.getElementById('').value;
    let dueDate = document.getElementById('').value;
    let priority = "high";
    let category = document.getElementById('').value;
    let subtasks = [];
    task = {
        id: 1,
        taskDescription: "",
        taskTitle: "",
        taskType: "User Story",
        taskDate: "",
        taskPrio: "",
        taskSubtasks:
        {
             subtask1: "",
             sibtask2: ""
        },
        taskAssigned: ["David Müller", "Daniel Meier"]
    };
    saveToFirebase();
    task = {};
}