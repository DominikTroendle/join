let contacts = [
    {name: "David Müller"},
    {name: "Daniel Meier"},
    {name: "Richard Renner"},
    {name: "Paul Poost"},
    {name: "Franz Ferdinand"},
    {name: "Thomas Deller"}

]

function init() {
    renderSelectOptions();
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

function toggleSelectOptions() {
    let container = document.getElementById('container-custom-select-options');
    container.classList.toggle('d-none');
}

function closeSelectOptions() {
    let container = document.getElementById('container-custom-select-options');
    container.classList.add('d-none');
}

function stopPropagation(event) {
    event.stopPropagation();
}

function renderSelectOptions() {
    let dropDown = document.getElementById('container-custom-select-options');
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
    } else {
        contactDiv.classList.remove('bg-blue');
        contactDiv.classList.remove('white');
        icon.src = "./assets/icons/unchecked.svg";
        icon.classList.remove('filter-white');
    }
}

function isContactSelected(contactDiv) {
    return contactDiv.classList.contains('bg-blue');
}

// change arrow direction of assigned-to & category onclick