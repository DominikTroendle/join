/**
 * Toggles the new contact overlay.
 */
function addNewContactOverlay() {
    let refNewContactTemplateOverlay = document.getElementById('newContactOverlay');
    refNewContactTemplateOverlay.innerHTML = getToCreatANewContactTemplate();
    let newContactOverlay = document.querySelector('.new-contact-overlay');
    let newContactContainer = document.querySelector('.new-Contect-Container');
    newContactOverlay.classList.add('active');
    setTimeout(() => { newContactContainer.classList.add('active'); }, 10)
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
    let refs = [nameRef, emailRef, phoneRef];
    refs.forEach(ref => ref.style.border = "");
}

/**
 * Validates a given input field (ref) and changes its border if its unvalid
 * @param {HTMLElement} ref - the input element to be validated
 * @returns true if the inputs value is valid, otherwise false
 */
function validateField(ref) {
    let refValue = ref.value.trim();
    if (refValue === "") {
        ref.style.border = "1px solid red";
        document.getElementById(`error-message-${ref.id}`).classList.add('error-text-red');
        return false;
    } else {
        document.getElementById(`error-message-${ref.id}`).classList.remove('error-text-red');
    }
    return true;
}

/**
 * Validates a given input field (ref) and changes its border if its unvalid. Adjusts the error message if the format is unvalid.
 * @param {HTMLElement} ref - the input element to be validated
 * @returns true if the inputs value is valid, otherwise false
 */
function validateEmail(ref) {
    if (ref.value === "" || !ref.value.includes('@')) {
        ref.style.border = "1px solid red";
        document.getElementById(`error-message-${ref.id}`).innerText = 'This field is required!';
        document.getElementById(`error-message-${ref.id}`).classList.add('error-text-red');
        if (ref.value.length !== 0 && !ref.value.includes("@")) {
            document.getElementById(`error-message-${ref.id}`).innerText = 'Unvalid format (example@domain.de)!';
        }
        return false;
    } else {
        document.getElementById(`error-message-${ref.id}`).classList.remove('error-text-red');
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
        document.getElementById(`error-message-${ref.id}`).innerText = 'This field is required!';
        document.getElementById(`error-message-${ref.id}`).classList.add('error-text-red');
        if (ref.value.length !== 0 && !/^\d+$/.test(ref.value)) {
            document.getElementById(`error-message-${ref.id}`).innerText = 'Only numbers are valid!';
        }
        return false;
    } else {
        document.getElementById(`error-message-${ref.id}`).classList.remove('error-text-red');
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
 * Displays a temporary success message in the message box with a fade-out effect.
 * 
 * @param {string} text - The message text to display initially.
 */
function showSuccessEditedMessage(text) {
    let messageBox = document.getElementById('succesfully-message-box');
    let messageText = document.getElementById("text-message-h1");
    messageText.innerHTML = text;
    setTimeout(() => {
        messageBox.style.display = "flex";
        setTimeout(() => {
            messageBox.style.display = "none";
            messageText.innerHTML = "Contact succesfully created";
        }, 2000);
    }, 100);
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