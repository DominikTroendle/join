/**
 * Moves a task card from one search category array to another and updates its category property.
 * After moving the task, this function updates the UI by re-rendering both the old and new category areas.
 *
 * @function
 * @returns {void} This function does not return a value.
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
 * Toggles between search mode states. If search mode is currently disabled, 
 * it enables it by calling `setSearchModeTrueAndChangeImg`. 
 * If search mode is enabled, it disables it and reinitializes the app by calling `setSearchModeFalseAndChangeImg` and `init`.
 *
 * @returns {void} This function does not return a value.
 */
function selectionOfWhichFunctionIsUsed() {
    if (searchMode === "false") {
        setSearchModeTrueAndChangeImg();
    } else {
        setSearchModeFalseAndChangeImg();
        init();
    }
}

/**
 * Checks the search word input and loads the corresponding search results for all task categories.
 * Clears previous search arrays, then searches through each task array to find matches with the search word.
 * It renders the search results in the appropriate drag fields and adjusts the height for the drag fields.
 *
 * @async
 * @function
 * @returns {Promise<void>} This function does not return any value, it operates asynchronously.
 */
async function checkSearchWordAndLoadAllSearchTasks() {
    let searchFieldInput = document.getElementById("search-field__input");
    let searchWord = searchFieldInput.value.trim();
    clearAllSearchArray();
    for (let index = 0; index < arrayNames.length; index++) {
        let originalArray = arrays[arrayNames[index]];
        let searchArray = searchArrays[searchArrayNames[index]];
        let dragField = document.getElementById(dragFieldIds[index]);
        searchTasksinArray(searchWord, index, originalArray, searchArray, dragField);
    }
    setHeightForDragFields();
}

/**
 * Searches for tasks in an array based on a search term and updates the display with the matching tasks.
 * It checks if the task title or description includes the search term and adds matching tasks to the `searchArray`.
 * If any matching tasks are found, it renders them using `renderSmallCard`. Otherwise, it displays a message indicating no results.
 *
 * @param {string} searchWord - The term to search for within the task title and description.
 * @param {number} index - The index of the current search field.
 * @param {Array<Object>} originalArray - The array of tasks to search through.
 * @param {Array<Object>} searchArray - The array that will hold the tasks that match the search criteria.
 * @param {HTMLElement} dragField - The HTML element where the search results will be rendered.
 */
function searchTasksinArray(searchWord, index, originalArray, searchArray, dragField) {
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

/**
 * Toggles the search mode to "true" and updates the UI to reflect the search state.
 * If the search field is not empty, it switches the `searchMode` to "true",
 * hides the search icon, and displays the close icon in the search field.
 *
 * @returns {void} This function does not return a value.
 */
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

/**
 * Closes the search mode when the search field is empty.
 * If the search field is cleared, it sets the `searchMode` to "false", 
 * updates the UI to reflect the changes, and re-initializes the application state.
 *
 * @returns {void} This function does not return a value.
 */
function closeSearchModeWhenInputIsEmpty() {
    let searchFieldInput = document.getElementById("search-field__input").value;
    if (searchFieldInput === "") {
        setSearchModeFalseAndChangeImg();
        init();
    }
}

/**
 * Disables the search mode by setting `searchMode` to "false", 
 * updates the UI to show the search icon and hide the close icon, 
 * and clears the input field.
 *
 * @returns {void} This function does not return a value.
 */
function setSearchModeFalseAndChangeImg() {
    searchMode = "false";
    document.getElementById("search-field__img").classList.remove("d-none");
    document.getElementById("search-field__close-img").classList.add("d-none");
    document.getElementById("search-field__input").value = "";
}

/**
 * Loads data from the database for various task categories and renders the search tasks.
 * This function fetches task data for the categories "toDos", "inProgress", "awaitFeedback", 
 * and "done" from the database, and then updates the corresponding arrays and drag fields.
 * After loading the data, it triggers the process of checking and loading the search tasks.
 * 
 * @async
 * @returns {Promise<void>} This function is asynchronous and does not return any value.
 * It modifies global arrays and updates the UI by rendering the search tasks.
 */
async function loadAllDataFromDatabaseAndRenderSearchTasks() {
    await readFromDatabase(localStorage.getItem("userId"), "toDos", toDoArray, "to-do-drag-field");
    await readFromDatabase(localStorage.getItem("userId"), "inProgress", inProgressArray, "in-progress-drag-field");
    await readFromDatabase(localStorage.getItem("userId"), "awaitFeedback", awaitFeedbackArray, "await-feedback-drag-field");
    await readFromDatabase(localStorage.getItem("userId"), "done", doneArray, "done-drag-field");
    checkSearchWordAndLoadAllSearchTasks();
}

/**
 * Removes the currently selected task from the given search results array,
 * but only if search mode is active.
 *
 * @param {Array} currentArraySearch - The array of search result tasks.
 *
 * This function checks if the global `searchMode` is set to "true". If so,
 * it finds the task with the ID stored in `currentTaskCardId` and removes it
 * from the provided array using `splice()`.
 */
function removeTaskFromSearchArray(currentArraySearch) {
    if (searchMode == "true") {
        let indexFromCurrentSearchTask = currentArraySearch.findIndex(element => element.id === currentTaskCardId);
        if (indexFromCurrentSearchTask !== -1) currentArraySearch.splice(indexFromCurrentSearchTask, 1);
    }
}