const BASE_URL = "https://join-skizze-default-rtdb.europe-west1.firebasedatabase.app/"
let allContacts = [];

async function init() {
    await loadAllUserContacts();
    await allUserContacts();
    await loadContent();
}

function selectContact() {
    let element = document.getElementById('')
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
    successfullyContact()
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
        console.error("Fehler: userResponse ist null oder undefined!");
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
    console.log(allContacts);
    
}

async function loadContent() {
    let refContent = document.getElementById('contactList')
    for (let i = 0; i < allContacts.length; i++) {
        refContent.innerHTML += await getContactListTemplate(i);
    }
}