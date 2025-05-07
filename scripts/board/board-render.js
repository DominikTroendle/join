/**
 * Renders small task cards inside the specified drag field by generating HTML content 
 * for each task in the given array and inserting it into the corresponding field.
 * If the array is empty, no cards are rendered.
 *
 * @param {string} dragFieldId - The ID of the drag field where the task cards should be rendered.
 * @param {Array} dragFieldArray - The array of tasks to be rendered as small cards.
 * @returns {void} This function does not return any value.
 */
function renderSmallCard(dragFieldId, dragFieldArray) {
    if (dragFieldArray.length != 0) {
        let dragField = document.getElementById(dragFieldId);
        dragField.innerHTML = "";
        for (let index = 0; index < dragFieldArray.length; index++) {
            let description = shortenText(dragFieldArray[index].taskDescription, 50);
            dragField.innerHTML += smallCardTemplate(dragFieldArray[index].id, dragFieldArray[index].taskType, dragFieldArray[index].taskTitle, description, dragFieldArray[index].taskPriority, dragFieldArray[index].numberOfSubtasks, dragFieldArray[index].numberOfCompletedSubtasks, dragFieldArray[index].assignedContacts)
        }
    }
}

/**
 * Renders the content for the "big task card" based on the selected small task card.
 * This function is triggered when a small task card is clicked, and it displays the details of that task 
 * in the "big task card" overlay.
 *
 * @param {MouseEvent} event - The event triggered when a small task card is clicked.
 * @returns {void} This function does not return any value.
 */
function renderContentBigTaskCard(event) {
    currentTaskCardId = event.currentTarget.id;
    currentArrayName = event.currentTarget.closest(".drag-field").dataset.array;
    currentArray = arrays[currentArrayName];
    currentDragFieldId = event.currentTarget.closest(".drag-field").id;
    let objectFromCurrentSmallTaskCard = currentArray.find(element => element.id == currentTaskCardId);
    let bigTaskCard = document.getElementById("big-task-card__box");
    bigTaskCard.innerHTML = bigTaskCardTemplate(objectFromCurrentSmallTaskCard.id, objectFromCurrentSmallTaskCard.taskType, objectFromCurrentSmallTaskCard.taskTitle, objectFromCurrentSmallTaskCard.taskDescription, objectFromCurrentSmallTaskCard.taskPriority, objectFromCurrentSmallTaskCard.taskDueDate, objectFromCurrentSmallTaskCard.numberOfSubtasks, objectFromCurrentSmallTaskCard.numberOfCompletedSubtasks, objectFromCurrentSmallTaskCard.assignedContacts, objectFromCurrentSmallTaskCard.subtasks);
}

/**
 * Renders the content for the "big task card" in edit mode based on the selected small task card.
 * This function displays the details of the task in an editable format within the "big task card" overlay.
 *
 * @returns {void} This function does not return any value.
 */
function renderContentBigTaskCardEdit() {
    let bigTaskCard = document.getElementById("big-task-card__box");
    let objectFromCurrentSmallTaskCard = currentArray.find(element => element.id == currentTaskCardId);
    bigTaskCard.innerHTML = bigTaskCardEditTemplate(objectFromCurrentSmallTaskCard.id, objectFromCurrentSmallTaskCard.taskType, objectFromCurrentSmallTaskCard.taskTitle, objectFromCurrentSmallTaskCard.taskDescription, objectFromCurrentSmallTaskCard.taskPriority, objectFromCurrentSmallTaskCard.taskDueDate, objectFromCurrentSmallTaskCard.numberOfSubtasks, objectFromCurrentSmallTaskCard.numberOfCompletedSubtasks, objectFromCurrentSmallTaskCard.assignedContacts, objectFromCurrentSmallTaskCard.subtasks);
}

/**
 * Renders and displays the "Add Task" overlay.
 * This function injects the HTML template for the task form into the overlay box
 * and makes the overlay visible by removing the "d-none" class.
 *
 * @returns {void} This function does not return a value.
 */
function renderAddTaskOverlay() {
    let addTaskOverlay = document.getElementById("add-task__overlay");
    let addTaskBox = document.getElementById("add-task__box");
    addTaskBox.innerHTML = addTaskTemplate();
    addTaskOverlay.classList.remove("d-none");
}

/**
 * Renders the content of the big task card with updated information from the provided task card object.
 * This function replaces the existing content of the big task card with the new content based on the given task data.
 * 
 * @param {Object} taskCardObject - The task object containing the updated data to render in the big task card.
 * @param {string} taskCardObject.id - The unique identifier for the task.
 * @param {string} taskCardObject.taskType - The type of the task.
 * @param {string} taskCardObject.taskTitle - The title of the task.
 * @param {string} taskCardObject.taskDescription - The description of the task.
 * @param {string} taskCardObject.taskPriority - The priority of the task.
 * @param {string} taskCardObject.taskDueDate - The due date of the task.
 * @param {number} taskCardObject.numberOfSubtasks - The number of subtasks associated with the task.
 * @param {number} taskCardObject.numberOfCompletedSubtasks - The number of completed subtasks associated with the task.
 * @param {Array} taskCardObject.assignedContacts - An array of contacts assigned to the task.
 * @param {Array} taskCardObject.subtasks - An array representing the subtasks associated with the task.
 * 
 * @returns {void} This function does not return any value. It directly updates the DOM with the new task content.
 */
function renderNewContentFromBigTaskCard(taskCardObject) {
    let bigTaskCard = document.getElementById("big-task-card__box");
    bigTaskCard.innerHTML = bigTaskCardTemplate(taskCardObject.id, taskCardObject.taskType, taskCardObject.taskTitle, taskCardObject.taskDescription, taskCardObject.taskPriority, taskCardObject.taskDueDate, taskCardObject.numberOfSubtasks, taskCardObject.numberOfCompletedSubtasks, taskCardObject.assignedContacts, taskCardObject.subtasks);
}

/**
 * Renders the list of contact assignment options in the dropdown for the Big Task Card edit view.
 *
 * - If no contacts are selected, renders the full list using `renderDefaultContactsForBigTaskCardEdit`.
 * - If contacts are already selected, calls `checkForSelectedContactsForBigTaskCard` to handle rendering.
 * - Ensures scrollability if the dropdown content exceeds its container height.
 *
 * @param {Array<Object>} array - Array of contact objects to be displayed in the dropdown.
 * Each object should have at least a `name` and `color` property.
 *
 * Dependencies:
 * - `selectedContactsBigTaskCardEdit` (global state)
 * - `renderDefaultContactsForBigTaskCardEdit(array, container)`
 * - `checkForSelectedContactsForBigTaskCard(array, container)`
 * - `checkForScrollableContainerForBigTaskCardEdit(container)`
 */
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

/**
 * Renders the default list of contact options into the assignment dropdown 
 * for the Big Task Card edit view when no contacts are selected.
 *
 * Iterates over the provided contact array and calls 
 * `renderContactAsDefaultForBigTaskCardEdit` for each contact to append them to the dropdown.
 *
 * @param {Array<Object>} array - An array of contact objects with `name` and `color` properties.
 * @param {HTMLElement} dropDown - The DOM element representing the dropdown container where contact options will be appended.
 *
 * Dependencies:
 * - `renderContactAsDefaultForBigTaskCardEdit(container, name, color)`
 */
function renderDefaultContactsForBigTaskCardEdit(array, dropDown) {
    for (let i = 0; i < array.length; i++) {
        let contactName = array[i].name;
        let color = array[i].color;
        renderContactAsDefaultForBigTaskCardEdit(dropDown, contactName, color);
    }
}

/**
 * Renders a contact as selected in the assignment dropdown for the Big Task Card edit view.
 *
 * This function first renders the contact as a default contact using 
 * `renderContactAsDefaultForBigTaskCardEdit`. Then, it updates the contact's visual 
 * state by adding a selection icon and changing the contact's appearance to indicate 
 * that it has been selected. This is achieved by calling `toggleSelection`.
 *
 * @param {HTMLElement} dropDown - The DOM element representing the dropdown container where the contact options are rendered.
 * @param {string} contactName - The name of the contact being rendered as selected.
 * @param {string} color - The color associated with the contact for styling purposes.
 *
 * Dependencies:
 * - `renderContactAsDefaultForBigTaskCardEdit(container, name, color)`
 * - `toggleSelection(isSelected, contactDiv, icon)`
 */
function renderContactAsSelectedForBigTaskCard(dropDown, contactName, color) {
    renderContactAsDefaultForBigTaskCardEdit(dropDown, contactName, color);
    let contactDiv = document.getElementById(`edit-container-${contactName}`);
    let icon = document.getElementById(`edit-icon-${contactName}`);
    toggleSelection(true, contactDiv, icon);
}

/**
 * Renders a contact as a default (non-selected) option in the Big Task Card edit dropdown.
 *
 * This function appends a contact's HTML representation to the dropdown and updates the contact's
 * name and initials. The contact's initials are displayed with the specified color, and the name 
 * is used to uniquely identify the contact in the DOM. It does not mark the contact as selected.
 *
 * @param {HTMLElement} dropDown - The dropdown container where the contact is rendered.
 * @param {string} contactName - The name of the contact to render in the dropdown.
 * @param {string} color - The color to be applied to the contact's initials for styling.
 */
function renderContactAsDefaultForBigTaskCardEdit(dropDown, contactName, color) {
    dropDown.innerHTML += returnAssignedContactHTMLForBigTaskCardEdit(contactName, color);
    document.getElementById(`edit-${contactName}`).innerText = contactName;
    document.getElementById(`edit-initials-${contactName}`).innerText = getInitials(contactName);
    document.getElementById(`edit-initials-${contactName}`).classList.add(`${color}`);
}

/**
 * Renders the preview of the selected contacts for the big task card edit.
 * 
 * This function loops through the `selectedContactsBigTaskCardEdit` array, 
 * extracts each contact's name and color, calculates their initials, 
 * and appends the corresponding contact preview HTML to the provided container.
 * 
 * @param {HTMLElement} container - The DOM element where the selected contact previews will be rendered.
 * 
 * @example
 * renderSelectedContactsPreviewForBigTaskCardEdit(document.getElementById('contact-preview-container'));
 * // This will display the previews of selected contacts inside the specified container.
 */
function renderSelectedContactsPreviewForBigTaskCardEdit(container) {
    for (let i = 0; i < selectedContactsBigTaskCardEdit.length; i++) {
        let name = selectedContactsBigTaskCardEdit[i].name;
        let color = selectedContactsBigTaskCardEdit[i].color;
        let initials = getInitials(name);
        container.innerHTML += returnAssignedContactPreviewHTML(initials, color);
    }
}