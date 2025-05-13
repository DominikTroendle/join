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
 * @param {HTMLFormElement} form - The form containing user data.
 */
async function addUserToContactList(event, form) {
    if (handleContactUnvalidInputs(false)) {
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
        resetAddContactButton();
        return false;
    }
}

/**
 * Handles input validation on different input elements by calling different helper functions
 * @param {boolean} isEdit - determines which inputs should be checked by changing the ids depending on the value of isEdit
 * @returns {boolean} true if all inputs are valid, otherwise false
 */
function handleContactUnvalidInputs(isEdit) {
    let nameRef = document.getElementById(`${isEdit ? 'editName' : 'name'}`);
    let emailRef = document.getElementById(`${isEdit ? 'editEmail' : 'email'}`);
    let phoneRef = document.getElementById(`${isEdit ? 'editPhone' : 'phone'}`);
    resetBorders(nameRef, emailRef, phoneRef);
    let isValid = true;
    isValid &= validateField(nameRef);
    isValid &= validateEmail(emailRef);
    isValid &= validatePhone(phoneRef);
    return isValid;
}

/**
 * Resets inputs borders to default style
 * @param {HTMLElement} nameRef - name input element whose border should be reset
 * @param {HTMLElement} emailRef - email input element whose border should be reset
 * @param {HTMLElement} phoneRef - phone input element whose border should be reset
 */
function resetBorders(nameRef, emailRef, phoneRef) {
    let refs = [nameRef, emailRef, phoneRef]
    refs.forEach(ref => ref.style.border = "");
}

/**
 * Validates a given input field (ref) and changes its border if its unvalid
 * @param {HTMLElement} ref - the input element to be validated
 * @returns true if the inputs value is valid, otherwise false
 */
function validateField(ref) {
    if (ref.value === "") {
        ref.style.border = "1px solid red";
        return false;
    }
    return true;
}

/**
 * Validates a given input field (ref) and changes its border if its unvalid
 * @param {HTMLElement} ref - the input element to be validated
 * @returns true if the inputs value is valid, otherwise false
 */
function validateEmail(ref) {
    if (ref.value === "" || !ref.value.includes('@')) {
        ref.style.border = "1px solid red";
        return false;
    }
    return true;
}

/**
 * Validates a given input field (ref) and changes its border if its unvalid
 * @param {HTMLElement} ref - the input element to be validated
 * @returns true if the inputs value is valid, otherwise false
 */
function validatePhone(ref) {
    if (ref.value === "" || !/^\d+$/.test(ref.value)) {
        ref.style.border = "1px solid red";
        return false;
    }
    return true;
}

/**
 * Resets the add contact button's click handler.
 */
function resetAddContactButton() {
    let addButton = document.getElementById('addContactButton');
    if (addButton) addButton.onclick = addNewContactOverlay;
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
 * Opens and displays the contact edit overlay for the specified contact.
 * 
 * @param {string} contactKey - The key of the contact to be edited.
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
    setTimeout(() => editContactContainer.classList.add('active'), 10);
    attachEditOverlayClickHandler(editContactOverlay, editContactContainer);
}

/**
 * Attaches a click handler to remove 'active' class from overlay and container when overlay is clicked.
 
* @param {HTMLElement} overlay - The overlay element.
 
* @param {HTMLElement} container - The container element.
 */
function attachEditOverlayClickHandler(overlay, container) {
    overlay.onclick = e => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            container.classList.remove('active');
        }
    };
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
    if (handleContactUnvalidInputs(true)) {
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
 * Updates data at the specified path.
 * 
 * @param {string} key - The key for the data.
 * 
 * @param {Object} data - The data to store.
 * 
 * @param {string} path - The user path.
 */
async function putData(key, data, path) {
    let procressEditContainer = document.querySelector('.edit-contact-overlay');
    let procressOverlay = document.querySelector('.mobile-procressing-area-overlay');
    let response = await fetch(`${BASE_URL}users/${path}/allContacts/${key}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    let responseToJson = await response.json();
    handleOverlay(procressEditContainer, procressOverlay);
    return responseToJson;
}

/**
 * Toggles the visibility of the process edit container and overlay.
 * @param {HTMLElement} procressEditContainer - The container to toggle.
 * @param {HTMLElement} procressOverlay - The overlay to close.
 */
function handleOverlay(procressEditContainer, procressOverlay) {
    if (procressEditContainer || procressOverlay) {
        procressEditContainer?.classList.remove('active');
        procressOverlay?.classList.add('close');
    }
}