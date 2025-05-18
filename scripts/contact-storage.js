/**
 * Adds a new user to the contact list.
 * 
 * @param {Event} event - The event object.
 * @param {HTMLFormElement} form - The form containing user data.
 */
async function addUserToContactList(event, form) {
    event.preventDefault();
    if (handleContactUnvalidInputs(false)) {
        let userId = localStorage.getItem("userId"), color = await randomBgColor();
        let newContact = await createContact(form, color);
        let response = await sendData(`${userId}/allContacts`, newContact);
        newContact.key = response.name;
        allContacts.push(newContact);
        await loadContactList();
        moreContactInformation(newContact.name); highlightNewContact(newContact);
        form.reset(); successfullyContact(); resetAddContactButton();
        return false;
    }
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
 * Edits a contact and updates the contact list.
 * 
 * @param {Event} event - The event object.
 * 
 * @param {HTMLFormElement} form - The form containing contact data.
 */
async function editContact(event, form) {
    event.preventDefault();
    if (handleContactUnvalidInputs(true)) {
        let userId = localStorage.getItem("userId");
        let contactKey = document.getElementById('editContactOverlay').dataset.contactKey;
        if (!contactKey) return;
        let updatedContact = await createEditContact(form, await randomBgColor());
        updatedContact.name = form.querySelector('#editName').value, updatedContact.email = form.querySelector('#editEmail').value;
        await putData(contactKey, updatedContact, userId);
        let contactIndex = allContacts.findIndex(c => c.key === contactKey);
        if (contactIndex !== -1) allContacts[contactIndex] = { key: contactKey, ...updatedContact };
        showSuccessEditedMessage("Contact succesfully edited"); updateContactTemplate(contactKey, updatedContact); await loadContactList();
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