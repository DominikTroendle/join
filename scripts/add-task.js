// add assigned-to dropdown onclick

function prioButtonSelected(prio) {
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

// change arrow direction of assigned-to & category onclick