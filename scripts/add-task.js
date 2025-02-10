let contacts = [
    {name: "David Müller"},
    {name: "Daniel Meier"},
    {name: "Richard Renner"},
    {name: "Paul Poost"},
    {name: "Franz Ferdinand"},
    {name: "Thomas Deller"}
];

let colors = ["bg-orange", "bg-pink", "bg-bluepurple", "bg-purple", "bg-skyblue", "bg-turquoise", "bg-redorange", "bg-peach", "bg-rose", "bg-sun", "bg-darkblue", "bg-green", "bg-yellow", "bg-red", "bg-darkyellow"];

let selectedContacts = [];

let subtasks = 0;

function init() {
    renderAssignOptions();
}

function selectPrioButton(prio) {
    clearPrioButtons();
    let button = document.getElementById(`${prio}`);
    let svg = document.getElementById(`svg-${prio}`);
    button.classList.add(`${prio}`);
    button.classList.add('white');
    svg.classList.add('filter-white');
}

function clearPrioButtons() {
    let prios = ["urgent", "medium", "low"];
    for (let i = 0; i < prios.length; i++) {
        let button = document.getElementById(`${prios[i]}`);
        let svg = document.getElementById(`svg-${prios[i]}`);
        button.classList.remove(`${prios[i]}`);
        button.classList.remove('white');
        svg.classList.remove('filter-white');
    }
}

function toggleAssignOptions() {
    let container = document.getElementById('dropdown-assign');
    container.classList.toggle('d-none');
}

function toggleCategoryOptions() {
    let container = document.getElementById('dropdown-category');
    container.classList.toggle('d-none');
}

function displayCategory(category) {
    document.getElementById('category').value = category;
    closeDropdown();
}

function closeDropdown() {
    let dropdownAssign = document.getElementById('dropdown-assign');
    let dropdownCategory = document.getElementById('dropdown-category');
    dropdownAssign.classList.add('d-none');
    dropdownCategory.classList.add('d-none');
}

function stopPropagation(event) {
    event.stopPropagation();
}

function renderAssignOptions() {
    let dropDown = document.getElementById('dropdown-assign');
    dropDown.innerHTML = "";
    for (let i = 0; i < contacts.length; i++) {
        let name = contacts[i].name;
        let color = getBgColor(name);
        dropDown.innerHTML += returnAssignedContactHTML(name);
        document.getElementById(`${name}`).innerText = name;
        document.getElementById(`initials-${name}`).innerText = getInitials(name);
        document.getElementById(`initials-${name}`).classList.add(`${color}`);
    }
}

function getInitials(name) {
    let names = name.split(' ');
    let initials = "";
    for (let i = 0; i < names.length; i++) {
        initials += names[i].substring(0, 1).toUpperCase();
    }
    return initials;
}

function getBgColor() {
    let randomNumber= Math.floor(Math.random() * colors.length);
    let randomColor = colors[randomNumber];
    return randomColor;
}

function selectContact(name) {
    let contactDiv = document.getElementById(`container-${name}`);
    let icon = document.getElementById(`icon-${name}`);
    if (!isContactSelected(contactDiv)) {
        contactDiv.classList.add('bg-blue');
        contactDiv.classList.add('selected-hover');
        contactDiv.classList.add('white');
        icon.src = "./assets/icons/checked.svg";
        icon.classList.add('filter-white');
        updateSelectedContacts(true, name);
    } else {
        contactDiv.classList.remove('bg-blue');
        contactDiv.classList.remove('selected-hover');
        contactDiv.classList.remove('white');
        icon.src = "./assets/icons/unchecked.svg";
        icon.classList.remove('filter-white');
        updateSelectedContacts(false, name);
    }
    changeAssignedToValue();
    displaySelectedContacts();
}

function displaySelectedContacts() {
    let container = document.getElementById('container-assigned-contacts');
    container.innerHTML = "";
    for (let i = 0; i < selectedContacts.length; i++) {
        let name = selectedContacts[i];
        let initials = getInitials(name);
        container.innerHTML += returnAssignedContactsHTML(initials);
    }
}

function updateSelectedContacts(boolean, name) {
    if (boolean) {
        selectedContacts.push(name);
    } else {
        let index = selectedContacts.indexOf(name);
        selectedContacts.splice(index, 1);
    }
}

function isContactSelected(contactDiv) {
    return contactDiv.classList.contains('bg-blue');
}

function changeAssignedToValue() {
    document.getElementById('assigned-to').value = selectedContacts.join(', ');
}

function clearInputs() {
    subtasks = 0;
    document.getElementById('container-subtasks').innerHTML = "";
    document.getElementById('container-assigned-contacts').innerHTML = "";
    clearPrioButtons();
    clearDropDowns();
    let inputs = ["title", "description", "due-date", "subtasks"];
    for (let i = 0; i <inputs.length; i++) {
        document.getElementById(`${inputs[i]}`).value = "";
    }
}

function clearDropDowns() {
    for (let i = 0; i < selectedContacts.length; i++) {
        document.getElementById(`container-${selectedContacts[i]}`).classList.remove('bg-blue');
        document.getElementById(`container-${selectedContacts[i]}`).classList.remove('white');
        document.getElementById(`icon-${selectedContacts[i]}`).classList.remove('filter-white');
        document.getElementById(`icon-${selectedContacts[i]}`).src = "./assets/icons/unchecked.svg";
    }
    selectedContacts = [];
    changeAssignedToValue();
    document.getElementById('category').value = "";
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

function saveTask() {
    let title = document.getElementById('').value;
    let description = document.getElementById('').value;
    let dueDate = document.getElementById('').value;
    let priority = "high";
    let categrory = document.getElementById('').value;
    let subtasks = [];
    let task = {

    };
}

// change arrow direction of assigned-to & category onclick