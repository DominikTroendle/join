let contacts = [
    {name: "David Müller"},
    {name: "Daniel Meier"},
    {name: "Richard Renner"},
    {name: "Paul Poost"},
    {name: "Franz Ferdinand"},
    {name: "Thomas Deller"}

]

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

function selectContact() {
    let 
}

// change arrow direction of assigned-to & category onclick