/**
 * Generates a small card template for displaying a task.
 * 
 * This template is used to create a visually formatted card for displaying task details, including 
 * task type, title, description, priority, subtasks, and assigned contacts. It also includes a move 
 * menu for task management on mobile.
 * 
 * @function smallCardTemplate
 * @param {string} id - The unique identifier for the task card.
 * @param {string} taskType - The type of the task (e.g., "User Story", "Technical Task").
 * @param {string} taskTitle - The title of the task.
 * @param {string} taskDescription - The description of the task.
 * @param {string} taskPriority - The priority of the task (e.g., "low", "medium", "urgent").
 * @param {number} numberOfSubtasks - The total number of subtasks associated with the task.
 * @param {number} numberOfCompletedSubtasks - The number of completed subtasks.
 * @param {Array<Object>} assignedContacts - An array of contacts assigned to the task, each object containing the contact's name and color.
 * 
 * @returns {string} The HTML string for the task card template.
 *
 * @description
 * This function dynamically creates an HTML template for a task card by:
 * 1. Determining the appropriate CSS class for the task type.
 * 2. Mapping the task priority to an image source.
 * 3. Generating HTML for subtasks progress, if applicable.
 * 4. Creating a list of assigned contacts with initials and background colors.
 * 5. Returning the complete HTML string for rendering the task card.
 */
function smallCardTemplate(id, taskType, taskTitle, taskDescription, taskPriority, numberOfSubtasks, numberOfCompletedSubtasks, assignedContacts) {
    let taskTypeCssClass = taskType == "User Story" ? `user-story__category-box-user-story`
        : `user-story__category-box-technical-task`;
    const priorityMapping = [
        {
            priority: "low",
            src: "../assets/icons/low.svg"
        },
        {
            priority: "medium",
            src: "../assets/icons/medium.svg"
        },
        {
            priority: "urgent",
            src: "../assets/icons/urgent.svg"
        }
    ];
    let taskPriorityImgSrc = priorityMapping.find(element => element.priority == taskPriority)?.src || "";
    let subtaskHtml = "";
    let scaleFillCalculate;
    let scaleColor;
    if (numberOfSubtasks != 0 && numberOfCompletedSubtasks != 0) {
        scaleFillCalculate = (100 / numberOfSubtasks) * numberOfCompletedSubtasks;
        scaleColor = numberOfSubtasks === numberOfCompletedSubtasks ? `background-color: lightgreen` : "";
        subtaskHtml = `<div class="user-story__scale-text-box">
                    <div class="user-story__subtask-scale-box">
                        <div class="user-story__subtask-scale-fill" style="width: ${scaleFillCalculate}%; ${scaleColor}"></div>
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
    return `<div class="user-story__all-content-box">
                <div class="user-story__box" id="${id}" draggable="true" ondragstart="startDragging('${id}'); addDragRotation(event); saveCurrentCardId(event); disablePointerEventsForAllTasks(event)" ondragend="removeDragRotation(event); activatePointerEventsForAllTasks(); removeCardBorderBox()" onclick="saveCurrentCardId(event); toggleDnoneBigTaskCard(); renderContentBigTaskCard(event)">
                    <div class="user-story__category-mobile-button-box">
                        <div class="user-story__category-box ${taskTypeCssClass}">
                            <span class="user-story__category-text">${taskType}</span>
                        </div>
                        <button class="user-story__mobile-button" onclick="openMobileMoveMenu(event); event.stopPropagation();">
                            <svg viewBox="0 0 55 45">
                                <rect x="0" y="0" width="55" height="45" rx="10" ry="10" fill="#ECEFF4" stroke="#D8DEE9" stroke-width="2" />
                                <circle cx="22" cy="22.5" r="16" fill="#4C566A" />
                                <text x="22" y="26.5" text-anchor="middle" fill="white" font-size="8.4" font-family="sans-serif"
                                font-weight="bold">MOVE</text>
                                <path class="arrow up" d="M44 6.5 L40 13.5 L42 13.5 L42 19.5 L47 19.5 L47 13.5 L49 13.5 Z" fill="#4C566A" />
                                <path class="arrow down" d="M44 38.5 L40 31.5 L42 31.5 L42 25.5 L47 25.5 L47 31.5 L49 31.5 Z" fill="#4C566A" />
                            </svg>
                        </button>
                    </div>
                    <span class="user-story__title">${taskTitle}</span>
                    <span class="user-story__description">${taskDescription}</span>
                    ${subtaskHtml}
                    <div class="user-story__name-priority-box">
                        <div class="user-story__name-box">
                            ${assignedContactsHtml}
                            <span class="initials-over-six">${initialsOverSix}</span>
                        </div>
                        <img class="user-story__img" src="${taskPriorityImgSrc}" alt="">
                    </div>
                </div>
                <div class="user-story__mobile-move-menu">
                    <svg viewBox="28 28 244 244">
                        <path d="M150,150 L159,28 A122,122 0 0,1 265,140 L150,150 Z" fill="#5E81AC"
                        class="user-story__mobile-move-menu__segment toDos open delay-1-open" onclick="moveTaskCardMobile(event, 'to-do-drag-field', toDoArray, 'toDos')" />
                        <path d="M150,150 L267,159 A122,122 0 0,1 159,267 L150,150 Z" fill="#4C6E91"
                        class="user-story__mobile-move-menu__segment inProgress open delay-2-open" onclick="moveTaskCardMobile(event, 'in-progress-drag-field', inProgressArray, 'inProgress')" />
                        <path d="M150,150 L140,267 A122,122 0 0,1 33,159 L150,150 Z" fill="#7A9BAE"
                        class="user-story__mobile-move-menu__segment awaitFeedback open delay-3-open" onclick="moveTaskCardMobile(event, 'await-feedback-drag-field', awaitFeedbackArray, 'awaitFeedback')" />
                        <path d="M150,150 L33,140 A122,122 0 0,1 140,28 L150,150 Z" fill="#6F8FAF" 
                        class="user-story__mobile-move-menu__segment done open delay-4-open" onclick="moveTaskCardMobile(event, 'done-drag-field', doneArray, 'done')" />
                        <defs>
                            <path id="midArc1" d="M150,70 A75,75 0 0,1 237,150" />
                            <path id="midArc2" d="M150,237 A68,68 0 0,0 237,150" />
                            <path id="midArc3" d="M63,150 A68,68 0 0,0 150,237" />
                            <path id="midArc4" d="M63,150 A75,75 0 0,1 150,70" />
                        </defs>
                        <text class="user-story__mobile-move-menu__segment-text open delay-1-open" fill="#ECEFF4" font-size="20" font-weight="bold">
                            <textPath href="#midArc1" startOffset="50%" text-anchor="middle">To Do</textPath>
                        </text>
                        <text class="user-story__mobile-move-menu__segment-text open delay-2-open" fill="#ECEFF4" font-size="20" font-weight="bold">
                            <textPath href="#midArc2" startOffset="50%" text-anchor="middle">In Progress</textPath>
                        </text>
                        <text class="user-story__mobile-move-menu__segment-text open delay-3-open" fill="#ECEFF4" font-size="20" font-weight="bold">
                            <textPath href="#midArc3" startOffset="50%" text-anchor="middle">A. Feedback</textPath>
                        </text>
                        <text class="user-story__mobile-move-menu__segment-text open delay-4-open" fill="#ECEFF4" font-size="20" font-weight="bold">
                            <textPath href="#midArc4" startOffset="50%" text-anchor="middle">Done</textPath>
                        </text>
                    </svg>
                    <div class="user-story__mobile-move-menu__center-button open" onclick="animationReverse(event)"><span
                        class="user-story__mobile-move-menu__center-button-text">Move to</span>
                    </div>
                </div>
            </div>`;
}

/**
 * Generates a template for displaying a "No tasks" message.
 * 
 * This function creates a template for a message that informs the user when no tasks are available 
 * to display. It can be used in scenarios where no tasks exist in a particular category or when no 
 * tasks match the search criteria.
 * 
 * @function noCardTemplate
 * @param {string} category - The category of tasks, such as "To Do", "In Progress", etc.
 * @param {string} searchMode - The search mode indicator, which determines the message content. 
 *                              If "false", the message will indicate no tasks. If any other value, 
 *                              it will indicate no tasks found in the search.
 * 
 * @returns {string} The HTML string for displaying the "No tasks" message.
 *
 * @description
 * This function generates a simple HTML template that displays a message depending on the `searchMode`. 
 * It will show "No tasks" if `searchMode` is `"false"` and "No Search Tasks" if `searchMode` is any other value. 
 * It appends the `category` string to the message to make it more specific to the context (e.g., "No tasks In Progress").
 */
function noCardTemplate(category, searchMode) {
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

/**
 * Generates an HTML template for a draggable card border.
 * 
 * This function creates a template for displaying a border box element during a drag-and-drop action. 
 * The border box's height is dynamically set based on the provided `cardHeight` parameter.
 * 
 * @function cardBorderdragEnterTemplate
 * @param {number} cardHeight - The height of the card border box to be generated, typically in pixels.
 * 
 * @returns {string} The HTML string for the card border box with the specified height.
 * 
 * @description
 * This function generates an HTML `<div>` element with a specific height for a draggable card border. 
 * The border box's height is set dynamically through inline CSS using the `cardHeight` value.
 */
function cardBorderdragEnterTemplate(cardHeight) {
    return `<div class="card-border-box" id="card-border-box" style="height: ${cardHeight}px">
            </div>`;
}

function bigTaskCardTemplate(taskType, taskTitle, taskDescription, taskPriority, taskDueDate, assignedContacts, subtasks) {
    let taskTypeCssClass = taskType == "User Story" ? `big-task-card__category-box-user-story`
        : `big-task-card__category-box-technical-task`;
    const priorityMapping = [
        {
            priority: "low",
            img: `<img class="big-task-card__priority-img" src= "../assets/icons/low.svg" alt="">`,
            priorityText: "Low"
        },
        {
            priority: "medium",
            img: `<img class="big-task-card__priority-img" src= "../assets/icons/medium.svg" alt="">`,
            priorityText: "Medium"
        },
        {
            priority: "urgent",
            img: `<img class="big-task-card__priority-img" src= "../assets/icons/urgent.svg" alt="">`,
            priorityText: "Urgent"
        }
    ];
    let taskPriorityImg = "";
    let taskPriorityText = "";
    let taskPriorityForEdit = "";
    if (taskPriority) {
        taskPriorityImg = priorityMapping.find(element => element.priority == taskPriority)?.img || "";
        taskPriorityText = priorityMapping.find(element => element.priority == taskPriority)?.priorityText || "";
        taskPriorityForEdit = taskPriority === "big-task-card-edit__medium-button" ? "" : `big-task-card-edit__${taskPriority}-button`
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
    return `<div class="big-task-card__task-type-text-button-box">
                <div class="big-task-card__task-type-text-box ${taskTypeCssClass}">
                    <span class="big-task-card__task-type-text">${taskType}</span>
                </div>
                <button class="big-task-card__task-type-button" onclick="addClassSlideBack()">
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                        <rect x="0.144531" width="24" height="24" fill="none"/>
                        <path d="M12.1443 13.4L7.24434 18.3C7.061 18.4834 6.82767 18.575 6.54434 18.575C6.261 18.575 6.02767 18.4834 5.84434 18.3C5.661 18.1167 5.56934 17.8834 5.56934 17.6C5.56934 17.3167 5.661 17.0834 5.84434 16.9L10.7443 12L5.84434 7.10005C5.661 6.91672 5.56934 6.68338 5.56934 6.40005C5.56934 6.11672 5.661 5.88338 5.84434 5.70005C6.02767 5.51672 6.261 5.42505 6.54434 5.42505C6.82767 5.42505 7.061 5.51672 7.24434 5.70005L12.1443 10.6L17.0443 5.70005C17.2277 5.51672 17.461 5.42505 17.7443 5.42505C18.0277 5.42505 18.261 5.51672 18.4443 5.70005C18.6277 5.88338 18.7193 6.11672 18.7193 6.40005C18.7193 6.68338 18.6277 6.91672 18.4443 7.10005L13.5443 12L18.4443 16.9C18.6277 17.0834 18.7193 17.3167 18.7193 17.6C18.7193 17.8834 18.6277 18.1167 18.4443 18.3C18.261 18.4834 18.0277 18.575 17.7443 18.575C17.461 18.575 17.2277 18.4834 17.0443 18.3L12.1443 13.4Z" fill="#2A3647"/>
                    </svg>
                </button>
            </div>
            <div class="big-task-card__scroll-box">
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
            </div>
            <div class="big-task-card__button-box">
                <button class="big-task-card__button" onclick="deleteCurrentTask(); fadeOutBigTaskCard(); setTimeout(setHeightForDragFields, 3000);">
                    <svg class="big-task-card__button-img" width="25" height="25" viewBox="0 0 25 25" fill="none">
                        <path
                            d="M7.7 21.4c-.55 0-1.02-.2-1.41-.59-.39-.39-.59-.86-.59-1.41V6.4h-.01a1 1 0 0 1 0-2h4V4.4c0-.28.1-.52.29-.71.19-.19.43-.29.71-.29h4c.28 0 .52.1.71.29.19.19.29.43.29.71h4a1 1 0 0 1 0 2h-.41v13c0 .55-.2 1.02-.59 1.41-.39.39-.86.59-1.41.59H7.7ZM7.7 6.4v13h10v-13h-10Zm2 10c0 .28.1.52.29.71.19.19.43.29.71.29s.52-.1.71-.29c.19-.19.29-.43.29-.71v-7c0-.28-.1-.52-.29-.71-.19-.19-.43-.29-.71-.29s-.52.1-.71.29c-.19.19-.29.43-.29.71v7Zm4 0c0 .28.1.52.29.71.19.19.43.29.71.29s.52-.1.71-.29c.19-.19.29-.43.29-.71v-7c0-.28-.1-.52-.29-.71-.19-.19-.43-.29-.71-.29s-.52.1-.71.29c-.19.19-.29.43-.29.71v7Z" />
                    </svg>
                    Delete</button>
                <span class="big-task-card__seperator"></span>
                <button class="big-task-card__button" onclick="renderContentBigTaskCardEdit(); selectPrioButtonForBigTaskCardEdit('${taskPriorityForEdit}'); loadAllContacts(); displaySelectedContactsForBigTaskCard(); deactivatePastDays('big-task-card-edit__input-date-picker')">
                    <svg class="big-task-card__button-img" width="25" height="25" viewBox="0 0 25 25" fill="none">
                        <path
                            d="M5.68 19.4h1.4l8.63-8.63-1.4-1.4-8.63 8.63v1.4ZM19.98 9.32l-4.25-4.2 1.4-1.4c.38-.38.85-.56 1.41-.56s1.03.18 1.41.56l1.4 1.4c.38.38.58.85.6 1.41.02.55-.16 1.02-.54 1.41l-1.43 1.42ZM18.53 10.8 7.93 21.4H3.68v-4.25L14.28 6.55l4.25 4.25Z" />
                    </svg>
                    Edit</button>
            </div>`;
}

/**
 * Generates the editable HTML template for a "Big Task Card" with full task details.
 *
 * This function returns a dynamic HTML string for rendering a task editing interface.
 * It includes inputs and controls for modifying title, description, due date, priority,
 * assigned contacts, and subtasks. The layout adjusts depending on the screen width
 * to support both desktop and mobile views.
 *
 * @function bigTaskCardEditTemplate
 *
 * @param {string} taskTitle - The current title of the task.
 * @param {string} taskDescription - The current description of the task.
 * @param {string} taskDueDate - The current due date in format `dd/mm/yyyy`.
 * @param {Array<{name: string, color: string}>} assignedContacts - Array of contact objects assigned to the task. Each contact includes a name and a background color.
 * @param {Array<{subtask: string, checked: boolean}>} subtasksEdit - Array of subtasks, each with a `subtask` string and a `checked` boolean indicating completion.
 *
 * @returns {string} - The generated HTML markup string for the editable big task card.
 *
 * @description
 * The returned HTML includes:
 * - A title input with validation for required input and character limit.
 * - A description textarea.
 * - A due date input with a native date picker fallback.
 * - Priority selection buttons (Urgent, Medium, Low) with icons.
 * - A searchable "Assigned to" multi-select input with dropdown and visual feedback.
 * - A subtask section allowing users to add, edit, or delete subtasks with live feedback.
 * - A final confirmation button ("OK") to save the updated task data.
 *
 * The HTML is responsive, with different rendering logic for subtasks depending on whether the
 * view is mobile (`window.innerWidth <= 1040`) or desktop.
 *
 * @example
 * const html = bigTaskCardEditTemplate(
 *   "Implement login",
 *   "Allow users to log in via email and password",
 *   "25/06/2025",
 *   [{ name: "Alice", color: "#FF5733" }, { name: "Bob", color: "#33FF57" }],
 *   [{ subtask: "Design form", checked: false }, { subtask: "Connect API", checked: true }]
 * );
 * document.getElementById("edit-card-container").innerHTML = html;
 */
function bigTaskCardEditTemplate(taskTitle, taskDescription, taskDueDate, assignedContacts, subtasksEdit) {
    let dueDate = "";
    if (taskDueDate) {
        dueDate = taskDueDate;
    }
    selectedContactsBigTaskCardEdit.length = 0;
    subtasksBigTaskCardEdit.length = 0;
    subtasksCountBigTaskCardEdit = 0;
    assignedContacts.sort((element1, element2) => element1.name.localeCompare(element2.name));
    assignedContacts.forEach(element => selectedContactsBigTaskCardEdit.push(element));
    if (subtasksEdit) {
        subtasksEdit.forEach(element => subtasksBigTaskCardEdit.push(element));
    }
    let subtasksHtml = "";
    for (let index = 0; index < subtasksBigTaskCardEdit.length; index++) {
        let id = ++subtasksCountBigTaskCardEdit;
        subtasksHtml += window.innerWidth <= 1040 ? returnSubtaskMobileHTMLForBigTaskCardEdit(id, subtasksBigTaskCardEdit[index].subtask)
            : returnSubtaskHTMLForBigTaskCardEdit(id, subtasksBigTaskCardEdit[index].subtask);
    }
    return `<div class="big-task-card-edit__task-type-text-button-box edit">
                <button class="big-task-card-edit__task-type-button" onclick="addClassSlideBack()">
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                        <rect x="0.144531" width="24" height="24" fill="none"/>
                        <path d="M12.1443 13.4L7.24434 18.3C7.061 18.4834 6.82767 18.575 6.54434 18.575C6.261 18.575 6.02767 18.4834 5.84434 18.3C5.661 18.1167 5.56934 17.8834 5.56934 17.6C5.56934 17.3167 5.661 17.0834 5.84434 16.9L10.7443 12L5.84434 7.10005C5.661 6.91672 5.56934 6.68338 5.56934 6.40005C5.56934 6.11672 5.661 5.88338 5.84434 5.70005C6.02767 5.51672 6.261 5.42505 6.54434 5.42505C6.82767 5.42505 7.061 5.51672 7.24434 5.70005L12.1443 10.6L17.0443 5.70005C17.2277 5.51672 17.461 5.42505 17.7443 5.42505C18.0277 5.42505 18.261 5.51672 18.4443 5.70005C18.6277 5.88338 18.7193 6.11672 18.7193 6.40005C18.7193 6.68338 18.6277 6.91672 18.4443 7.10005L13.5443 12L18.4443 16.9C18.6277 17.0834 18.7193 17.3167 18.7193 17.6C18.7193 17.8834 18.6277 18.1167 18.4443 18.3C18.261 18.4834 18.0277 18.575 17.7443 18.575C17.461 18.575 17.2277 18.4834 17.0443 18.3L12.1443 13.4Z" fill="#2A3647"/>
                    </svg>
                </button>
            </div>
            <div class="big-task-card-edit__scroll-box">
                <div class="container-input-label big-task-card-edit__text-input-box">
                    <label for="big-task-card-edit__input-title" class="label-add-task flex class="big-task-card-edit__text">
                        Title
                        <span class="asterisk">&#42;</span>
                        <p id="max-char-big-task-card-edit__input-title" class="required-max-chars d-none">Reached maximum amount of 50 chars!</p>
                    </label>
                    <input id="big-task-card-edit__input-title" class="input big-task-card-edit__input" type="text" name="title" placeholder="Enter a title" value="${taskTitle}" maxlength="50" size="10" onkeyup="checkInputLengthForBigTaskCardEdit('big-task-card-edit__input-title'); resetOrShowDateErrorForBigTaskCardEdit()">
                    <p id="required-big-task-card-edit__input-title" class="required hidden">This field is required</p>
                </div>
                <div class="big-task-card-edit__text-textarea-box">
                    <span class="big-task-card-edit__text">Description</span>
                    <textarea class="big-task-card-edit__textarea" id="big-task-card-edit__textarea-description" placeholder="Enter a Description">${taskDescription}</textarea>
                </div>
                <div class="container-input-label big-task-card-edit__text-input-box">
                    <label for="big-task-card-edit__input-due-date" class="label-add-task flex big-task-card-edit__text" id="label-due-date">
                        Due date
                        <span class="asterisk" id="asterisk-due-date">&#42;</span>
                        <p id="invalid-date-big-task-card-edit__input-due-date" class="required hidden">Invalid date format (dd/mm/jjjj)!</p>
                    </label>
                    <div id="big-task-card-edit__input-due-date-box" class="big-task-card-edit__input-due-date-box">
                        <input id="big-task-card-edit__input-due-date" class="big-task-card-edit__input big-task-card-edit__input-due-date input" type="text" name="due-date" placeholder="dd/mm/yyyy" value="${dueDate}" size="10" required  maxlength="10" onkeyup="resetOrShowDateErrorForBigTaskCardEdit()">
                        <input id="big-task-card-edit__input-date-picker" class="big-task-card-edit__input-date-picker" type="date" onchange="putDateToInputForBigTaskCardEdit(); resetOrShowDateErrorForBigTaskCardEdit()">
                    </div>
                    <p id="required-big-task-card-edit__input-due-date" class="required hidden">This field is required</p>
                </div>
                <div id="big-task-card-edit__prioritys-box" class="big-task-card-edit__prioritys-box container-input-label">
                    <span class="label-add-task">Priority</span>
                    <div id="big-task-card-edit__prioritys-button-box" class="big-task-card-edit__prioritys-button-box">
                        <button id="big-task-card-edit__urgent-button" class="button-prio button-prio-hover" type="button" onclick="selectPrioButtonForBigTaskCardEdit('big-task-card-edit__urgent-button')">
                            Urgent
                            <img id="svg-big-task-card-edit__urgent-button" src="../assets/icons/urgent.svg" alt="icon-urgent">
                        </button>
                        <button id="big-task-card-edit__medium-button" class="button-prio button-prio-hover" type="button" onclick="selectPrioButtonForBigTaskCardEdit('big-task-card-edit__medium-button')">
                            Medium
                            <img id="svg-big-task-card-edit__medium-button" src="../assets/icons/medium.svg" alt="icon-medium">
                        </button>
                        <button id="big-task-card-edit__low-button" class="button-prio button-prio-hover" type="button" onclick="selectPrioButtonForBigTaskCardEdit('big-task-card-edit__low-button')">
                            Low
                            <img id="svg-big-task-card-edit__low-button" src="../assets/icons/low.svg" alt="icon-low">
                        </button>
                    </div>
                </div>
                <div class="container-input-label custom-select">
                    <label for="big-task-card-edit__assigned-to-input" class="label-add-task">
                        Assigned to
                    </label>
                    <div id="big-task-card-edit__assigned-to-box" class="big-task-card-edit__assigned-to-box">
                        <input id="big-task-card-edit__assigned-to-input" class="big-task-card-edit__assigned-to-input assigned-to__input" type="text" name="assigned-to" placeholder="Select contacts to assign" onclick="toggleAssignOptionsForBigTaskCardEdit(), stopPropagation(event)" onkeyup="filterContactsForBigTaskCardEdit()">
                        <button class="button-dropdown" type="button" onclick="toggleAssignOptionsForBigTaskCardEdit(), toggleInputFocusForBigTaskCardEdit(), stopPropagation(event)">
                            <img id="big-task-card-edit__arrow-dropdown-assigned" src="../assets/icons/arrow_drop_down.svg" alt="icon-arrow-down">
                        </button>
                    </div>
                    <div id="big-task-card-edit__assigned-to-dropdown" class="big-task-card-edit__assigned-to-dropdown">
                        <div id="big-task-card-edit__dropdown-assign" class="container-custom-select-options big-task-card-edit__dropdown-assign d-none" onmousedown="preventDefault(event)"></div>
                    </div>
                    <div id="big-task-card-edit__assigned-contacts-box" class="big-task-card-edit__assigned-contacts-box"></div>
                </div>
                <div class="container-input-label">
                    <label id="label-subtasks" for="big-task-card-edit__subtask-input" class="label-add-task" placeholder="Add new subtask">
                        Subtasks
                        <p id="invalid-subtask-big-task-card-edit__subtask-input" class="required d-none">Enter at least one character to save subtask!</p>
                        <p id="max-char-big-task-card-edit__subtask-input" class="required-max-chars d-none">Reached maximum amount of 50 chars!</p>
                    </label>
                    <div id="big-task-card-edit__subtask-box" class="big-task-card-edit__subtask-box" onclick="changeInputButtonForBigTaskCardEdit(true), stopPropagation(event)">
                        <input id="big-task-card-edit__subtask-input" class="big-task-card-edit__subtask-input input" type="text" name="subtasks" placeholder="Add new subtask" maxlength="50" onkeyup="resetSubtaskValidationForBigTaskCardEdit()" onkeydown="isEnterKeyForBigTaskCard(event)">                         
                        <button id="big-task-card-edit__subtask-button-add" class="button-add" type="button">
                            <img src="../assets/icons/add.svg" alt="icon-arrow-down">
                        </button>
                        <div id="big-task-card-edit__subtask-buttons-box" class="big-task-card-edit__subtask-buttons-box container-button-confirm d-none">
                            <button type="button" class="button-add button-accept-reject" onclick="processSubtaskForBigTaskCardEdit(false)">
                                <img src="../assets/icons/close.svg" alt="icon-reject">
                            </button>
                            <hr>
                            <button type="button" class="button-add button-accept-reject" onclick="processSubtaskForBigTaskCardEdit(true)">
                                <img src="../assets/icons/check_blue.svg" alt="icon-accept">
                            </button>
                        </div>
                    </div>
                    <div id="big-task-card-edit__subtasks-box" class="big-task-card-edit__subtasks-box big-task-card-edit__container-subtasks">${subtasksHtml}</div>
                </div>
            </div>
                <div class="big-task-card-edit__task-type-text-button-box">
                    <button class="big-task-card-edit__Ok-button" onclick="readFromEditAndSaveData()">Ok <img class="big-task-card-edit__Ok-button-img" src="../assets/icons/check.png"></button>
                </div>`;
}

/**
 * Generates the HTML template for the "Add Task" form, including sections for the task title, description, due date, priority, assigned contacts, category, subtasks, and action buttons.
 * The function returns the generated HTML string that can be used to dynamically render the task form on the page.
 * The form includes validation for required fields, maximum character length, and various interaction features such as dropdowns and date pickers.
 * 
 * @returns {string} The HTML string representing the structure of the "Add Task" form.
 */
function addTaskTemplate() {
    return `<div class="all-content">
    <section id="main" onclick="closeDropdown(), changeInputButton(false), stopPropagation(event)">
        <div id="container-form">
            <div id="form-top">
                <h1>Add Task</h1>
                <button class="add-task__close-button" onclick="addTaskBoxAddClassSlideBack(); clearSelectedContactsAndSubtasks();">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="0.185" width="30.72" height="30.72" fill="none"/>
                        <path d="M15.552 17.867L9.29 24.13C9.058 24.362 8.763 24.48 8.405 24.48C8.047 24.48 7.752 24.362 7.52 24.13C7.288 23.898 7.17 23.603 7.17 23.245C7.17 22.887 7.288 22.592 7.52 22.36L13.782 16.098L7.52 9.837C7.288 9.604 7.17 9.31 7.17 8.952C7.17 8.594 7.288 8.299 7.52 8.067C7.752 7.835 8.047 7.717 8.405 7.717C8.763 7.717 9.058 7.835 9.29 8.067L15.552 14.328L21.813 8.067C22.045 7.835 22.34 7.717 22.698 7.717C23.056 7.717 23.351 7.835 23.583 8.067C23.815 8.299 23.933 8.594 23.933 8.952C23.933 9.31 23.815 9.604 23.583 9.837L17.321 16.098L23.583 22.36C23.815 22.592 23.933 22.887 23.933 23.245C23.933 23.603 23.815 23.898 23.583 24.13C23.351 24.362 23.056 24.48 22.698 24.48C22.34 24.48 22.045 24.362 21.813 24.13L15.552 17.867Z" fill="#2A3647"/>
                    </svg>
                </button>
            </div>
            <form id="form-add-task">
                <div id="form-left">
                    <div class="container-input-label">
                        <label for="title" class="label-add-task flex">
                            Title
                            <span class="asterisk">&#42;</span>
                            <p id="max-char-title" class="required-max-chars d-none">Reached maximum amount of 50 chars!</p>
                        </label>
                        <input id="title" class="input" onkeyup="resetOrShowDateError()" type="text" name="title" placeholder="Enter a title" maxlength="50" size="10" onkeyup="checkInputLength('title')">
                        <p id="required-title" class="required hidden">This field is required</p>
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
                            <p id="invalid-date" class="required hidden">Invalid date format (dd/mm/jjjj)!</p>
                        </label>
                        <div id="container-input-due-date">
                            <input id="due-date" class="input" onkeyup="resetOrShowDateError()" type="text" name="due-date" placeholder="dd/mm/yyyy" size="10" required  maxlength="10">
                            <input id="date-picker" type="date" onchange="putDateToInput(); resetOrShowDateError()">
                        </div>
                        <p id="required-due-date" class="required hidden">This field is required</p>
                    </div>
                </div>
                <hr id="separator">
                <div id="form-right">
                    <div id="container-prioritys" class="container-input-label">
                        <span class="label-add-task">Priority</span>
                        <div id="buttons-prio">
                            <button id="urgent" class="button-prio button-prio-hover" type="button" onclick="selectPrioButton('urgent')">
                                Urgent
                                <img id="svg-urgent" src="../assets/icons/urgent.svg" alt="icon-urgent">
                            </button>
                            <button id="medium" class="button-prio medium white" type="button" onclick="selectPrioButton('medium')">
                                Medium
                                <img id="svg-medium" src="../assets/icons/medium.svg" alt="icon-medium" class="filter-white">
                            </button>
                            <button id="low" class="button-prio button-prio-hover" type="button" onclick="selectPrioButton('low')">
                                Low
                                <img id="svg-low" src="../assets/icons/low.svg" alt="icon-low">
                            </button>
                        </div>
                    </div>
                    <div class="container-input-label custom-select">
                        <label for="assigned-to" class="label-add-task">
                            Assigned to
                        </label>
                        <div id="container-input-assigned">
                            <input id="assigned-to" type="text" name="assigned-to" placeholder="Select contacts to assign" size="10" onclick="toggleAssignOptions(), stopPropagation(event)" onkeyup="filterContacts()">
                            <button class="button-dropdown" type="button" onclick="toggleAssignOptions(), toggleInputFocus(), stopPropagation(event)">
                                <img id="arrow-dropdown-assigned" src="../assets/icons/arrow_drop_down.svg" alt="icon-arrow-down">
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
                            <input readonly id="category" type="text" name="category" placeholder="Select task category" size="10" onclick="toggleCategoryOptions(), stopPropagation(event)">
                            <button class="button-dropdown" type="button">
                                <img id="arrow-dropdown-category" src="../assets/icons/arrow_drop_down.svg" alt="icon-arrow-down" onclick="toggleCategoryOptions(), stopPropagation(event)">
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
                        <p id="required-category" class="required hidden">This field is required</p>
                    </div>
                    <div class="container-input-label">
                        <label id="label-subtasks" for="subtasks" class="label-add-task" placeholder="Add new subtask">
                            Subtasks
                            <p id="invalid-subtask" class="required d-none">Enter at least one character to save subtask!</p>
                            <p id="max-char-subtasks" class="required-max-chars d-none">Reached maximum amount of 50 chars!</p>
                        </label>
                        <div id="container-input-subtask" onclick="changeInputButton(true), stopPropagation(event)">
                            <input id="subtasks" class="input" type="text" name="subtasks" placeholder="Add new subtask" maxlength="50" size="10" onkeyup="resetSubtaskValidation()" onkeydown="isEnterKey(event)">
                            <button id="button-add" class="button-add" type="button">
                                <img src="../assets/icons/add.svg" alt="icon-arrow-down">
                            </button>
                            <div id="container-buttons" class="container-button-confirm d-none">
                                <button type="button" class="button-add button-accept-reject" onclick="processSubtask(false)">
                                    <img src="../assets/icons/close.svg" alt="icon-reject">
                                </button>
                                <hr>
                                <button type="button" class="button-add button-accept-reject" onclick="processSubtask(true)">
                                    <img src="../assets/icons/check_blue.svg" alt="icon-accept">
                                </button>
                            </div>
                        </div>
                        <div id="container-subtasks"></div>
                    </div>
                    <p id="required-mobile"><span class="asterisk">&#42;</span>This field is required</p>
                </div>
            </form>
            <div id="footer-add-task">
                <p class="flex"><span class="asterisk">&#42;</span>This field is required</p>
                <div id="clear-create-buttons">
                    <button id="button-clear" onclick="clearInputs()">Clear
                        <img src="../assets/icons/cancel.svg" alt="icon-cancel">
                    </button>
                    <button id="button-create" onclick="createTaskOverlay()">Create task
                        <img src="../assets/icons/check.svg" alt="icon-check">
                    </button>
                </div>
            </div>
        </div>
    </section>
    <div id="overlay-task-added" class="d-none">
        <div id="task-added">
            <span>Task added to board</span>
            <img class="menu-button-icon" src="../assets/icons/board.svg" alt="icon-board">
        </div>
    </div>
    </div>
`
}

/**
 * Generates the HTML structure for displaying an assigned contact in the "Big Task Card Edit" view.
 * This HTML includes the contact's initials, name, and an unchecked icon, along with a click handler
 * that allows the user to select the contact. The contact's name and color are dynamically included
 * in the HTML structure.
 *
 * @param {string} name - The name of the contact to be displayed.
 * @param {string} color - The color associated with the contact, which may be used for customization.
 * 
 * @returns {string} - The HTML structure for the assigned contact element.
 *
 * @example
 * const contactHTML = returnAssignedContactHTMLForBigTaskCardEdit("John Doe", "blue");
 * document.getElementById("assigned-contact-container").innerHTML = contactHTML;
 */
function returnAssignedContactHTMLForBigTaskCardEdit(name, color) {
    return `<div id="edit-container-${name}" class="container-custom-select-option edit-container select-option-with-scrollbar" onclick="selectContactForBigTaskCardEdit('${name}','${color}'), stopPropagation(event)">
                <div class="flex-align gap-15">
                    <span id="edit-initials-${name}" class="initials"></span>
                    <span id="edit-${name}" class="name"></span>
                </div>
                <img id="edit-icon-${name}" src="../assets/icons/unchecked.svg" alt="icon-unchecked">
            </div>`;
}

/**
 * Generates the HTML structure for displaying a subtask in the "Big Task Card Edit" view.
 *
 * The generated HTML includes:
 * - A container for the subtask with a unique ID.
 * - An editable input field for modifying the subtask.
 * - Buttons for saving or deleting the subtask.
 * - A display view of the subtask text with edit/delete icons that appear on hover.
 *
 * This structure allows the subtask to be dynamically manipulated in the UI, including editing
 * via double-click and showing edit options on hover.
 *
 * @param {number} id - The unique identifier for the subtask. Used to create element IDs and bind event handlers.
 * @param {string} [subtaskText=""] - The text content of the subtask to be displayed. Defaults to an empty string.
 *
 * @returns {string} The full HTML string for rendering the subtask element in the edit view.
 *
 * @example
 * const subtaskHTML = returnSubtaskHTMLForBigTaskCardEdit(1, "Write documentation");
 * document.getElementById("subtasks-container").innerHTML += subtaskHTML;
 */
function returnSubtaskHTMLForBigTaskCardEdit(id, subtaskText = "") {
    return `<div id="big-task-card-edit__container-subtask-${id}" class="position-relative">
                <div id="big-task-card-edit__edit-subtask-${id}" class="container-subtask-edit big-task-card-edit__edit-subtask d-none">
                    <input id="big-task-card-edit__input-subtask-${id}" class="input-edit" type="text"  maxlength="50">
                    <div class="flex">
                        <img src="../assets/icons/delete.svg" alt="icon-delete" onclick="deleteSubtaskForBigTaskCardEdit(${id}, event)">
                        <hr class="edit-hr">
                        <img class="check-blue" src="../assets/icons/check_blue.svg" alt="icon-accept" onclick="saveEditedSubtaskForBigTaskCard(${id})">
                    </div>
                </div>
                <div id="big-task-card-edit__details-subtask-${id}" class="container-subtask big-task-card-edit__details-subtask subtask-scroll-margin" onmouseover="showEditOptionsForBigTaskCardEdit(${id}, true)" onmouseleave="showEditOptionsForBigTaskCardEdit(${id}, false)" ondblclick="editSubtaskForBigTaskCard(${id})">
                    <div class="subtask-text" onmouseover="showEditOptionsForBigTaskCardEdit(${id}, true)" onmouseleave="showEditOptionsForBigTaskCardEdit(${id}, false)">
                        <span>&bull;</span>
                        <span id="big-task-card-edit__subtask-${id}" class="subtask-text-span">${subtaskText}</span>
                    </div>
                    <div id="big-task-card-edit__icons-subtask-${id}" class="subtask-icons d-none" onmouseover="showEditOptionsForBigTaskCardEdit(${id}, true)" onmouseleave="showEditOptionsForBigTaskCardEdit(${id}, false)">
                        <img src="../assets/icons/edit.svg" alt="icon-edit" onclick="editSubtaskForBigTaskCard(${id})">
                        <hr>
                        <img src="../assets/icons/delete.svg" alt="icon-delete" onclick="deleteSubtaskForBigTaskCardEdit(${id}, event)">
                    </div>
                </div>
            </div>`;
}

/**
 * Generates the HTML structure for displaying a subtask in the "Big Task Card Edit" view,
 * specifically optimized for mobile devices.
 *
 * The generated HTML includes:
 * - An edit container with an input field for modifying the subtask text.
 * - Action icons for deleting or saving the subtask while in edit mode.
 * - A display container for showing the subtask text.
 * - Edit and delete icons that are always visible in the mobile layout (no hover required).
 * - Unique element IDs based on the subtask ID to support dynamic interaction and DOM updates.
 *
 * @param {number} id - The unique identifier for the subtask. Used to generate unique HTML element IDs
 *                      and bind functionality such as edit and delete actions.
 * @param {string} [subtaskText=""] - The text content of the subtask. Defaults to an empty string if not provided.
 *
 * @returns {string} The HTML string representing the subtask element, formatted for mobile view.
 *
 * @example
 * const subtaskMobileHTML = returnSubtaskMobileHTMLForBigTaskCardEdit(1, "Fix login bug");
 * document.getElementById("subtasks-container-mobile").innerHTML += subtaskMobileHTML;
 */
function returnSubtaskMobileHTMLForBigTaskCardEdit(id, subtaskText = "") {
    return `<div id="big-task-card-edit__container-subtask-${id}" class="position-relative">
                <div id="big-task-card-edit__edit-subtask-${id}" class="container-subtask-edit big-task-card-edit__edit-subtask d-none">
                    <input id="big-task-card-edit__input-subtask-${id}" class="input-edit" type="text"  maxlength="50">
                    <div class="flex">
                        <img src="../assets/icons/delete.svg" alt="icon-delete" onclick="deleteSubtaskForBigTaskCardEdit(${id}, event)">
                        <hr class="edit-hr">
                        <img class="check-blue" src="../assets/icons/check_blue.svg" alt="icon-accept" onclick="saveEditedSubtaskForBigTaskCard(${id})">
                    </div>
                </div>
                <div id="big-task-card-edit__details-subtask-${id}" class="container-subtask big-task-card-edit__details-subtask subtask-scroll-margin">
                    <div class="subtask-text">
                        <span>&bull;</span>
                        <span id="big-task-card-edit__subtask-${id}" class="subtask-text-span">${subtaskText}</span>
                    </div>
                    <div id="big-task-card-edit__icons-subtask-${id}" class="subtask-icons">
                        <img src="../assets/icons/edit.svg" alt="icon-edit" onclick="editSubtaskForBigTaskCard(${id})">
                        <hr>
                        <img src="../assets/icons/delete.svg" alt="icon-delete" onclick="deleteSubtaskForBigTaskCardEdit(${id}, event)">
                    </div>
                </div>
            </div>`;
}