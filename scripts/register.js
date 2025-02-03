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

    let name = document.getElementById('name');
    let title = document.getElementById('email');
    let description = document.getElementById('password');

    let newUser = {
        "user" : name.value,
        "email" : email.value,
        "password" : password.value,
    };
    await UserLogin()
    await sendData("/allUser", newUser);
    name.value = '';
    title.value = '';
    description.value = '';

    window.location.href = 'login.html?msg=Du hast dich erfolgreich regestriert';
    return false;
}

async function UserLogin() {
    let password = document.getElementById('password');
    let conrollPassword = document.getElementById('conrollPassword');
    let user = allUsers.find(u => u.password == password.value && u.conrollPassword == conrollPassword.value)
    if (user) {
        console.log("user gefunden");
        email.value = "";
        password.value = "";
        window.location.href = 'login.html?';
    }else{
        console.log("kein user vorhanden");
        conrollPassword.style.border = "1px solid red";
        document.getElementById('notCorrectValue').style.display = ("flex")
    }
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