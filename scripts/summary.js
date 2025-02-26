const BASE_URL = "https://join-user-default-rtdb.europe-west1.firebasedatabase.app/"




function changeImgSource(id, imgSource) {
    imgId = document.getElementById(id)
    imgId.src = imgSource;
}

async function init() {
    await loadUserData()
    currentTime();
}

async function loadUserData() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        console.log("Kein eingeloggter User gefunden!");
        return window.location.href = "index.html?";
    }
    let dataPath = userId === "guest" ? "users/guest.json" : `users/${userId}.json`;
    let response = await fetch(BASE_URL + dataPath);
    let userData = await response.json();
    
    console.log("Daten des eingeloggten Users:", userData);
    document.getElementById('userName').innerHTML = userData.userDatas.user || "";
    document.getElementById('smallInitials').innerText = findInitials(userData.userDatas.user) || "G"
}

function findInitials(contactName) {
    let name = contactName.split(' ');
    let initials = '';
    for (let i = 0; i < name.length; i++) {
        initials += name[i].substring(0, 1).toUpperCase();
    }
    return initials
}

function currentTime() {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
        document.getElementById('currentGreeting').innerHTML = "Good morning"
    } else if (currentTime < 18) {
        document.getElementById('currentGreeting').innerHTML = "Good day"
    } else {
        document.getElementById('currentGreeting').innerHTML = "Good evening"
    }
}