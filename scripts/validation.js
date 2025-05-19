/**
 * Retrieves password inputs and validates whether they match.
 */
function checkPasswordMatch() {
    const password = document.getElementById('password');
    const conrollPassword = document.getElementById('controllPassword');
    validatePasswords(password, conrollPassword);
}