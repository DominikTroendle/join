function changeImgSource(id, imgSource) {
    imgId = document.getElementById(id)
    imgId.src = imgSource;
}

function init() {
    currentDate();
    currentTime();
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