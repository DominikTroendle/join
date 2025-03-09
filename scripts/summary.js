const BASE_URL = "https://join-user-default-rtdb.europe-west1.firebasedatabase.app/"

function changeImgSource(id, imgSource) {
    imgId = document.getElementById(id)
    imgId.src = imgSource;
}

async function init() {
    await loadUserData()
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
    document.getElementById('userName').innerHTML = userData.userDatas.user || "";
    document.getElementById('smallInitials').innerText = findInitials(userData.userDatas.user) || "G"
    currentTime(userId);
}

function findInitials(contactName) {
    let name = contactName.split(' ');
    let initials = '';
    for (let i = 0; i < name.length; i++) {
        initials += name[i].substring(0, 1).toUpperCase();
    }
    return initials
}

function currentTime(userId) {
    const currentTime = new Date().getHours();
    let greeting = "";
    if (currentTime < 12) {
        greeting = "Good morning";
    } else if (currentTime < 18) {
        greeting = "Good day";
    } else {
        greeting = "Good evening";
    }
    if (userId !== "guest") {
        greeting += ",";
    }
    document.getElementById('currentGreeting').innerHTML = greeting;
}

// async function readFromDatabase(userKey) {
//     try {
//         let allLoadTasks = [];
//         let result = await fetch(`${BASE_URL}users/${userKey}/tasks.json`);
//         if (!result.ok) {
//             throw new Error(`error when loading the data: ${result.statusText}`);
//         }
//         let data = await result.json();
//         if (data) {
//             Object.entries(data).forEach(([firebaseKey, value]) => {
//                 value.id = firebaseKey;
//                 if (!value.assignedContacts) {
//                     value.assignedContacts = [];
//                 }
//                 allLoadTasks.push(value);
//             });

//         }
//     } catch (error) {
//         console.error("error loading the data:", error);
//     }

// }

// readFromDatabase(localStorage.getItem("userId"));