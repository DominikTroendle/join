function smallCardTemplate(id, taskType, taskTitle, taskDiscription) {
    let taskTypeCssClass = taskType == "User Story" ? `user-story__category-box-user-story`
        : `user-story__category-box-technical-task`;

    return `<div class="user-story__box" id="${id}" draggable="true" ondragstart="startDragging(${id}); changeDragRotation(event)">
                <div class="user-story__category-box ${taskTypeCssClass}">
                    <span class="user-story__category-text">${taskType}</span>
                </div>
                <span class="user-story__title">${taskTitle}</span>
                <span class="user-story__discription">${taskDiscription}</span>
                <div class="user-story__scale-text-box">
                    <div class="user-story__subtask-scale-box">
                        <div class="user-story__subtask-scale-fill"></div>
                    </div>
                    <span class="user-story__subtask-text">1/2 Subtasks</span>
                </div>
                <div class="user-story__name-priority-box">
                    <div class="user-story__name-box">
                        <span class="user-story__name background-color-1">AM</span>
                        <span class="user-story__name background-color-2">EM</span>
                        <span class="user-story__name background-color-3">MB</span>
                    </div>
                    <img class="user-story__img" src="assets/icons/Priority symbols.png" alt="">
                </div>
            </div>`
}

function noCardTemplate(category) {
    return `<div class="no-task-box">
                <span class="no-task-text">No tasks ${category}</span>
            </div>`
}

function cardBorderdragEnterTemplate() {
    return `<div class="card-border-box" id="card-border-box">
            </div>`
}