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
    
    newContactOverlay.onclick = function(event){
        if (event.target === newContactOverlay) {
            newContactOverlay.classList.remove('active');
            newContactContainer.classList.remove('active');
        }
    }
}

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

function cleanPhoneNumber(phone) {
    let digits = phone.replace(/\D/g, '');
    if (digits.startsWith('0')) digits = '49' + digits.slice(1);
    return digits.startsWith('49') ? '+' + digits : '+' + digits;
}

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
    
    editContactOverlay.onclick = function(event){
        if (event.target === editContactOverlay) {
            editContactOverlay.classList.remove('active');
            editContactContainer.classList.remove('active');
        }
    }
}

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

function cleanPhoneNumber(phone) {
    let digits = phone.replace(/\D/g, '');
    if (digits.startsWith('0')) digits = '49' + digits.slice(1);
    return digits.startsWith('49') ? '+' + digits : '+' + digits;
}

function formatPhone(phone) {
    const cleaned = cleanPhoneNumber(phone);
    const country = cleaned.slice(0, 3);
    const groups = cleaned.slice(3).match(/.{1,3}/g)?.join(' ') || '';
    return `${country} ${groups}`.trim();
}

function procressingClickMenu() {
    let procressOverlay = document.querySelector('.mobile-procressing-area-overlay');
    let menuBox = document.querySelector('.menu-box');
    let supportBox = document.querySelector('.small-menu-button');
    let procressButton = document.querySelector('.mobile-procressing-area-button')
    procressOverlay.classList.add('active');
    procressOverlay.classList.remove('close');
    menuBox.classList.add('inactive');
    supportBox.classList.add('inactive');
    procressButton.classList.add('active');

    procressOverlay.onclick = function(event){
        if (event.target === procressOverlay) {
            procressOverlay.classList.add('close');
            procressOverlay.classList.remove('active');
            menuBox.classList.remove('inactive');
            supportBox.classList.remove('inactive');
            setTimeout(() => {
                procressButton.classList.remove('active');
            }, 1000);
        }
    }
}

function toggleButtonBackgroundcolor(button) {
        if (!button.style.backgroundColor || button.style.backgroundColor === '#2A3647') {
            button.style.backgroundColor = '#29abe2';
        } else {
            button.style.backgroundColor = '#2A3647';
        }
    
}

function toggleButtonColor(button) {
    if (!button.style.color || button.style.color === 'rgb(42, 54, 71)') {
        button.style.color = '#29abe2';
    } 
    button = document.querySelector('.procressing-area-edit-button-mobile');
    button.classList.add('procressing-area-button-mobile-backgroundcolor');
}

function toggleRemoveButtonColor(button) {
    if (!button.style.color || button.style.color === '#29abe2') {
        button.style.color = 'rgb(42, 54, 71)';
    } 
    button = document.querySelector('.procressing-area-edit-button-mobile');
    button.classList.remove('procressing-area-button-mobile-backgroundcolor');
    button.style.color = 'rgb(42, 54, 71)';
}