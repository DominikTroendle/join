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

async function selectMoreContactInformationTemplate(contact, initial) {
    return `
        <section class="contact-info-container" id="contact-${contact.key}">
            <div class="info-name-container">
                <div class="more-info-initials ${contact.color}"><p>${initial}</p></div>
                <div class="procressing-area">
                    <h1>${contact.name}</h1>
                    <div class="procressing-area-button-container">
                        <button class="procressing-area-button" onclick="editContactOverlay('${contact.key}')">
                            <svg class="icon" width="19" height="19" viewBox="0 0 19 19" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z"/>
                            </svg>
                            <p>Edit</p>
                        </button>
                        <button class="procressing-area-button" onclick="deleteContact('${contact.key}')">
                            <svg class="icon" width="16" height="18" viewBox="0 0 16 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 18c-.55 0-1.02-.2-1.41-.59C1.2 17.02 1 16.55 1 16V3c-.28 0-.52-.1-.71-.29C.1 2.52 0 2.28 0 2s.1-.52.29-.71C.48 1.1.72 1 1 1h4c0-.28.1-.52.29-.71C5.48.1 5.72 0 6 0h4c.28 0 .52.1.71.29.19.19.29.43.29.71h4c.28 0 .52.1.71.29.19.19.29.43.29.71s-.1.52-.29.71c-.19.19-.43.29-.71.29v13c0 .55-.2 1.02-.59 1.41-.39.38-.86.59-1.41.59H3ZM3 3v13h10V3H3Zm2 10c0 .28.1.52.29.71.19.19.43.29.71.29s.52-.1.71-.29c.19-.19.29-.43.29-.71V6c0-.28-.1-.52-.29-.71C6.52 5.1 6.28 5 6 5s-.52.1-.71.29C5.1 5.48 5 5.72 5 6v7Zm4 0c0 .28.1.52.29.71.19.19.43.29.71.29s.52-.1.71-.29c.19-.19.29-.43.29-.71V6c0-.28-.1-.52-.29-.71C10.52 5.1 10.28 5 10 5s-.52.1-.71.29c-.19.19-.29.43-.29.71v7Z"/>
                            </svg>
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
        <div class="procress-mobile-view"></div>
        <div id="mobile-procressing-area-overlay" class="mobile-procressing-area-overlay">
                <div class="procressing-mobile-menu-container">
                    <div class="procressing-mobile-menu">
                        <div class="procressing-area-button-mobile-position">
                            <button class="procressing-area-edit-button-mobile" onclick="editContactOverlay('${contact.key}'); toggleButtonColor(this)">
                                <svg class="icon" width="18" height="18" viewBox="0 0 19 19" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z"/>
                                </svg>
                                <p>Edit</p>
                            </button>
                            <button class="procressing-area-delete-button-mobile" onclick="deleteContact('${contact.key}'); toggleButtonColor(this)">
                                <svg class="icon" width="18" height="18" viewBox="0 0 16 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 18c-.55 0-1.02-.2-1.41-.59C1.2 17.02 1 16.55 1 16V3c-.28 0-.52-.1-.71-.29C.1 2.52 0 2.28 0 2s.1-.52.29-.71C.48 1.1.72 1 1 1h4c0-.28.1-.52.29-.71C5.48.1 5.72 0 6 0h4c.28 0 .52.1.71.29.19.19.29.43.29.71h4c.28 0 .52.1.71.29.19.19.29.43.29.71s-.1.52-.29.71c-.19.19-.43.29-.71.29v13c0 .55-.2 1.02-.59 1.41-.39.38-.86.59-1.41.59H3ZM3 3v13h10V3H3Zm2 10c0 .28.1.52.29.71.19.19.43.29.71.29s.52-.1.71-.29c.19-.19.29-.43.29-.71V6c0-.28-.1-.52-.29-.71C6.52 5.1 6.28 5 6 5s-.52.1-.71.29C5.1 5.48 5 5.72 5 6v7Zm4 0c0 .28.1.52.29.71.19.19.43.29.71.29s.52-.1.71-.29c.19-.19.29-.43.29-.71V6c0-.28-.1-.52-.29-.71C10.52 5.1 10.28 5 10 5s-.52.1-.71.29c-.19.19-.29.43-.29.71v7Z"/>
                                </svg>
                                <p>Delete</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    `;
}

function getToCreatANewContactTemplate() {
return`
    <div class="new-Contect-Container">
        <div class="information-content-container">
            <img src="assets/img/Capa 2.png" alt="">
            <h1>Add contact</h1>
            <p>Tasks are better whit a team!</p>
            <hr>
        </div>
        <div class="add-input-contect-container">
            <div class="close-btn">
                <button class="desktop-close-btn" onclick="closeAddNewContact()"><img src="assets/icons/close.svg" alt=""></button>
                <button class="mobile-close-btn" onclick="closeAddNewContact()"><img src="assets/img/close-mobile-white.png" alt=""></button>
            </div>
            <div class="new-user-image">
                <img src="assets/img/person.png" alt="">
            </div>
            <form onsubmit="return addUserToContactList(event, this);">
                <div class="input-container">
                    <div class="input-area">
                        <input type="text" placeholder="Name" id="name" required>
                        <img src="assets/img/person-grey.png" alt="">
                    </div>
                    <div class="input-container">
                        <div class="input-area">
                                <input type="email" placeholder="Email" id="email" required>
                                <img src="assets/img/mail.png" alt="">
                        </div> 
                    </div>
                    <div class="input-container">
                        <div class="input-area">
                            <input type="tel" placeholder="Phone" id="phone" required>
                            <img src="assets/img/call.png" alt="">
                        </div>
                    </div>
                    <div class="contact-button-container">
                        <button class="cancel-btn" onclick="closeAddNewContact(); return false;">Cancel <p>X</p>
                        </button>
                        <button class="create-btn" type="submit">Create contact <img src="assets/icons/check.svg" alt=""></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
`
}

function getEditContactTemplate(key) {
    return`
        <div class="edit-Contect-Container">
            <div class="information-content-container">
                <img src="assets/img/Capa 2.png" alt="">
                <h1>Edit contact</h1>
                <hr>
            </div>
            <div class="add-input-contect-container">
                <div class="close-btn">
                    <button class="desktop-close-btn" onclick="closeEditContact('${key}')"><img src="assets/icons/close.svg" alt=""></button>
                    <button class="mobile-close-btn" onclick="closeEditContact('${key}')"><img src="assets/img/close-mobile-white.png" alt=""></button>
                </div>
                <div class="edit-contact-initcolor" id="editUserInitials">
                    <p class="edit-contact-initialien" id="editUserInitialsText">AB</p>
                </div>
                <form onsubmit="return editContact(event, this);">
                    <div class="input-container mobile-container">
                        <div class="input-area">
                            <input type="text" placeholder="Name" id="editName" required>
                            <img src="assets/img/person-grey.png" alt="">
                        </div>
                        <div class="input-container">
                            <div class="input-area">
                                <input type="email" placeholder="Email" id="editEmail" required>
                                <img src="assets/img/mail.png" alt="">
                            </div> 
                        </div>
                        <div class="input-container">
                            <div class="input-area">
                                <input type="tel" placeholder="Phone" id="editPhone" required>
                                <img src="assets/img/call.png" alt="">
                            </div>
                        </div>
                        <div class="contact-button-container">
                            <button class="cancel-btn mobile-delete-view" type="submit" onclick="deleteContact('${key}')";>Delete</button>
                            <button class="save-btn" type="submit">Save<img src="assets/icons/check.svg" alt=""></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
}

