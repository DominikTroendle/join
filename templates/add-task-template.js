function returnAssignedContactHTML(name, color) {
    return `<div id="container-${name}" class="container-custom-select-option select-option-with-scrollbar" onclick="selectContact('${name}','${color}'), stopPropagation(event)">
                <div class="flex-align gap-15">
                    <span id="initials-${name}" class="initials"></span>
                    <span id="${name}" class="name"></span>
                </div>
                <img id="icon-${name}" src="./assets/icons/unchecked.svg" alt="icon-unchecked">
            </div>`;
}

function returnAssignedContactPreviewHTML(initials, color) {
    return `<span class="initials ${color}">${initials}</span>`;
}

function returnSubtaskHTML(id) {
    return `<div id="container-subtask-${id}" class="position-relative">
                <div id="edit-subtask-${id}" class="container-subtask-edit d-none">
                    <input id="input-subtask-${id}" class="input-edit" type="text">
                    <div class="flex">
                        <img src="./assets/icons/delete.svg" alt="icon-delete" onclick="deleteSubtask(${id})">
                        <hr class="edit-hr">
                        <img class="check-blue" src="./assets/icons/check_blue.svg" alt="icon-accept" onclick="saveEditedSubtask(${id})">
                    </div>
                </div>
                <div id="details-subtask-${id}" class="container-subtask" onmouseover="showEditOptions(${id}, true)" onmouseleave="showEditOptions(${id}, false)" ondblclick="editSubtask(${id})">
                    <div class="subtask-text" onmouseover="showEditOptions(${id}, true)" onmouseleave="showEditOptions(${id}, false)">
                        <span>&bull;</span>
                        <span id="subtask-${id}"></span>
                    </div>
                    <div id="icons-subtask-${id}" class="subtask-icons d-none" onmouseover="showEditOptions(${id}, true)" onmouseleave="showEditOptions(${id}, false)">
                        <img src="./assets/icons/edit.svg" alt="icon-edit" onclick="editSubtask(${id})">
                        <hr>
                        <img src="./assets/icons/delete.svg" alt="icon-delete" onclick="deleteSubtask(${id})">
                    </div>
                </div>
            </div>`;
}