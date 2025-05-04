/**
 * Toggles the new contact overlay.
 */
function addNewContactOverlay() {
    let refNewContactTemplateOverlay = document.getElementById('newContactOverlay');
    refNewContactTemplateOverlay.innerHTML = getToCreatANewContactTemplate();
    let newContactOverlay = document.querySelector('.new-contact-overlay');
    let newContactContainer = document.querySelector('.new-Contect-Container');
    newContactOverlay.classList.add('active');
    setTimeout(() => {
        newContactContainer.classList.add('active');
    }, 10)

    newContactOverlay.onclick = function (event) {
        if (event.target === newContactOverlay) {
            newContactOverlay.classList.remove('active');
            newContactContainer.classList.remove('active');
        }
    }
}

/**
 * Closes the "add new contact" overlay with a fade-out effect.
 */
function closeAddNewContact() {
    let newContactOverlay = document.querySelector('.new-contact-overlay');
    let newContactContainer = document.querySelector('.new-Contect-Container');
    newContactContainer.classList.remove('active');
    setTimeout(() => {
        newContactOverlay.classList.remove('active');
    }, 350);
}

/**
 * Resets the contact form.
 */
function resetContactForm() {
    let form = document.querySelector('#newContectOverlay form');
    if (form) {
        form.reset();
    }
}

/**
 * Adds a new user to the contact list.
 * 
 * @param {Event} event - The event object.
 * 
 * @param {HTMLFormElement} form - The form containing user data.
 */
async function addUserToContactList(event, form) {
    event.preventDefault();
    let userId = localStorage.getItem("userId"), color = await randomBgColor();
    let newContact = await createContact(form, color);
    let response = await sendData(`${userId}/allContacts`, newContact);
    newContact.key = response.name;
    allContacts.push(newContact);
    await loadContactList();
    moreContactInformation(newContact.name);
    highlightNewContact(newContact);
    form.reset();
    successfullyContact();
    let addButton = document.getElementById('addContactButton');
    if (addButton) {
        addButton.onclick = addNewContactOverlay;
    }
    return false;
}

/**
 * Creates a contact object from form input values.
 * 
 * @param {HTMLFormElement} form - The form containing contact inputs.
 * 
 * @param {string} color - The contact's assigned color.
 * 
 * @returns {Promise<Object>} The contact object.
 */
async function createContact(form, color) {
    return {
        name: form.querySelector('#name').value,
        email: form.querySelector('#email').value,
        phone: formatPhone(form.querySelector('#phone').value),
        color: color
    };
}

/**
 * Creates a contact object.
 * 
 * @param {HTMLFormElement} form - The form element.
 * 
 * @param {string} color - The contact color.
 */
async function createContact(form, color) {
    return {
        name: form.querySelector('#name').value,
        email: form.querySelector('#email').value,
        phone: formatPhone(form.querySelector('#phone').value),
        color: color
    };
}

/**
 * Formats a phone number to international format with +49 prefix.
 * 
 * @param {string} phone - Input phone number.
 * 
 * @returns {string} Formatted phone number.
 */
function cleanPhoneNumber(phone) {
    let digits = phone.replace(/\D/g, '');
    if (digits.startsWith('0')) digits = '49' + digits.slice(1);
    return digits.startsWith('49') ? '+' + digits : '+' + digits;
}

/**
 * Formats a phone number by separating the country code and grouping the rest.
 * 
 * @param {string} phone - Raw phone number input.
 * 
 * @returns {string} Formatted phone number.
 */
function formatPhone(phone) {
    const cleaned = cleanPhoneNumber(phone);
    const country = cleaned.slice(0, 3);
    const groups = cleaned.slice(3).match(/.{1,3}/g)?.join(' ') || '';
    return `${country} ${groups}`.trim();
}

/**
 * Returns a random background color.
 */
async function randomBgColor() {
    if (bgColors.length === 0) return "#F6F7F8";
    let randomIndex = Math.floor(Math.random() * bgColors.length);
    return bgColors[randomIndex].name.replace(/^\./, '');
}

/**
 * Edits a contact overlay.
 * 
 * @param {string} contactKey - The key of the contact.
 */
function editContactOverlay(contactKey) {
    let refOverlay = document.getElementById('editContactOverlay');
    refOverlay.innerHTML = getEditContactTemplate(contactKey);
    let editContactOverlay = document.querySelector('.edit-contact-overlay');
    let editContactContainer = document.querySelector('.edit-Contect-Container');
    editContactOverlay.classList.add('active');
    let contact = allContacts.find(c => c.key === contactKey);
    if (!contact) return;
    fillContactForm(contact);
    refOverlay.dataset.contactKey = contactKey;
    setTimeout(() => {
        editContactContainer.classList.add('active');
    }, 10)

    editContactOverlay.onclick = function (event) {
        if (event.target === editContactOverlay) {
            editContactOverlay.classList.remove('active');
            editContactContainer.classList.remove('active');
        }
    }
}

/**
 * Closes the edit contact overlay with a fade-out effect.
 */
function closeEditContact() {
    let newContactOverlay = document.querySelector('.edit-contact-overlay');
    let newContactContainer = document.querySelector('.edit-Contect-Container');
    newContactContainer.classList.remove('active');
    setTimeout(() => {
        newContactOverlay.classList.remove('active');
    }, 350);
}

/**
 * Closes the overlay.
 * 
 * @param {HTMLElement} refOverlay - The overlay element.
 * 
 * @param {HTMLElement} container - The container to animate.
 */
function closeOverlay(refOverlay, container) {
    container.style.transform = 'translateX(100%)';
    setTimeout(() => refOverlay.classList.toggle('d-none'), 500);
}

/**
 * Fills the contact form with given contact data.
 * 
 * @param {Object} contact - The contact data.
 */
function fillContactForm(contact) {
    document.getElementById('editName').value = contact.name || "";
    document.getElementById('editEmail').value = contact.email || "";
    document.getElementById('editPhone').value = clearVievEditNumber(contact.phone) || "";
    document.getElementById('editUserInitialsText').innerText = findInitials(contact.name);
    document.getElementById('editUserInitials').className = `edit-contact-initcolor ${contact.color}`;
}

/**
 * Edits a contact and updates the contact list.
 * 
 * @param {Event} event - The event object.
 * 
 * @param {HTMLFormElement} form - The form containing contact data.
 */
async function editContact(event, form) {
    event.preventDefault();
    let userId = localStorage.getItem("userId");
    let contactKey = document.getElementById('editContactOverlay').dataset.contactKey;
    if (!contactKey) return;
    let updatedContact = await createEditContact(form, await randomBgColor());
    updatedContact.name = form.querySelector('#editName').value;
    updatedContact.email = form.querySelector('#editEmail').value;
    await putData(contactKey, updatedContact, userId);
    let contactIndex = allContacts.findIndex(c => c.key === contactKey);
    if (contactIndex !== -1) allContacts[contactIndex] = { key: contactKey, ...updatedContact };
    updateContactTemplate(contactKey, updatedContact);
    await loadContactList();
}

/**
 * Normalizes a phone number by removing non-digits and converting leading 0 to country code 49.
 * 
 * @param {string} phone - The phone number to normalize.
 * 
 * @returns {string} Normalized phone number.
 */
function clearVievEditNumber(phone) {
    let digits = phone.replace(/\D/g, '');
    if (digits.startsWith('0')) digits = '49' + digits.slice(1);
    return digits;
}

/**
 * Creates a contact object.
 * 
 * @param {HTMLFormElement} form - The form element.
 * 
 * @param {string} color - The contact color.
 */
async function createEditContact(form, color) {
    return {
        name: form.querySelector('#editName').value,
        email: form.querySelector('#editEmail').value,
        phone: formatPhone(form.querySelector('#editPhone').value),
        color: color
    };
}

/**
 * Formats a phone number to international format starting with +49.
 * 
 * @param {string} phone - Input phone number.
 * 
 * @returns {string} Formatted phone number.
 */
function cleanPhoneNumber(phone) {
    let digits = phone.replace(/\D/g, '');
    if (digits.startsWith('0')) digits = '49' + digits.slice(1);
    return digits.startsWith('49') ? '+' + digits : '+' + digits;
}

/**
 * Formats a phone number by grouping digits after the country code.
 * 
 * @param {string} phone - Raw phone number input.
 * 
 * @returns {string} Formatted phone number.
 */
function formatPhone(phone) {
    const cleaned = cleanPhoneNumber(phone);
    const country = cleaned.slice(0, 3);
    const groups = cleaned.slice(3).match(/.{1,3}/g)?.join(' ') || '';
    return `${country} ${groups}`.trim();
}

/**
 * Handles click events for the mobile processing menu, toggling visibility of UI elements.
 */
function procressingClickMenu() {
    let procressOverlay = document.querySelector('.mobile-procressing-area-overlay');
    let menuBox = document.querySelector('.menu-box');
    let supportBox = document.querySelector('.small-menu-button');
    let procressButton = document.querySelector('.mobile-procressing-area-button');
    procressOverlay.classList.add('active');
    procressOverlay.classList.remove('close');
    menuBox.classList.add('inactive');
    supportBox.classList.add('inactive');
    procressButton.classList.add('active');
    procressOverlay.onclick = (event) => {
        if (event.target === procressOverlay) {
            handleOverlayClick(procressOverlay, menuBox, supportBox, procressButton);
        }
    };
}

/**
 * Handles click event to toggle overlay and menu visibility.
 * 
 * @param {HTMLElement} procressOverlay - The overlay element.
 * 
 * @param {HTMLElement} menuBox - The menu box element.
 * 
 * @param {HTMLElement} supportBox - The support box element.
 * 
 * @param {HTMLElement} procressButton - The process button element.
 */
function handleOverlayClick(procressOverlay, menuBox, supportBox, procressButton) {
    procressOverlay.classList.add('close');
    procressOverlay.classList.remove('active');
    menuBox.classList.remove('inactive');
    supportBox.classList.remove('inactive');
    setTimeout(() => {
        procressButton.classList.remove('active');
    }, 1000);
}

/**
 * Toggles the background color of a button between two colors.
 * 
 * @param {HTMLButtonElement} button - The button element to toggle.
 */
function toggleButtonBackgroundcolor(button) {
    if (!button.style.backgroundColor || button.style.backgroundColor === '#2A3647') {
        button.style.backgroundColor = '#29abe2';
    } else {
        button.style.backgroundColor = '#2A3647';
    }
}

/**
 * Toggles the color of a button and updates its background.
 * 
 * @param {HTMLElement} button - The button element to modify.
 */
function toggleButtonColor(button) {
    if (!button.style.color || button.style.color === 'rgb(42, 54, 71)') {
        button.style.color = '#29abe2';
    }
    button = document.querySelector('.procressing-area-edit-button-mobile');
    button.classList.add('procressing-area-button-mobile-backgroundcolor');
}

/**
 * Toggles the color of the remove button and updates the mobile edit button style.
 * 
 * @param {HTMLElement} button - The button element to toggle the color of.
 */
function toggleRemoveButtonColor(button) {
    if (!button.style.color || button.style.color === '#29abe2') {
        button.style.color = 'rgb(42, 54, 71)';
    }
    button = document.querySelector('.procressing-area-edit-button-mobile');
    button.classList.remove('procressing-area-button-mobile-backgroundcolor');
    button.style.color = 'rgb(42, 54, 71)';
}