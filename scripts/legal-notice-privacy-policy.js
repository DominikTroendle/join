/**
 * Loads and displays user initials.
 */
async function loadSmallInitials() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        return;
    }
    let dataPath = userId === "guest" ? "users/guest.json" : `users/${userId}.json`;
    let response = await fetch(BASE_URL + dataPath);
    let userData = await response.json();
    document.getElementById('smallInitials').innerText = findInitials(userData.userDatas.name) || "G";
}

/**
 * Gets initials from a name.
 * 
 * @param {string} contactName - The full name.
 */
function findInitials(contactName) {
    let name = contactName.trim().split(' ').filter(n => n);
    let initials = '';
    for (let i = 0; i < Math.min(name.length, 2); i++) {
        initials += name[i].charAt(0).toUpperCase();
    }
    return initials
}