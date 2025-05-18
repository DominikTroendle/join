/**
 * Changes the `src` attribute of an image element with the specified ID.
 *
 * @param {string} id - The ID of the image element whose source should be changed.
 * @param {string} imgSource - The new source URL to set for the image.
 */
function changeImgSource(id, imgSource) {
    imgId = document.getElementById(id)
    imgId.src = imgSource;
}

/**
 * Handles the toggling of a subtask's checked state when a checkbox is clicked.
 * 
 * Retrieves the current state and index of the subtask from the event target,
 * toggles its value, updates the corresponding task object and checkbox element,
 * and delegates the update logic to `updateSubtaskCheckedStatus`.
 * 
 * @async
 * @param {Event} event - The click event triggered on the subtask checkbox element.
 */
async function changeCheckedSubtask(event) {
    let oldSubtaskChecked = event.currentTarget.getAttribute("data-checked");
    let newSubtaskChecked = oldSubtaskChecked === "true" ? "false" : "true";
    let index = event.currentTarget.getAttribute("data-index");
    let objectFromCurrentSmallTaskCard = currentArray.find(element => element.id == currentTaskCardId);
    let currentCheckbox = document.getElementById(`big-task-card__checkbox${index}`);
    updateSubtaskCheckedStatus(newSubtaskChecked, index, objectFromCurrentSmallTaskCard, currentCheckbox);
}

/**
 * Updates the checked state of a specific subtask both in the data model and in the UI,
 * then persists the change to the database.
 * 
 * If the update is successful, it triggers a UI update to reflect the number of completed subtasks.
 * If the database update fails, an error message is logged to the console.
 * 
 * @async
 * @param {string} newSubtaskChecked - The new checked status ("true" or "false") for the subtask.
 * @param {number} index - The index of the subtask within the task's subtasks array.
 * @param {Object} objectFromCurrentSmallTaskCard - The task object that contains the subtask.
 * @param {HTMLElement} currentCheckbox - The checkbox element in the DOM representing the subtask.
 */
async function updateSubtaskCheckedStatus(newSubtaskChecked, index, objectFromCurrentSmallTaskCard, currentCheckbox) {
    objectFromCurrentSmallTaskCard.subtasks[index].checked = newSubtaskChecked;
    currentCheckbox.dataset.checked = newSubtaskChecked;
    let putResponse = await putDataInDatabase(localStorage.getItem("userId"), currentTaskCardId, newSubtaskChecked, `subtasks/${index}/checked`);
    if (!putResponse.ok) {
        console.error("error when saving:", putResponse.statusText);
        return;
    }
    changeNumberOfCompletedSubtasks();
}

/**
 * Updates the number of completed subtasks for the current task and saves the change to the database.
 * This function calculates the number of completed subtasks, updates the task object,
 * and sends the updated value to the database. It also re-renders the small card for the task.
 *
 * @async
 * @returns {Promise<void>} Resolves when the number of completed subtasks is updated in the database and the UI is refreshed.
 */
async function changeNumberOfCompletedSubtasks() {
    let selectedArray = searchMode === "true" ? searchArrays[currentArrayName + "Search"] : currentArray;
    let objectFromCurrentSmallTaskCard = selectedArray.find(element => element.id == currentTaskCardId);
    let newNumberOfSubtasksCompleted = objectFromCurrentSmallTaskCard.subtasks.filter(element => element.checked === "true").length;
    objectFromCurrentSmallTaskCard.numberOfCompletedSubtasks = newNumberOfSubtasksCompleted;
    let putResponse = await putDataInDatabase(localStorage.getItem("userId"), currentTaskCardId, newNumberOfSubtasksCompleted, "numberOfCompletedSubtasks");
    renderSmallCard(currentDragFieldId, selectedArray);
    if (!putResponse.ok) {
        console.error("error when saving:", putResponse.statusText);
        return;
    }
}

/**
 * Checks if the task is in the "done" category and marks all subtasks as completed.
 * Then updates the number of completed subtasks in the database and re-renders the "done" category.
 *
 * @async
 * @function checkAllSubtasksOfTask
 * @param {string} category - The category identifier to check if it's the "done" column.
 */
async function checkAllSubtasksOfTask(category) {
    if (category === "done-drag-field") {
        let currentDoneArray = searchMode === "true" ? doneArraySearch : doneArray
        let objectFromCurrentSmallTaskCard = currentDoneArray.find(element => element.id == currentCardId);
        if (!objectFromCurrentSmallTaskCard) return;
        let newNumberOfSubtasksCompleted = objectFromCurrentSmallTaskCard.subtasks.length;
        completeAllSubtasks(objectFromCurrentSmallTaskCard, newNumberOfSubtasksCompleted);
        renderSmallCard("done-drag-field", currentDoneArray);
        updateNumberOfCompletedSubtasksInDatabase(newNumberOfSubtasksCompleted);
    }
}

/**
 * Marks all subtasks of a given task object as completed and updates their status in the database.
 *
 * @async
 * @function completeAllSubtasks
 * @param {Object} objectFromCurrentSmallTaskCard - The task object containing the subtasks to be completed.
 * @param {number} newNumberOfSubtasksCompleted - The total number of subtasks to be marked as completed.
 * @returns {Promise<void>} - Resolves when all subtasks have been updated, or exits early if an error occurs.
 * @throws {Error} Logs an error if saving a subtask status fails.
 */
async function completeAllSubtasks(objectFromCurrentSmallTaskCard, newNumberOfSubtasksCompleted) {
    objectFromCurrentSmallTaskCard.numberOfCompletedSubtasks = newNumberOfSubtasksCompleted;
    for (let index = 0; index < objectFromCurrentSmallTaskCard.subtasks.length; index++) {
        objectFromCurrentSmallTaskCard.subtasks[index].checked = "true";
        let putResponse = await putDataInDatabase(localStorage.getItem("userId"), currentCardId, objectFromCurrentSmallTaskCard.subtasks[index].checked, `subtasks/${index}/checked`);
        if (!putResponse.ok) {
            console.error("error when saving:", putResponse.statusText);
            return;
        }
    }
}

/**
 * Updates the number of completed subtasks for the current task in the database.
 *
 * @async
 * @function updateNumberOfCompletedSubtasksInDatabase
 * @param {number} newNumberOfSubtasksCompleted - The updated count of completed subtasks to be saved.
 * @returns {Promise<void>} - Resolves when the update is successful, or logs an error if the update fails.
 * @throws {Error} Logs an error if the PUT request to the database fails.
 */
async function updateNumberOfCompletedSubtasksInDatabase(newNumberOfSubtasksCompleted) {
    let putResponse2 = await putDataInDatabase(localStorage.getItem("userId"), currentCardId, newNumberOfSubtasksCompleted, "numberOfCompletedSubtasks");
    if (!putResponse2.ok) {
        console.error("error when saving:", putResponse2.statusText);
        return;
    }
}

/**
 * Reads data from the task edit form, validates the inputs, and if valid, updates the task data and re-renders the task card.
 * If any input is invalid, an error message is displayed.
 * 
 * The function performs the following steps:
 * 1. Removes any existing error messages related to the task edit form.
 * 2. Validates the input values for the task's details (title, description, etc.).
 * 3. Validates the due date format.
 * 4. If both validations pass, it updates the task and renders the updated task card.
 * 5. If the date format is invalid and the due date is not empty, it displays an error message related to the due date.
 * 6. If the general validation fails, it displays a general error message.
 * 
 * @returns {Promise<void>} A promise that resolves once the task update and rendering are completed, or rejects if validation fails.
 */
async function readFromEditAndSaveData() {
    removeErrorForBigTaskCardEdit();
    let valid = validateInputsForBigTaskCardEdit();
    let validDateFormat = testDateForBigTaskCardEdit();
    if (valid && validDateFormat) {
        updateTaskAndRender()
    } else if (!validDateFormat && document.getElementById('big-task-card-edit__input-due-date').value !== "") {
        throwErrorForBigTaskCardEdit();
        document.getElementById('invalid-date-big-task-card-edit__input-due-date').classList.remove('hidden');
    } else {
        throwErrorForBigTaskCardEdit();
    }
}

/**
 * Updates the task data based on the current task card, renders the updated content, and saves the changes to the database.
 * The function performs the following actions:
 * 1. Finds the task card object from the current array based on the task ID.
 * 2. Filters and stores the completed subtasks.
 * 3. Prepares the task data for update.
 * 4. Edits the task data in the array with the new values.
 * 5. Renders the updated content of the task card.
 * 6. Sends the updated task data to the database using a PUT request.
 * 7. If the database update is successful, it reloads the tasks (if search mode is enabled) or initializes the page.
 * 8. If the database update fails, an error is logged.
 *
 * @returns {Promise<void>} A promise that resolves after the task update and rendering are completed, or rejects if the update to the database fails.
 */
async function updateTaskAndRender() {
    let taskCardObject = currentArray.find(element => element.id === currentTaskCardId);
    completedSubtasksArray = subtasksBigTaskCardEdit.filter(element => element.checked === "true");
    prepareTaskDataForUpdate(taskCardObject);
    editDataInArray(taskCardObject, data);
    showTaskEditedOverlay("Task edited in Board");
    renderNewContentFromBigTaskCard(taskCardObject)
    let editResponse = await editDataInDatabase(localStorage.getItem("userId"), currentTaskCardId, data);
    if (!editResponse.ok) {
        console.error("error when saving in the database:", editResponse.statusText);
        return;
    }
    searchMode === "true" ? loadAllDataFromDatabaseAndRenderSearchTasks() : init();
}

/**
 * Prepares the data for updating a task by collecting the current values from the task card and the input fields.
 * This function creates an object `data` with the task's updated information, including the category, task type, title,
 * description, priority, due date, subtasks, and assigned contacts.
 *
 * @param {Object} taskCardObject - The task card object containing the existing task data to be updated.
 * @param {string} taskCardObject.category - The category of the task.
 * @param {string} taskCardObject.taskType - The type of the task.
 * @param {string} taskCardObject.taskTitle - The title of the task.
 * @param {string} taskCardObject.taskDescription - The description of the task.
 * @param {string} taskCardObject.taskPriority - The priority of the task.
 * @param {string} taskCardObject.taskDueDate - The due date of the task.
 * @param {Array} taskCardObject.subtasks - The subtasks associated with the task.
 * @param {Array} taskCardObject.assignedContacts - The contacts assigned to the task.
 * 
 * @returns {void} This function does not return any value, but it updates the `data` object with the task's updated information.
 */
function prepareTaskDataForUpdate(taskCardObject) {
    data = {
        category: taskCardObject.category,
        taskType: taskCardObject.taskType,
        taskTitle: document.getElementById("big-task-card-edit__input-title").value,
        taskDescription: document.getElementById("big-task-card-edit__textarea-description").value,
        taskPriority: selectedPriorityBigTaskCardEdit,
        taskDueDate: document.getElementById("big-task-card-edit__input-due-date").value,
        numberOfSubtasks: subtasksBigTaskCardEdit.length,
        numberOfCompletedSubtasks: completedSubtasksArray.length,
        assignedContacts: selectedContactsBigTaskCardEdit,
        subtasks: subtasksBigTaskCardEdit
    }
}

/**
 * Edits the properties of a task object in an array by updating its values with new data.
 * 
 * @param {Object} taskCardObject - The task object whose data is being edited.
 * @param {Object} data - The new data to update the task object with. This includes various task attributes.
 * @param {string} data.category - The category of the task.
 * @param {string} data.taskType - The type of the task.
 * @param {string} data.taskTitle - The title of the task.
 * @param {string} data.taskDescription - The description of the task.
 * @param {string} data.taskPriority - The priority level of the task.
 * @param {string} data.taskDueDate - The due date of the task.
 * @param {number} data.numberOfSubtasks - The total number of subtasks associated with the task.
 * @param {number} data.numberOfCompletedSubtasks - The number of completed subtasks associated with the task.
 * @param {Array} data.assignedContacts - An array of contacts assigned to the task.
 * @param {Array} data.subtasks - An array representing the subtasks of the task.
 * 
 * @returns {void} This function does not return any value. It directly modifies the provided `taskCardObject`.
 */
function editDataInArray(taskCardObject, data) {
    taskCardObject.category = data.category;
    taskCardObject.taskType = data.taskType;
    taskCardObject.taskTitle = data.taskTitle;
    taskCardObject.taskDescription = data.taskDescription;
    taskCardObject.taskPriority = data.taskPriority;
    taskCardObject.taskDueDate = data.taskDueDate;
    taskCardObject.numberOfSubtasks = data.numberOfSubtasks;
    taskCardObject.numberOfCompletedSubtasks = data.numberOfCompletedSubtasks;
    taskCardObject.assignedContacts = data.assignedContacts;
    taskCardObject.subtasks = data.subtasks;
}

/**
 * Synchronizes all contacts with tasks for a specific user by loading the data from the database and updating assigned contacts in tasks.
 * 
 * This function performs three steps:
 * 1. Loads all contacts from the database.
 * 2. Loads all tasks from the database.
 * 3. Updates the assigned contacts in each task based on the loaded contacts.
 *
 * @async
 * @function syncAllContactsWithTasks
 * @param {string} userKey - The unique user ID to fetch contacts and tasks from the database.
 * @returns {Promise<void>} - This function does not return any value but performs the synchronization asynchronously.
 * @throws {Error} If any of the data retrieval operations fail.
 */
async function syncAllContactsWithTasks(userKey) {
    await readAllContactsFromDatabase(userKey);
    await readAllTasksFromDatabase(userKey);
    await updateAssignedContactsInTasks(userKey);
}

/**
 * Updates the UI rendering after a task has been moved between categories.
 * 
 * Depending on whether the app is in search mode, this function either:
 * - Renders updated task cards in the old and new categories,
 * - Or calls a separate function to handle the update during a search.
 * 
 * Also triggers a database update for the moved task's category.
 * 
 * @function updateCategoryRender
 * @returns {void}
 */
function updateCategoryRender() {
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
    updateTaskCategoryInDatabase();
}

/**
 * Updates the task's category in the database and performs follow-up actions.
 * 
 * Sends a PUT request to update the task's category based on the current user ID and task ID.
 * If the update is successful, it verifies all subtasks for the new category and visually highlights the moved task card.
 * 
 * @async
 * @function updateTaskCategoryInDatabase
 * @returns {Promise<void>} - Resolves when all operations are complete.
 * @throws {Error} Logs an error to the console if the database update fails.
 */
async function updateTaskCategoryInDatabase() {
    let putResponse = await putDataInDatabase(localStorage.getItem("userId"), currentCardId, currentTaskData.category, "category");
    if (!putResponse.ok) {
        console.error("Error when saving the new task:", putResponse.statusText);
        return;
    }
    await checkAllSubtasksOfTask(newCategory);
    highlightTaskCardWithAnimation();
}

/**
 * Shortens a given text to a maximum number of characters by trimming it to the nearest word 
 * and appending an ellipsis ("...") if the text exceeds the specified length.
 * 
 * @param {string} text - The text that needs to be shortened.
 * @param {number} maxChars - The maximum number of characters allowed for the shortened text.
 * @returns {string} A shortened version of the text, possibly with an ellipsis, if it exceeds the specified length.
 */
function shortenText(text, maxChars) {
    let newText = "";
    let words = text.split(" ");
    for (let index = 0; index < words.length; index++) {
        if ((newText + " " + words[index]).trim().length > maxChars) {
            break;
        }
        newText += words[index] + " ";
    }
    newText = newText.trim();
    return newText.length < text.trim().length ? newText + "..." : newText;
}

/**
 * Deletes the currently selected task from both the UI and the database.
 *
 * This function performs the following steps:
 * 1. Removes the task from the local data array if it exists.
 * 2. Displays a temporary overlay message to confirm deletion.
 * 3. Triggers a visual animation indicating the task was deleted.
 * 4. Re-renders the task cards after a short delay.
 * 5. Sends a DELETE request to remove the task from the database.
 *
 * @async
 * @function deleteCurrentTask
 * @returns {Promise<void>} Resolves when the task is removed from both the UI and the database.
 *                          Logs an error to the console if the database deletion fails.
 */
async function deleteCurrentTask() {
    let indexFromCurrentTask = currentArray.findIndex(element => element.id === currentTaskCardId);
    if (indexFromCurrentTask !== -1) {
        currentArray.splice(indexFromCurrentTask, 1);
    }
    showTaskEditedOverlay("Task deleted in Board");
    highlightDeleteTaskCardWithAnimation();
    setTimeout(() => renderSmallCard(currentDragFieldId, currentArray), 2500);
    let deleteResponse = await deleteInDatabase(localStorage.getItem("userId"), currentTaskCardId);
    if (!deleteResponse.ok) {
        console.error("error when saving:", putResponse.statusText);
        return;
    }
}

/**
 * Visually highlights the task card that is about to be deleted using a flashing animation.
 *
 * This function performs the following actions:
 * 1. Waits briefly, then scrolls the task card into view.
 * 2. Adds a CSS class to trigger a flashing delete animation.
 * 3. After the animation duration, removes the CSS class to reset the style.
 *
 * @function highlightDeleteTaskCardWithAnimation
 * @returns {void} This function does not return a value.
 */
function highlightDeleteTaskCardWithAnimation() {
    setTimeout(() => {
        document.getElementById(currentCardId).scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById(currentCardId).classList.add('highlight-flash-delete');
    }, 500);
    setTimeout(() => {
        document.getElementById(currentCardId).classList.remove('highlight-flash-delete');
    }, 2500);
}