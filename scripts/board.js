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

let isBorderActive = false

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
        document.getElementById(oldCategory).innerHTML = noCardTemplate(oldCategoryName);
    }

    renderSmallCard(newCategory, newArray);

    let putResponse = await putDataInDatabase(localStorage.getItem("userId"), currentCardId, currentTaskData);
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
    let smallTaskCardId = event.currentTarget.id;
    let currentArrayName = event.currentTarget.closest(".drag-field").dataset.array;
    let currentArray = arrays[currentArrayName];
    let objectFromCurrentSmallTaskCard = currentArray.find(element => element.id == smallTaskCardId);

    let bigTaskCard = document.getElementById("big-task-card__box");
    bigTaskCard.innerHTML = bigTaskCardTemplate(objectFromCurrentSmallTaskCard.id, objectFromCurrentSmallTaskCard.taskType, objectFromCurrentSmallTaskCard.taskTitle, objectFromCurrentSmallTaskCard.taskDescription, objectFromCurrentSmallTaskCard.taskPriority, objectFromCurrentSmallTaskCard.taskDuoDate , objectFromCurrentSmallTaskCard.numberOfSubtasks, objectFromCurrentSmallTaskCard.numberOfCompletedSubtasks, objectFromCurrentSmallTaskCard.assignedContacts);
}

function renderContentBigTaskCardEdit() {
    let bigTaskCard = document.getElementById("big-task-card__box");
    bigTaskCard.innerHTML = bigTaskCardEditTemplate();
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
                console.log
                if (value.category === category) {
                    value.id = firebaseKey;

                    if (!value.assignedContacts) {
                        value.assignedContacts = [];
                    }
                    categoryArray.push(value);
                }
            });
        }
        renderSmallCard(dragFieldId, categoryArray);
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

async function deleteInDatabase(userKey, category, firebaseId) {
    let response = await fetch(`${BASE_URL}/users/${userKey}/tasks/${category}/${firebaseId}.json`, {
        method: "DELETE"
    })
    return response
}

async function putDataInDatabase(userKey, cardId, data) {
    let response = await fetch(`${BASE_URL}/users/${userKey}/tasks/${cardId}/category.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.category)
    });
    if (!response.ok) {
        console.error("error when saving:", response.statusText);
    }
    return response;
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
// postDataInDatabase("guest", data);