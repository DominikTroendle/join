const BASE_URL = "https://join-user-default-rtdb.europe-west1.firebasedatabase.app/"




function changeImgSource(id, imgSource) {
    imgId = document.getElementById(id)
    imgId.src = imgSource;
}

async function init() {
    await loadUserData()
    currentDate();
    currentTime();
}

async function loadUserData() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        console.log("Kein eingeloggter User gefunden!");
        return;
    }
    let dataPath = userId === "guest" ? "guest/guestUser.json" : `users/${userId}.json`;
    let response = await fetch(BASE_URL + dataPath);
    let userData = await response.json();
    
    console.log("Daten des eingeloggten Users:", userData);
    document.getElementById('userName').innerHTML = userData.user || "";
}

function currentDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = today.toLocaleDateString('en-US', options);
    document.getElementById("currentDate").innerText = dateString;
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