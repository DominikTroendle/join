const BASE_URL = "https://join-skizze-default-rtdb.europe-west1.firebasedatabase.app/"
const BASE_JOIN_URL = "https://join-guast-account-default-rtdb.europe-west1.firebasedatabase.app/"
let allUsers = [];


const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');

if (msg) {
    msgBox.innerHTML = msg;
}else{
    document.getElementById('msgBox').style.display="none";
}

async function init() {
    await loadContent();
    await loadAllUserData();
    await allDatas()
}

async function loadContent() {
    let refContent = document.getElementById('content');
    refContent.innerHTML = await getTemplateLogin();
}

async function loadAllUserData(path) {
    let response = await fetch(BASE_URL + path + ".json")
    return responseToJson = await response.json();
}

async function allDatas() {
    let userResponse = await loadAllUserData("allUser");
    if (!userResponse) { 
        console.error("Fehler: userResponse ist null oder undefined!");
        return;
    }
    let userKeysArray = Object.keys(userResponse);
    for (let index = 0; index < userKeysArray.length; index++) {
        allUsers.push(
            {
                key : userKeysArray[index],
                email : userResponse[userKeysArray[index]]?.user,
                password : userResponse[userKeysArray[index]]?.password,
            }
        )
    }
    console.log(allUsers);
}

async function UserLogin() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let user = allUsers.find(u => u.email == email.value && u.password == password.value)
    email.value = "";
    password.value = "";
    if (user) {
        console.log("user gefunden");
        window.location.href = 'index.html?=Du hast die efolgereich eingelogt';
    }else{
        console.log("kein user vorhanden");
        email.style.border = "1px solid red";
        password.style.border = "1px solid red";
        document.getElementById('notCorrectValue').style.display = ("flex")
    }
}

function loginGuastAccount() {
    window.location.href = "index.html?"
}