async function getContactListTemplate(name, email, bgColor) {
return `
    <section>
        <div class="container-contact" onclick="selectContact(this)" id="selectContact">
            <div class="container-initials ${bgColor}" id="doppelInitials-${name}">AM</div>
                <div class="container-contact-preview">
                    <span class="contact-preview-name" id="${name}">${name}</span>
                    <span class="contact-preview-mail">${email}</span>
                </div>
            </div>
        </div>
    </section>
`
}

async function selectMoreContactInformationTemplate(contact) {
    let bgColorClass = getBackgroundColor(contact.name);
    let initials = findInitials(contact.name);
    return `
        <section class="contact-info-container">
            <div class="info-name-container">
                <div class="more-info-initials ${bgColorClass}" id="doppelInitials-${contact.name}">${initials}</div>
                <div class="procressing-area">
                    <h1>${contact.name}</h1>
                    <div class="procressing-area-button-container">
                        <button class="procressing-area-button">
                            <img src="assets/icons/edit.svg" alt="">
                            <p>Edit</p>
                        </button>
                        <button class="procressing-area-button">
                            <img src="assets/icons/delete.svg" alt=""><p>Delete</p>
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