let currentDraggedElement;
let toDoArray = [];
let inProgressArray = [];
let awaitFeedbackArray = [];
let doneArray = [];
let oldArray = [];
let newArray = [];
let oldCategory;
let oldCategoryName;
let newCategory;
let newCategoryName;
let currentCardId;
let currentTaskData = {};
let currentTaskCardId;
let currentArrayName;
let currentArray = [];
let currentDragFieldId;
let isBorderActive = false
let toDoArraySearch = [];
let inProgressArraySearch = [];
let awaitFeedbackArraySearch = [];
let doneArraySearch = [];
let originDragField = null;
let searchMode = "false";
let data = {
    category: "",
    taskType: "",
    taskTitle: "",
    taskDescription: "",
    taskPriority: "",
    numberOfSubtasks: 0,
    numberOfCompletedSubtasks: 0,
    assignedContacts: [],
    subtasks: []
}
const BASE_URL = "https://join-user-default-rtdb.europe-west1.firebasedatabase.app";
const arrayNames = ["toDoArray", "inProgressArray", "awaitFeedbackArray", "doneArray"];
const searchArrayNames = ["toDoArraySearch", "inProgressArraySearch", "awaitFeedbackArraySearch", "doneArraySearch"];
const searchArrays = {
    toDoArraySearch: toDoArraySearch,
    inProgressArraySearch: inProgressArraySearch,
    awaitFeedbackArraySearch: awaitFeedbackArraySearch,
    doneArraySearch: doneArraySearch
};
const dragFieldIds = ["to-do-drag-field", "in-progress-drag-field", "await-feedback-drag-field", "done-drag-field"];
const categorys = ["To do", "In progress", "Await feedback", "Done"];
const categorysObject = {
    toDos: "To do",
    inProgress: "In progress",
    awaitFeedback: "Await feedback",
    done: "Done"
}
const searchArraysBasedOnCategory = {
    toDos: toDoArraySearch,
    inProgress: inProgressArraySearch,
    awaitFeedback: awaitFeedbackArraySearch,
    done: doneArraySearch
}
const arrays = {
    toDoArray: toDoArray,
    inProgressArray: inProgressArray,
    awaitFeedbackArray: awaitFeedbackArray,
    doneArray: doneArray
};

/**
 * Initializes the task board by resetting UI elements, synchronizing contacts with tasks,
 * and loading task data from the database into their respective arrays and drag-and-drop fields.
 * It also sets the height for drag fields and clears the session storage task category.
 *
 * This function performs asynchronous operations, including reading task data from the database
 * and synchronizing contacts with tasks. It ensures that the UI is updated and prepared for
 * user interaction.
 *
 * @async
 * @returns {Promise<void>} Resolves when all asynchronous operations (such as loading tasks and synchronizing contacts) are complete.
 */
async function init() {
    setSearchModeFalseAndChangeImg();
    await syncAllContactsWithTasks(localStorage.getItem("userId"));
    await readFromDatabase(localStorage.getItem("userId"), "toDos", toDoArray, "to-do-drag-field");
    await readFromDatabase(localStorage.getItem("userId"), "inProgress", inProgressArray, "in-progress-drag-field");
    await readFromDatabase(localStorage.getItem("userId"), "awaitFeedback", awaitFeedbackArray, "await-feedback-drag-field");
    await readFromDatabase(localStorage.getItem("userId"), "done", doneArray, "done-drag-field");
    setHeightForDragFields();
    removeSessionStorageTaskCategory()
}

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
async function allowDrop2(event, dragFieldArray) {
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
 * Moves a search task card from one search category array to another and updates its category.
 * This function re-renders the search results for both the old and new categories after the task is moved.
 *
 * @returns {void} This function does not return any value.
 */
function putSearchTaskFromOldArrayinNewArray() {
    let oldArraySearch = searchArraysBasedOnCategory[oldCategoryName];
    let newArraySearch = searchArraysBasedOnCategory[newCategoryName];
    let index = oldArraySearch.findIndex(element => element.id == currentCardId);
    newArraySearch.push(oldArraySearch.splice(index, 1)[0]);
    let taskCardObjectinNewArraySearch = newArraySearch.find(element => element.id == currentCardId);
    taskCardObjectinNewArraySearch.category = newCategoryName;
    if (oldArraySearch.length !== 0) {
        renderSmallCard(oldCategory, oldArraySearch);
    } else {
        document.getElementById(oldCategory).innerHTML = noCardTemplate(categorysObject[oldCategoryName], searchMode);
    }
    renderSmallCard(newCategory, newArraySearch);
}

/**
 * Saves the ID of the currently clicked or interacted card.
 * This function is typically used to capture the ID of a task card during an event (e.g., a click).
 *
 * @param {Event} event - The event triggered by interacting with the card (e.g., click event).
 * @returns {void} This function does not return any value.
 */
function saveCurrentCardId(event) {
    currentCardId = event.currentTarget.id;
}

/**
 * Clears all search arrays by setting their lengths to 0, effectively removing all items.
 * This function is used to reset search-related arrays for tasks, clearing any stored search results.
 *
 * @returns {void} This function does not return any value.
 */
function clearAllSearchArray() {
    toDoArraySearch.length = 0;
    inProgressArraySearch.length = 0;
    awaitFeedbackArraySearch.length = 0;
    doneArraySearch.length = 0;
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

/**
 * Toggles the visibility of the "big task card" overlay by adding or removing the "d-none" class.
 * This function is typically used to show or hide the large task card overlay.
 *
 * @returns {void} This function does not return any value.
 */
function toggleDnoneBigTaskCard() {
    document.getElementById("big-task-card__overlay").classList.toggle("d-none");
}

/**
 * Adds a sliding effect to the "big task card" box by adding the "slide-back" class,
 * waits for a brief moment, and then hides the big task card overlay and removes the sliding effect.
 *
 * @returns {void} This function does not return any value.
 */
function addClassSlideBack() {
    document.getElementById("big-task-card__box").classList.add("slide-back")
    setTimeout(() => {
        toggleDnoneBigTaskCard();
        document.getElementById("big-task-card__box").classList.remove("slide-back")
        clearTimeout();
    }, 120);
}

/**
 * Toggles the visibility of three elements (a rectangle, a close rectangle, and a hook) 
 * by adding or removing the "d-none" class. This is typically used to show or hide UI elements.
 *
 * @param {string} idRectangleOpen - The ID of the rectangle element that should be shown or hidden.
 * @param {string} idRectangleClose - The ID of the rectangle element (close) that should be shown or hidden.
 * @param {string} idHook - The ID of the hook element that should be shown or hidden.
 * @returns {void} This function does not return any value.
 */
function toggleDnoneCheckbox(idRectangleOpen, idRectangleClose, idHook) {
    let rectangleOpen = document.getElementById(idRectangleOpen);
    let rectangleClose = document.getElementById(idRectangleClose);
    let hook = document.getElementById(idHook);
    rectangleOpen.classList.toggle("d-none");
    rectangleClose.classList.toggle("d-none");
    hook.classList.toggle("d-none");
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
 * Fetches task data from the database for a specific user and category, then processes and renders the data 
 * into the corresponding task array and UI category.
 *
 * @async
 * @param {string} userKey - The unique identifier of the user whose tasks are being retrieved.
 * @param {string} category - The category of tasks to be retrieved (e.g., "toDos", "inProgress").
 * @param {Array} categoryArray - The array where the tasks of the specified category will be stored.
 * @param {string} dragFieldId - The ID of the drag field where the tasks will be rendered.
 * @returns {Promise<void>} Resolves when the tasks have been successfully fetched, processed, and rendered.
 */
async function readFromDatabase(userKey, category, categoryArray, dragFieldId) {
    try {
        let result = await fetch(`${BASE_URL}/users/${userKey}/tasks.json`);
        if (!result.ok) {
            throw new Error(`Error when retrieving the data: ${result.statusText}`);
        }
        let data = await result.json();
        categoryArray.length = 0;
        collectTasksByCategory(data, category, categoryArray);
        renderCategoryContent(category, categoryArray, dragFieldId)
    } catch (error) {
        console.error("error loading the data:", error);
    }
}

/**
 * Collects tasks from the provided data that match the specified category 
 * and stores them in the provided category array.
 * Each task is enhanced with an `id` and default empty array for `assignedContacts` if not present.
 *
 * @param {Object} data - The data object containing task information, where each key is a unique task identifier.
 * @param {string} category - The category to filter tasks by (e.g., "toDo", "inProgress").
 * @param {Array} categoryArray - The array to store the filtered tasks of the specified category.
 * @returns {void} This function does not return any value. It modifies the `categoryArray` directly.
 */
function collectTasksByCategory(data, category, categoryArray) {
    if (data) {
        Object.entries(data).forEach(([firebaseKey, value]) => {
            if (value.category === category) {
                value.id = firebaseKey;
                if (!value.assignedContacts) {
                    value.assignedContacts = [];
                }
                categoryArray.push(value);
            }
        });
    }
}

/**
 * Renders the content for a specific category based on the provided category array.
 * If there are tasks in the category, it renders the small cards; otherwise, it displays a "no cards" message.
 *
 * @param {string} category - The category to render (e.g., "toDo", "inProgress").
 * @param {Array} categoryArray - The array containing tasks for the specified category.
 * @param {string} dragFieldId - The ID of the drag field where the tasks should be rendered.
 * @returns {void} This function does not return any value. It directly modifies the UI by rendering the category content.
 */
function renderCategoryContent(category, categoryArray, dragFieldId) {
    if (categoryArray.length !== 0 && searchMode === "false") {
        renderSmallCard(dragFieldId, categoryArray);
    } else {
        document.getElementById(dragFieldId).innerHTML = noCardTemplate(categorysObject[category], searchMode);
    }
}

/**
 * Sends a POST request to save task data to the database for a specific user.
 * This function sends the provided task data to the server and logs an error if the request fails.
 *
 * @async
 * @param {string} userKey - The unique identifier for the user to whom the task data belongs.
 * @param {Object} data - The task data to be saved to the database.
 * @returns {Promise<void>} Resolves when the data has been successfully posted or logs an error if the request fails.
 */
async function postDataInDatabase(userKey, data) {
    let response = await fetch(`${BASE_URL}/users/${userKey}/tasks/.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        console.error("Error when saving:", response.statusText);
    }
}

/**
 * Changes the category of a task by finding the task object based on the task card's ID.
 * This function retrieves the task object from the `toDoArray` based on the task card's ID.
 *
 * @param {Event} event - The event triggered by the action on the task card.
 * @returns {void} This function does not return any value. It modifies the task data by retrieving the task object.
 */
function changeTaskCategoryinDatabase(event) {
    taskCardId = event.currentTarget.id;
    taskCardObject = toDoArray.find(element => element.id == taskCardId);
}

/**
 * Sends a DELETE request to remove a task from the database for a specific user.
 * This function deletes a task from the database using the provided `cardId` and `userKey`.
 * If the request fails, it logs an error to the console.
 *
 * @async
 * @param {string} userKey - The unique identifier for the user whose task is being deleted.
 * @param {string} cardId - The ID of the task card to be deleted.
 * @returns {Promise<Response>} The response from the DELETE request.
 */
async function deleteInDatabase(userKey, cardId) {
    let response = await fetch(`${BASE_URL}/users/${userKey}/tasks/${cardId}.json`, {
        method: "DELETE"
    })
    if (!response.ok) {
        console.error("error when saving:", response.statusText);
    }
    return response
}

/**
 * Sends a PUT request to update the task data in the database for a specific user and task.
 * This function updates the specified task using the provided data and updates a specific field (extendedPath).
 *
 * @async
 * @param {string} userKey - The unique identifier for the user whose task is being updated.
 * @param {string} cardId - The ID of the task card to be updated.
 * @param {Object} data - The data to be updated in the task.
 * @param {string} extendedPath - The specific path to the field that needs to be updated (e.g., "category", "taskTitle").
 * @returns {Promise<Response>} The response from the PUT request.
 */
async function putDataInDatabase(userKey, cardId, data, extendedPath) {
    let response = await fetch(`${BASE_URL}/users/${userKey}/tasks/${cardId}/${extendedPath}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        console.error("error when saving:", response.statusText);
    }
    return response;
}

/**
 * Toggles the checked state of a subtask and updates the task's subtasks in the database.
 * This function changes the checked state of a subtask when a checkbox is clicked, updates the task's data in the database,
 * and updates the number of completed subtasks.
 *
 * @async
 * @param {Event} event - The event triggered by clicking the checkbox of the subtask.
 * @returns {Promise<void>} Resolves when the subtask's checked state has been updated in the database and the task is refreshed.
 */
async function changeCheckedSubtask(event) {
    let oldSubtaskChecked = event.currentTarget.getAttribute("data-checked");
    let newSubtaskChecked = oldSubtaskChecked === "true" ? "false" : "true";
    let index = event.currentTarget.getAttribute("data-index");
    let objectFromCurrentSmallTaskCard = currentArray.find(element => element.id == currentTaskCardId);
    let currentCheckbox = document.getElementById(`big-task-card__checkbox${index}`);
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

async function checkAllSubtasksOfTask(category) {
    if (category === "done-drag-field") {
        let currentDoneArray = searchMode === "true" ? doneArraySearch : doneArray
        let objectFromCurrentSmallTaskCard = currentDoneArray.find(element => element.id == currentCardId);
        if (!objectFromCurrentSmallTaskCard) return;
        completeAllSubtasks(objectFromCurrentSmallTaskCard)
        renderSmallCard("done-drag-field", currentDoneArray);
        let putResponse2 = await putDataInDatabase(localStorage.getItem("userId"), currentCardId, newNumberOfSubtasksCompleted, "numberOfCompletedSubtasks");
        if (!putResponse2.ok) {
            console.error("error when saving:", putResponse2.statusText);
            return;
        }
    }
}

async function completeAllSubtasks(objectFromCurrentSmallTaskCard) {
    let newNumberOfSubtasksCompleted = objectFromCurrentSmallTaskCard.subtasks.length;
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

async function deleteCurrentTask() {
    let indexFromCurrentTask = currentArray.findIndex(element => element.id === currentTaskCardId);
    if (indexFromCurrentTask !== -1) {
        currentArray.splice(indexFromCurrentTask, 1);
    }
    renderSmallCard(currentDragFieldId, currentArray);
    let deleteResponse = await deleteInDatabase(localStorage.getItem("userId"), currentTaskCardId);
    if (!deleteResponse.ok) {
        console.error("error when saving:", putResponse.statusText);
        return;
    }
}

async function checkSearchWordAndLoadAllSearchTasks() {
    let searchFieldInput = document.getElementById("search-field__input");
    let searchWord = searchFieldInput.value.trim();
    clearAllSearchArray();
    for (let index = 0; index < arrayNames.length; index++) {
        let originalArray = arrays[arrayNames[index]];
        let searchArray = searchArrays[searchArrayNames[index]];
        let dragField = document.getElementById(dragFieldIds[index]);
        originalArray.forEach(element => {
            if (element.taskTitle.toLowerCase().includes(searchWord.toLowerCase()) || element.taskDescription.toLowerCase().includes(searchWord.toLowerCase())) {
                searchArray.push(element);
            }
        });
        if (searchArray.length !== 0) {
            renderSmallCard(dragFieldIds[index], searchArray);
        } else {
            dragField.innerHTML = noCardTemplate(categorys[index], searchMode);
        }
    }
    setHeightForDragFields();
}

function renderAddTaskOverlay() {
    let addTaskOverlay = document.getElementById("add-task__overlay");
    let addTaskBox = document.getElementById("add-task__box");
    addTaskBox.innerHTML = addTaskTemplate();
    addTaskOverlay.classList.remove("d-none");
}

function addTaskBoxAddClassSlideBack() {
    document.getElementById("add-task__box").classList.add("slide-back")
    setTimeout(() => {
        toggleDnoneAddTaskOverlay()
        document.getElementById("add-task__box").classList.remove("slide-back")
        clearTimeout();
    }, 120);
}

function toggleDnoneAddTaskOverlay() {
    document.getElementById("add-task__overlay").classList.toggle("d-none");
}

function setSearchModeTrueAndChangeImg() {
    if (searchMode === "false") {
        let searchFieldInput = document.getElementById("search-field__input").value;
        if (searchFieldInput !== "") {
            searchMode = "true";
            document.getElementById("search-field__img").classList.add("d-none");
            document.getElementById("search-field__close-img").classList.remove("d-none");
        }
    }
}

function closeSearchModeWhenInputIsEmpty() {
    let searchFieldInput = document.getElementById("search-field__input").value;
    if (searchFieldInput === "") {
        setSearchModeFalseAndChangeImg();
        init();
    }
}

function setSearchModeFalseAndChangeImg() {
    searchMode = "false";
    document.getElementById("search-field__img").classList.remove("d-none");
    document.getElementById("search-field__close-img").classList.add("d-none");
    document.getElementById("search-field__input").value = "";
}

function selectionOfWhichFunctionIsUsed() {
    if (searchMode === "false") {
        setSearchModeTrueAndChangeImg();
    } else {
        setSearchModeFalseAndChangeImg();
        init();
    }
}

async function readFromEditAndSaveData() {
    removeErrorForBigTaskCardEdit();
    let valid = validateInputsForBigTaskCardEdit();
    let validDateFormat = testDateForBigTaskCardEdit();
    if (valid && validDateFormat) {
        let taskCardObject = currentArray.find(element => element.id === currentTaskCardId);
        completedSubtasksArray = subtasksBigTaskCardEdit.filter(element => element.checked === "true");
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
        editDataInArray(taskCardObject, data);
        renderNewContentFromBigTaskCard(taskCardObject)
        let editResponse = await editDataInDatabase(localStorage.getItem("userId"), currentTaskCardId, data);
        if (!editResponse.ok) {
            console.error("error when saving in the database:", editResponse.statusText);
            return;
        }
        searchMode === "true" ? loadAllDataFromDatabaseAndRenderSearchTasks() : init();
    } else if (!validDateFormat && document.getElementById('big-task-card-edit__input-due-date').value !== "") {
        throwErrorForBigTaskCardEdit();
        document.getElementById('invalid-date-big-task-card-edit__input-due-date').classList.remove('hidden');
    } else {
        throwErrorForBigTaskCardEdit();
    }
}

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

async function editDataInDatabase(userKey, cardId, data) {
    let response = await fetch(`${BASE_URL}/users/${userKey}/tasks/${cardId}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        console.error("error when saving:", response.statusText);
    }
    return response;
}

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

function renderNewContentFromBigTaskCard(taskCardObject) {
    let bigTaskCard = document.getElementById("big-task-card__box");
    bigTaskCard.innerHTML = bigTaskCardTemplate(taskCardObject.id, taskCardObject.taskType, taskCardObject.taskTitle, taskCardObject.taskDescription, taskCardObject.taskPriority, taskCardObject.taskDueDate, taskCardObject.numberOfSubtasks, taskCardObject.numberOfCompletedSubtasks, taskCardObject.assignedContacts, taskCardObject.subtasks);
}

function setHeightForDragFields() {
    const dragFields = document.querySelectorAll('.drag-field');
    if (window.innerWidth < 1310) {
        dragFields.forEach(dragField => dragField.style.height = 'auto');
        return;
    }
    let maxHeight = 0;
    dragFields.forEach(dragField => dragField.style.height = 'auto');
    dragFields.forEach(dragField => {
        maxHeight = Math.max(maxHeight, dragField.scrollHeight);
    });
    dragFields.forEach(dragField => {
        dragField.style.height = `${maxHeight}px`;
    });
}
window.addEventListener("resize", setHeightForDragFields);
let allContacts = [];
let allTasks = [];
async function readAllContactsFromDatabase(userKey) {
    try {
        let result = await fetch(`${BASE_URL}/users/${userKey}/allContacts.json`);
        if (!result.ok) {
            throw new Error(`Fehler beim Abrufen der Daten: ${result.statusText}`);
        }
        let data = await result.json();
        allContacts.length = 0;
        if (data) {
            Object.entries(data).forEach(([firebaseKey, value]) => {
                const { name, color } = value;
                allContacts.push({ name, color });
            });
        }
    } catch (error) {
        console.error("error loading the data:", error);
    }
}

async function readAllTasksFromDatabase(userKey) {
    try {
        let result = await fetch(`${BASE_URL}/users/${userKey}/tasks.json`);
        if (!result.ok) {
            throw new Error(`Fehler beim Abrufen der Daten: ${result.statusText}`);
        }
        let data = await result.json();
        allTasks.length = 0;
        if (data) {
            Object.entries(data).forEach(([firebaseKey, value]) => {
                value.id = firebaseKey;
                allTasks.push(value);
            });
        }
    } catch (error) {
        console.error("error loading the data:", error);
    }
}

async function syncAllContactsWithTasks(userKey) {
    await readAllContactsFromDatabase(userKey);
    await readAllTasksFromDatabase(userKey);
    let updatedTasks = allTasks.map(task => {
        if (!task.assignedContacts) return task;
        task.assignedContacts = task.assignedContacts
            .map(contact => {
                let updatedContact = allContacts.find(c => c.name === contact.name);
                return updatedContact ? updatedContact : null;
            })
            .filter(contact => contact !== null);

        return task;
    });
    await saveTasksToDatabase(userKey, updatedTasks);
}

async function saveTasksToDatabase(userKey, tasks) {
    if (!Array.isArray(tasks) || tasks.length === 0) {
        console.warn("Es wurden keine Tasks zum Speichern übergeben Vorgang abgebrochen.");
        return;
    }

    try {
        let updates = {};
        tasks.forEach(task => {
            updates[task.id] = { ...task };
        });

        await fetch(`${BASE_URL}/users/${userKey}/tasks.json`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates)
        });
    } catch (error) {
        console.error("Fehler beim Speichern der Tasks:", error);
    }
}

function openMobileMoveMenu(event) {
    let currentCardClicked = event.currentTarget.closest(".user-story__all-content-box");
    let currentUserStoryBox = currentCardClicked.querySelector(".user-story__box");
    let currentMoveMenu = currentCardClicked.querySelector(".user-story__mobile-move-menu");
    let currentCenterButtonText = currentCardClicked.querySelector('.user-story__mobile-move-menu__center-button-text');
    let currentCategoryName = currentCardClicked.closest(".drag-field").getAttribute("data-category");
    let currentCenterButton = currentCardClicked.querySelector(".user-story__mobile-move-menu__center-button");
    event.stopPropagation();
    closeOtherMoveMenus(currentCenterButton)
    currentMoveMenu.querySelector(`.${currentCategoryName}`).style.fill = "#D08770";
    currentMoveMenu.querySelector(`.${currentCategoryName}`).style.pointerEvents = "none";
    currentUserStoryBox.style.pointerEvents = "none";
    currentMoveMenu.style.display = "flex";
    currentMoveMenu.style.pointerEvents = "none";
    addAnimationClassToTaskContent(currentUserStoryBox);
    setTimeout(() => {
        currentCenterButtonText.classList.add('fade-out');
        setTimeout(() => {
            currentCenterButtonText.textContent = 'Close';
            currentCenterButtonText.classList.remove('fade-out');
            currentMoveMenu.style.pointerEvents = "auto";
        }, 300);
    }, 1200);
}

function addAnimationClassToTaskContent(currentUserStoryBox) {
    setTimeout(() => {
        currentUserStoryBox.classList.add("blur-out");
    }, 200);
}

function removeAnimationClassToTaskContent(currentUserStoryBox) {
    setTimeout(() => {
        currentUserStoryBox.classList.remove("blur-out");
    }, 1600);
}

function animationReverse(event) {
    let currentCardClicked = event.currentTarget.closest(".user-story__all-content-box");
    let currentUserStoryBox = currentCardClicked.querySelector(".user-story__box");
    let currentMoveMenu = currentCardClicked.querySelector(".user-story__mobile-move-menu");
    let currentCenterButtonText = currentCardClicked.querySelector('.user-story__mobile-move-menu__center-button-text');
    currentCardClicked.querySelectorAll(".currentMoveMenu").forEach((element, index) => element.classList.remove(`delay-${index + 1}-open`, "open"));
    currentCardClicked.querySelectorAll(".user-story__mobile-move-menu__segment-text").forEach((element, index) => element.classList.add(`delay-${index + 1}-close`, "close"));
    currentCardClicked.querySelectorAll(".user-story__mobile-move-menu__segment").forEach((element, index) => element.classList.remove(`delay-${index + 1}-open`, "open"));
    currentCardClicked.querySelectorAll(".user-story__mobile-move-menu__segment").forEach((element, index) => element.classList.add(`delay-${index + 1}-close`, "close"));
    currentCardClicked.querySelector(".user-story__mobile-move-menu__center-button").classList.remove("open");
    currentCardClicked.querySelector(".user-story__mobile-move-menu__center-button").classList.add("close");
    fadeOutCenterButtonText(currentCenterButtonText);
    removeAnimationClassToTaskContent(currentUserStoryBox);
    resetAllClassesFromMoveMenu(currentCardClicked, currentUserStoryBox, currentMoveMenu);
}

function closeOtherMoveMenus(currentCenterButton) {
    const allButtons = document.querySelectorAll(".user-story__mobile-move-menu__center-button.open");
    allButtons.forEach(button => {
        if (button !== currentCenterButton) {
            animationReverse({ currentTarget: button });
        }
    });
}

function fadeOutCenterButtonText(currentCenterButtonText) {
    setTimeout(() => {
        currentCenterButtonText.classList.add('fade-out');
        setTimeout(() => {
            currentCenterButtonText.textContent = 'Move to';
            currentCenterButtonText.classList.remove('fade-out');
        }, 300);
    }, 100);
}

function resetAllClassesFromMoveMenu(currentCardClicked, currentUserStoryBox, currentMoveMenu) {
    setTimeout(() => {
        currentUserStoryBox.style.pointerEvents = "auto";
        currentMoveMenu.style.display = "none";
        currentCardClicked.querySelectorAll(".user-story__mobile-move-menu__segment-text").forEach((element, index) => element.classList.remove(`delay-${index + 1}-close`, "close"));
        currentCardClicked.querySelectorAll(".user-story__mobile-move-menu__segment-text").forEach((element, index) => element.classList.add(`delay-${index + 1}-open`, "open"));
        currentCardClicked.querySelectorAll(".user-story__mobile-move-menu__segment").forEach((element, index) => element.classList.remove(`delay-${index + 1}-close`, "close"));
        currentCardClicked.querySelectorAll(".user-story__mobile-move-menu__segment").forEach((element, index) => element.classList.add(`delay-${index + 1}-open`, "open"));
        currentCardClicked.querySelector(".user-story__mobile-move-menu__center-button").classList.remove("close");
        currentCardClicked.querySelector(".user-story__mobile-move-menu__center-button").classList.add("open");
    }, 1800);
}

async function moveTaskCardMobile(event, newMoveCategory, newMoveArray, newMoveCategoryName) {
    let currentCardClicked = event.currentTarget.closest(".user-story__all-content-box");
    let oldDragField = event.currentTarget.closest(".drag-field");
    cardId = currentCardClicked.querySelector(".user-story__box").id;
    currentCardId = currentCardClicked.querySelector(".user-story__box").id;
    oldCategoryName = oldDragField.getAttribute("data-category");
    oldArray = arrays[oldDragField.getAttribute("data-array")];
    oldCategory = oldDragField.id;
    newCategory = newMoveCategory;
    newArray = newMoveArray;
    newCategoryName = newMoveCategoryName;

    if (oldCategory === newCategory) {
        return;
    }
    findObjectInArrayAndSaveData(oldArray, newCategoryName);

    let index = oldArray.findIndex(element => element.id == currentCardId);

    newArray.push(oldArray.splice(index, 1)[0]);
    let taskCardObjectinNewArray = newArray.find(element => element.id == currentCardId);
    taskCardObjectinNewArray.category = newCategoryName;
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

    let putResponse = await putDataInDatabase(localStorage.getItem("userId"), currentCardId, currentTaskData.category, "category");
    if (!putResponse.ok) {
        console.error("Fehler beim Speichern des neuen Tasks:", putResponse.statusText);
        return; // Falls PUT fehlschlägt, nicht weitermachen!
    }
    await checkAllSubtasksOfTask(newCategory);
    setTimeout(() => {
        document.getElementById(currentCardId).scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById(currentCardId).classList.add('highlight-flash');
    }, 300);

    setTimeout(() => {
        document.getElementById(currentCardId).classList.remove('highlight-flash');
    }, 3300);
}

function createTaskOverlay() {
    removeError();
    let valid = validateInputs();
    let validDateFormat = testDate();
    let titleInput = document.getElementById("title");
    let descriptionInput = document.getElementById("description");
    if (valid && validDateFormat) {
        saveTaskOverlay()
        document.getElementById('overlay-task-added').classList.remove('d-none');
        setTimeout(() => {
            document.getElementById("add-task__overlay").classList.add("fade-out");
            init();
            clearSelectedContactsAndSubtasks();
            setTimeout(() => {
                document.getElementById('overlay-task-added').classList.add('d-none');
                let allUserStoryTitle = Array.from(document.querySelectorAll(".user-story__title"));
                let findNewCreateTask = allUserStoryTitle.find(element => {
                    let userStoryBox = element.closest(".user-story__box");
                    let description = userStoryBox.querySelector(".user-story__description");
                    return (
                        element.innerText.trim() === titleInput.value.trim() && description?.innerText.trim() === descriptionInput.value.trim()
                    )
                });
                if (findNewCreateTask) {
                    let currentNewCreateTaskId = findNewCreateTask.closest(".user-story__box").id;
                    document.getElementById(currentNewCreateTaskId).scrollIntoView({ behavior: 'smooth', block: 'center' });
                    document.getElementById(currentNewCreateTaskId).classList.add('highlight-flash');
                    setTimeout(() => {
                        document.getElementById(currentNewCreateTaskId).classList.remove('highlight-flash');
                    }, 3300);
                }
                document.getElementById("add-task__overlay").classList.remove("fade-out");
                document.getElementById('add-task__overlay').classList.toggle('d-none');
            }, 500);
        }, 900);
    } else if (!validDateFormat && document.getElementById('due-date').value !== "") {
        throwError();
        document.getElementById('invalid-date').classList.remove('hidden');
    } else {
        throwError();
    }
}
let categoryFromClickedButton = "";
function saveCategoryFromClickedButton(event) {
    categoryFromClickedButton = event.currentTarget.getAttribute("data-category");
}

function saveTaskOverlay() {
    if (!categoryFromClickedButton) return;
    task.category = categoryFromClickedButton;
    task.taskType = document.getElementById('category').value;
    task.taskTitle = document.getElementById('title').value;
    task.taskDescription = document.getElementById('description').value;
    task.taskPriority = selectedPriority;
    task.numberOfSubtasks = subtasksCount;
    task.numberOfCompletedSubtasks = 0;
    task.subtasks = subtasks;
    task.taskDueDate = document.getElementById('due-date').value;
    task.assignedContacts = selectedContacts;
    saveToFirebase("tasks/", task);
    task = {};
}

function fadeOutBigTaskCard() {
    document.getElementById("big-task-card__overlay").classList.add("fade-out");
    setTimeout(() => {
        document.getElementById("big-task-card__overlay").classList.remove("fade-out");
        document.getElementById('big-task-card__overlay').classList.toggle('d-none');
    }, "120");
}

function clearSelectedContactsAndSubtasks() {
    selectedContacts.length = 0;
    subtasks.length = 0;
}

function removeSessionStorageTaskCategory() {
    sessionStorage.removeItem("taskCategory");
}

function setSessionStorageTaskCategory(category) {
    sessionStorage.setItem("taskCategory", category);
}

async function loadAllDataFromDatabaseAndRenderSearchTasks() {
    await readFromDatabase(localStorage.getItem("userId"), "toDos", toDoArray, "to-do-drag-field");
    await readFromDatabase(localStorage.getItem("userId"), "inProgress", inProgressArray, "in-progress-drag-field");
    await readFromDatabase(localStorage.getItem("userId"), "awaitFeedback", awaitFeedbackArray, "await-feedback-drag-field");
    await readFromDatabase(localStorage.getItem("userId"), "done", doneArray, "done-drag-field");
    checkSearchWordAndLoadAllSearchTasks();
}