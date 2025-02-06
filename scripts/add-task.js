let contacts = [
    {name: "David Müller"},
    {name: "Daniel Meier"},
    {name: "Richard Renner"},
    {name: "Paul Poost"},
    {name: "Franz Ferdinand"},
    {name: "Thomas Deller"}

];

let selectedContacts = [];

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
        dropDown.innerHTML += returnAssignedContactHTML(name);
        let nameSpan = document.getElementById(`${name}`);
        nameSpan.innerText = name;
    }
}

function selectContact(name) {
    let contactDiv = document.getElementById(`container-${name}`);
    let icon = document.getElementById(`icon-${name}`);
    if (!isContactSelected(contactDiv)) {
        contactDiv.classList.add('bg-blue');
        contactDiv.classList.add('white');
        icon.src = "./assets/icons/checked.svg";
        icon.classList.add('filter-white');
        updateSelectedContacts(true, name);
    } else {
        contactDiv.classList.remove('bg-blue');
        contactDiv.classList.remove('white');
        icon.src = "./assets/icons/unchecked.svg";
        icon.classList.remove('filter-white');
        updateSelectedContacts(false, name);
    }
    changeAssignedToValue();
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

function saveTask() {

}

// change arrow direction of assigned-to & category onclick