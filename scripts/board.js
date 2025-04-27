let currentDraggedElement;
let toDoArray2 = [
    {
        id: 1,
        taskType: "User Story",
        taskTitle: "Kochwelt Page & Recipe Recommender",
        taskDescription: "Build start page with recipe recommendation...",
        taskPriority: "medium",
        numberOfSubtasks: 2,
        numberOfCompletedSubtasks: 1,
        assignedContacts: [{ name: "Anton Meyer", color: "bg-purple" }, { name: "Emil Mandolf", color: "bg-rose" }, { name: "Moritz Buchholz", color: "bg-darkyellow" }]
    },
    {
        id: 2,
        taskType: "Technical Task",
        taskTitle: "HTML Base Template Creation",
        taskDescription: "Create reusable HTML base templates...",
        taskPriority: "low",
        numberOfSubtasks: 1,
        numberOfCompletedSubtasks: 0,
        assignedContacts: [{ name: "Anton Meyer", color: "bg-purple" }, { name: "Emil Mandolf", color: "bg-rose" }, { name: "Moritz Buchholz", color: "bg-darkyellow" }]
    }
];
let inProgressArray2 = [
    {
        id: 3,
        taskType: "User Story",
        taskTitle: "Daily Kochwelt Recipe",
        taskDescription: "Implement daily recipe and portion calculator...",
        taskPriority: "medium",
        numberOfSubtasks: 4,
        numberOfCompletedSubtasks: 2,
        assignedContacts: [{ name: "Anton Meyer", color: "bg-purple" }, { name: "Emil Mandolf", color: "bg-rose" }, { name: "Moritz Buchholz", color: "bg-darkyellow" }]
    },
    {
        id: 4,
        taskType: "Technical Task",
        taskTitle: "CSS Architecture Planning",
        taskDescription: "Define CSS naming conventions and structure...",
        taskPriority: "urgent",
        numberOfSubtasks: 6,
        numberOfCompletedSubtasks: 2,
        assignedContacts: [{ name: "Anton Meyer", color: "bg-purple" }, { name: "Emil Mandolf", color: "bg-rose" }, { name: "Moritz Buchholz", color: "bg-darkyellow" }]
    }
];
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
let searchMode = "false";

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


function changeImgSource(id, imgSource) {
    imgId = document.getElementById(id)
    imgId.src = imgSource;
}

function startDragging(id) {
    currentDraggedElement = id;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(event, dragFieldId, dragFieldArray) {
    cardId = event.currentTarget.id;
    oldCategory = dragFieldId;
    oldCategoryName = event.currentTarget.getAttribute("data-category")
    oldArray = dragFieldArray;
    const img = new Image();  // Leeres Bild erstellen
    img.src = '';             // Keine sichtbare Quelle
    event.dataTransfer.setDragImage(img, 0, 0);
}

async function allowDrop2(event, dragFieldArray) {
    newCategory = event.currentTarget.id;
    newArray = dragFieldArray;
    newCategoryName = event.currentTarget.getAttribute("data-category");

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
    checkAllSubtasksOfTask(newCategory);
}

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

function saveCurrentCardId(event) {
    currentCardId = event.currentTarget.id;
}

function clearAllArray() {
    toDoArray = [];
    inProgressArray = [];
    awaitFeedbackArray = [];
    doneArray = [];
}

function clearAllSearchArray() {
    toDoArraySearch.length = 0;
    inProgressArraySearch.length = 0;
    awaitFeedbackArraySearch.length = 0;
    doneArraySearch.length = 0;
}

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

function addDragRotation(event) {
    let currentDragCard = document.getElementById(event.currentTarget.id);
    currentDragCard.classList.add("drag-start-transform");
}

function removeDragRotation(event) {
    let currentDragCard = document.getElementById(event.currentTarget.id);
    currentDragCard.classList.remove("drag-start-transform");
}

let originDragField = null; // Speichert das ursprüngliche Drag-Feld

function onDragStart(event) {
    originDragField = event.currentTarget.closest(".drag-field"); // Speichert das ursprüngliche Feld
    // document.body.style.cursor = "grabbing";
}

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

function removeCardBorderBox() {
    dragFieldIds.forEach(element => {
        let dragField = document.getElementById(element);
        let cardBorderBox = dragField.querySelector("#card-border-box");
        if (cardBorderBox) {
            cardBorderBox.remove();
        }
    });
}

function activatePointerEventsForAllTasks() {
    const tasks = document.querySelectorAll(".user-story__all-content-box");
    tasks.forEach(task => task.style.pointerEvents = "auto");
}

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


function toggleDnoneBigTaskCard() {
    document.getElementById("big-task-card__overlay").classList.toggle("d-none");
}

function addClassSlideBack() {
    document.getElementById("big-task-card__box").classList.add("slide-back")
    setTimeout(() => {
        toggleDnoneBigTaskCard();
        document.getElementById("big-task-card__box").classList.remove("slide-back")
        clearTimeout();
    }, 120);
}

function toggleDnoneCheckbox(idRectangleOpen, idRectangleClose, idHook) {
    let rectangleOpen = document.getElementById(idRectangleOpen);
    let rectangleClose = document.getElementById(idRectangleClose);
    let hook = document.getElementById(idHook);
    rectangleOpen.classList.toggle("d-none");
    rectangleClose.classList.toggle("d-none");
    hook.classList.toggle("d-none");
}

const arrays = {
    toDoArray: toDoArray,
    inProgressArray: inProgressArray,
    awaitFeedbackArray: awaitFeedbackArray,
    doneArray: doneArray
};

function renderContentBigTaskCard(event) {
    currentTaskCardId = event.currentTarget.id;
    currentArrayName = event.currentTarget.closest(".drag-field").dataset.array;
    currentArray = arrays[currentArrayName];
    currentDragFieldId = event.currentTarget.closest(".drag-field").id;
    let objectFromCurrentSmallTaskCard = currentArray.find(element => element.id == currentTaskCardId);

    let bigTaskCard = document.getElementById("big-task-card__box");
    bigTaskCard.innerHTML = bigTaskCardTemplate(objectFromCurrentSmallTaskCard.id, objectFromCurrentSmallTaskCard.taskType, objectFromCurrentSmallTaskCard.taskTitle, objectFromCurrentSmallTaskCard.taskDescription, objectFromCurrentSmallTaskCard.taskPriority, objectFromCurrentSmallTaskCard.taskDueDate, objectFromCurrentSmallTaskCard.numberOfSubtasks, objectFromCurrentSmallTaskCard.numberOfCompletedSubtasks, objectFromCurrentSmallTaskCard.assignedContacts, objectFromCurrentSmallTaskCard.subtasks);
}

function renderContentBigTaskCardEdit() {
    let selectedArray = searchMode === "true" ? searchArrays[currentArrayName + "Search"] : currentArray;
    let bigTaskCard = document.getElementById("big-task-card__box");
    let objectFromCurrentSmallTaskCard = selectedArray.find(element => element.id == currentTaskCardId);
    bigTaskCard.innerHTML = bigTaskCardEditTemplate(objectFromCurrentSmallTaskCard.id, objectFromCurrentSmallTaskCard.taskType, objectFromCurrentSmallTaskCard.taskTitle, objectFromCurrentSmallTaskCard.taskDescription, objectFromCurrentSmallTaskCard.taskPriority, objectFromCurrentSmallTaskCard.taskDueDate, objectFromCurrentSmallTaskCard.numberOfSubtasks, objectFromCurrentSmallTaskCard.numberOfCompletedSubtasks, objectFromCurrentSmallTaskCard.assignedContacts, objectFromCurrentSmallTaskCard.subtasks);
}

async function init() {
    setSearchModeFalseAndChangeImg();
    await syncAllContactsWithTasks(localStorage.getItem("userId"));
    await readFromDatabase(localStorage.getItem("userId"), "toDos", toDoArray, "to-do-drag-field");
    await readFromDatabase(localStorage.getItem("userId"), "inProgress", inProgressArray, "in-progress-drag-field");
    await readFromDatabase(localStorage.getItem("userId"), "awaitFeedback", awaitFeedbackArray, "await-feedback-drag-field");
    await readFromDatabase(localStorage.getItem("userId"), "done", doneArray, "done-drag-field");
    setHeightForDragFields();
}

const BASE_URL = "https://join-user-default-rtdb.europe-west1.firebasedatabase.app";
async function readFromDatabase(userKey, category, categoryArray, dragFieldId) {
    try {
        let result = await fetch(`${BASE_URL}/users/${userKey}/tasks.json`);
        if (!result.ok) {
            throw new Error(`Fehler beim Abrufen der Daten: ${result.statusText}`);
        }
        let data = await result.json();
        categoryArray.length = 0;
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
        if (categoryArray.length !== 0) {
            renderSmallCard(dragFieldId, categoryArray);
        } else {
            document.getElementById(dragFieldId).innerHTML = noCardTemplate(categorysObject[category], searchMode);
        }
    } catch (error) {
        console.error("error loading the data:", error);
    }
}

async function postDataInDatabase(userKey, data) {
    let response = await fetch(`${BASE_URL}/users/${userKey}/tasks/.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        let result = await response.json();
        console.log("Daten erfolgreich gespeichert:", result);
    } else {
        console.error("Fehler beim Speichern:", response.statusText);
    }
}

function changeTaskCategoryinDatabase(event) {
    taskCardId = event.currentTarget.id;
    taskCardObject = toDoArray.find(element => element.id == taskCardId);
}

async function deleteInDatabase(userKey, cardId) {
    let response = await fetch(`${BASE_URL}/users/${userKey}/tasks/${cardId}.json`, {
        method: "DELETE"
    })
    if (!response.ok) {
        console.error("error when saving:", response.statusText);
    }
    return response
}

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
        if (!objectFromCurrentSmallTaskCard) {
            return;
        }
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
        renderSmallCard("done-drag-field", currentDoneArray);
        let putResponse2 = await putDataInDatabase(localStorage.getItem("userId"), currentCardId, newNumberOfSubtasksCompleted, "numberOfCompletedSubtasks");
            if (!putResponse2.ok) {
                console.error("error when saving:", putResponse2.statusText);
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
//postDataInDatabase("guest", data);

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
}

async function loadAllSearchTasks() {
    for (let index = 0; index < arrayNames.length; index++) {
        let searchArray = searchArrays[searchArrayNames[index]];
        let dragField = document.getElementById(dragFieldIds[index]);
        if (searchArray.length !== 0) {
            renderSmallCard(dragFieldIds[index], searchArray);
        } else {
            dragField.innerHTML = noCardTemplate(categorys[index], searchMode);
        }
    }
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
    let selectedArray = searchMode === "true" ? searchArrays[currentArrayName + "Search"] : currentArray;
    console.log(currentArrayName);
    let valid = validateInputsForBigTaskCardEdit();
    let validDateFormat = testDateForBigTaskCardEdit();
    if (valid && validDateFormat) {
        let taskCardObject = selectedArray.find(element => element.id === currentTaskCardId);
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
        searchMode === "true" ? loadAllSearchTasks() : init();
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

        console.log("Tasks erfolgreich aktualisiert.");
    } catch (error) {
        console.error("Fehler beim Speichern der Tasks:", error);
    }
}

function openMobileMoveMenu(event) {
    let currentCardClicked = event.currentTarget.closest(".user-story__all-content-box");
    let currentUserStoryBox = currentCardClicked.querySelector(".user-story__box");
    let currentMoveMenu = currentCardClicked.querySelector(".user-story__mobile-move-menu");
    let currentCenterButtonText = currentCardClicked.querySelector('.user-story__mobile-move-menu__center-button-text');
    event.stopPropagation();
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
    checkAllSubtasksOfTask(newCategory);
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