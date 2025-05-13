const BASE_URL = "https://join-user-default-rtdb.europe-west1.firebasedatabase.app/"
let isPasswordVisible = false;
let logoAnimation = sessionStorage.getItem("moveAnimation");
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
}

/**
 * Handles user login by validating email and password.
 */
async function UserLogin() {
    let emailInput = document.getElementById('email');
    let passwordInput = document.getElementById('password');
    let email = emailInput.value;
    let password = passwordInput.value;
    let usersResponse = await fetch(BASE_URL + "users.json");
    let users = await usersResponse.json();
    let userId = Object.keys(users).find(key => users[key].userDatas.email === email && users[key].userDatas.password === password);
    handleUserLogin(userId, users, emailInput, passwordInput);
}

/**
 * Handles user login by storing user info and redirecting, or showing an error if login fails.
 * @param {string} userId - The user's ID.
 * @param {object} users - Object containing all users.
 * @param {HTMLElement} emailInput - The email input element.
 * @param {HTMLElement} passwordInput - The password input element.
 */
function handleUserLogin(userId, users, emailInput, passwordInput) {
    if (userId) {
        localStorage.setItem("userId", userId);
        sessionStorage.setItem("loggedIn", "true");
        window.location.href = 'html/summary.html?';
    } else {
        throwLoginDataError(users, emailInput, passwordInput);
    }
}

/**
 * Displays an error border and message on the corresponding input if the input value doesnt match the server`s data
 * @param {object} users - Object containing all users.
 * @param {HTMLElement} emailInput - Input element where the user enters his email address
 * @param {HTMLElement} passwordInput - Input element where the user enters his password
 */
function throwLoginDataError(users, emailInput, passwordInput) {
    const email = emailInput.value, password = passwordInput.value;
    const user = Object.values(users).find(u => u.userDatas.email === email);
    const emailValid = !!user, passwordValid = user?.userDatas.password === password;
    setInputBorder(emailInput, emailValid);
    setInputBorder(passwordInput, emailValid && passwordValid);
    toggleErrorMessage(!(emailValid && passwordValid));
}

/**
 * Sets input border to red or grey, depending on the value of isValid (red if true, grey otherwise)
 * @param {HTMLElement} input - Input elemen whose border should be adjusted
 * @param {boolean} isValid - boolean to determine which color the input border should get
 */
function setInputBorder(input, isValid) {
    input.style.border = `1px solid ${isValid ? '#D1D1D1' : 'red'}`;
}

/**
 * Displays or removes an errror message, depending on the value of show (remove if false, show otherwise)
 * @param {boolean} show - boolean to determine whether the error message should be shown or not
 */
function toggleErrorMessage(show) {
    document.getElementById('notCorrectValue').style.display = show ? 'block' : 'none';
}

/**
 * Sets the user ID to "guest" and redirects to the summary page.
 */
function loginGuastAccount() {
    localStorage.setItem("userId", "guest");
    sessionStorage.setItem("loggedIn", "true");
    window.location.href = "html/summary.html?"
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
    if (logoAnimation === "false") return backLogin();
    setTimeout(() => {
        const { passivLogo, loginLogo, overlay, logoPath1, logoPath2, logoPath3, logoPath4, logoPath5 } = getLogoElements();
        updateLogoElements(passivLogo, loginLogo, overlay, [logoPath1, logoPath2, logoPath3, logoPath4, logoPath5]);
        setTimeout(() => {
            overlay.classList.remove('login-overlay');
            passivLogo.style.display = "flex";
            loginLogo.style.display = "none";
        }, 1000);
        sessionStorage.setItem("moveAnimation", false);
    }, 200);
}

// /**
//  * Updates the logo elements and triggers the animation.
//  */
function updateLogoElements(passivLogo, loginLogo, overlay, logoPaths) {
    passivLogo.style.display = "none";
    loginLogo.style.display = "flex";
    overlay.classList.add('login-overlay');
    logoPaths.forEach(logoPath => logoPath.classList.add('animation-change-logo-color'));
    setTimeout(() => {
        logoPaths.forEach(logoPath => logoPath.classList.remove('animation-change-logo-color'));
    }, 1000);
}

// /**
//  * Retrieves logo-related DOM elements.
//  * @returns {Object} An object containing the logo elements.
//  */
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