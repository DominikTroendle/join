/**
 * Renders small task cards inside a specified drag field element.
 * 
 * Clears the container and populates it with task cards based on the provided array.
 * If the array is empty, it renders a placeholder template instead.
 * 
 * @param {string} dragFieldId - The ID of the container element where the cards will be rendered.
 * @param {Array<Object>} dragFieldArray - Array of task objects to render as small cards.
 */
function renderSmallCard(dragFieldId, dragFieldArray) {
    let dragField = document.getElementById(dragFieldId);
    if (dragFieldArray.length != 0) {
        dragField.innerHTML = "";
        for (let index = 0; index < dragFieldArray.length; index++) {
            let description = shortenText(dragFieldArray[index].taskDescription, 50);
            dragField.innerHTML += smallCardTemplate(dragFieldArray[index].id, dragFieldArray[index].taskType, dragFieldArray[index].taskTitle, description, dragFieldArray[index].taskPriority, dragFieldArray[index].numberOfSubtasks, dragFieldArray[index].numberOfCompletedSubtasks, dragFieldArray[index].assignedContacts)
        }
    } else {
        dragField.innerHTML = noCardTemplate(categorysObject[dragField.dataset.category], searchMode);
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
    bigTaskCard.innerHTML = bigTaskCardTemplate(objectFromCurrentSmallTaskCard.taskType, objectFromCurrentSmallTaskCard.taskTitle, objectFromCurrentSmallTaskCard.taskDescription, objectFromCurrentSmallTaskCard.taskPriority, objectFromCurrentSmallTaskCard.taskDueDate, objectFromCurrentSmallTaskCard.assignedContacts, objectFromCurrentSmallTaskCard.subtasks);
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
    bigTaskCard.innerHTML = bigTaskCardEditTemplate(objectFromCurrentSmallTaskCard.taskTitle, objectFromCurrentSmallTaskCard.taskDescription, objectFromCurrentSmallTaskCard.taskDueDate, objectFromCurrentSmallTaskCard.assignedContacts, objectFromCurrentSmallTaskCard.subtasks);
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
    bigTaskCard.innerHTML = bigTaskCardTemplate(taskCardObject.taskType, taskCardObject.taskTitle, taskCardObject.taskDescription, taskCardObject.taskPriority, taskCardObject.taskDueDate, taskCardObject.assignedContacts, taskCardObject.subtasks);
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

/**
 * Searches for a newly created task in the DOM based on sessionStorage data and, if found,
 * highlights and scrolls to it.
 *
 * @function readTaskFromSessionAndFindTask
 * @returns {void}
 *
 * @description
 * This function performs the following steps:
 * 1. Waits briefly to ensure all DOM elements are loaded.
 * 2. Checks if a new task was added via the 'add-task' flag in sessionStorage.
 * 3. Retrieves the stored title and description, normalizes and shortens them.
 * 4. Searches through all user story titles in the DOM to find a matching task.
 * 5. If a match is found, it highlights and scrolls to the corresponding task element.
 * 6. Resets the sessionStorage flag to prevent duplicate actions.
 */
function readTaskFromSessionAndFindTask() {
    setTimeout(() => {
        if (sessionStorage.getItem("add-task") === "true") {
            const titleFromStorage = normalizeText(sessionStorage.getItem("title"));
            const descriptionFromStorage = shortenText(normalizeText(sessionStorage.getItem("description")), 50);
            let allUserStoryTitle = Array.from(document.querySelectorAll(".user-story__title"));
            let findNewCreateTask = findTaskByTitleAndDescription(titleFromStorage, descriptionFromStorage, allUserStoryTitle);
            if (findNewCreateTask) {
                highlightAndScrollToNewTask(findNewCreateTask);
            }
            sessionStorage.setItem("add-task", "false");
        }
    }, 500);
}

/**
 * Searches the DOM for a user story element that matches the given title and description.
 *
 * @function findTaskByTitleAndDescription
 * @param {string} titleFromStorage - The normalized title string retrieved from sessionStorage.
 * @param {string} descriptionFromStorage - The normalized and optionally shortened description string from sessionStorage.
 * @param {Element[]} allUserStoryTitle - An array of DOM elements representing all user story titles.
 * @returns {Element|null} The matching DOM element if found, otherwise null.
 *
 * @description
 * This function iterates over all user story title elements in the DOM and compares their
 * normalized text content (title and description) to the provided title and description values.
 * If a match is found, the corresponding element is returned.
 */
function findTaskByTitleAndDescription(titleFromStorage, descriptionFromStorage, allUserStoryTitle) {
    let findTask = allUserStoryTitle.find(element => {
        let userStoryBox = element.closest(".user-story__box");
        let description = userStoryBox?.querySelector(".user-story__description");
        let titleInDOM = normalizeText(element.innerText);
        let descriptionInDOM = normalizeText(description?.innerText);
        return titleInDOM == titleFromStorage && descriptionInDOM == descriptionFromStorage;
    });
    return findTask;
}

/**
 * Normalizes a string by replacing multiple whitespaces and non-breaking spaces,
 * trimming the result, and converting it to lowercase.
 *
 * @function normalizeText
 * @param {string} [string] - The input string to normalize.
 * @returns {string} The normalized string.
 *
 * @description
 * This function performs the following transformations on the input string:
 * 1. Replaces multiple whitespace characters with a single space.
 * 2. Replaces non-breaking spaces (Unicode U+00A0) with regular spaces.
 * 3. Trims leading and trailing spaces.
 * 4. Converts the string to lowercase.
 * If the input is null or undefined, it returns undefined.
 */
function normalizeText(string) {
    return string?.replace(/\s+/g, ' ').replace(/\u00A0/g, ' ').trim().toLowerCase();
}