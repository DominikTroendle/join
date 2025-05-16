/**
 * Processes subtask by checking the inputs value and determining whether to add the task (if boolean is true) or clear (if boolean is false) the input.
 * Clears the input value afterwards.
 * @param {Boolean} boolean - determines whether the subtask should be added (true) or the input should be cleared (false)
 */
function processSubtask(boolean) {
    let input = document.getElementById('subtasks');
    let invalidRef = document.getElementById('invalid-subtask');
    invalidRef.classList.add('d-none');
    document.getElementById('max-char-subtasks').classList.add('d-none')
    if (boolean && (input.value != "")) {
        addSubtask();
        input.value = "";
    } else if (!boolean && (input.value != "" || input.value == "")) {
        input.value = "";
    } else {
        invalidRef.classList.remove('d-none');
    }
}

/**
 * Toggles visibility of the edition options based on the boolean value by addind or removing classes
 * @param {String} id - id of the edition options whose visibility should be changed
 * @param {Boolean} boolean - determines whether classes should be added (false) or removed (true)
 */
function showEditOptions(id, boolean) {
    if (boolean) {
        document.getElementById(`icons-subtask-${id}`).classList.remove('d-none');
    } else {
        document.getElementById(`icons-subtask-${id}`).classList.add('d-none');
    }
}

/**
 * Checks if the pressed key is the Enter key
 * @param {KeyboardEvent} event - key press event triggered by the user
 */
function isEnterKey(event) {
    let subtasksInput = document.getElementById('subtasks')
    if (event.key === "Enter") {
        addSubtask();
        subtasksInput.value = "";
    }
}

/**
 * Adds subtask if the inputs value is not empty, otherwise throws error
 */
function addSubtask() {
    let inputValue = document.getElementById('subtasks').value;
    inputValue = inputValue.trim();
    if (inputValue !== "") {
        renderSubtask(inputValue);
    } else {
        throwSubtaskError();
    }
}

/**
 * Renders subtask by hiding error messages, determining the subtasks style (mobile/desktop and scrollable/unscrollable) and filling in the inputValue as innerText
 * @param {String} inputValue - value of the subtask that is to be filled in
 */
function renderSubtask(inputValue) {
    let containerSubtasks = document.getElementById('container-subtasks');
    let subtaskObj = {"checked" : "false"};
    document.getElementById('invalid-subtask').classList.add('d-none');
    document.getElementById('container-input-subtask').classList.remove('input-unvalid');
    subtasksCount++;
    determineSubtaskStyle(containerSubtasks, subtasksCount);
    document.getElementById(`subtask-${subtasksCount}`).innerText = inputValue;
    subtaskObj.subtask = inputValue;
    subtasks.push(subtaskObj);
    checkForScrollableContainer(containerSubtasks);
}

/**
 * Determines whether a mobile HTML template should be rendered by checking the innerWindow width
 * @param {HTMLElement} containerSubtasks - div element in which the HTML template is rendered
 * @param {Number} subtasksCount - number of the subtask
 */
function determineSubtaskStyle(containerSubtasks, subtasksCount) {
    if (window.innerWidth <= 1040) {
        containerSubtasks.innerHTML += returnSubtaskMobileHTML(subtasksCount);
    } else {
        containerSubtasks.innerHTML += returnSubtaskHTML(subtasksCount);
    }
}

/**
 * Deletes subtask by removing if from both the subtasks array and the DOM
 * @param {String} id - id of the subtask the user clicked to delete
 */
function deleteSubtask(id) {
    let subtaskContainer = document.getElementById(`container-subtask-${id}`);
    let containerSubtasks = document.getElementById('container-subtasks');
    subtasks.splice((id-1), 1);
    subtaskContainer.remove();
    subtasksCount--;
    checkForScrollableContainer(containerSubtasks);    
}

/**
 * Edits subtask by updating its value based on the users input and adjusts padding-related class by determining whether the element is the last child
 * @param {String} id - id of the subtask the user clicked to edit
 */
function editSubtask(id) {
    let allEditSubtasks = Array.from(document.querySelectorAll(".container-subtask-edit"));
    let allDetailsSubtasks = Array.from(document.querySelectorAll(".container-subtask"));
    allEditSubtasks.forEach(element => element.classList.add('d-none'));
    allDetailsSubtasks.forEach(element => element.classList.remove('d-none'));
    document.getElementById(`input-subtask-${id}`).value = document.getElementById(`subtask-${id}`).innerText;
    document.getElementById(`details-subtask-${id}`).classList.add('d-none');
    document.getElementById(`edit-subtask-${id}`).classList.remove('d-none');
}

/**
 * Checks if the given child is the last child of its parent
 * @param {HTMLElement} child - div element to check
 * @returns true if the given child is the last child of its parent, otherwise false
 */
function isLastChild(child) {
    return (child === child.parentNode.children[child.parentNode.children.length-1]) 
}

/**
 * Saves edited subtask by updating its value with the inputs value and adjusts padding-related class
 * @param {Number} id - id of the subtask the user clicked to save
 */
function saveEditedSubtask(id) {
    let input = document.getElementById(`input-subtask-${id}`);
    let element = document.getElementById(`container-subtask-${id}`);
    document.getElementById(`details-subtask-${id}`).classList.remove('d-none');
    document.getElementById(`edit-subtask-${id}`).classList.add('d-none');
    document.getElementById(`subtask-${id}`).innerText = input.value;
    subtasks[`${id-1}`].subtask = input.value;
    input.value = "";
    if (window.innerWidth > 1040) {showEditOptions(id, false);}
    if (element.classList.contains('padding-top')) {
        element.classList.remove('padding-top');
    }
}

/**
 * Throws error on subtask container by removing classes from the subtask container to show error message
 */
function throwSubtaskError() {
    document.getElementById('invalid-subtask').classList.remove('d-none');
    document.getElementById('container-input-subtask').classList.add('input-unvalid');
}

/**
 * Changes the visibility of two buttons to be displayed or hidden, depending on the boolean value
 * @param {Boolean} boolean - determines which classes should be added to or removed from the buttons
 */
function changeInputButton(boolean) {
    if (boolean) {
        document.getElementById('button-add').classList.add('d-none');
        document.getElementById('container-buttons').classList.remove('d-none');
    } else {
        document.getElementById('button-add').classList.remove('d-none');
        document.getElementById('container-buttons').classList.add('d-none');
    }
}