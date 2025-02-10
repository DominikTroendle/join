async function getContactListTemplate(i) {
return `
    <div>
        <div class="container-letter">
            <span>A</span>
        </div>
        <hr>
        <div class="container-contact" onclick="selectContact()">
            <div class="container-initials">AM</div>
                <div class="container-contact-preview">
                    <span class="contact-preview-name">${allContacts[i].name}</span>
                    <span class="contact-preview-mail">${allContacts[i].email}</span>
                </div>
            </div>
`
}