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
                    <input type="name" id="name" placeholder="Name" required />
                    <input type="email" id="email" placeholder="Email" required />
                    <input type="password" id="password" placeholder="Password" required/>
                    <input type="password" id="password" placeholder="Password" required/>
                <div>
                <div class="privacy-policy">
                    I accept the <a href="">Privacy policy</a>
                </div>
                <div class="register-button">
                    <button>Sign up</button>
                </div>
            </form>
        </div>
    </div>
`
}