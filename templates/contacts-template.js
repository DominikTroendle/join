async function getContactListTemplate(contactName, contactMail, colorName) {
return `
    <section>
        <div class="container-contact" onclick="selectContact(this)" id="selectContact-${contactName}">
            <div class="container-initials ${colorName}"><p id="doppelInitials-${contactName}">AM</p></div>
                <div class="container-contact-preview">
                    <span class="contact-preview-name" id="${contactName}">${contactName}</span>
                    <span class="contact-preview-mail">${contactMail}</span>
                </div>
            </div>
        </div>
    </section>
`
}

async function selectMoreContactInformationTemplate(contact, init) {
    return `
        <section class="contact-info-container">
            <div class="info-name-container">
                <div class="more-info-initials ${contact.color}"><p>${init}</p></div>
                <div class="procressing-area">
                    <h1>${contact.name}</h1>
                    <div class="procressing-area-button-container">
                        <button class="procressing-area-button">
                            <img src="assets/icons/edit.svg" alt="">
                            <p>Edit</p>
                        </button>
                        <button class="procressing-area-button" onclick="deleteContact('${contact.key}')">
                            <img src="assets/icons/delete.svg" alt="">
                            <p>Delete</p>
                        </button>
                    </div>
                </div>
            </div>
            <div class="contact-information">
                <p>Contact Information</p>
            </div>
            <div class="info-box-container">
                <div class="info-box">
                    <p>Email</p>
                    <a href="">${contact.email}</a>
                </div>
                <div class="info-box">
                    <p>Phone</p>
                    ${contact.phone}
                </div>
            </div>
        </section>
    `;
}