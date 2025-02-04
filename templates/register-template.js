async function getTemplateRegister() {
return `
    <img src="assets/img/join-logo.png" alt="Logo" class="logo" />
    <div class="user-register-container">
        <div class="user-register">
            <div class="Sign-up">
                <button class="left-btn"><img src="assets/img/arrow-left-line.png" alt=""></button>
                <h1>Sign up</h1>
            </div>
            <div class="blue-line"></div>
            <form onsubmit="UserRegister(); return false">
                <div class="register-input">
                    <div class="input-container">
                        <input type="name" id="name" placeholder="Name" required />
                        <img src="assets/img/person.png" alt="person Icon" class="input-icon">
                    </div>
                    <div class="input-container">
                        <input type="email" id="email" placeholder="Email" required />
                        <img src="assets/img/mail.png" alt="Mail Icon" class="input-icon">
                    </div>
                    <div class="input-container">
                        <input type="password" id="password" placeholder="Password" required
                        onfocus="changePasswordIcon(true)" 
                        onblur="changePasswordIcon(false)"/>
                        <img id="passwordIcon" src="assets/img/lock.png" alt="lock Icon" class="input-icon">
                    </div>
                    <div class="input-container">
                        <input type="password" id="controllPassword" placeholder="Password" required
                        // onfocus="changeConrollPasswordIcon(true)" 
                        // onblur="changeConrollPasswordIcon(false)"/>
                        <img id="passwordControllIcon" src="assets/img/lock.png" alt="lock Icon" class="input-icon" onclick="togglePasswordVisibility()">
                    </div>
                    <div class="no-value-content">
                        <p id="notCorrectValue" class="error-massage">Your passwords don't match. Please try again.</p>
                    </div>
                </div>
                <div class="privacy-policy-container">
                    <input type="checkbox" id="checkbox" class="checkbox"> 
                    <label for="checkbox">I accept the <a href="">Privacy policy</a></label
                </div>
                <div class="register-button">
                    <button onclick="UserRegister()">Sign up</button>
                </div>
            </form>
        </div>
    </div>
`
}