function returnAssignedContactHTML(name) {
    return `<div id="container-${name}" class="container-custom-select-option" onclick="selectContact('${name}'), stopPropagation(event)">
                <div class="container-bg">
                    <div class="flex-align gap-15">
                        <span class="initials"></span>
                        <span id="${name}" class="name"></span>
                    </div>
                    <img id="icon-${name}" src="./assets/icons/unchecked.svg" alt="icon-unchecked">
                </div>
            </div>`;
}

function returnSubtaskHTML(id) {
    return `<div id="container-subtask-${id}" class="position-relative">
                <div id="edit-subtask-${id}" class="container-subtask-edit d-none">
                    <input id="input-subtask-${id}" class="input-edit" type="text">
                    <div class="subtask-icons">
                        <img src="./assets/icons/delete.svg" alt="icon-delete" onclick="deleteSubtask(${id})">
                        <hr>
                        <img src="./assets/icons/check_blue.svg" alt="icon-accept" onclick="saveEditedSubtask(${id})">
                    </div>
                </div>
                <div id="details-subtask-${id}" class="container-subtask" onmouseover="toggleEditOptions(${id})" onmouseleave="toggleEditOptions(${id})">
                    <div class="subtask-text" onmouseover="toggleEditOptions(${id})" onmouseleave="toggleEditOptions(${id})">
                        <span>&bull;</span>
                        <span id="subtask-${id}"></span>
                    </div>
                    <div id="icons-subtask-${id}" class="subtask-icons d-none" onmouseover="toggleEditOptions(${id})" onmouseleave="toggleEditOptions(${id})">
                        <img src="./assets/icons/edit.svg" alt="icon-edit" onclick="editSubtask(${id})">
                        <hr>
                        <img src="./assets/icons/delete.svg" alt="icon-delete" onclick="deleteSubtask(${id})">
                    </div>
                </div>
            </div>`;
}