const BASE_URL = "https://join-skizze-default-rtdb.europe-west1.firebasedatabase.app/"
let isPasswordVisible = false;

async function init() {
    await loadAllUserData();
}

async function loadAllUserData(path) {
    let response = await fetch(BASE_URL + path + ".json")
    return responseToJson = await response.json();
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

async function addUserToRegister(event, form) {
    event.preventDefault();
    let isValid = await UserRegister();
    if (!isValid) {
        return false;
    }
    let name = form.querySelector('#name');
    let email = form.querySelector('#email');
    let password = form.querySelector('#password');
    let newUser = {
        "user" : name.value,
        "email" : email.value,
        "password" : password.value,
    };
    await sendData("/allUser", newUser);
    name.value = '';
    email.value = '';
    password.value = '';
    window.location.href = 'index.html?msg=You Signed Up successfully';
    return false;
}

function backToLogin() {
    window.location.href = 'index.html?';
}

async function UserRegister() {
    const password = document.getElementById('password');
    const conrollPassword = document.getElementById('controllPassword');
    const checkbox = document.getElementById('checkbox');
    let isValid = true;

    if (!checkbox.checked) {
        checkbox.style.border = "2px solid red";
        isValid = false;
    } else {
        checkbox.style.border = "2px solid black";
    } 
    if (password.value !== conrollPassword.value) {
        conrollPassword.style.border = "1px solid red";
        conrollPassword.style.boxShadow = "0px 0px 4px 1px red"
        document.getElementById('notCorrectValue').style.display = "flex";
        isValid = false;
    } else {
        conrollPassword.style.border = "1px solid black";
        conrollPassword.style.boxShadow = "none"
        document.getElementById('notCorrectValue').style.display = "none";
    }

    return isValid;
}

function changePasswordIcon(focused) {
    const icon = document.getElementById("passwordIcon");
    const passwordInput = document.getElementById("password")
    if (focused && !isPasswordVisible) {
        icon.src = "assets/img/visibility_off.png";
    } else if (passwordInput.value.trim().length > 0) {
        icon.src = "assets/img/visibility_off.png";
    } else {
        icon.src = "assets/img/lock.png";
    }
}

function changeConrollPasswordIcon(focused) {
    const icon = document.getElementById("passwordControllIcon");
    const passwordInput = document.getElementById("controllPassword");
    if (isPasswordVisible) return;
    if (focused) {
        icon.src = "assets/img/visibility_off.png";
    } else if (passwordInput.value.trim().length > 0) {
        icon.src = "assets/img/visibility_off.png";
    } else {
        icon.src = "assets/img/lock.png";
    }
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById("controllPassword");
    const icon = document.getElementById("passwordControllIcon");
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