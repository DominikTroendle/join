const BASE_URL = "https://join-user-default-rtdb.europe-west1.firebasedatabase.app/"
let isPasswordVisible = false;
let bgColors = [];

/**
 * Initializes the application by loading colors, user data, and setting up session storage.
 */
async function init() {
    await loadColors();
    await loadAllUserData();
}

/**
 * Loads background color classes from a CSS file and returns them as objects.
 * @returns {Promise<Array<{name: string, color: string}>>}
 */
async function loadColors() {
    let responseColors = await fetch("../styles/colors.css");
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

/**
 * Loads and returns JSON user data from the given path.
 * @param {string} path - Relative path to the user data file (without ".json").
 * @returns {Promise<Object>} Parsed JSON data.
 */
async function loadAllUserData(path) {
    let response = await fetch(BASE_URL + path + ".json")
    return responseToJson = await response.json();
}

/**
 * Sends a POST request with JSON data to the specified path.
 * @param {string} path - API endpoint path.
 * @param {Object} data - Data to send in the request body.
 * @returns {Promise<Object>} - Parsed JSON response.
 */
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

/**
 * Sends a PUT request with JSON data to the specified path.
 * @param {string} path - Endpoint path (without .json).
 * @param {Object} data - Data to send in the request body.
 * @returns {Promise<Object>} - Parsed JSON response.
 */
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

/**
 * Handles user registration: creates user, registers them, and redirects on success.
 * @param {Event} event - The form submit event.
 * @param {HTMLFormElement} form - The registration form element.
 */
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

/**
 * Returns a random background color class name.
 * @returns {string} The class name of a random background color.
 */
async function randomBgColor() {
    if (bgColors.length === 0) return ".bg-grey";
    let randomIndex = Math.floor(Math.random() * bgColors.length);
    return bgColors[randomIndex].name.replace(/^\./, '');
}

/**
 * Registers a user by sending data to an API and returns the user ID if successful.
 * @async
 * @param {Object} user - The user data to be registered.
 * @returns {string|null} The user ID if registration succeeds, otherwise null.
 */
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

/**
 * Creates a user object from the form data and color.
 * @param {HTMLFormElement} form - The form containing user data.
 * @param {string} color - The user's color preference.
 * @returns {Object} The user object.
 */
function createUserObject(form, color) {
    return {
        name: form.querySelector('#name').value + " (You)",
        email: form.querySelector('#email').value,
        password: form.querySelector('#password').value,
        color: color,
        phone: " "
    };
}

/**
 * Clears the values of name, email, and password fields in the form.
 * @param {HTMLFormElement} form - The form to clear.
 */
function clearForm(form) {
    form.querySelector('#name').value = '';
    form.querySelector('#email').value = '';
    form.querySelector('#password').value = '';
}

/**
 * Redirects the user to the login page.
 */
function backToLogin() {
    window.location.href = '../index.html?';
}

/**
 * Validates user registration inputs (name, email, checkbox and passwords).
 * @returns {Promise<boolean>} True if all variables (name, email, checkbox and passwords) are valid, otherwise false.
 */
async function UserRegister() {
    const password = document.getElementById('password');
    const conrollPassword = document.getElementById('controllPassword');
    const checkbox = document.getElementById('checkbox');
    const checkboxValid = validateCheckbox(checkbox);
    const passwordMatch = validatePasswords(password, conrollPassword);
    const nameValid = validateSignupInputs('name');
    const emailValid = validateSignupInputs('email');
    const passwordValid = validateSignupInputs('password');
    return nameValid && emailValid && checkboxValid && passwordValid && passwordMatch;
}

/**
 * Validates if inputs of name and email are filled and updates its border color.
 * @param {String} input - name of the input to validate
 * @returns {boolean} true if the input is valid, false otherwise
 */
function validateSignupInputs(input) {
    const inputRef = document.getElementById(`${input}`);
    let isValid = true;
    if (inputRef.value.length === 0 || !inputRef.value.includes("@")) {
        inputRef.style.border = '1px solid red';
        isValid = false;
    } else {
        inputRef.style.border = '1px solid #D1D1D1';
    }
    return isValid;
}

/**
 * Validates if a checkbox is checked and updates its border color.
 * @param {HTMLInputElement} checkbox - The checkbox element to validate.
 * @returns {boolean} True if checked, false otherwise.
 */
function validateCheckbox(checkbox) {
    const isValid = checkbox.checked;
    checkbox.style.border = `2px solid ${isValid ? 'black' : 'red'}`;
    return isValid;
}

/**
 * Validates if the provided passwords match and updates the UI accordingly.
 * @param {HTMLInputElement} password - The password input element.
 * @param {HTMLInputElement} conrollPassword - The confirmation password input element.
 * @returns {boolean} - Returns true if passwords match, false otherwise.
 */
function validatePasswords(password, conrollPassword) {
    const match = password.value !== "" && password.value === conrollPassword.value;
    conrollPassword.style.border = `1px solid ${match ? 'black' : 'red'}`;
    conrollPassword.style.boxShadow = match ? 'none' : '';
    document.getElementById('notCorrectValue').style.display = match ? 'none' : 'flex';
    return match;
}

/**
 * Updates the password icon based on input focus and visibility state.
 * @param {boolean} focused - Whether the password input is focused.
 */
function changePasswordIcon(focused) {
    const icon = document.getElementById("passwordIcon");
    const passwordInput = document.getElementById("password")
    if (focused && !isPasswordVisible) {
        icon.src = "../assets/img/visibility_off.png";
    } else if (passwordInput.value.trim().length > 0) {
        icon.src = "../assets/img/visibility_off.png";
    } else {
        icon.src = "../assets/img/lock.png";
    }
}

/**
 * Updates the password visibility icon based on input focus and value.
 * @param {boolean} focused - Indicates if the password input is focused.
 */
function changeConrollPasswordIcon(focused) {
    const icon = document.getElementById("passwordControllIcon");
    const passwordInput = document.getElementById("controllPassword");
    if (isPasswordVisible) return;
    if (focused) {
        icon.src = "../assets/img/visibility_off.png";
    } else if (passwordInput.value.trim().length > 0) {
        icon.src = "../assets/img/visibility_off.png";
    } else {
        icon.src = "../assets/img/lock.png";
    }
}

/**
 * Toggles the visibility of the password input field.
 */
function togglePasswordVisibility() {
    const passwordInput = document.getElementById("controllPassword");
    const icon = document.getElementById("passwordControllIcon");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.src = "../assets/img/visibility.png";
        isPasswordVisible = true;
    } else {
        passwordInput.type = "password";
        icon.src = "../assets/img/visibility_off.png";
        isPasswordVisible = false;
    }
}

/**
 * Hides login-related links based on login status and screen width.
 */
function hideLoggendInLinks() {
    const status = sessionStorage.getItem("loggedIn");
    if (status === null && window.innerWidth > 1040) {
        hideLoggedInLinksDesktop();
    } else if (status === null && window.innerWidth < 1040) {
        hideLoggedInLinksDesktop();
        document.getElementById('menu-button-bottom-box').style.display = "flex";
    }
    if (status === "true") {
        Array.from(document.getElementsByClassName('login'))
            .forEach(li => li.style.display = 'none');
    }
}

/**
 * Hides elements for logged-in users on desktop and updates the login button style.
 */
function hideLoggedInLinksDesktop() {
    const loggedInLinks = Array.from(document.getElementsByClassName('logged-in'));
    loggedInLinks.forEach(li => {
        li.style.display = 'none';
        document.getElementById('login-button').classList.add('menu-login-button');
    });
}