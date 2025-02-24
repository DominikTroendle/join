let currentDraggedElement;
let toDoArray = [
    {
        id: 1,
        taskType: "User Story",
        taskTitle: "Kochwelt Page & Recipe Recommender",
        taskDescription: "Build start page with recipe recommendation...",
        taskPriority: "medium",
        numberOfSubtasks: 2,
        numberOfCompletedSubtasks: 1,
        assignedContacts: [{name: "Anton Meyer", color: "bg-purple"}, {name: "Emil Mandolf", color: "bg-rose"}, {name: "Moritz Buchholz", color: "bg-darkyellow"}]
    },
    {
        id: 2,
        taskType: "Technical Task",
        taskTitle: "HTML Base Template Creation",
        taskDescription: "Create reusable HTML base templates...",
        taskPriority: "low",
        numberOfSubtasks: 1,
        numberOfCompletedSubtasks: 0,
        assignedContacts: [{name: "Anton Meyer", color: "bg-purple"}, {name: "Emil Mandolf", color: "bg-rose"}, {name: "Moritz Buchholz", color: "bg-darkyellow"}]
    }
];
let inProgressArray = [
    {
        id: 3,
        taskType: "User Story",
        taskTitle: "Daily Kochwelt Recipe",
        taskDescription: "Implement daily recipe and portion calculator...",
        taskPriority: "medium",
        numberOfSubtasks: 4,
        numberOfCompletedSubtasks: 2,
        assignedContacts: [{name: "Anton Meyer", color: "bg-purple"}, {name: "Emil Mandolf", color: "bg-rose"}, {name: "Moritz Buchholz", color: "bg-darkyellow"}]
    },
    {
        id: 4,
        taskType: "Technical Task",
        taskTitle: "CSS Architecture Planning",
        taskDescription: "Define CSS naming conventions and structure...",
        taskPriority: "urgent",
        numberOfSubtasks: 6,
        numberOfCompletedSubtasks: 2,
        assignedContacts: [{name: "Anton Meyer", color: "bg-purple"}, {name: "Emil Mandolf", color: "bg-rose"}, {name: "Moritz Buchholz", color: "bg-darkyellow"}]
    }
];
let awaitFeedbackArray = [];
let doneArray = [];
let oldArray = [];
let newArray = [];
let oldCategory;
let oldCategoryName;
let newCategory;
let cardId;

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

function allowDrop2(event, dragFieldArray) {
    newCategory = event.currentTarget.id;
    newArray = dragFieldArray;

    let index = oldArray.findIndex(element => element.id == cardId);
    newArray.push(oldArray.splice(index, 1)[0]);
    if (oldArray.length !== 0) {
        renderSmallCard(oldCategory, oldArray);
    } else {
        document.getElementById(oldCategory).innerHTML = noCardTemplate(oldCategoryName);
    }

    renderSmallCard(newCategory, newArray);
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
renderSmallCard("to-do-drag-field", toDoArray);
renderSmallCard("in-progress-drag-field", inProgressArray);

function changeDragRotation(event) {
    let currentDragCard = document.getElementById(event.currentTarget.id);
    currentDragCard.classList.add("drag-start-transform");
}

// function createBorderCardForDragEntered(event) {
//     document.getElementById(event.currentTarget.id).innerHTML += cardBorderdragEnterTemplate();
// }

// function createBorderCardForDragEntered(event) {
//     const target = document.getElementById(event.currentTarget.id);

//     // Prüfe, ob die card-border-box schon existiert
//     if (!target.querySelector("#card-border-box")) {
//         target.innerHTML += cardBorderdragEnterTemplate();
//     }
// }

let originDragField = null; // Speichert das ursprüngliche Drag-Feld

function onDragStart(event) {
    originDragField = event.currentTarget.closest(".drag-field"); // Speichert das ursprüngliche Feld
    document.body.style.cursor = "grabbing";
}

function createBorderCardForDragEntered(event) {
    const target = document.getElementById(event.currentTarget.id);

    // Falls es das Ursprungsfeld ist, keine Umrandung hinzufügen
    if (target === originDragField) return;

    // Prüfen, ob die Umrandung schon existiert
    if (!target.querySelector("#card-border-box")) {
        target.innerHTML += cardBorderdragEnterTemplate();
    }
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

function renderContentBigTaskCard() {
    let bigTaskCard = document.getElementById("big-task-card__box");
    bigTaskCard.innerHTML = bigTaskCardTemplate();
}

function renderContentBigTaskCardEdit() {
    let bigTaskCard = document.getElementById("big-task-card__box");
    bigTaskCard.innerHTML = bigTaskCardEditTemplate();
}

function test() {
    // fetch("https://remotestorage-4c4b1-default-rtdb.europe-west1.firebasedatabase.app/toDos.json")
    // .then(response => response.json())
    // .then(data => console.log(data))
    // .catch(error => console.error("Fehler beim Abrufen:", error));

    // fetch("https://remotestorage-4c4b1-default-rtdb.europe-west1.firebasedatabase.app/inProgress.json", {
    //     method: "PATCH",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //         "2": {
    //             id: 2,
    //             taskType: "User Story",
    //             taskTitle: "Kochwelt Page & Recipe Recommender",
    //             taskDescription: "Build start page with recipe recommendation..."
    //         }
    //     })
    // })
    // .then(response => response.json())
    // .then(data => console.log("Daten gespeichert:", data))
    // .catch(error => console.error("Fehler beim Speichern:", error));
    toDoArray = [];
    console.log("Array leer machen: " + toDoArray);
    fetch("https://remotestorage-4c4b1-default-rtdb.europe-west1.firebasedatabase.app/inProgress.json")
        .then(response => response.json())
        .then(data => {
            if (data) {
                const toDoArray = Object.values(data); // Objekt in ein Array umwandeln
                console.log(toDoArray);
            } else {
                console.log("Keine Daten gefunden.");
            }
        })
        .catch(error => console.error("Fehler beim Abrufen:", error));

}

// test();
