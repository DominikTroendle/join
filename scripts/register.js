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
    color = await randomBgColor();
    let isValid = await UserRegister();
    if (!isValid) {
        return false;
    }
    let name = form.querySelector('#name');
    let email = form.querySelector('#email');
    let password = form.querySelector('#password');
    let newUser = {
        "name" : name.value +  " (You)",
        "email" : email.value,
        "password" : password.value,
        "color" : color,
        "phone" : " "
    };
    let response = await sendData("/users", {});
    if (response && response.name) {
        let userId = response.name;
        await putData(`/users/${userId}/userDatas`, newUser);
        await sendData(`/users/${userId}/allContacts`, newUser);
        name.value = '';
        email.value = '';
        password.value = '';
        window.location.href = 'index.html?msg=You Signed Up successfully';
    } else {
        console.error("User registration failed.");
    }
    return false;
}

async function randomBgColor() {
    if (bgColors.length === 0) return ".bg-grey";
    let randomIndex = Math.floor(Math.random() * bgColors.length);
    return bgColors[randomIndex].name.replace(/^\./, '');
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
        conrollPassword.style.border = "solid 2px red"
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

function hideLoggendInLinks() {
    let path = sessionStorage.getItem("currentPage", window.location.pathname);
    if (path === "/register.html" || path === "/index.html") {
        const loggedInLinks = Array.from(document.getElementsByClassName('logged-in'));
        loggedInLinks.forEach( li => {
        li.style.display = 'none';
        document.getElementById('login-button').classList.add('menu-login-button')
    });
    }
    if (path === "/summary.html" || path === "/add-task.html" || path === "/board.html" || path === "/contacts.html") {
        const loginInLink = Array.from(document.getElementsByClassName('login'));
        loginInLink.forEach( li => {
        li.style.display = 'none';
    });
    }
}