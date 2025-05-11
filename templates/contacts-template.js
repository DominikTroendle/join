/**
 * Returns an HTML string for a contact list item.
 * 
 * @param {string} contactName - The contact's name.
 * 
 * @param {string} contactMail - The contact's email address.
 * 
 * @param {string} colorName - CSS class for contact's color.
 * 
 * @returns {Promise<string>} HTML template string.
 */
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


/**
 * Returns an HTML template string displaying detailed contact information.
 * 
 * @param {Object} contact - The contact object containing details like name, email, phone, and key.
 * 
 * @param {string} initial - The initials to display for the contact.
 * 
 * @returns {Promise<string>} A promise that resolves to the HTML string.
 */
async function selectMoreContactInformationTemplate(contact, initial) {
    return `
        <section class="contact-info-container" id="contact-${contact.key}">
            <div class="info-name-container">
                <div class="more-info-initials ${contact.color}"><p>${initial}</p></div>
                <div class="procressing-area">
                    <div class="container-user-name">
                        <h1>${contact.name}</h1>
                    </div>
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

/**
 * Returns the HTML template string for the "Add New Contact" form.
 * 
 * @returns {string} HTML markup as a string.
 */
function getToCreatANewContactTemplate() {
return`
    <div class="new-Contect-Container">
        <div class="information-content-container">
            <img src="../assets/img/join-logo-weiß.png" alt="">
            <h1>Add contact</h1>
            <p>Tasks are better whit a team!</p>
            <hr>
        </div>
        <div class="add-input-contect-container">
            <div class="close-btn">
                <button class="desktop-close-btn" onclick="closeAddNewContact()"><img src="../assets/icons/close.svg" alt=""></button>
                <button class="mobile-close-btn" onclick="closeAddNewContact()"><img src="../assets/img/close-mobile-white.svg" alt=""></button>
            </div>
            <div class="new-user-image">
                <img src="../assets/img/person.png" alt="">
            </div>
            <form onsubmit="return addUserToContactList(event, this);">
                <div class="input-container">
                    <div class="input-area">
                        <input type="text" placeholder="Name" id="name" pattern="^\\S(.*\\S)?$" title="No spaces allowed at the beginning or end" required>
                        <img src="../assets/img/person-grey.png" alt="">
                    </div>
                    <div class="input-container">
                        <div class="input-area">
                                <input type="email" placeholder="Email" id="email" pattern="^\\S+$" title="No spaces allowed" required>
                                <img src="../assets/img/mail.png" alt="">
                        </div> 
                    </div>
                    <div class="input-container">
                        <div class="input-area">
                            <input type="tel" name="phone" pattern="^\\+?[0-9]+$" placeholder="Phone" id="phone" required>
                            <img src="../assets/img/call.png" alt="">
                        </div>
                    </div>
                    <div class="contact-button-container">
                        <button class="cancel-btn" onclick="closeAddNewContact(); return false;">Cancel <p>X</p>
                        </button>
                        <button class="create-btn" type="submit">Create contact <img src="../assets/icons/check.svg" alt=""></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
`
}

/**
 * Returns the HTML template for editing a contact with the given key.
 * 
 * @param {string} key - The contact's unique identifier.
 * 
 * @returns {string} HTML string for the edit contact form.
 */
function getEditContactTemplate(key) {
    return`
        <div class="edit-Contect-Container">
            <div class="information-content-container">
                <img src="../assets/img/join-logo-weiß.png" alt="">
                <h1>Edit contact</h1>
                <hr>
            </div>
            <div class="edit-add-input-contect-container">
                <div class="close-btn">
                    <button class="desktop-close-btn" onclick="closeEditContact('${key}')"><img src="../assets/icons/close.svg" alt=""></button>
                    <button class="mobile-close-btn" onclick="closeEditContact('${key}')"><img src="../assets/img/close-mobile-white.svg" alt=""></button>
                </div>
                <div class="edit-contact-initcolor" id="editUserInitials">
                    <p class="edit-contact-initialien" id="editUserInitialsText">AB</p>
                </div>
                <form onsubmit="return editContact(event, this);">
                    <div class="input-container mobile-container">
                        <div class="input-area">
                            <input type="text" placeholder="Name" id="editName" pattern="^\\S(.*\\S)?$" title="No spaces allowed at the beginning or end" required>
                            <img src="../assets/img/person-grey.png" alt="">
                        </div>
                        <div class="input-container">
                            <div class="input-area">
                                <input type="email" placeholder="Email" id="editEmail" pattern="^\\S+$" title="No spaces allowed" required>
                                <img src="../assets/img/mail.png" alt="">
                            </div> 
                        </div>
                        <div class="input-container">
                            <div class="input-area">
                                <input type="tel" name="phone" pattern="^\\+?[0-9]+$" placeholder="Phone" id="editPhone" required>
                                <img src="../assets/img/call.png" alt="">
                            </div>
                        </div>
                        <div class="contact-button-container">
                            <button class="edit-cancel-btn mobile-delete-view" type="button" onclick="deleteContact('${key}')";>Delete</button>
                            <button class="save-btn" type="buttom">Save<img src="../assets/icons/check.svg" alt="" onclick="putData('${key}')"></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
}

