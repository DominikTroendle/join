const BASE_URL = "https://join-user-default-rtdb.europe-west1.firebasedatabase.app/"
let isPasswordVisible = false;
let bgColors = [];

async function init() {
    await loadColors();
    await loadAllUserData();
    sessionSorage()
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

async function putData(path="", data={}) {
    let response = await fetch(BASE_URL + path + ".json",{
        method: "PUT",
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
    const color = await randomBgColor();
    if (!await UserRegister()) return false;

    const newUser = createUserObject(form, color);
    const userId = await registerUser(newUser);
    if (!userId) return false;

    clearForm(form);
    window.location.href = 'index.html?msg=You Signed Up successfully';
    return false;
}

async function randomBgColor() {
    if (bgColors.length === 0) return ".bg-grey";
    let randomIndex = Math.floor(Math.random() * bgColors.length);
    return bgColors[randomIndex].name.replace(/^\./, '');
}

async function registerUser(user) {
    const response = await sendData("/users", {});
    if (response?.name) {
        const userId = response.name;
        await putData(`/users/${userId}/userDatas`, user);
        await sendData(`/users/${userId}/allContacts`, user);
        return userId;
    } else {
        console.error("User registration failed.");
        return null;
    }
}

function createUserObject(form, color) {
    return {
        name: form.querySelector('#name').value + " (You)",
        email: form.querySelector('#email').value,
        password: form.querySelector('#password').value,
        color: color,
        phone: " "
    };
}

function clearForm(form) {
    form.querySelector('#name').value = '';
    form.querySelector('#email').value = '';
    form.querySelector('#password').value = '';
}

function backToLogin() {
    window.location.href = 'index.html?';
}

async function UserRegister() {
    const password = document.getElementById('password');
    const conrollPassword = document.getElementById('controllPassword');
    const checkbox = document.getElementById('checkbox');
    const checkboxValid = validateCheckbox(checkbox);
    const passwordValid = validatePasswords(password, conrollPassword);
    return checkboxValid && passwordValid;
}

function validateCheckbox(checkbox) {
    const isValid = checkbox.checked;
    checkbox.style.border = `2px solid ${isValid ? 'black' : 'red'}`;
    return isValid;
}

function validatePasswords(password, conrollPassword) {
    const match = password.value === conrollPassword.value;
    conrollPassword.style.border = `1px solid ${match ? 'black' : 'red'}`;
    conrollPassword.style.boxShadow = match ? 'none' : '';
    document.getElementById('notCorrectValue').style.display = match ? 'none' : 'flex';
    return match;
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

function hideLoggendInLinks() {
    let status = sessionStorage.getItem("loginStatus");
    if (status === "undefined" && window.innerWidth > 1040) {
        const loggedInLinks = Array.from(document.getElementsByClassName('logged-in'));
        loggedInLinks.forEach( li => {
        li.style.display = 'none';
        document.getElementById('login-button').classList.add('menu-login-button')
        });
    } else if (status === "undefined" && window.innerWidth < 1040) {
        const loggedInLinks = Array.from(document.getElementsByClassName('logged-in'));
        loggedInLinks.forEach( li => {
        li.style.display = 'none';
        document.getElementById('login-button').classList.add('menu-login-button');
        });
        document.getElementById('menu-button-bottom-box').style.display = "flex";
    }
    if (status ===  "loggedIn") {
        const loginInLink = Array.from(document.getElementsByClassName('login'));
        loginInLink.forEach( li => {
        li.style.display = 'none';
    });
    }
}

function correctLoginStatus() {
    let loginStatus;
    if (document.getElementById('login-button').style.display === "none") {loginStatus = "loggedIn"};
    if (loginStatus === "loggedIn") {
        sessionStorage.setItem("loginStatus", loginStatus);
    }
}