function smallCardTemplate(id, taskType, taskTitle, taskDescription, taskPriority, numberOfSubtasks, numberOfCompletedSubtasks, assignedContacts) {
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

    let taskPriorityImgSrc = priorityMapping.find(element => element.priority == taskPriority)?.src || "";

    let subtaskHtml = "";
    let scaleFillCalculate;

    if (numberOfSubtasks != 0 && numberOfCompletedSubtasks != 0) {
        scaleFillCalculate = (100 / numberOfSubtasks) * numberOfCompletedSubtasks;
        subtaskHtml = `<div class="user-story__scale-text-box">
                    <div class="user-story__subtask-scale-box">
                        <div class="user-story__subtask-scale-fill" style="width: ${scaleFillCalculate}%"></div>
                    </div>
                    <span class="user-story__subtask-text">${numberOfCompletedSubtasks}/${numberOfSubtasks} Subtasks</span>
                </div>`
    }

    assignedContacts.sort((element1, element2) => element1.name.localeCompare(element2.name));
    let assignedContactsHtml = "";
    let initialsOverSix = "";
    if (assignedContacts) {
        let initials = assignedContacts.map(element => element.name.slice(0, 1) + element.name.slice(element.name.indexOf(" ") + 1, element.name.indexOf(" ") + 2) || "");
        let backgroundColors = assignedContacts.map(element => element.color);
        let maxIndex = initials.length < 6 ? initials.length : 6;
        initialsOverSix = initials.length > 6 ? `+${initials.length - 6}` : "";
        for (let index = 0; index < maxIndex; index++) {
            assignedContactsHtml += `<span class="user-story__name ${backgroundColors[index]}">${initials[index]}</span>`
        }
    }

    return `<div class="user-story__box" id="${id}" draggable="true" ondragstart="startDragging('${id}'); addDragRotation(event); saveCurrentCardId(event)" ondragend="removeDragRotation(event)" onclick="toggleDnoneBigTaskCard(); renderContentBigTaskCard(event)">
                <div class="user-story__category-box ${taskTypeCssClass}">
                    <span class="user-story__category-text">${taskType}</span>
                </div>
                <span class="user-story__title">${taskTitle}</span>
                <span class="user-story__discription">${taskDescription}</span>
                ${subtaskHtml}
                <div class="user-story__name-priority-box">
                    <div class="user-story__name-box">
                        ${assignedContactsHtml}
                        <span class="initials-over-six">${initialsOverSix}</span>
                    </div>
                    <img class="user-story__img" src="${taskPriorityImgSrc}" alt="">
                </div>
            </div>`;
}

function noCardTemplate(category, searchMode) {
    console.log(searchMode);
    let noTaskBoxText;
    if (searchMode === "false") {
        noTaskBoxText = "No tasks";

    } else {
        noTaskBoxText = "No Search Tasks";
    }


    return `<div class="no-task-box">
                <span class="no-task-text">${noTaskBoxText} ${category}</span>
            </div>`;
}

function cardBorderdragEnterTemplate(cardHeight) {
    return `<div class="card-border-box" id="card-border-box" style="height: ${cardHeight}px">
            </div>`;
}

function bigTaskCardTemplate(id, taskType, taskTitle, taskDescription, taskPriority, taskDueDate, numberOfSubtasks, numberOfCompletedSubtasks, assignedContacts, subtasks) {
    let taskTypeCssClass = taskType == "User Story" ? `big-task-card__category-box-user-story`
        : `big-task-card__category-box-technical-task`;

    const priorityMapping = [
        {
            priority: "low",
            img: `<img class="big-task-card__priority-img" src= "assets/icons/low.svg" alt="">`,
            priorityText: "Low"
        },
        {
            priority: "medium",
            img: `<img class="big-task-card__priority-img" src= "assets/icons/medium.svg" alt="">`,
            priorityText: "Medium"
        },
        {
            priority: "urgent",
            img: `<img class="big-task-card__priority-img" src= "assets/icons/urgent.svg" alt="">`,
            priorityText: "Urgent"
        }
    ];

    let taskPriorityImg = "";
    let taskPriorityText = "";
    let taskPriorityForEdit = "";
    if (taskPriority) {
        taskPriorityImg = priorityMapping.find(element => element.priority == taskPriority)?.img;
        taskPriorityText = priorityMapping.find(element => element.priority == taskPriority)?.priorityText;
        taskPriorityForEdit = taskPriority;
    }

    let dueDate = "";
    if (taskDueDate) {
        dueDate = taskDueDate;
    }
    assignedContacts.sort((element1, element2) => element1.name.localeCompare(element2.name));
    let scrollClassAssignedContacts = "";
    let assignedContactsHtml = "";
    if (assignedContacts) {
        let initials = assignedContacts.map(element => element.name.slice(0, 1) + element.name.slice(element.name.indexOf(" ") + 1, element.name.indexOf(" ") + 2) || "");
        let backgroundColors = assignedContacts.map(element => element.color);
        let names = assignedContacts.map(element => element.name);

        for (let index = 0; index < initials.length; index++) {
            assignedContactsHtml += `<div class="big-task-card__initials-name-box">
                                        <span class="big-task-card__initials ${backgroundColors[index]}">${initials[index]}</span>
                                        <span class="big-task-card__name">${names[index]}</span>
                                     </div>`
        }
        assignedContacts.length > 3 ? scrollClassAssignedContacts = `big-task-card__div-scroll` : "";
    }

    let scrollClassSubtasks = "";
    let subtasksHtml = "";
    if (subtasks) {
        let allSubtasks = subtasks.map(element => element.subtask);
        let allSubtasksChecked = subtasks.map(element => element.checked);
        for (let index = 0; index < allSubtasks.length; index++) {
            let rectangleOpen;
            let rectangleClose;
            let hook;
            let checked;
            if (allSubtasksChecked[index] === "true") {
                rectangleOpen = ``;
                rectangleClose = `d-none`;
                hook = ``;
                checked = "true";
            } else {
                rectangleOpen = `d-none`;
                rectangleClose = ``;
                hook = `d-none`;
                checked = "false";
            }
            subtasksHtml += `<div class="big-task-card__subtasks-check-text-box">
                            <svg class="big-task-card__checkbox" id="big-task-card__checkbox${index}" data-checked="${checked}" data-index="${index}"
                                onclick="toggleDnoneCheckbox('rectangle-open-checkbox${index}', 'rectangle-close-checkbox${index}', 'hook-checkbox${index}'); changeCheckedSubtask(event)"
                                width="25" height="25" viewBox="0 0 25 25" fill="none">
                                <path class="${rectangleOpen}" id="rectangle-open-checkbox${index}"
                                    d="M20.6821 11.3967V17.3967C20.6821 19.0536 19.339 20.3967 17.6821 20.3967H7.68213C6.02527 20.3967 4.68213 19.0536 4.68213 17.3967V7.39673C4.68213 5.73987 6.02527 4.39673 7.68213 4.39673H15.6821"
                                    stroke="#2A3647" stroke-width="2" stroke-linecap="round" />
                                <path class="${rectangleClose}" id="rectangle-close-checkbox${index}"
                                    d="M7.68213 4.39673H17.6821C19.339 4.39673 20.6821 5.73987 20.6821 7.39673V17.3967C20.6821 19.0536 19.339 20.3967 17.6821 20.3967H7.68213C6.02527 20.3967 4.68213 19.0536 4.68213 17.3967V7.39673C4.68213 5.73987 6.02527 4.39673 7.68213 4.39673Z"
                                    stroke="#2A3647" stroke-width="2" stroke-linecap="round" fill="none" />
                                <path class="${hook}" id="hook-checkbox${index}"
                                    d="M8.68213 12.3967L12.6821 16.3967L20.6821 4.89673" stroke="#2A3647"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <span class="big-task-card__subtasks-text">${allSubtasks[index]}</span>
                        </div>`
        }
        subtasks.length > 2 ? scrollClassSubtasks = `big-task-card__div-scroll` : "";
    }

    return `    <div class="big-task-card__task-type-text-button-box">
                    <div class="big-task-card__task-type-text-box ${taskTypeCssClass}">
                        <span class="big-task-card__task-type-text">${taskType}</span>
                    </div>
                    <button class="big-task-card__task-type-button" onclick="addClassSlideBack()">x</button>
                </div>
                <div class="big-task-card__title-box">
                    <span class="big-task-card__title">${taskTitle}</span>
                </div>
                <div class="big-task-card__task-description-box">
                    <span class="big-task-card__task-description-text">${taskDescription}</span>
                </div>
                <div class="big-task-card__due-date-box">
                    <span class="big-task-card__due-date-text">Due date:</span>
                    <span class="big-task-card__due-date-text">${dueDate}</span>
                </div>
                <div class="big-task-card__priority-box">
                    <span class="big-task-card__priority-text">Priority:</span>
                    <div class="big-task-card__priority-text-img-box">
                        <span class="big-task-card__priority-text">${taskPriorityText}</span>
                        ${taskPriorityImg}
                    </div>
                </div>
                <div class="big-task-card__assigned-to-box">
                    <div class="big-task-card__assigned-to-text-box">
                        <span class="big-task-card__assigned-to-text">Assigned To:</span>
                    </div>
                    <div class="big-task-card__assigned-to-names-box ${scrollClassAssignedContacts}">
                        ${assignedContactsHtml}
                    </div>
                </div>
                <div class="big-task-card__subtasks-box">
                    <div class="big-task-card__subtasks-title-box">
                        <span class="big-task-card__subtasks-title">Subtasks</span>
                    </div>
                    <div class="big-task-card__all-subtasks-box ${scrollClassSubtasks}">
                        ${subtasksHtml}
                    </div>
                </div>
                <div class="big-task-card__button-box">
                    <button class="big-task-card__button" onclick="deleteCurrentTask()">
                        <svg class="big-task-card__button-img" width="25" height="25" viewBox="0 0 25 25" fill="none">
                            <path
                                d="M7.7 21.4c-.55 0-1.02-.2-1.41-.59-.39-.39-.59-.86-.59-1.41V6.4h-.01a1 1 0 0 1 0-2h4V4.4c0-.28.1-.52.29-.71.19-.19.43-.29.71-.29h4c.28 0 .52.1.71.29.19.19.29.43.29.71h4a1 1 0 0 1 0 2h-.41v13c0 .55-.2 1.02-.59 1.41-.39.39-.86.59-1.41.59H7.7ZM7.7 6.4v13h10v-13h-10Zm2 10c0 .28.1.52.29.71.19.19.43.29.71.29s.52-.1.71-.29c.19-.19.29-.43.29-.71v-7c0-.28-.1-.52-.29-.71-.19-.19-.43-.29-.71-.29s-.52.1-.71.29c-.19.19-.29.43-.29.71v7Zm4 0c0 .28.1.52.29.71.19.19.43.29.71.29s.52-.1.71-.29c.19-.19.29-.43.29-.71v-7c0-.28-.1-.52-.29-.71-.19-.19-.43-.29-.71-.29s-.52.1-.71.29c-.19.19-.29.43-.29.71v7Z" />
                        </svg>
                        Delete</button>
                    <button class="big-task-card__button" onclick="renderContentBigTaskCardEdit(); displaySelectedContacts(); selectPrioButton('${taskPriorityForEdit}')">
                        <svg class="big-task-card__button-img" width="25" height="25" viewBox="0 0 25 25" fill="none">
                            <path
                                d="M5.68 19.4h1.4l8.63-8.63-1.4-1.4-8.63 8.63v1.4ZM19.98 9.32l-4.25-4.2 1.4-1.4c.38-.38.85-.56 1.41-.56s1.03.18 1.41.56l1.4 1.4c.38.38.58.85.6 1.41.02.55-.16 1.02-.54 1.41l-1.43 1.42ZM18.53 10.8 7.93 21.4H3.68v-4.25L14.28 6.55l4.25 4.25Z" />
                        </svg>
                        Edit</button>
                </div>`;
}

function bigTaskCardEditTemplate(id, taskType, taskTitle, taskDescription, taskPriority, taskDueDate, numberOfSubtasks, numberOfCompletedSubtasks, assignedContacts, subtasksEdit) {
    let dueDate = "";
    if (taskDueDate) {
        dueDate = taskDueDate;
    }

    selectedContacts.length = 0;
    subtasks.length = 0;
    subtasksCount = 1;

    assignedContacts.sort((element1, element2) => element1.name.localeCompare(element2.name));
    assignedContacts.forEach(element => selectedContacts.push(element));

    if (subtasksEdit) {
        subtasksEdit.forEach(element => subtasks.push(element));
    }

    let subtasksHtml = "";
    for (let index = 0; index < subtasks.length; index++) {
        let id = subtasksCount++;
        subtasksHtml += `<div id="container-subtask-${id}" class="position-relative">
                <div id="edit-subtask-${id}" class="container-subtask-edit d-none">
                    <input id="input-subtask-${id}" class="input-edit" type="text"  maxlength="50">
                    <div class="flex">
                        <img src="./assets/icons/delete.svg" alt="icon-delete" onclick="deleteSubtask(${id})">
                        <hr class="edit-hr">
                        <img class="check-blue" src="./assets/icons/check_blue.svg" alt="icon-accept" onclick="saveEditedSubtask(${id})">
                    </div>
                </div>
                <div id="details-subtask-${id}" class="container-subtask subtask-scroll-margin" onmouseover="showEditOptions(${id}, true)" onmouseleave="showEditOptions(${id}, false)" ondblclick="editSubtask(${id})">
                    <div class="subtask-text" onmouseover="showEditOptions(${id}, true)" onmouseleave="showEditOptions(${id}, false)">
                        <span>&bull;</span>
                        <span id="subtask-${id}">${subtasks[index].subtask}</span>
                    </div>
                    <div id="icons-subtask-${id}" class="subtask-icons d-none" onmouseover="showEditOptions(${id}, true)" onmouseleave="showEditOptions(${id}, false)">
                        <img src="./assets/icons/edit.svg" alt="icon-edit" onclick="editSubtask(${id})">
                        <hr>
                        <img src="./assets/icons/delete.svg" alt="icon-delete" onclick="deleteSubtask(${id})">
                    </div>
                </div>
            </div>`;
    }

    return `    <div class="big-task-card-edit__task-type-text-button-box">
                    <button class="big-task-card-edit__task-type-button" onclick="addClassSlideBack()">x</button>
                </div>
                <div class="big-task-card-edit__scroll-box">
                    <div class="big-task-card-edit__text-input-box">
                        <span class="big-task-card-edit__text">Title</span>
                        <input class="big-task-card-edit__input" id="big-task-card-edit__input-title" type="text" placeholder="Enter a Title" value="${taskTitle}">
                    </div>
                    <div class="big-task-card-edit__text-textarea-box">
                        <span class="big-task-card-edit__text">Description</span>
                        <textarea class="big-task-card-edit__textarea" id="big-task-card-edit__textarea-description" placeholder="Enter a Description">${taskDescription}</textarea>
                    </div>
                    <div class="big-task-card-edit__text-input-box">
                        <span class="big-task-card-edit__text">Due date</span>
                        <input class="big-task-card-edit__input" id="big-task-card-edit__input-due-date" type="text" placeholder="dd/mm/yyyy" value="${dueDate}">
                    </div>
                    
                    
                    
                    <div id="container-prioritys" class="container-input-label">
                            <label for="buttons-prio" class="label-add-task">Priority</label>
                            <div id="buttons-prio">
                                <button id="urgent" class="button-prio button-prio-hover" type="button" onclick="selectPrioButton('urgent')">
                                    Urgent
                                    <img id="svg-urgent" src="assets/icons/urgent.svg" alt="icon-urgent">
                                </button>
                                <button id="medium" class="button-prio medium white" type="button" onclick="selectPrioButton('medium')">
                                    Medium
                                    <img id="svg-medium" src="assets/icons/medium.svg" alt="icon-medium" class="filter-white">
                                </button>
                                <button id="low" class="button-prio button-prio-hover" type="button" onclick="selectPrioButton('low')">
                                    Low
                                    <img id="svg-low" src="assets/icons/low.svg" alt="icon-low">
                                </button>
                            </div>
                        </div>
                    
                    <div class="container-input-label custom-select">
                            <label for="assigned-to" class="label-add-task">
                                Assigned to
                            </label>
                            <div id="container-input-assigned">
                                <input id="assigned-to" type="text" name="assigned-to" placeholder="Select contacts to assign" onclick="toggleAssignOptions(), stopPropagation(event)" onkeyup="filterContacts()">
                                <button class="button-dropdown" type="button" onclick="toggleAssignOptions(), toggleInputFocus(), stopPropagation(event)">
                                    <img id="arrow-dropdown-assigned" src="./assets/icons/arrow_drop_down.svg" alt="icon-arrow-down">
                                </button>
                            </div>
                            <div id="container-dropdown">
                                <div id="dropdown-assign" class="container-custom-select-options d-none" onmousedown="preventDefault(event)"></div>
                            </div>
                            <div id="container-assigned-contacts"></div>
                        </div>
                    <div class="container-input-label">
                            <label id="label-subtasks" for="subtasks" class="label-add-task" placeholder="Add new subtask">
                                Subtasks
                                <p id="invalid-subtask" class="required grey">Enter at least one character to save subtask!</p>
                                <p id="max-char-subtasks" class="required-max-chars grey d-none">Reached maximum amount of 50 chars!</p>
                            </label>
                            <div id="container-input-subtask" onclick="changeInputButton(true), stopPropagation(event)">
                                <input id="subtasks" class="input" type="text" name="subtasks" placeholder="Add new subtask" maxlength="50" onkeyup="checkInputLength('subtasks')" onkeydown="isEnterKey(event)">                                <button id="button-add" class="button-add" type="button">
                                    <img src="./assets/icons/add.svg" alt="icon-arrow-down">
                                </button>
                                <div id="container-buttons" class="container-button-confirm d-none">
                                    <button type="button" class="button-add button-accept-reject" onclick="processSubtask(false)">
                                        <img src="./assets/icons/close.svg" alt="icon-reject">
                                    </button>
                                    <hr>
                                    <button type="button" class="button-add button-accept-reject" onclick="processSubtask(true)">
                                        <img src="./assets/icons/check_blue.svg" alt="icon-accept">
                                    </button>
                                </div>
                            </div>
                            <div id="container-subtasks">${subtasksHtml}</div>
                        </div>
                    
                    
                    
                    
                    
                    <div class="big-task-card-edit__task-type-text-button-box">
                        <button class="big-task-card-edit__Ok-button" onclick="readFromEdit(); renderContentBigTaskCard()">Ok</button>
                    </div>
                </div>`;
}

{/* <div class="big-task-card-edit__text-input-box">
                        <span class="big-task-card-edit__text">Assigned to</span>
                        <input class="big-task-card-edit__input" type="text" placeholder="Select contacts to assign">
                    </div>
                    <div class="big-task-card-edit__text-input-box">
                        <span class="big-task-card-edit__text">Subtasks</span>
                        <input class="big-task-card-edit__input" type="text" placeholder="Add new subtask">
                    </div> */}

{/* <div class="big-task-card-edit__text-button-box">
                        <span class="big-task-card-edit__text">Priority</span>
                        <div class="big-task-card-edit__button-box">
                            <button class="big-task-card-edit__button">Urgent<img src="assets/icons/urgent.svg"
                                    alt=""></button>
                            <button class="big-task-card-edit__button">Medium<img src="assets/icons/medium.svg"
                                    alt=""></button>
                            <button class="big-task-card-edit__button">Low<img src="assets/icons/low.svg"
                                    alt=""></button>
                        </div>
                    </div> */}

function addTaskTemplate() {
    return `<section id="main" onclick="closeDropdown(), changeInputButton(false), stopPropagation(event)">
        <div id="container-form">
            <div id="form-top">
                <h1>Add Task</h1>
                <form id="form-add-task">
                    <div id="form-left">
                        <div class="container-input-label">
                            <label for="title" class="label-add-task flex">
                                Title
                                <span class="asterisk">&#42;</span>
                                <p id="max-char-title" class="required-max-chars grey">Reached maximum amount of 50 chars!</p>
                            </label>
                            <input id="title" class="input" type="text" name="title" placeholder="Enter a title" maxlength="50" onkeyup="checkInputLength('title')">
                            <p id="required-title" class="required grey">This field is required</p>
                        </div>
                        <div id="container-description" class="container-input-label">
                            <label for="description" class="label-add-task">
                                Description
                            </label>
                            <textarea id="description" class="input" name="description" placeholder="Enter a Description"></textarea>
                        </div>
                        <div class="container-input-label">
                            <label for="due-date" class="label-add-task flex" id="label-due-date">
                                Due date
                                <span class="asterisk" id="asterisk-due-date">&#42;</span>
                                <p id="invalid-date" class="required grey">Invalid date format (dd/mm/jjjj)!</p>
                            </label>
                            <div id="container-input-due-date">
                                <input id="due-date" class="input" type="text" name="due-date" placeholder="dd/mm/yyyy" required  maxlength="10">
                                <input id="date-picker" type="date" onchange="putDateToInput()">
                            </div>
                            <p id="required-due-date" class="required grey">This field is required</p>
                        </div>
                    </div>
                    <hr id="separator">
                    <div id="form-right">
                        <div id="container-prioritys" class="container-input-label">
                            <label for="buttons-prio" class="label-add-task">Priority</label>
                            <div id="buttons-prio">
                                <button id="urgent" class="button-prio button-prio-hover" type="button" onclick="selectPrioButton('urgent')">
                                    Urgent
                                    <img id="svg-urgent" src="assets/icons/urgent.svg" alt="icon-urgent">
                                </button>
                                <button id="medium" class="button-prio medium white" type="button" onclick="selectPrioButton('medium')">
                                    Medium
                                    <img id="svg-medium" src="assets/icons/medium.svg" alt="icon-medium" class="filter-white">
                                </button>
                                <button id="low" class="button-prio button-prio-hover" type="button" onclick="selectPrioButton('low')">
                                    Low
                                    <img id="svg-low" src="assets/icons/low.svg" alt="icon-low">
                                </button>
                            </div>
                        </div>
                        <div class="container-input-label custom-select">
                            <label for="assigned-to" class="label-add-task">
                                Assigned to
                            </label>
                            <div id="container-input-assigned">
                                <input id="assigned-to" type="text" name="assigned-to" placeholder="Select contacts to assign" onclick="toggleAssignOptions(), stopPropagation(event)" onkeyup="filterContacts()">
                                <button class="button-dropdown" type="button" onclick="toggleAssignOptions(), toggleInputFocus(), stopPropagation(event)">
                                    <img id="arrow-dropdown-assigned" src="./assets/icons/arrow_drop_down.svg" alt="icon-arrow-down">
                                </button>
                            </div>
                            <div id="container-dropdown">
                                <div id="dropdown-assign" class="container-custom-select-options d-none" onmousedown="preventDefault(event)"></div>
                            </div>
                            <div id="container-assigned-contacts"></div>
                        </div>
                        <div class="container-input-label">
                            <label for="category" class="label-add-task flex">
                                Category
                                <span class="asterisk">&#42;</span>
                            </label>
                            <div id="container-input-category">
                                <input readonly id="category" type="text" name="category" placeholder="Select task category" onclick="toggleCategoryOptions(), stopPropagation(event)">
                                <button class="button-dropdown" type="button">
                                    <img id="arrow-dropdown-category" src="./assets/icons/arrow_drop_down.svg" alt="icon-arrow-down" onclick="toggleCategoryOptions(), stopPropagation(event)">
                                </button>
                            </div>
                            <div class="container-arrow-dropdown" onclick="toggleCategoryOptions(), stopPropagation(event)"></div>
                            <div id="dropdown-category" class="container-custom-select-options-noscroll d-none">
                                <div id="technical-task" class="container-custom-select-option" onclick="displayCategory('Technical Task'), stopPropagation(event)">
                                    <div class="container-bg">
                                        <div>
                                            <span class="category">Technical Task</span>
                                        </div>
                                    </div>
                                </div>
                                <div id="user-story" class="container-custom-select-option" onclick="displayCategory('User Story'), stopPropagation(event)">
                                    <div class="container-bg">
                                        <div>
                                            <span class="category">User Story</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p id="required-category" class="required grey">This field is required</p>
                        </div>
                        <div class="container-input-label">
                            <label id="label-subtasks" for="subtasks" class="label-add-task" placeholder="Add new subtask">
                                Subtasks
                                <p id="invalid-subtask" class="required grey">Enter at least one character to save subtask!</p>
                                <p id="max-char-subtasks" class="required-max-chars grey d-none">Reached maximum amount of 50 chars!</p>
                            </label>
                            <div id="container-input-subtask" onclick="changeInputButton(true), stopPropagation(event)">
                                <input id="subtasks" class="input" type="text" name="subtasks" placeholder="Add new subtask" maxlength="50" onkeyup="checkInputLength('subtasks')">
                                <button id="button-add" class="button-add" type="button">
                                    <img src="./assets/icons/add.svg" alt="icon-arrow-down">
                                </button>
                                <div id="container-buttons" class="container-button-confirm d-none">
                                    <button type="button" class="button-add button-accept-reject" onclick="processSubtask(false)">
                                        <img src="./assets/icons/close.svg" alt="icon-reject">
                                    </button>
                                    <hr>
                                    <button type="button" class="button-add button-accept-reject" onclick="processSubtask(true)">
                                        <img src="./assets/icons/check_blue.svg" alt="icon-accept">
                                    </button>
                                </div>
                            </div>
                            <div id="container-subtasks"></div>
                        </div>
                    </div>
                </form>
            </div>
            <div id="footer-add-task">
                <p class="flex"><span class="asterisk">&#42;</span>This field is required</p>
                <div>
                    <button id="button-clear" onclick="clearInputs()">Clear
                        <img src=".//assets/icons/cancel.svg" alt="icon-cancel">
                    </button>
                    <button id="button-create" onclick="createTask()">Create task
                        <img src=".//assets/icons/check.svg" alt="icon-check">
                    </button>
                </div>
            </div>
        </div>
    </section>
`
}