const BASE_URL = "https://join-user-default-rtdb.europe-west1.firebasedatabase.app/"
const priorities = ['urgent', 'medium', 'low'];
const priorityIcons = {
    urgent: 'assets/icons/urgent-summary.png',
    medium: 'assets/icons/medium-summary.svg',
    low: 'assets/icons/low-summary.svg',
};

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

/**
 * Loads the number of tasks by priority and updates the display in the summary section.
 * 
 * The priorities are checked in the order of 'urgent', 'medium', and 'low'.
 * Once tasks with a specific priority are found (excluding 'done' tasks),
 * the display is updated accordingly. If none of these priorities are found,
 * "finished" is displayed.
 *
 * @param {Array<Object>} allLoadTasks - A list of all loaded tasks, each with properties such as `taskPriority` and `category`.
 */
function loadNumberOfPriorityTasks(allLoadTasks) {
    for (let priority of priorities) {
        let numberOfTasks = allLoadTasks.filter(element => element.taskPriority === priority && element.category !== "done").length;
        if (numberOfTasks > 0) {
            updatePriorityTaskDisplay(numberOfTasks, priority.charAt(0).toUpperCase() + priority.slice(1), priorityIcons[priority], allLoadTasks);
            return;
        }
    }
    document.getElementById("number-of-priority-tasks").innerHTML = "&#x1F3C1";
    document.getElementById("priority-text").innerHTML = "finished";
    document.getElementById("priority-img").src = "assets/icons/all-ready-summary.svg";
}

/**
 * Updates the display of the priority task section in the summary.
 * 
 * This function updates the number of priority tasks, the priority text, and the associated priority icon in the UI. 
 * Additionally, it triggers the loading of the upcoming deadline for the tasks of that specific priority.
 * 
 * @param {number} numberOfPriorityTasks - The number of tasks with the current priority.
 * @param {string} priorityText - The text representing the priority (e.g., 'Urgent', 'Medium', 'Low').
 * @param {string} priorityImg - The path to the icon image corresponding to the current priority.
 * @param {Array<Object>} allLoadTasks - A list of all loaded tasks, each with properties like `taskPriority` and `category`.
 */
function updatePriorityTaskDisplay(numberOfPriorityTasks, priorityText, priorityImg, allLoadTasks) {
    document.getElementById("number-of-priority-tasks").innerHTML = numberOfPriorityTasks;
    document.getElementById("priority-text").innerHTML = priorityText;
    document.getElementById("priority-img").src = priorityImg;
    loadUpcomingDeadline(allLoadTasks, priorityText.toLowerCase());
}

/**
 * Loads the upcoming deadline for tasks of a given priority and separates their due dates
 * into past and future deadlines based on the current date.
 *
 * Filters out tasks with the category "done" and processes only those with the specified priority.
 * The deadlines are passed to a helper function to be sorted by date category.
 *
 * @param {Array<Object>} allLoadTasks - The list of all loaded tasks, each containing properties like `taskPriority`, `category`, and `taskDueDate`.
 * @param {string} priority - The task priority to filter for (e.g., "urgent", "medium", or "low").
 */
function loadUpcomingDeadline(allLoadTasks, priority) {
    let tasksWithCurrentPriority = allLoadTasks.filter(element => element.taskPriority === priority && element.category !== "done");
    let datesOfUpcomingDeadlines = tasksWithCurrentPriority.map(element => element.taskDueDate);
    const currentDate = new Date();
    let pastDeadlines = [];
    let futureDeadlines = [];
    splitDeadlinesByDate(datesOfUpcomingDeadlines, currentDate, pastDeadlines, futureDeadlines);
}

/**
 * Sorts a list of deadline date strings into past and future deadlines based on the current date.
 * 
 * Converts date strings in "dd/mm/yyyy" format to JavaScript Date objects.
 * Adds each date to either `pastDeadlines` or `futureDeadlines` depending on whether the date is
 * before or after the current date. Then calls `displayClosestPastDeadline()` to update the display.
 * 
 * @param {string[]} datesOfUpcomingDeadlines - Array of task due dates as strings in "dd/mm/yyyy" format.
 * @param {Date} currentDate - The reference date (usually today's date).
 * @param {Date[]} pastDeadlines - Array to collect deadline dates that are in the past.
 * @param {Date[]} futureDeadlines - Array to collect deadline dates that are in the future.
 */
function splitDeadlinesByDate(datesOfUpcomingDeadlines, currentDate, pastDeadlines, futureDeadlines) {
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
    }
    displayClosestPastDeadline(currentDate, pastDeadlines, futureDeadlines);
}

/**
 * Displays the closest past deadline if available, and updates the UI accordingly.
 * 
 * If any past deadlines exist, determines the most recent expired deadline that is before the current date.
 * Updates the text, color, and font weight of the deadline display to indicate it is expired.
 * Then proceeds to check for future deadlines by calling `displayClosestUpcomingDeadline()`.
 * 
 * @param {Date} currentDate - The current date used as a reference point.
 * @param {Date[]} pastDeadlines - Array of past deadline dates.
 * @param {Date[]} futureDeadlines - Array of future deadline dates.
 */
function displayClosestPastDeadline(currentDate, pastDeadlines, futureDeadlines) {
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
    displayClosestUpcomingDeadline(closestDeadline, futureDeadlines);
}

/**
 * Displays the closest upcoming deadline if no past deadline has already been displayed.
 * 
 * If no `closestDeadline` was set by a past deadline, this function finds the nearest future deadline
 * from the `futureDeadlines` array and updates the UI text accordingly.
 * If a `closestDeadline` exists (either from past or future), its date is formatted and shown in the UI.
 * 
 * @param {Date|null} closestDeadline - The closest past deadline, or null if none was found.
 * @param {Date[]} futureDeadlines - Array of future deadline dates to evaluate.
 */
function displayClosestUpcomingDeadline(closestDeadline, futureDeadlines) {
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

/**
 * Controls the greeting animation sequence based on the window size and session storage state.
 * 
 * If the session storage item "valueAnimation" is set to "stop", the animation is skipped.
 * If the window width is less than 1040 pixels, the name box visibility is toggled and the greeting 
 * animation is triggered by fading out the name box and showing the user interface elements.
 *
 * @function
 */
function greetingAnimation() {
    let valueAnimation = sessionStorage.getItem("valueAnimation");
    if (valueAnimation === "stop") {
        return;
    }
    if (window.innerWidth < 1040) {
        toggleNameBoxVisibility();
        fadeOutNameBoxAndShowUI();
    }
}

/**
 * Toggles the visibility of the name box and adjusts the opacity of UI elements.
 * 
 * This function displays the name box by setting its `display` style to `flex` and hides
 * the other UI elements by setting their opacity to 0. This is typically used as part of 
 * an animation or transition effect to show the name box while hiding other interface elements.
 * 
 * @function
 */
function toggleNameBoxVisibility() {
    document.getElementById("name-box").style.display = "flex";
    document.getElementById("title__box").style.opacity = 0;
    document.getElementById("all-button-box").style.opacity = 0;
}

/**
 * Initiates a fade-out animation for the name box and fade-in animation for the UI elements.
 * 
 * This function first waits for 2 seconds, then applies fade-out animation to the name box 
 * and fade-in animations to the title box and button box. After the fade-out animation completes, 
 * it hides the name box and stores the state in `sessionStorage` to prevent the animation from 
 * triggering again.
 * 
 * @function
 */
function fadeOutNameBoxAndShowUI() {
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
