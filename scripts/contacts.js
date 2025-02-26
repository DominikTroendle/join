const BASE_URL = "https://join-user-default-rtdb.europe-west1.firebasedatabase.app/"
let allContacts = [];
let contactNames = [];
let bgColors = [];


async function init() {
    await loadSmallInitials();
    await loadAllUserContacts();
    await allUserContacts();
    await loadColors();
    await loadContactList();
}

async function loadSmallInitials() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        console.log("Kein eingeloggter User gefunden!");
        return window.location.href = "index.html?";
    }
    let dataPath = userId === "guest" ? "users/guest.json" : `users/${userId}.json`;
    let response = await fetch(BASE_URL + dataPath);
    let userData = await response.json();
    
    console.log("Daten des eingeloggten Users:", userData);
    document.getElementById('smallInitials').innerText = findInitials(userData.userDatas.user);
}

async function loadAllUserContacts(path) {
    let response = await fetch(`${BASE_URL}users/${path}.json`)
    return responseToJson = await response.json();
}

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

function addNewContectOverlay() {
    let refOverlay = document.getElementById('newContectOverlay');
    refOverlay.innerHTML = getToCreatANewContactTemplate();
    refOverlay.classList.toggle('d-none');
    let container = refOverlay.querySelector('.new-Contect-Container');
    setTimeout(() => {
        container.style.transform = 'translateX(0)';
    }, 10);
    if (!refOverlay.dataset.listenerAdded) {
        refOverlay.dataset.listenerAdded = "true";
        refOverlay.onclick = function(event) {
            if (event.target === refOverlay) {
                container.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    refOverlay.classList.toggle('d-none');
                }, 500);
            }
        };
    }
}

function resetContactForm() {
    let form = document.querySelector('#newContectOverlay form');
    if (form) {
        form.reset();
    }
}

async function addUserToContactList(event, form) {
    event.preventDefault();
    let userId = localStorage.getItem("userId");
    let name = form.querySelector('#name');
    let email = form.querySelector('#email');
    let phone = form.querySelector('#phone');
    let color = await randomBgColor();
    let newContact = {
        "name": name.value, 
        "email": email.value, 
        "phone": phone.value, 
        "color": color
    };
    let response = await sendData(`${userId}/allContacts`, newContact);
    newContact.key = response.name;
    allContacts.push(newContact);
    await loadContactList();
    moreContactInformation(newContact.name);
    setTimeout(() => {
        let newContactElement = [...document.querySelectorAll('.container-contact')]
            .find(el => el.textContent.includes(newContact.name));
    
        if (newContactElement) {
            selectContact(newContactElement);
            newContactElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, 100);
    form.reset();
    successfullyContact();
    let addButton = document.getElementById('addContactButton');
    if (addButton) {
        addButton.onclick = addNewContectOverlay;
    }
    return false;
}

async function randomBgColor() {
    if (bgColors.length === 0) return "#F6F7F8";
    let randomIndex = Math.floor(Math.random() * bgColors.length);
    return bgColors[randomIndex].name.replace(/^\./, '');
}

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

async function loadContactList() {
    let contactList = document.getElementById('contactList');
    contactList.innerHTML = "";
    allContacts.sort((a, b) => a.name.localeCompare(b.name));
    let currentLetter = "";

    for (let i = 0; i < allContacts.length; i++) {
        currentLetter = await createContactGroup(allContacts[i], currentLetter, contactList);
    }
}

async function createContactGroup(contact, currentLetter, contactList) {
    let firstLetter = contact.name.charAt(0).toUpperCase();
    if (currentLetter !== firstLetter) {
        currentLetter = firstLetter;
        addGroupHeader(contactList, currentLetter);
    }
    await addContactToGroup(contact, currentLetter);
    return currentLetter;
}

function addGroupHeader(contactList, letter) {
    contactList.innerHTML += `<div>
        <div class="container-letter">${letter}</div>
        <div id="group-${letter}"></div>
    </div>`;
}

async function addContactToGroup(contact, letter) {
    let groupContainer = document.getElementById(`group-${letter}`);
    let isFirst = groupContainer.children.length === 0;
    groupContainer.innerHTML += `${isFirst ? "<hr class='line'>" : ""}${await getContactListTemplate(contact.name, contact.email, contact.color)}`;
    document.getElementById(contact.name).innerText = contact.name;
    document.getElementById(`doppelInitials-${contact.name}`).innerText = findInitials(contact.name);
}

function findInitials(contactName) {
    let name = contactName.split(' ');
    let initials = '';
    for (let i = 0; i < name.length; i++) {
        initials += name[i].substring(0, 1).toUpperCase();
    }
    return initials
}

function selectContact(element) {
    let isSelected = element.classList.contains('select-contact');
    document.querySelectorAll('.container-contact').forEach(contact => {
        contact.classList.remove('select-contact');
        contact.style.color = "black";
    });
    if (isSelected) {
        document.getElementById('moreInformationContact').style.transform = 'translateX(100%)';
        setTimeout(() => document.getElementById('moreInformationContact').innerHTML = '', 500);
    } else {
        element.classList.add('select-contact');
        element.style.color = "white";
        moreContactInformation(element.querySelector('.contact-preview-name').innerText);
    }
}

async function moreContactInformation(contactName) {
    document.getElementById(`${contactName}`).innerText = contactName;
    let initials = findInitials(contactName);
    document.getElementById(`doppelInitials-${contactName}`).innerText = initials;
    let contact = allContacts.find(c => c.name === contactName);
    if (contact) {
        let contactDetailsTemplate = await selectMoreContactInformationTemplate(contact, initials);
        let contactInfoContainer = document.getElementById('moreInformationContact');
        contactInfoContainer.innerHTML = contactDetailsTemplate;
        contactInfoContainer.style.transition = 'transform 0.5s ease-out';
        setTimeout(() => {
            contactInfoContainer.style.transform = 'translateX(0)';
        }, 10);
    }
}

function editContactOverlay(contactKey) {
    let refOverlay = document.getElementById('editContactOverlay');
    refOverlay.innerHTML = getEditContactTemplate(contactKey);
    refOverlay.classList.toggle('d-none');
    let container = refOverlay.querySelector('.new-Contect-Container');
    setTimeout(() => container.style.transform = 'translateX(0)', 10);
    if (!refOverlay.dataset.listenerAdded) {
        refOverlay.dataset.listenerAdded = "true";
        refOverlay.onclick = (e) => { if (e.target === refOverlay) { container.style.transform = 'translateX(100%)'; 
        setTimeout(() => refOverlay.classList.toggle('d-none'), 500); } };
    }
    let contact = allContacts.find(c => c.key === contactKey);
    if (!contact) return console.error("Fehler: Kontakt nicht gefunden!");
    document.getElementById('editName').value = contact.name || "";
    document.getElementById('editEmail').value = contact.email || "";
    document.getElementById('editPhone').value = contact.phone || "";
    let initials = findInitials(contact.name);
    document.getElementById('editUserInitialsText').innerText = initials;
    document.getElementById('editUserInitials').className = `edit-contact-initcolor ${contact.color}`;
    refOverlay.dataset.contactKey = contactKey;
}

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

async function updateContactTemplate(contactKey, updatedContact) {
    let contactElement = document.querySelector(`#contact-${contactKey}`);
    if (contactElement) {
        let initials = findInitials(updatedContact.name);
        let template = await selectMoreContactInformationTemplate(updatedContact, initials);
        contactElement.innerHTML = template;
    }
}

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
    } catch (error) {
        console.error("Fehler beim Löschen:", error);
    }
}