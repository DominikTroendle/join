const BASE_URL = "https://join-skizze-default-rtdb.europe-west1.firebasedatabase.app/"

async function init() {
    await loadContent();
    await loadAllUserData();
    // await allDatas()
}

async function loadAllUserData(path) {
    let response = await fetch(BASE_URL + path + ".json")
    return responseToJson = await response.json();
}

async function loadContent() {
    let refContent = document.getElementById('content');
    refContent.innerHTML = await getTemplateRegister();
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

async function addUserToRegister() {
    event.preventDefault();

    let title = document.getElementById('email');
    let description = document.getElementById('password');

    let newUser = {
        "user" : email.value,
        "password" : password.value,
    };
    await sendData("/allUser", newUser);
    title.value = '';
    description.value = '';

    window.location.href = 'login.html?msg=Du hast dich erfolgreich regestriert';
    return false;
}