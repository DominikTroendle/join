const BASE_URL = "https://join-user-default-rtdb.europe-west1.firebasedatabase.app/"
let isPasswordVisible = false;
let logoAnimation = localStorage.getItem("moveAnimation");
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');

/**
 * Displays a message in a modal for 2 seconds.
 * @param {string} msg - The message to display.
 */
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

/**
 * Initializes the animation and session storage.
 */
function init() {
    animationLogo()
    sessionSorage()
}

/**
 * Authenticates the user by checking email and password against stored data.
 * If successful, stores user ID in local storage, sets session, and redirects to summary page.
 * If unsuccessful, highlights input fields and displays an error message.
 */
async function UserLogin() {
    let emailInput = document.getElementById('email');
    let passwordInput = document.getElementById('password');
    let email = emailInput.value;
    let password = passwordInput.value;
    let usersResponse = await fetch(BASE_URL + "users.json");
    let users = await usersResponse.json();
    let userId = Object.keys(users).find(key => users[key].userDatas.email === email && users[key].userDatas.password === password);
    if (userId) {
        localStorage.setItem("userId", userId);
        sessionSorage("loggedIn");
        window.location.href = 'summary.html?';
    } else {
        emailInput.style.border = "1px solid red";
        passwordInput.style.border = "1px solid red";
        document.getElementById('notCorrectValue').style.display = ("block")
    }
}

/**
 * Sets the user ID to "guest" and redirects to the summary page.
 */
function loginGuastAccount() {
    localStorage.setItem("userId", "guest");
    window.location.href = "summary.html?"
}

/**
 * Changes the password icon based on focus and visibility state.
 * @param {boolean} focused - Whether the input is focused.
 */
function changePasswordIcon(focused) {
    const icon = document.getElementById("passwordIcon");
    if (focused && !isPasswordVisible) {
        icon.src = "assets/img/visibility_off.png";
    } else if (!focused && !isPasswordVisible) {
        icon.src = "assets/img/lock.png";
    }
}

/**
 * Toggles password visibility and changes the icon.
 */
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

/**
 * Reloads the page and hides the login overlay and logo.
 */
function backLogin() {
    window.location.reload = "index.html"
    let overlay = document.getElementById('loginOverlay');
    overlay.style.display = "none"
    let loginLogo = document.getElementById('loginLogo');
    loginLogo.style.display = "none"
}

/**
 * Toggles the logo animation and updates the logo and overlay elements.
 * If animation is disabled, calls backLogin function.
 */
function animationLogo() {
    if (logoAnimation === "false") {
        backLogin();
    } else {
        setTimeout(() => {
            const { passivLogo, loginLogo, overlay, logoPath1, logoPath2, logoPath3, logoPath4, logoPath5 } = getLogoElements();
            passivLogo.style.display = "none";
            loginLogo.style.display = "flex";
            overlay.classList.add('login-overlay');
            logoPath1.classList.add('animation-change-logo-color');
            logoPath2.classList.add('animation-change-logo-color');
            logoPath3.classList.add('animation-change-logo-color');
            logoPath4.classList.add('animation-change-logo-color');
            logoPath5.classList.add('animation-change-logo-color');
            setTimeout(() => {
                overlay.classList.remove('login-overlay');
            }, 1000);
            localStorage.setItem("moveAnimation", false);
        }, 200);
    }
}

/**
 * Retrieves logo-related DOM elements.
 * @returns {Object} An object containing the logo elements.
 */
function getLogoElements() {
    return {
        passivLogo: document.getElementById('passivLogo'),
        loginLogo: document.getElementById('loginLogo'),
        overlay: document.getElementById('loginOverlay'),
        logoPath1: document.getElementById('moveLogo1'),
        logoPath2: document.getElementById('moveLogo2'),
        logoPath3: document.getElementById('moveLogo3'),
        logoPath4: document.getElementById('moveLogo4'),
        logoPath5: document.getElementById('moveLogo5')
    };
}