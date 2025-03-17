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
    let newCategoryName = event.currentTarget.getAttribute("data-category");

    if (oldCategory === newCategory) {
        return;
    }
    findObjectInArrayAndSaveData(oldArray, newCategoryName);

    let index = oldArray.findIndex(element => element.id == currentCardId);

    newArray.push(oldArray.splice(index, 1)[0]);
    let taskCardObjectinNewArray = newArray.find(element => element.id == currentCardId);
    taskCardObjectinNewArray.category = newCategoryName;
    if (oldArray.length !== 0) {
        renderSmallCard(oldCategory, oldArray);
    } else {
        document.getElementById(oldCategory).innerHTML = noCardTemplate(categorysObject[oldCategoryName]);
    }

    renderSmallCard(newCategory, newArray);

    let putResponse = await putDataInDatabase(localStorage.getItem("userId"), currentCardId, currentTaskData.category, "category");
    if (!putResponse.ok) {
        console.error("Fehler beim Speichern des neuen Tasks:", putResponse.statusText);
        return; // Falls PUT fehlschlägt, nicht weitermachen!
    }
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
            dragField.innerHTML += smallCardTemplate(dragFieldArray[index].id, dragFieldArray[index].taskType, dragFieldArray[index].taskTitle, dragFieldArray[index].taskDescription, dragFieldArray[index].taskPriority, dragFieldArray[index].numberOfSubtasks, dragFieldArray[index].numberOfCompletedSubtasks, dragFieldArray[index].assignedContacts)
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

function createBorderCardForDragEntered(event) {

    const target = document.getElementById(event.currentTarget.id);
    let currentCard = document.getElementById(currentCardId);
    // Falls es das Ursprungsfeld ist, keine Umrandung hinzufügen
    if (target === originDragField) return;

    // Prüfen, ob die Umrandung schon existiert
    if (!target.querySelector("#card-border-box")) {
        target.innerHTML += cardBorderdragEnterTemplate(currentCard.offsetHeight);
    }
}

function removeBorderCard(event) {
    // if (isBorderActive) {
    //     const target = event.currentTarget;

    //     const borderBox = target.querySelector("#card-border-box");
    //     if (borderBox) {
    //         borderBox.remove();  // Element entfernen
    //         isBorderActive = false;
    //     }
    // }
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
    let bigTaskCard = document.getElementById("big-task-card__box");
    let objectFromCurrentSmallTaskCard = currentArray.find(element => element.id == currentTaskCardId);
    bigTaskCard.innerHTML = bigTaskCardEditTemplate(objectFromCurrentSmallTaskCard.id, objectFromCurrentSmallTaskCard.taskType, objectFromCurrentSmallTaskCard.taskTitle, objectFromCurrentSmallTaskCard.taskDescription, objectFromCurrentSmallTaskCard.taskPriority, objectFromCurrentSmallTaskCard.taskDueDate, objectFromCurrentSmallTaskCard.numberOfSubtasks, objectFromCurrentSmallTaskCard.numberOfCompletedSubtasks, objectFromCurrentSmallTaskCard.assignedContacts, objectFromCurrentSmallTaskCard.subtasks);
}

function init() {
    // clearAllArray();

    readFromDatabase(localStorage.getItem("userId"), "toDos", toDoArray, "to-do-drag-field");
    readFromDatabase(localStorage.getItem("userId"), "inProgress", inProgressArray, "in-progress-drag-field");
    readFromDatabase(localStorage.getItem("userId"), "awaitFeedback", awaitFeedbackArray, "await-feedback-drag-field");
    readFromDatabase(localStorage.getItem("userId"), "done", doneArray, "done-drag-field");
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
            document.getElementById(dragFieldId).innerHTML = noCardTemplate(categorysObject[category]);
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
    let objectFromCurrentSmallTaskCard = currentArray.find(element => element.id == currentTaskCardId);
    let newNumberOfSubtasksCompleted = objectFromCurrentSmallTaskCard.subtasks.filter(element => element.checked === "true").length;
    objectFromCurrentSmallTaskCard.numberOfCompletedSubtasks = newNumberOfSubtasksCompleted
    let putResponse = await putDataInDatabase(localStorage.getItem("userId"), currentTaskCardId, newNumberOfSubtasksCompleted, "numberOfCompletedSubtasks");
    renderSmallCard(currentDragFieldId, currentArray);
    if (!putResponse.ok) {
        console.error("error when saving:", putResponse.statusText);
        return;
    }
}

async function deleteCurrentTask() {
    let indexFromCurrentTask = currentArray.findIndex(element => element.id === currentTaskCardId);
    if (indexFromCurrentTask !== -1) {
        currentArray.splice(indexFromCurrentTask, 1);
    }
    renderSmallCard(currentDragFieldId, currentArray);
    addClassSlideBack();
    let deleteResponse = await deleteInDatabase(localStorage.getItem("userId"), currentTaskCardId);
    if (!deleteResponse.ok) {
        console.error("error when saving:", putResponse.statusText);
        return;
    }
}

let data = {
    category: "toDos",
    taskType: "Technical Task",
    taskTitle: "CSS Architecture Planning",
    taskDescription: "Define CSS naming conventions and structure...",
    taskPriority: "urgent",
    numberOfSubtasks: 6,
    numberOfCompletedSubtasks: 2,
    assignedContacts: [{ name: "Anton Meyer", color: "bg-purple" }, { name: "Emil Mandolf", color: "bg-rose" }, { name: "Moritz Buchholz", color: "bg-darkyellow" }]
}
//postDataInDatabase("guest", data);

async function checkSearchWordAndLoadAllSearchTasks() {
    let searchFieldInput = document.getElementById("search-field__input");
    let searchWord = searchFieldInput.value.trim();
    clearAllSearchArray();
    if (searchWord.length >= 3) {
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
                dragField.innerHTML = noCardTemplate(categorys[index]);
            }
        }
    }
}

// Funktion zum Öffnen des Overlays und Laden einer externen HTML-Seite
function openOverlay() {
    fetch("add-task.html") // Hole die HTML-Seite über die URL
        .then(response => {
            if (!response.ok) {
                throw new Error('Fehler beim Laden der Seite');
            }
            return response.text(); // Holen des HTML-Inhalts als Text
        })
        .then(data => {
            // Setze den erhaltenen HTML-Inhalt in das Popup
            document.getElementById("big-task-card__box").innerHTML = data;
            // Zeige das Overlay an
            document.getElementById("big-task-card__overlay").classList.remove("d-none");
        })
        .catch(error => {
            console.error("Fehler beim Laden der HTML-Seite:", error);
        });
}

// Funktion zum Schließen des Overlays
function closeOverlay() {
    // Leere den Inhalt des Popups, wenn es geschlossen wird
    document.getElementById("popupContent").innerHTML = "";
    // Verstecke das Overlay
    document.getElementById("overlay").style.display = "none";
}
