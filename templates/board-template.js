function smallCardTemplate(id, taskType, taskTitle, taskDescription, taskPriority) {
    let taskTypeCssClass = taskType == "User Story" ? `user-story__category-box-user-story`
        : `user-story__category-box-technical-task`;

    const priorityMapping = [
        {
            priority: "low",
            src: "assets/icons/low.svg"
        },
        {
            priority: "medium",
            src: "assets/icons/medium.svg"
        },
        {
            priority: "urgent",
            src: "assets/icons/urgent.svg"
        }
    ];

    let taskPriorityImgSrc = priorityMapping.find(element => element.priority == taskPriority)?.src;

    return `<div class="user-story__box" id="${id}" draggable="true" ondragstart="startDragging(${id}); changeDragRotation(event)" onclick="toggleDnoneBigTaskCard(); renderContentBigTaskCard()">
                <div class="user-story__category-box ${taskTypeCssClass}">
                    <span class="user-story__category-text">${taskType}</span>
                </div>
                <span class="user-story__title">${taskTitle}</span>
                <span class="user-story__discription">${taskDescription}</span>
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
                    <img class="user-story__img" src="${taskPriorityImgSrc}" alt="">
                </div>
            </div>`;
}

function noCardTemplate(category) {
    return `<div class="no-task-box">
                <span class="no-task-text">No tasks ${category}</span>
            </div>`;
}

function cardBorderdragEnterTemplate() {
    return `<div class="card-border-box" id="card-border-box">
            </div>`;
}

function bigTaskCardTemplate() {
    return `    <div class="big-task-card__task-type-text-button-box">
                    <div class="big-task-card__task-type-text-box">
                        <span class="big-task-card__task-type-text">User Story</span>
                    </div>
                    <button class="big-task-card__task-type-button" onclick="addClassSlideBack()">x</button>
                </div>
                <div class="big-task-card__title-box">
                    <span class="big-task-card__title">Kochwelt Page & Recipe Recommender</span>
                </div>
                <div class="big-task-card__task-description-box">
                    <span class="big-task-card__task-description-text">Build start page with recipe
                        recommendation</span>
                </div>
                <div class="big-task-card__due-date-box">
                    <span class="big-task-card__due-date-text">Due date:</span>
                    <span class="big-task-card__due-date-text">10/05/2023</span>
                </div>
                <div class="big-task-card__priority-box">
                    <span class="big-task-card__priority-text">Priority:</span>
                    <div class="big-task-card__priority-text-img-box">
                        <span class="big-task-card__priority-text">Medium</span>
                        <img class="big-task-card__priority-img" src="assets/icons/medium.svg" alt="">
                    </div>
                </div>
                <div class="big-task-card__assigned-to-box">
                    <div class="big-task-card__assigned-to-text-box">
                        <span class="big-task-card__assigned-to-text">Assigned To:</span>
                    </div>
                    <div class="big-task-card__assigned-to-names-box">
                        <div class="big-task-card__initials-name-box">
                            <span class="big-task-card__initials bg-color-1">EM</span>
                            <span class="big-task-card__name">Emmanuel Mauer</span>
                        </div>
                        <div class="big-task-card__initials-name-box">
                            <span class="big-task-card__initials bg-color-2">MB</span>
                            <span class="big-task-card__name">Marcel Bauer</span>
                        </div>
                        <div class="big-task-card__initials-name-box">
                            <span class="big-task-card__initials bg-color-3">AM</span>
                            <span class="big-task-card__name">Anton Mayer</span>
                        </div>
                    </div>
                </div>
                <div class="big-task-card__subtasks-box">
                    <div class="big-task-card__subtasks-title-box">
                        <span class="big-task-card__subtasks-title">Subtasks</span>
                    </div>
                    <div class="big-task-card__all-subtasks-box">
                        <div class="big-task-card__subtasks-check-text-box">
                            <svg class="big-task-card__checkbox"
                                onclick="toggleDnoneCheckbox('rectangle-open-checkbox1', 'rectangle-close-checkbox1', 'hook-checkbox1')"
                                width="25" height="25" viewBox="0 0 25 25" fill="none">
                                <path class="d-none" id="rectangle-open-checkbox1"
                                    d="M20.6821 11.3967V17.3967C20.6821 19.0536 19.339 20.3967 17.6821 20.3967H7.68213C6.02527 20.3967 4.68213 19.0536 4.68213 17.3967V7.39673C4.68213 5.73987 6.02527 4.39673 7.68213 4.39673H15.6821"
                                    stroke="#2A3647" stroke-width="2" stroke-linecap="round" />
                                <path class="" id="rectangle-close-checkbox1"
                                    d="M7.68213 4.39673H17.6821C19.339 4.39673 20.6821 5.73987 20.6821 7.39673V17.3967C20.6821 19.0536 19.339 20.3967 17.6821 20.3967H7.68213C6.02527 20.3967 4.68213 19.0536 4.68213 17.3967V7.39673C4.68213 5.73987 6.02527 4.39673 7.68213 4.39673Z"
                                    stroke="#2A3647" stroke-width="2" stroke-linecap="round" fill="none" />
                                <path class="d-none" id="hook-checkbox1"
                                    d="M8.68213 12.3967L12.6821 16.3967L20.6821 4.89673" stroke="#2A3647"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <span class="big-task-card__subtasks-text">Implement Recipe Recommendation</span>
                        </div>
                        <div class="big-task-card__subtasks-check-text-box">
                            <svg class="big-task-card__checkbox"
                                onclick="toggleDnoneCheckbox('rectangle-open-checkbox2', 'rectangle-close-checkbox2', 'hook-checkbox2')"
                                width="25" height="25" viewBox="0 0 25 25" fill="none">
                                <path class="d-none" id="rectangle-open-checkbox2"
                                    d="M20.6821 11.3967V17.3967C20.6821 19.0536 19.339 20.3967 17.6821 20.3967H7.68213C6.02527 20.3967 4.68213 19.0536 4.68213 17.3967V7.39673C4.68213 5.73987 6.02527 4.39673 7.68213 4.39673H15.6821"
                                    stroke="#2A3647" stroke-width="2" stroke-linecap="round" />
                                <path class="" id="rectangle-close-checkbox2"
                                    d="M7.68213 4.39673H17.6821C19.339 4.39673 20.6821 5.73987 20.6821 7.39673V17.3967C20.6821 19.0536 19.339 20.3967 17.6821 20.3967H7.68213C6.02527 20.3967 4.68213 19.0536 4.68213 17.3967V7.39673C4.68213 5.73987 6.02527 4.39673 7.68213 4.39673Z"
                                    stroke="#2A3647" stroke-width="2" stroke-linecap="round" fill="none" />
                                <path class="d-none" id="hook-checkbox2"
                                    d="M8.68213 12.3967L12.6821 16.3967L20.6821 4.89673" stroke="#2A3647"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <span class="big-task-card__subtasks-text">Start Page Layout</span>
                        </div>
                    </div>
                </div>
                <div class="big-task-card__button-box">
                    <button class="big-task-card__button">
                        <svg class="big-task-card__button-img" width="25" height="25" viewBox="0 0 25 25" fill="none">
                            <path
                                d="M7.7 21.4c-.55 0-1.02-.2-1.41-.59-.39-.39-.59-.86-.59-1.41V6.4h-.01a1 1 0 0 1 0-2h4V4.4c0-.28.1-.52.29-.71.19-.19.43-.29.71-.29h4c.28 0 .52.1.71.29.19.19.29.43.29.71h4a1 1 0 0 1 0 2h-.41v13c0 .55-.2 1.02-.59 1.41-.39.39-.86.59-1.41.59H7.7ZM7.7 6.4v13h10v-13h-10Zm2 10c0 .28.1.52.29.71.19.19.43.29.71.29s.52-.1.71-.29c.19-.19.29-.43.29-.71v-7c0-.28-.1-.52-.29-.71-.19-.19-.43-.29-.71-.29s-.52.1-.71.29c-.19.19-.29.43-.29.71v7Zm4 0c0 .28.1.52.29.71.19.19.43.29.71.29s.52-.1.71-.29c.19-.19.29-.43.29-.71v-7c0-.28-.1-.52-.29-.71-.19-.19-.43-.29-.71-.29s-.52.1-.71.29c-.19.19-.29.43-.29.71v7Z" />
                        </svg>
                        Delete</button>
                    <button class="big-task-card__button" onclick="renderContentBigTaskCardEdit()">
                        <svg class="big-task-card__button-img" width="25" height="25" viewBox="0 0 25 25" fill="none">
                            <path
                                d="M5.68 19.4h1.4l8.63-8.63-1.4-1.4-8.63 8.63v1.4ZM19.98 9.32l-4.25-4.2 1.4-1.4c.38-.38.85-.56 1.41-.56s1.03.18 1.41.56l1.4 1.4c.38.38.58.85.6 1.41.02.55-.16 1.02-.54 1.41l-1.43 1.42ZM18.53 10.8 7.93 21.4H3.68v-4.25L14.28 6.55l4.25 4.25Z" />
                        </svg>
                        Edit</button>
                </div>`;
}

function bigTaskCardEditTemplate() {
    return `    <div class="big-task-card-edit__task-type-text-button-box">
                    <button class="big-task-card-edit__task-type-button" onclick="addClassSlideBack()">x</button>
                </div>
                <div class="big-task-card-edit__scroll-box">
                    <div class="big-task-card-edit__text-input-box">
                        <span class="big-task-card-edit__text">Title</span>
                        <input class="big-task-card-edit__input" type="text" placeholder="Enter a Title">
                    </div>
                    <div class="big-task-card-edit__text-textarea-box">
                        <span class="big-task-card-edit__text">Description</span>
                        <textarea class="big-task-card-edit__textarea" placeholder="Enter a Description"></textarea>
                    </div>
                    <div class="big-task-card-edit__text-input-box">
                        <span class="big-task-card-edit__text">Due date</span>
                        <input class="big-task-card-edit__input" type="text" placeholder="dd/mm/yyyy">
                    </div>
                    <div class="big-task-card-edit__text-button-box">
                        <span class="big-task-card-edit__text">Priority</span>
                        <div class="big-task-card-edit__button-box">
                            <button class="big-task-card-edit__button">Urgent<img src="assets/icons/urgent.svg"
                                    alt=""></button>
                            <button class="big-task-card-edit__button">Medium<img src="assets/icons/medium.svg"
                                    alt=""></button>
                            <button class="big-task-card-edit__button">Low<img src="assets/icons/low.svg"
                                    alt=""></button>
                        </div>
                    </div>
                    <div class="big-task-card-edit__text-input-box">
                        <span class="big-task-card-edit__text">Assigned to</span>
                        <input class="big-task-card-edit__input" type="text" placeholder="Select contacts to assign">
                    </div>
                    <div class="big-task-card-edit__text-input-box">
                        <span class="big-task-card-edit__text">Subtasks</span>
                        <input class="big-task-card-edit__input" type="text" placeholder="Add new subtask">
                    </div>
                    <div class="big-task-card-edit__task-type-text-button-box">
                        <button class="big-task-card-edit__Ok-button" onclick="renderContentBigTaskCard()">Ok</button>
                    </div>
                </div>`;
}