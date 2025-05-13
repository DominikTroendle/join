/**
 * Sets the element being dragged to the given ID.
 * 
 * This function is used to track the currently dragged element by storing its ID
 * in the `currentDraggedElement` variable.
 * 
 * @param {string} id - The ID of the element that is being dragged.
 */
function startDragging(id) {
    currentDraggedElement = id;
}

/**
 * Stores the closest parent drag field element when a drag operation starts.
 * This function is triggered when the drag event is initiated, capturing the origin field for later use.
 *
 * @param {DragEvent} event - The drag event triggered when an element starts being dragged.
 * @returns {void} This function does not return any value.
 */
function onDragStart(event) {
    originDragField = event.currentTarget.closest(".drag-field");
}

/**
 * Adds a CSS class to the currently dragged card to apply a rotation or transformation effect during drag.
 * This function is triggered when the drag operation starts.
 *
 * @param {DragEvent} event - The drag event triggered when an element is being dragged.
 * @returns {void} This function does not return any value.
 */
function addDragRotation(event) {
    let currentDragCard = document.getElementById(event.currentTarget.id);
    currentDragCard.classList.add("drag-start-transform");
}

/**
 * Removes the CSS class that applies the rotation or transformation effect from the currently dragged card.
 * This function is triggered when the drag operation ends or the drag effect needs to be removed.
 *
 * @param {DragEvent} event - The drag event triggered when an element is being dropped or when drag ends.
 * @returns {void} This function does not return any value.
 */
function removeDragRotation(event) {
    let currentDragCard = document.getElementById(event.currentTarget.id);
    currentDragCard.classList.remove("drag-start-transform");
}

/**
 * Handles the movement of a draggable element by capturing the event data and setting up
 * the necessary variables for the drag operation. It also customizes the drag image during the drag process.
 *
 * @param {DragEvent} event - The drag event that contains data about the drag operation.
 * @param {string} dragFieldId - The ID of the drag field from which the element is being moved.
 * @param {Array} dragFieldArray - The array representing the items within the drag field.
 * 
 * @returns {void} This function does not return any value.
 */
function moveTo(event, dragFieldId, dragFieldArray) {
    cardId = event.currentTarget.id;
    oldCategory = dragFieldId;
    oldCategoryName = event.currentTarget.getAttribute("data-category")
    oldArray = dragFieldArray;
    const img = new Image();
    img.src = '';
    event.dataTransfer.setDragImage(img, 0, 0);
}

/**
 * Handles the drop event during a drag-and-drop operation, updating the task's category
 * and synchronizing the changes with the database. It also updates the UI by moving the task 
 * to the new category and checking related subtasks.
 *
 * @async
 * @param {DragEvent} event - The drag event that triggers the drop operation.
 * @param {Array} dragFieldArray - The array representing the items in the drag field.
 * @returns {Promise<void>} Resolves when the task is successfully moved to the new category 
 * and the data is updated in the database.
 */
async function processTaskDrop(event, dragFieldArray) {
    newCategory = event.currentTarget.id;
    newArray = dragFieldArray;
    newCategoryName = event.currentTarget.getAttribute("data-category");
    if (oldCategory === newCategory) return;
    findObjectInArrayAndSaveData(oldArray, newCategoryName);
    moveTaskToNewCategory();
    let putResponse = await putDataInDatabase(localStorage.getItem("userId"), currentCardId, currentTaskData.category, "category");
    if (!putResponse.ok) {
        console.error("Error when saving the new task:", putResponse.statusText);
        return;
    }
    checkAllSubtasksOfTask(newCategory);
}

/**
 * Finds a task object in the given array by its ID and saves its data to the `currentTaskData` object.
 * This function is used to capture the details of the task being moved or edited and store them for later use.
 *
 * @param {Array} array - The array in which to search for the task object.
 * @param {string} newCategoryName - The new category name to be assigned to the task.
 * @returns {void} This function does not return any value.
 */
function findObjectInArrayAndSaveData(array, newCategoryName) {
    let taskObject = array.find(element => element.id == currentCardId);
    currentTaskData = {
        category: newCategoryName,
        taskType: taskObject.taskType,
        taskTitle: taskObject.taskTitle,
        taskDescription: taskObject.taskDescription,
        taskPriority: taskObject.taskPriority,
        numberOfSubtasks: taskObject.numberOfSubtasks,
        numberOfCompletedSubtasks: taskObject.numberOfCompletedSubtasks,
        assignedContacts: taskObject.assignedContacts
    }
}

/**
 * Moves a task card from one category (array) to another and updates its category.
 * This function also triggers a UI update after the task is moved.
 *
 * @returns {void} This function does not return any value.
 */
function moveTaskToNewCategory() {
    let index = oldArray.findIndex(element => element.id == currentCardId);
    newArray.push(oldArray.splice(index, 1)[0]);
    let taskCardObjectinNewArray = newArray.find(element => element.id == currentCardId);
    taskCardObjectinNewArray.category = newCategoryName;
    updateUIAfterTaskMove();
}

/**
 * Updates the UI after a task has been moved to a new category.
 * This function re-renders the task cards in both the old and new categories,
 * or updates the search results if search mode is enabled.
 *
 * @returns {void} This function does not return any value.
 */
function updateUIAfterTaskMove() {
    if (searchMode === "false") {
        if (oldArray.length !== 0) {
            renderSmallCard(oldCategory, oldArray);
        } else {
            document.getElementById(oldCategory).innerHTML = noCardTemplate(categorysObject[oldCategoryName], searchMode);
        }
        renderSmallCard(newCategory, newArray);
    } else {
        putSearchTaskFromOldArrayinNewArray();
    }
}

/**
 * Prevents the default behavior of the drop event.
 * 
 * This function is used to allow an element to accept a dropped item by preventing
 * the default handling of the drop event.
 * 
 * @param {Event} ev - The drop event triggered during the drag-and-drop operation.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Creates a border box around the target drag field when a card is dragged into it.
 * This function is triggered when a drag enters a new field, displaying a visual border around the target area.
 * If the target field is the same as the origin field, no border box is created.
 *
 * @param {DragEvent} event - The drag event triggered when a card is dragged into a new drag field.
 * @returns {void} This function does not return any value.
 */
function createCardBorderBoxForDragEntered(event) {
    let targetDragField = document.getElementById(event.currentTarget.id);
    let currentCard = document.getElementById(currentCardId);
    if (targetDragField === originDragField) {
        return;
    }
    removeCardBorderBox();
    if (!targetDragField.querySelector("#card-border-box")) {
        targetDragField.innerHTML += cardBorderdragEnterTemplate(currentCard.offsetHeight);
    }
}

/**
 * Removes the border box from all drag fields.
 * This function is triggered to clear any visual border box that was added when a card entered a drag field.
 *
 * @returns {void} This function does not return any value.
 */
function removeCardBorderBox() {
    dragFieldIds.forEach(element => {
        let dragField = document.getElementById(element);
        let cardBorderBox = dragField.querySelector("#card-border-box");
        if (cardBorderBox) {
            cardBorderBox.remove();
        }
    });
}

/**
 * Activates pointer events for all task elements by setting their `pointer-events` CSS property to "auto".
 * This allows tasks to be interactive again (e.g., clickable, draggable).
 *
 * @returns {void} This function does not return any value.
 */
function activatePointerEventsForAllTasks() {
    const tasks = document.querySelectorAll(".user-story__all-content-box");
    tasks.forEach(task => task.style.pointerEvents = "auto");
}

/**
 * Disables pointer events for all task elements except for the one that triggered the event.
 * This function allows the task that triggered the event to remain interactive while disabling interactions 
 * with the other tasks (making them non-clickable or non-draggable).
 *
 * @param {Event} event - The event triggered when a task is interacted with, typically a click or drag event.
 * @returns {void} This function does not return any value.
 */
function disablePointerEventsForAllTasks(event) {
    const currentCard = event.currentTarget.closest(".user-story__all-content-box");
    const tasks = document.querySelectorAll(".user-story__all-content-box");
    tasks.forEach(task => {
        if (task !== currentCard) {
            task.style.pointerEvents = "none";
        } else {
            task.style.pointerEvents = "auto";
        }
    });
}