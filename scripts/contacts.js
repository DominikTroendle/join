function selectContact() {
    let element = document.getElementById('')
}


function addNewContect() {
    refOverlay = document.getElementById('newContectOverlay');
    refOverlay.classList.toggle('d-none');
    refOverlay.onclick = function(event) {
        if (event.target === refOverlay) {
            refOverlay.classList.toggle('d-none');
        }
    };
}