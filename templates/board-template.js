function smallCardTemplate(id) {
    return `<div class="user-story__box" id="${id}" draggable="true" ondragstart="startDragging(${id}); changeDragRotation(event)">
                <div class="user-story__category-box">
                    <span class="user-story__category-text">User Story</span>
                </div>
                <span class="user-story__title">Kochwelt Page & Recipe Recommender</span>
                <span class="user-story__discription">Build start page with recipe recommendation...</span>
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

function noCardTemplate() {
    return `<div class="no-task-box">
                <span class="no-task-text">No tasks To do</span>
            </div>`
}