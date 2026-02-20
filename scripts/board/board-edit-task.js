let contactsBigTaskCardEdit = [];
let selectedContactsBigTaskCardEdit = [];
let unvalidInputsBigTaskCardEdit = [];
let subtasksBigTaskCardEdit = [];
let subtasksCountBigTaskCardEdit = 0;
let selectedPriorityBigTaskCardEdit = "medium";
const BASE_URL_ADDTASK2 = "https://join-demo-87ca4-default-rtdb.europe-west1.firebasedatabase.app/users/";

/**
 * Selects and toggles the priority button for a big task card edit.
 * 
 * This function determines the priority type based on the button's id and
 * then calls the `togglePriorityForBigTaskCardEdit` function to toggle 
 * the button's class and update the selected priority.
 *
 * @param {string} prio - The id of the priority button (e.g., 'big-task-card-edit__urgent-button').
 * 
 * @example
 * selectPrioButtonForBigTaskCardEdit('big-task-card-edit__urgent-button');
 * This will set the priority to "urgent" and toggle the respective button.
 */
function selectPrioButtonForBigTaskCardEdit(prio) {
    if (prio !== "") {
        let priority = prio === "big-task-card-edit__urgent-button" ? "urgent" : prio === "big-task-card-edit__medium-button" ? "medium" : "low";
        let button = document.getElementById(`${prio}`);
        let svg = document.getElementById(`svg-${prio}`);
        togglePriorityForBigTaskCardEdit(priority, button, svg);
    }
}

/**
 * Toggles the priority button for a big task card edit.
 * 
 * This function checks whether the provided button already contains the selected
 * priority class. If it does, it clears the priority selection. Otherwise, it
 * updates the button's class to reflect the selected priority and clears any 
 * previously selected priority buttons.
 * 
 * @param {string} priority - The priority level to toggle ("urgent", "medium", or "low").
 * @param {HTMLElement} button - The button element representing the priority.
 * @param {HTMLElement} svg - The SVG element inside the button to be updated based on priority.
 * 
 * @example
 * togglePriorityForBigTaskCardEdit("urgent", urgentButton, svgElement);
 * This will toggle the 'urgent' priority on the button and update the selected priority.
 */
function togglePriorityForBigTaskCardEdit(priority, button, svg) {
    if (button.classList.contains(priority)) {
        toggleButtonClasses(true, button, svg, priority);
        selectedPriorityBigTaskCardEdit = "";
    } else {
        clearPrioButtonsForBigTaskCardEdit();
        toggleButtonClasses(false, button, svg, priority);
        selectedPriorityBigTaskCardEdit = priority;
    }
}

/**
 * Clears the priority selection from all priority buttons in the big task card edit.
 * 
 * This function removes the priority-related classes from all priority buttons 
 * and resets the button styling to its default state. It ensures that no priority 
 * is selected by removing the "urgent", "medium", or "low" classes and restoring 
 * the default button appearance.
 * 
 * @example
 * clearPrioButtonsForBigTaskCardEdit();
 * This will clear all priority selections and reset the button styles.
 */
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

/**
 * Displays the selected contacts for the big task card edit.
 * 
 * This function clears the existing assigned contacts from the container, 
 * renders the selected contacts preview, and adds or removes padding 
 * based on the number of selected contacts.
 * 
 * @example
 * displaySelectedContactsForBigTaskCard();
 * This will update the UI with the selected contacts and apply appropriate padding.
 */
function displaySelectedContactsForBigTaskCard() {
    let container = document.getElementById('big-task-card-edit__assigned-contacts-box');
    container.innerHTML = "";
    renderSelectedContactsPreviewForBigTaskCardEdit(container);
    if (selectedContactsBigTaskCardEdit.length > 8) {
        document.getElementById('big-task-card-edit__assigned-contacts-box').classList.add('padding-bottom-8');
    } else {
        document.getElementById('big-task-card-edit__assigned-contacts-box').classList.remove('padding-bottom-8');
    }
}

/**
 * Toggles the focus on the "Assigned To" input field in the Big Task Card edit view.
 * 
 * This function checks if the dropdown for assigning contacts is visible. 
 * If it is, it sets focus on the input field for assigning contacts.
 * 
 * @example
 * toggleInputFocusForBigTaskCardEdit();
 * This will focus on the 'Assigned To' input if the dropdown is visible.
 */
function toggleInputFocusForBigTaskCardEdit() {
    if (!document.getElementById('big-task-card-edit__dropdown-assign').classList.contains('d-none')) {
        document.getElementById('big-task-card-edit__assigned-to-input').focus();
    }
}

/**
 * Disables the selection of past dates in a specific date picker input
 * by setting the minimum allowed date to today's date.
 *
 * @function deactivatePastDays
 * @param {string} id - The ID of the input element to modify.
 * @returns {void} This function does not return anything.
 *
 * @description
 * Calculates the current date in ISO format and sets it as the `min` attribute
 * on the input element with the given ID. This ensures that the user cannot select
 * a date earlier than today.
 */
function deactivatePastDays(id) {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById(id).setAttribute("min", today);
}

/**
 * Displays the subtask detail view for all subtasks in the big task card.
 * 
 * This function hides all subtask edit containers by adding the 'd-none' class
 * and shows all subtask detail containers by removing the 'd-none' class.
 * It is typically used when exiting edit mode and returning to the standard view.
 */
function showSubtaskDetailsForBigTaskCard() {
    let allEditSubtasks = Array.from(document.querySelectorAll(".container-subtask-edit"));
    let allDetailsSubtasks = Array.from(document.querySelectorAll(".container-subtask"));
    allEditSubtasks.forEach(element => element.classList.add('d-none'));
    allDetailsSubtasks.forEach(element => element.classList.remove('d-none'));
}

/**
 * Validates the due date input on the big task card edit view.
 * Clears previous error messages and shows a new one if the date format is invalid.
 */
function resetOrShowDateErrorForBigTaskCardEdit() {
    removeErrorForBigTaskCardEdit();
    validateInputsForBigTaskCardEdit();
    let validDateFormat = testDateForBigTaskCardEdit();
    if (!validDateFormat && document.getElementById('big-task-card-edit__input-due-date').value !== "") {
        throwErrorForBigTaskCardEdit();
        document.getElementById('invalid-date-big-task-card-edit__input-due-date').classList.remove('hidden');
    } else throwErrorForBigTaskCardEdit();
}

/**
 * Hides subtask input error messages and checks input length
 * in the big task card edit view to reset validation state.
 */
function resetSubtaskValidationForBigTaskCardEdit() {
    let invalidRef = document.getElementById('invalid-subtask-big-task-card-edit__subtask-input');
    invalidRef.classList.add('d-none');
    document.getElementById('max-char-big-task-card-edit__subtask-input').classList.add('d-none')
    checkInputLengthForBigTaskCardEdit('big-task-card-edit__subtask-input');
}