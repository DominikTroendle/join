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