async function getTemplateLogin() {
return `
<img src="assets/img/join-logo.png" alt="Logo" class="logo" />
    <div class="login-container">
        <div class="register-link">
            <h7>Not a Join user?</h7>
            <button><a href="register.html">Sign up</a></button>
        </div>
    </div>
    <div class="user-login-container">
        <div class="user-login">
        <div class="login">
            <h1>Log in</h1>
            <div class="blue-line"></div>
            <form onsubmit="UserLogin(); return false">
                <div class="input-container">
                    <input type="email" id="email" placeholder="Email" required />
                    <img src="assets/img/mail.png" alt="Mail Icon" class="input-icon">
                </div>
                <div class="input-container">
                    <input type="password" id="password" placeholder="Password" required />
                    <img src="assets/img/lock.png" alt="Lock Icon" class="input-icon">
                </div>
                <div class="no-value-content">
                <p id="notCorrectValue" class="error-massage">Check your email and password. Please try again.</p>
                </div>
                <div class="login-buttons">
                    <button type="submit">Log in</button>
                    <button type="button" onclick="loginGuastAccount()">Guast Log in</button>
                </div>
            </form>
        </div>
        </div>
    </div>
    <div class="legal-information">
        <a href="">Privacy Policy</a>
        <a href="">Legal notice</a>
    </div>
`
}

