const BASE_URL = "https://join-skizze-default-rtdb.europe-west1.firebasedatabase.app/"
const BASE_JOIN_GUAST_URL = "https://join-guast-account-default-rtdb.europe-west1.firebasedatabase.app/"
let allUsers = [];
let isPasswordVisible = false;


const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');

if (msg) {
    const msgBox = document.getElementById('msgBox');
    const msgText = document.getElementById('msgText');

    msgText.innerHTML = msg;
    msgBox.classList.add('show');
    history.replaceState(null, "", window.location.pathname);
    setTimeout(() => {
        msgBox.classList.remove('show');
    }, 2000);
}

async function init() {
    await loadAllUserData();
    await allDatas();
}

async function loadAllUserData(path) {
    let response = await fetch(BASE_JOIN_GUAST_URL + path + ".json")
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
                email : userResponse[userKeysArray[index]]?.email,
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
        window.location.href = 'summary.html?';
    }else{
        console.log("kein user vorhanden");
        email.style.border = "1px solid red";
        password.style.border = "1px solid red";
        document.getElementById('notCorrectValue').style.display = ("flex")
    }
}

function loginGuastAccount() {
    window.location.href = "summary.html?"
}

function changePasswordIcon(focused) {
    const icon = document.getElementById("passwordIcon");
    if (focused && !isPasswordVisible) {
        icon.src = "assets/img/visibility_off.png";
    } else if (!focused && !isPasswordVisible) {
        icon.src = "assets/img/lock.png";
    }
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const icon = document.getElementById("passwordIcon");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.src = "assets/img/visibility.png";
        isPasswordVisible = true;
    } else {
        passwordInput.type = "password";
        icon.src = "assets/img/visibility_off.png";
        isPasswordVisible = false;
    }
}