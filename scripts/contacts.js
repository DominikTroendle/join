function selectContact() {
    let element = document.getElementById('')
}


function addNewContect() {
    refOverlay = document.getElementById('nexContectOverlay');
    refOverlay.classList.toggle('d-none')
    refOverlay.onclick = function(event) {
        if (event.target === refOverlay) {
            refOverlay.classList.add('d-none');
        }
    };
}