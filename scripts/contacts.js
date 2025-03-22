const BASE_URL = "https://join-user-default-rtdb.europe-west1.firebasedatabase.app/"
let allContacts = [];
let contactNames = [];
let bgColors = [];

/**
 * Initializes the application by loading necessary data.
 */
async function init() {
    await loadSmallInitials();
    await loadAllUserContacts();
    await allUserContacts();
    await loadColors();
    await loadContactList();
}

/**
 * Loads and displays user initials.
 */
async function loadSmallInitials() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        console.log("Kein eingeloggter User gefunden!");
        return window.location.href = "index.html?";
    }
    let dataPath = userId === "guest" ? "users/guest.json" : `users/${userId}.json`;
    let response = await fetch(BASE_URL + dataPath);
    let userData = await response.json();
    document.getElementById('smallInitials').innerText = findInitials(userData.userDatas.name) || "G";
}

/**
 * Loads user contacts.
 * 
 * @param {string} path - The user path.
 */
async function loadAllUserContacts(path) {
    let response = await fetch(`${BASE_URL}users/${path}.json`)
    return responseToJson = await response.json();
}

/**
 * Loads background colors from a CSS file.
 */
async function loadColors() {
    let responseColors = await fetch("styles/colors.css");
    let responseColorText = await responseColors.text();
    const regex = /\.bg-([\w-]+)\s*\{[^}]*background(?:-color)?:\s*([^;}]+)/g;
    let matches = [...responseColorText.matchAll(regex)];
    for (let i = 0; i < matches.length; i++) {
        bgColors.push({
            name: `.bg-${matches[i][1]}`,
            color: matches[i][2].trim()
        });
    }
    return bgColors;
}

/**
 * Loads all user contacts and stores them in allContacts.
 */
async function allUserContacts() {
    let userId = localStorage.getItem("userId");
    let contactResponse = await loadAllUserContacts(`${userId}/allContacts`);
    if (!contactResponse) { 
        console.error("Fehler: contactResponse ist null oder undefined!");
        return;
    }
    let contactKeysArray = Object.keys(contactResponse);
    for (let index = 0; index < contactKeysArray.length; index++) {
        allContacts.push(
            {
                key : contactKeysArray[index],
                name : contactResponse[contactKeysArray[index]]?.name,
                email : contactResponse[contactKeysArray[index]]?.email,
                phone : contactResponse[contactKeysArray[index]]?.phone,
                color : contactResponse[contactKeysArray[index]]?.color,
            }
        )
    }
}

/**
 * Toggles the new contact overlay.
 */
function addNewContactOverlay() {
    let refNewContactTemplateOverlay = document.getElementById('newContactOverlay');
    refNewContactTemplateOverlay.innerHTML = getToCreatANewContactTemplate();
    let newContactOverlay = document.querySelector('.contact-overlay');
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
    let newContactOverlay = document.querySelector('.contact-overlay');
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
        addButton.onclick = addNewContectOverlay;
    }
    return false;
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
        phone: form.querySelector('#phone').value,
        color: color
    };
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
 * Highlights and scrolls to the new contact.
 * 
 * @param {Object} contact - The contact object.
 */
function highlightNewContact(contact) {
    setTimeout(() => {
        let newContactElement = [...document.querySelectorAll('.container-contact')]
            .find(el => el.textContent.includes(contact.name));
        if (newContactElement) {
            selectContact(newContactElement);
            newContactElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, 100);
}

/**
 * Sends data to the specified path.
 * 
 * @param {string} path - The API endpoint.
 * 
 * @param {Object} data - The data to send.
 */
async function sendData(path, data) {
    let response = await fetch(`${BASE_URL}users/${path}.json`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    let responseToJson = await response.json();
    return responseToJson;
}

/**
 * Hides the contact overlay and briefly shows a success message.
 */
function successfullyContact() {
    let overlay = document.getElementById('newContectOverlay');
    overlay.classList.add("d-none");
    
    setTimeout(() => {
        let messageBox = document.getElementById('succesfully-message-box');
        messageBox.style.display = "flex";
        setTimeout(() => {
            messageBox.style.display = "none";
        }, 2000);
    }, 500);
}

/**
 * Loads and sorts the contact list.
 */
async function loadContactList() {
    let contactList = document.getElementById('contactList');
    contactList.innerHTML = "";
    allContacts.sort((a, b) => a.name.localeCompare(b.name));
    let currentLetter = "";

    for (let i = 0; i < allContacts.length; i++) {
        currentLetter = await createContactGroup(allContacts[i], currentLetter, contactList);
    }
}

/**
 * Creates a contact group by first letter.
 * 
 * @param {Object} contact - The contact object.
 * 
 * @param {string} currentLetter - The current letter.
 * 
 * @param {Array} contactList - The contact list.
 */
async function createContactGroup(contact, currentLetter, contactList) {
    let firstLetter = contact.name.charAt(0).toUpperCase();
    if (currentLetter !== firstLetter) {
        currentLetter = firstLetter;
        addGroupHeader(contactList, currentLetter);
    }
    await addContactToGroup(contact, currentLetter);
    return currentLetter;
}

/**
 * Adds a group header to the contact list.
 * 
 * @param {HTMLElement} contactList - The contact list container.
 * 
 * @param {string} letter - The letter for the group header.
 */
function addGroupHeader(contactList, letter) {
    contactList.innerHTML += `<div>
        <div class="container-letter">${letter}</div>
        <div id="group-${letter}"></div>
    </div>`;
}

/**
 * Adds a contact to the corresponding group.
 * 
 * @param {Object} contact - The contact object.
 * 
 * @param {string} letter - The group identifier.
 */
async function addContactToGroup(contact, letter) {
    let groupContainer = document.getElementById(`group-${letter}`);
    let isFirst = groupContainer.children.length === 0;
    groupContainer.innerHTML += `${isFirst ? "<hr class='line'>" : ""}${await getContactListTemplate(contact.name, contact.email, contact.color)}`;
    document.getElementById(contact.name).innerText = contact.name;
    document.getElementById(`doppelInitials-${contact.name}`).innerText = findInitials(contact.name);
}

/**
 * Gets initials from a name.
 * 
 * @param {string} contactName - The full name.
 */
function findInitials(contactName) {
    let name = contactName.trim().split(' ').filter(n => n);
    let initials = '';
    for (let i = 0; i < Math.min(name.length, 2); i++) {
        initials += name[i].charAt(0).toUpperCase();
    }
    return initials
}

/**
 * Toggles contact selection.
 * 
 * @param {HTMLElement} element - Clicked contact element.
 */
function selectContact(element) {
    let isSelected = element.classList.contains('select-contact');
    let moreInfoContainer = document.getElementById('moreInformationContact');
    let overlay = document.querySelector('.more-information-container');

    document.querySelectorAll('.container-contact').forEach(contact => {
        contact.classList.remove('select-contact');
        contact.style.color = "black";
    });

    if (isSelected) {
        moreInfoContainer.style.transform = 'translateX(100%)';
        setTimeout(() => moreInfoContainer.innerHTML = '', 500);
        closeContactMobilButton();
    } else {
        element.classList.add('select-contact');
        element.style.color = "white";
        moreContactInformation(element.querySelector('.contact-preview-name').innerText);
        
        if (window.innerWidth <= 1040) {
            overlay.classList.add('mobile-overlay');
        }
    }
}

function closeContactMobilButton() {
    document.querySelector('.more-information-container').classList.remove('mobile-overlay');
    document.querySelectorAll('.container-contact').forEach(contact => {
        contact.classList.remove('select-contact');
        contact.style.color = "black";
    });
}

/**
 * Updates and displays more contact information.
 * 
 * @param {string} contactName - The name of the contact.
 */
async function moreContactInformation(contactName) {
    document.getElementById(`${contactName}`).innerText = contactName;
    let initials = findInitials(contactName);
    document.getElementById(`doppelInitials-${contactName}`).innerText = initials;
    let contact = allContacts.find(c => c.name === contactName);
    if (contact) {
        let contactDetailsTemplate = await selectMoreContactInformationTemplate(contact, initials);
        let contactInfoContainer = document.getElementById('moreInformationContact');
        contactInfoContainer.innerHTML = contactDetailsTemplate;
        if (window.innerWidth >= 1040) {
            contactInfoContainer.style.transition = 'transform 0.5s ease-out';
            setTimeout(() => {
                contactInfoContainer.style.transform = 'translateX(0)';
            }, 10);
        } else {
            contactInfoContainer.style.transition = 'none';
            setTimeout(() => {
                contactInfoContainer.style.transform = 'none';
            }, 10);
        }
    }
}


/**
 * Edits a contact overlay.
 * 
 * @param {string} contactKey - The key of the contact.
 */
function editContactOverlay(contactKey) {
    let refOverlay = document.getElementById('editContactOverlay');
    refOverlay.innerHTML = getEditContactTemplate(contactKey);
    toggleOverlay(refOverlay);
    let contact = allContacts.find(c => c.key === contactKey);
    if (!contact) return console.error("Fehler: Kontakt nicht gefunden!");
    fillContactForm(contact);
    refOverlay.dataset.contactKey = contactKey;
}

/**
 * Toggles the overlay visibility and handles click outside to close.
 * 
 * @param {HTMLElement} refOverlay - The overlay element.
 */
function toggleOverlay(refOverlay) {
    refOverlay.classList.toggle('d-none');
    let container = refOverlay.querySelector('.new-Contect-Container');
    setTimeout(() => container.style.transform = 'translateX(0)', 10);
    if (!refOverlay.dataset.listenerAdded) {
        refOverlay.dataset.listenerAdded = "true";
        refOverlay.onclick = (e) => { 
            if (e.target === refOverlay) closeOverlay(refOverlay, container); 
        };
    }
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
    document.getElementById('editPhone').value = contact.phone || "";
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
    if (!contactKey) return console.error("Fehler: Kein gültiger Kontakt-Key gefunden!");
    let updatedContact = {
        name: form.querySelector('#editName').value,
        email: form.querySelector('#editEmail').value,
        phone: form.querySelector('#editPhone').value,
        color: await randomBgColor()
    };
    await putData(contactKey, updatedContact, userId);
    let contactIndex = allContacts.findIndex(c => c.key === contactKey);
    if (contactIndex !== -1) allContacts[contactIndex] = { key: contactKey, ...updatedContact };
    updateContactTemplate(contactKey, updatedContact);
    await loadContactList();
    editContactOverlay();
}

/**
 * Updates the contact template.
 * 
 * @param {string} contactKey - Contact identifier.
 * 
 * @param {Object} updatedContact - Updated contact data.
 */
async function updateContactTemplate(contactKey, updatedContact) {
    let contactElement = document.querySelector(`#contact-${contactKey}`);
    if (contactElement) {
        let initials = findInitials(updatedContact.name);
        let template = await selectMoreContactInformationTemplate(updatedContact, initials);
        contactElement.innerHTML = template;
    }
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
    let response = await fetch(`${BASE_URL}users/${path}/allContacts/${key}.json`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    let responseToJson = await response.json();
    return responseToJson;
}

/**
 * Deletes a contact by key.
 * 
 * @param {string} key - Contact key.
 */
async function deleteContact(key) {
    let userId = localStorage.getItem("userId");
    if (!key) {
        console.error("Fehler: Kein gültiger Key übergeben!");
        return;
    }
    try {
        let response = await fetch(`${BASE_URL}/users/${userId}/allContacts/${key}.json`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`Löschen fehlgeschlagen: ${response.status}`);
        }
        console.log(`Kontakt mit Key ${key} erfolgreich gelöscht!`);
        allContacts = allContacts.filter(contact => contact.key !== key);
        loadContactList();
        document.getElementById('moreInformationContact').innerHTML = '';
        document.querySelector('.more-information-container').classList.remove('mobile-overlay')
    } catch (error) {
        console.error("Fehler beim Löschen:", error);
    }
}

function procressingClickMenu() {
    let procressOverlay = document.querySelector('.mobile-procressing-area-overlay');
    procressOverlay.classList.add('active');
    procressOverlay.classList.remove('close');

    procressOverlay.onclick = function(event){
        if (event.target === procressOverlay) {
            procressOverlay.classList.add('close');
            procressOverlay.classList.remove('active');
        }
    }
}



// function procressingClickMenu() {
//     let overlay = document.querySelector('.mobile-procressing-area-overlay');
//     let menuBox = document.querySelector('.menu-box');
//     let headerBox = document.querySelector('.small-menu-button');

//     overlay.classList.add('active');
//     menuBox.classList.toggle('inactive');
//     headerBox.classList.toggle('inactive');
// }

// function closeOverlay(event) {
//     let overlay = document.querySelector('.procressing-mobile-menu-container');
//     let menuBox = document.querySelector('.menu-box');
//     let headerBox = document.querySelector('.small-menu-button');
    
//     if (!overlay.contains(event.target)) {
//         let overlay = document.getElementById('mobile-procressing-area-overlay');
//         overlay.classList.remove('active');
//         menuBox.classList.remove('inactive');
//         headerBox.classList.remove('inactive');
//     }
// }

function toggleButtonBackgroundcolor(button) {
        if (!button.style.backgroundColor || button.style.backgroundColor === 'rgb(42, 54, 71)') {
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