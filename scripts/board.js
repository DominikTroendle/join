let currentDraggedElement;
let toDoArray = [{ id: 1 }, { id: 2 }];
let inProgressArray = [];
let awaitFeedbackArray = [];
let doneArray = [];
let oldArray = [];
let newArray = [];
let oldCategory;
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
    oldArray = dragFieldArray;
}

function allowDrop2(event, dragFieldArray) {
    newCategory = event.currentTarget.id;
    newArray = dragFieldArray;

    let index = oldArray.findIndex(element => element.id == cardId);
    newArray.push(oldArray.splice(index, 1)[0]);
    if (oldArray.length !== 0) {
        renderSmallCard(oldCategory, oldArray);
    }else {
        document.getElementById(oldCategory).innerHTML = noCardTemplate();
    }
    
    renderSmallCard(newCategory, newArray);
}

function renderSmallCard(dragFieldId, dragFieldArray) {
    if (dragFieldArray.length != 0) {
        let dragField = document.getElementById(dragFieldId);
        dragField.innerHTML = "";
        for (let index = 0; index < dragFieldArray.length; index++) {
            dragField.innerHTML += smallCardTemplate(dragFieldArray[index].id)
        }
    }
}
renderSmallCard("to-do-drag-field", toDoArray);

function changeDragRotation(event) {
    let currentDragCard = document.getElementById(event.currentTarget.id);
    currentDragCard.classList.add("drag-start-transform");
}

