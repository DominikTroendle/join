const BASE_URL = "https://join-user-default-rtdb.europe-west1.firebasedatabase.app/"

/**
 * Changes the source of an image element based on its ID.
 * 
 * This function updates the `src` attribute of an image element with the given `id` to a new image source.
 * It is useful for dynamically updating images on a webpage.
 * 
 * @param {string} id - The ID of the image element whose source needs to be changed.
 * @param {string} imgSource - The new source URL for the image.
 * 
 * @example
 * changeImgSource('myImageId', 'https://example.com/new-image.jpg');
 * // This will change the source of the image with ID 'myImageId' to the new image URL.
 */
function changeImgSource(id, imgSource) {
    imgId = document.getElementById(id)
    imgId.src = imgSource;
}

/**
 * Initializes the application by loading user data.
 * 
 * This asynchronous function is used to initialize the application by calling the `loadUserData` function,
 * which fetches or loads user-related data. The `init` function is meant to be called at the start of the 
 * application to ensure that user data is loaded before the application runs.
 * 
 * @async
 * @function
 * @returns {Promise<void>} Resolves when the user data has been loaded.
 * 
 * @example
 * init().then(() => {
 *     console.log('User data has been successfully loaded!');
 * });
 */
async function init() {
    await loadUserData()
}

/**
 * Loads user data from a JSON file based on the user ID stored in localStorage.
 * If the user is not logged in or the user ID is invalid, redirects to the login page.
 * 
 * Fetches the user data from the appropriate file (either `guest.json` or a user-specific JSON file) 
 * and updates the user name and initials on the page.
 * 
 * @async
 * @function
 * @returns {Promise<void>} Resolves when the user data is successfully loaded and the UI is updated.
 * 
 * @throws {Error} If the user ID cannot be found in localStorage or the fetch request fails.
 * 
 * @example
 * await loadUserData();
 */
async function loadUserData() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        return window.location.href = "index.html?";
    }
    let dataPath = userId === "guest" ? "users/guest.json" : `users/${userId}.json`;
    let response = await fetch(BASE_URL + dataPath);
    let userData = await response.json();
    let userNameElement = document.getElementById('userName');
    let userName = userData.userDatas.name || "";
    updateUserNameAndInitials(userId, userData, userNameElement, userName);
}

/**
 * Updates the user name and initials on the page based on the provided user data.
 * 
 * If the user name is not "guest", it displays the user name (removing the "(You)" suffix, if present). 
 * If the user name is "guest", it clears the displayed user name. 
 * It also updates the initials (or defaults to "G" if no initials are found) and displays the current time based on the user ID.
 * 
 * @function
 * @param {string} userId - The ID of the user (used to fetch and display the current time).
 * @param {Object} userData - The data object containing user information, including the user name.
 * @param {HTMLElement} userNameElement - The HTML element where the user name will be displayed.
 * @param {string} userName - The name of the user to be displayed on the page.
 * 
 * @example
 * updateUserNameAndInitials(userId, userData, userNameElement, userName);
 */
function updateUserNameAndInitials(userId, userData, userNameElement, userName) {
    if (userName.toLowerCase() !== "guest") {
        userNameElement.innerHTML = userName.replace(/\s*\(You\)$/, "");
    } else {
        userNameElement.innerHTML = "";
    }
    document.getElementById('smallInitials').innerText = findInitials(userData.userDatas.name) || "G"
    currentTime(userId);
}

/**
 * Extracts the initials from a contact name by taking the first letter of the first two words of the name.
 * 
 * This function trims the input name, splits it into words, and collects the first letter of each word 
 * (up to the first two words). The initials are returned as a string, with each letter capitalized.
 * 
 * @function
 * @param {string} contactName - The full name of the contact (e.g., "John Doe").
 * @returns {string} - A string containing the initials of the contact. If the name has fewer than two words, 
 *                     only the first letter of the first word is returned.
 * 
 * @example
 * const initials = findInitials("John Doe"); // returns "JD"
 */
function findInitials(contactName) {
    let name = contactName.trim().split(' ').filter(n => n);
    let initials = '';
    for (let i = 0; i < Math.min(name.length, 2); i++) {
        initials += name[i].charAt(0).toUpperCase();
    }
    return initials
}

/**
 * Determines the current time of day and updates the greeting message for the user.
 * It assigns "Good morning", "Good day", or "Good evening" based on the current hour.
 * 
 * @function
 * @param {string} userId - The ID of the user to personalize the greeting.
 */
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
    updateGreetingForUser(userId, greeting);
}

/**
 * Updates the greeting message displayed for the user.
 * If the user is not a guest, a comma is added after the greeting.
 * 
 * @function
 * @param {string} userId - The ID of the user to personalize the greeting.
 * @param {string} greeting - The greeting message to display (e.g., "Good morning").
 */
function updateGreetingForUser(userId, greeting) {
    if (userId !== "guest") {
        greeting += ",";
    }
    document.getElementById('currentGreeting').innerHTML = greeting;
}

/**
 * Fetches and processes data from the database.
 * Retrieves user data from local storage, loads tasks, and updates task deadlines.
 * If an error occurs during the data loading process, it is logged to the console.
 * 
 * @async
 * @function
 * @throws {Error} If an error occurs while retrieving or processing the data, it is caught and logged.
 */
async function readFromDatabase() {
    try {
        let userKey = localStorage.getItem("userId");
        let allLoadTasks = [];
        loadNumberOfTasksinHtmlElements(allLoadTasks);
        loadNumberOfPriorityTasks(allLoadTasks);
        updateTaskDeadline(userKey, allLoadTasks);
    } catch (error) {
        console.error("error loading the data:", error);
    }
}

/**
 * Fetches and updates the task deadline for a specific user.
 * It retrieves task data from the database and updates the UI with the current date and the upcoming deadline.
 * If the data loading fails, an error is thrown.
 * 
 * @async
 * @function
 * @param {string} userKey - The key (ID) of the user whose task deadline needs to be updated.
 * @throws {Error} If an error occurs while fetching or processing the data, it is caught and thrown with a descriptive message.
 */
async function updateTaskDeadline(userKey, allLoadTasks) {
    document.getElementById("currentDate").innerHTML = "None";
    document.getElementById("deadline-text").innerHTML = "Upcoming Deadline";
    let result = await fetch(`${BASE_URL}users/${userKey}/tasks.json`);
    if (!result.ok) {
        throw new Error(`error when loading the data: ${result.statusText}`);
    }
    processAndLoadUserTasks(result, allLoadTasks);
}

/**
 * Processes and loads user task data from the result of a fetch operation.
 * The data is parsed from the response and each task is processed to ensure
 * that assigned contacts are initialized. It then updates the task count and priority tasks.
 * 
 * @async
 * @function
 * @param {Response} result - The response object from the fetch request containing user task data.
 * @throws {Error} If an error occurs during the processing of the fetched task data.
 */
async function processAndLoadUserTasks(result, allLoadTasks) {
    let data = await result.json();
    if (data) {
        Object.entries(data).forEach(([firebaseKey, value]) => {
            value.id = firebaseKey;
            if (!value.assignedContacts) {
                value.assignedContacts = [];
            }
            allLoadTasks.push(value);
        });
        loadNumberOfTasksinHtmlElements(allLoadTasks);
        loadNumberOfPriorityTasks(allLoadTasks);
    }
}

/**
 * Updates the HTML elements with the number of tasks in different categories.
 * It filters the tasks based on their category (e.g., "toDos", "inProgress", etc.)
 * and updates the corresponding elements in the DOM.
 * 
 * @function
 * @param {Array} allLoadTasks - An array of task objects, each containing a `category` property.
 * Each task is filtered based on its category to update the corresponding task count in the UI.
 */
function loadNumberOfTasksinHtmlElements(allLoadTasks) {
    document.getElementById("number-of-tasks-in-to-do").innerHTML = allLoadTasks.filter(element => element.category === "toDos").length;
    document.getElementById("number-of-tasks-in-progress").innerHTML = allLoadTasks.filter(element => element.category === "inProgress").length;
    document.getElementById("number-of-tasks-in-awaiting-feedback").innerHTML = allLoadTasks.filter(element => element.category === "awaitFeedback").length;
    document.getElementById("number-of-tasks-in-done").innerHTML = allLoadTasks.filter(element => element.category === "done").length;
    document.getElementById("number-of-all-tasks").innerHTML = allLoadTasks.length;
}

function loadNumberOfPriorityTasks(allLoadTasks) {
    let numberOfUrgentTasks = allLoadTasks.length > 0 ? allLoadTasks.filter(element => element.taskPriority === "urgent" && element.category !== "done").length : 0;
    let numberOfMediumTasks = allLoadTasks.length > 0 ? allLoadTasks.filter(element => element.taskPriority === "medium" && element.category !== "done").length : 0;
    let numberOfLowTasks = allLoadTasks.length > 0 ? allLoadTasks.filter(element => element.taskPriority === "low" && element.category !== "done").length : 0;
    if (numberOfUrgentTasks !== 0) {
        updatePriorityTaskDisplay(numberOfUrgentTasks, "Urgent", "assets/icons/urgent-summary.png", allLoadTasks);
        return;
    } else if (numberOfMediumTasks !== 0) {
        updatePriorityTaskDisplay(numberOfMediumTasks, "Medium", "assets/icons/medium-summary.svg", allLoadTasks);
        return;
    } else if (numberOfLowTasks !== 0) {
        updatePriorityTaskDisplay(numberOfLowTasks, "Low", "assets/icons/low-summary.svg", allLoadTasks)
        return;
    } else {
        let numberOfPriorityTasks = document.getElementById("number-of-priority-tasks");
        numberOfPriorityTasks.innerHTML = "&#x1F3C1";
        document.getElementById("priority-text").innerHTML = "finished";
        document.getElementById("priority-img").src = "assets/icons/all-ready-summary.svg";
    }
}

function updatePriorityTaskDisplay(numberOfPriorityTasks, priorityText, priorityImg, allLoadTasks) {
    document.getElementById("number-of-priority-tasks").innerHTML = numberOfPriorityTasks;
    document.getElementById("priority-text").innerHTML = priorityText;
    document.getElementById("priority-img").src = priorityImg;
    loadUpcomingDeadline(allLoadTasks, priorityText.toLowerCase());
}

function loadUpcomingDeadline(allLoadTasks, priority) {
    let tasksWithCurrentPriority = allLoadTasks.filter(element => element.taskPriority === priority && element.category !== "done");
    let datesOfUpcomingDeadlines = tasksWithCurrentPriority.map(element => element.taskDueDate);
    const currentDate = new Date();
    let pastDeadlines = [];
    let futureDeadlines = [];
    if (datesOfUpcomingDeadlines) {
        for (let dateString of datesOfUpcomingDeadlines) {
            if (!dateString) continue;
            let taskDate = new Date(dateString.split("/").reverse().join("-"));
            if (taskDate < currentDate) {
                pastDeadlines.push(taskDate);
            } else {
                futureDeadlines.push(taskDate);
            }
        }
        let closestDeadline = null;
        if (pastDeadlines.length > 0) {
            closestDeadline = pastDeadlines.reduce((closest, current) => {
                return (current > closest && current < currentDate) ? current : closest;
            });
            let deadlineText = document.getElementById("deadline-text");
            deadlineText.innerHTML = "Expired Deadline";
            deadlineText.style.color = "#FF8190";
            deadlineText.style.fontWeight = "bold";
        }
        if (!closestDeadline && futureDeadlines.length > 0) {
            closestDeadline = futureDeadlines.reduce((closest, current) => {
                return (current < closest) ? current : closest;
            });
            let deadlineText = document.getElementById("deadline-text");
            deadlineText.innerHTML = "Upcoming Deadline";
        }
        if (closestDeadline) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById("currentDate").innerHTML = closestDeadline.toLocaleDateString('en-US', options);
        }
    }
}

function greetingAnimation() {
    let valueAnimation = sessionStorage.getItem("valueAnimation");
    if (valueAnimation === "stop") {
        return;
    }
    if (window.innerWidth < 1040) {
        document.getElementById("name-box").style.display = "flex";
        document.getElementById("title__box").style.opacity = 0;
        document.getElementById("all-button-box").style.opacity = 0;
        setTimeout(() => {
            document.getElementById("name-box").classList.add("animation-fade-out");
            document.getElementById("title__box").classList.add("animation-fade-in");
            document.getElementById("all-button-box").classList.add("animation-fade-in");
            setTimeout(() => {
                document.getElementById("name-box").style.display = "none";
                sessionStorage.setItem("valueAnimation", "stop");
            }, 200);

        }, 2000);
    }
}
