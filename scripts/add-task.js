// add assigned-to dropdown onclick

// change color of button onclick
function prioButtonSelected(prio) {
    let button = document.getElementById(`${prio}`);
    button.classList.toggle(`${prio}`);
}

// change arrow direction of assigned-to & category onclick