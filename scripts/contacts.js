const BASE_URL = "https://join-skizze-default-rtdb.europe-west1.firebasedatabase.app/"
let allContacts = [];
let contactNames = [];
const letterColors = {
    "A": "bg-blue", "B": "bg-orange", "C": "bg-pink", "D": "bg-bluepurple",
    "E": "bg-purple", "F": "bg-skyblue", "G": "bg-turquoise", "H": "bg-redorange",
    "I": "bg-peach", "J": "bg-rose", "K": "bg-sun", "L": "bg-darkblue",
    "M": "bg-green", "N": "bg-yellow", "O": "bg-red", "P": "bg-darkyellow",
    "Q": "bg-blue", "R": "bg-orange", "S": "bg-pink", "T": "bg-bluepurple",
    "U": "bg-purple", "V": "bg-skyblue", "W": "bg-turquoise", "X": "bg-redorange",
    "Y": "bg-peach", "Z": "bg-rose"
};

async function init() {
    await loadAllUserContacts();
    await allUserContacts();
    await loadContactList();
    // await selectMoreContactInformation()
}

function addNewContect() {
    refOverlay = document.getElementById('newContectOverlay');
    refOverlay.classList.toggle('d-none');
    refOverlay.onclick = function(event) {
        if (event.target === refOverlay) {
            refOverlay.classList.toggle('d-none');
        }
    };
}

async function sendData(path="", data={}) {
    let response = await fetch(BASE_URL + path + ".json",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    let responseToJson = await response.json();
    return responseToJson;
}

async function addUserToContactList(event, form) {
    event.preventDefault()
    let name = form.querySelector('#name');
    let email = form.querySelector('#email');
    let phone = form.querySelector('#phone');
    let newContact = {
        "name" : name.value, "email" : email.value, "phone" : phone.value,
    };
    await sendData("/allContacts", newContact);
    name.value = ''; email.value = ''; phone.value = '';
    successfullyContact();
    return false;
}

function successfullyContact() {
    document.getElementById('newContectOverlay').style.display = "none";
    setTimeout(() => {
        let messageBox = document.getElementById('succesfully-message-box');
        messageBox.style.display = "flex";
        setTimeout(() => {
            messageBox.style.display = "none";
        }, 2000);
    }, 500);
}

async function loadAllUserContacts(path) {
    let response = await fetch(BASE_URL + path + ".json")
    return responseToJson = await response.json();
}

async function allUserContacts() {
    let contactResponse = await loadAllUserContacts("allContacts");
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
            }
        )
    }
}

async function loadContactList() {
    let contactList = document.getElementById('contactList');
    contactList.innerHTML = "";
    allContacts.sort((a, b) => a.name.localeCompare(b.name));
    let currentLetter = "";
    for (let i = 0; i < allContacts.length; i++) {
        let contactName = allContacts[i].name;
        let contactMail = allContacts[i].email;
        let firstLetter = contactName.charAt(0).toUpperCase();
        let isNewGroup = currentLetter !== firstLetter;
        if (isNewGroup) {
            currentLetter = firstLetter;
            contactList.innerHTML += `<div">
                <div class="container-letter">${currentLetter}</div>
                <div id="group-${currentLetter}"></div>
            </div>`;
        }
        let groupContainer = document.getElementById(`group-${currentLetter}`);
        let isFirstContactInGroup = groupContainer.children.length === 0;
        let bgColorClass = getBackgroundColor(contactName);

        groupContainer.innerHTML += `
            ${isNewGroup || isFirstContactInGroup ? "<hr>" : ""}
            ${await getContactListTemplate(contactName, contactMail, bgColorClass)}
        `;
        document.getElementById(`${contactName}`).innerText = contactName;
        document.getElementById(`doppelInitials-${contactName}`).innerText = findInitials(contactName);
    }
}

function getBackgroundColor(contactName) {
    let firstLetter = contactName.charAt(0).toUpperCase();
    return letterColors[firstLetter] || "bg-grey";
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
    let name = element.querySelector('.contact-preview-name').innerText;
    if (!isSelected) {
        element.classList.add('select-contact');
        element.style.color = "white";
        moreContactInformation(name);
    } else{
        let contactInfoContainer = document.getElementById('moreInformationContact');
        contactInfoContainer.innerHTML = '';
    }
    
    
}

async function moreContactInformation(contactName) {
    let contact = allContacts.find(c => c.name === contactName);
    if (contact) {
        let contactDetailsTemplate = await selectMoreContactInformationTemplate(contact);
        let contactInfoContainer = document.getElementById('moreInformationContact');
        contactInfoContainer.innerHTML = contactDetailsTemplate;
    } else {
        console.error("Kontakt nicht gefunden!");
    }
}

// async function selectMoreContactInformation() {
//     let refMoreInfo = document.getElementById('moreInformationContact')
//     for (let i = 0; i < allContacts.length; i++) {
//         refMoreInfo.innerHTML += await selectMoreContactInformationTemplate(i);
//     }
// }

// async function findName() {
//     for (let i = 0; i < allContacts.length; i++) {
//         contactNames.push({
//             name : allContacts[i].name
//         })
//     }
//     console.log(contactNames);
// }



