/**
 * Sends a POST request to save task data to the database for a specific user.
 * This function sends the provided task data to the server and logs an error if the request fails.
 *
 * @async
 * @param {string} userKey - The unique identifier for the user to whom the task data belongs.
 * @param {Object} data - The task data to be saved to the database.
 * @returns {Promise<void>} Resolves when the data has been successfully posted or logs an error if the request fails.
 */
async function postDataInDatabase(userKey, data) {
    let response = await fetch(`${BASE_URL}/users/${userKey}/tasks/.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        console.error("Error when saving:", response.statusText);
    }
}

/**
 * Sends a PUT request to update the task data in the database for a specific user and task.
 * This function updates the specified task using the provided data and updates a specific field (extendedPath).
 *
 * @async
 * @param {string} userKey - The unique identifier for the user whose task is being updated.
 * @param {string} cardId - The ID of the task card to be updated.
 * @param {Object} data - The data to be updated in the task.
 * @param {string} extendedPath - The specific path to the field that needs to be updated (e.g., "category", "taskTitle").
 * @returns {Promise<Response>} The response from the PUT request.
 */
async function putDataInDatabase(userKey, cardId, data, extendedPath) {
    let response = await fetch(`${BASE_URL}/users/${userKey}/tasks/${cardId}/${extendedPath}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        console.error("error when saving:", response.statusText);
    }
    return response;
}

/**
 * Edits the data of a specific task in the database by sending a PUT request to the server.
 * 
 * @param {string} userKey - The unique identifier of the user whose task data is being edited.
 * @param {string} cardId - The unique identifier of the task being edited.
 * @param {Object} data - The data to update for the specified task.
 * @returns {Promise<Response>} A promise that resolves to the response of the PUT request.
 * @throws {Error} If the request fails, an error is logged to the console.
 */
async function editDataInDatabase(userKey, cardId, data) {
    let response = await fetch(`${BASE_URL}/users/${userKey}/tasks/${cardId}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        console.error("error when saving:", response.statusText);
    }
    return response;
}

/**
 * Sends a DELETE request to remove a task from the database for a specific user.
 * This function deletes a task from the database using the provided `cardId` and `userKey`.
 * If the request fails, it logs an error to the console.
 *
 * @async
 * @param {string} userKey - The unique identifier for the user whose task is being deleted.
 * @param {string} cardId - The ID of the task card to be deleted.
 * @returns {Promise<Response>} The response from the DELETE request.
 */
async function deleteInDatabase(userKey, cardId) {
    let response = await fetch(`${BASE_URL}/users/${userKey}/tasks/${cardId}.json`, {
        method: "DELETE"
    })
    if (!response.ok) {
        console.error("error when saving:", response.statusText);
    }
    return response
}

/**
 * Fetches all contact data for a given user from the database and populates the global `allContacts` array.
 * If the request fails or data is invalid, an error is logged to the console.
 *
 * @async
 * @function readAllContactsFromDatabase
 * @param {string} userKey - The unique key identifying the user in the database.
 * @returns {Promise<void>} This function does not return a value.
 */
async function readAllContactsFromDatabase(userKey) {
    try {
        let result = await fetch(`${BASE_URL}/users/${userKey}/allContacts.json`);
        if (!result.ok) {
            throw new Error(`Fehler beim Abrufen der Daten: ${result.statusText}`);
        }
        let data = await result.json();
        allContacts.length = 0;
        extractContactsFromData(data);
    } catch (error) {
        console.error("error loading the data:", error);
    }
}

/**
 * Extracts contact information from the provided data object and adds it to the global `allContacts` array.
 *
 * @function extractContactsFromData
 * @param {Object} data - The contact data object retrieved from the database.
 * @param {Object} data[firebaseKey] - An object representing a contact with properties `name` and `color`.
 */
function extractContactsFromData(data) {
    if (data) {
        Object.entries(data).forEach(([firebaseKey, value]) => {
            const { name, color } = value;
            allContacts.push({ name, color });
        });
    }
}

/**
 * Loads all tasks of a user from the database and stores them in the global `allTasks` array.
 * 
 * @async
 * @function readAllTasksFromDatabase
 * @param {string} userKey - The unique user ID used to fetch tasks from the database.
 * @returns {Promise<void>} - Returns nothing, but handles task loading asynchronously.
 * @throws {Error} If the data could not be fetched successfully.
 */
async function readAllTasksFromDatabase(userKey) {
    try {
        let result = await fetch(`${BASE_URL}/users/${userKey}/tasks.json`);
        if (!result.ok) {
            throw new Error(`Fehler beim Abrufen der Daten: ${result.statusText}`);
        }
        let data = await result.json();
        allTasks.length = 0;
        extractTasksFromData(data);
    } catch (error) {
        console.error("error loading the data:", error);
    }
}

/**
 * Extracts tasks from the provided data and adds them to the global `allTasks` array.
 * Each task is assigned a unique `id` based on its Firebase key.
 * 
 * @function extractTasksFromData
 * @param {Object} data - The data object containing task information from Firebase.
 * @returns {void} This function does not return any value. It updates the global `allTasks` array.
 */
function extractTasksFromData(data) {
    if (data) {
        Object.entries(data).forEach(([firebaseKey, value]) => {
            value.id = firebaseKey;
            allTasks.push(value);
        });
    }
}

/**
 * Updates the assigned contacts in all tasks by matching the contacts' names with the existing contacts data.
 * The function iterates over all tasks and updates the `assignedContacts` field by replacing contact names 
 * with the corresponding contact objects from the `allContacts` array. 
 * After the update, the tasks are saved back to the database.
 * 
 * @async
 * @function updateAssignedContactsInTasks
 * @param {string} userKey - The unique user ID used to identify the tasks and save the updated data to the database.
 * @returns {Promise<void>} - This function does not return any value but performs the update operation asynchronously.
 * @throws {Error} If the tasks cannot be saved back to the database.
 */
async function updateAssignedContactsInTasks(userKey) {
    let updatedTasks = allTasks.map(task => {
        if (!task.assignedContacts) return task;
        task.assignedContacts = task.assignedContacts
            .map(contact => {
                let updatedContact = allContacts.find(c => c.name === contact.name);
                return updatedContact ? updatedContact : null;
            })
            .filter(contact => contact !== null);
        return task;
    });
    await saveTasksToDatabase(userKey, updatedTasks);
}

/**
 * Saves the provided tasks to the database for a specific user.
 * 
 * This function first checks if the provided tasks are an array and if it contains any tasks. 
 * If valid tasks are provided, it proceeds to update all tasks in the database.
 * 
 * @async
 * @function saveTasksToDatabase
 * @param {string} userKey - The unique identifier for the user whose tasks will be saved.
 * @param {Array} tasks - The array of tasks that need to be saved to the database.
 * @throws {Error} If an error occurs while saving the tasks to the database.
 * @returns {Promise<void>} - This function returns nothing but performs the task-saving process asynchronously.
 */
async function saveTasksToDatabase(userKey, tasks) {
    if (!Array.isArray(tasks) || tasks.length === 0) {
        console.warn("No tasks were transferred for saving Process cancelled.");
        return;
    }
    try {
        let updates = {};
        updateAllTasksInDatabase(userKey, tasks, updates)
    } catch (error) {
        console.error("Error when saving the tasks:", error);
    }
}

/**
 * Updates all tasks in the database for a specific user.
 * 
 * This function iterates over the provided tasks and creates an update object for each task, 
 * then sends a PUT request to update the tasks in the database.
 * 
 * @async
 * @function updateAllTasksInDatabase
 * @param {string} userKey - The unique identifier for the user whose tasks will be updated.
 * @param {Array} tasks - The array of tasks to be updated in the database.
 * @param {Object} updates - An object that will hold the updated task data.
 * @throws {Error} If an error occurs while updating the tasks in the database.
 * @returns {Promise<void>} - This function returns nothing but performs the task updating process asynchronously.
 */
async function updateAllTasksInDatabase(userKey, tasks, updates) {
    tasks.forEach(task => {
        updates[task.id] = { ...task };
    });
    await fetch(`${BASE_URL}/users/${userKey}/tasks.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
    });
}

/**
 * Fetches task data from the database for a specific user and category, then processes and renders the data 
 * into the corresponding task array and UI category.
 *
 * @async
 * @param {string} userKey - The unique identifier of the user whose tasks are being retrieved.
 * @param {string} category - The category of tasks to be retrieved (e.g., "toDos", "inProgress").
 * @param {Array} categoryArray - The array where the tasks of the specified category will be stored.
 * @param {string} dragFieldId - The ID of the drag field where the tasks will be rendered.
 * @returns {Promise<void>} Resolves when the tasks have been successfully fetched, processed, and rendered.
 */
async function readFromDatabase(userKey, category, categoryArray, dragFieldId) {
    try {
        let result = await fetch(`${BASE_URL}/users/${userKey}/tasks.json`);
        if (!result.ok) {
            throw new Error(`Error when retrieving the data: ${result.statusText}`);
        }
        let data = await result.json();
        categoryArray.length = 0;
        collectTasksByCategory(data, category, categoryArray);
        renderCategoryContent(category, categoryArray, dragFieldId)
    } catch (error) {
        console.error("error loading the data:", error);
    }
}

/**
 * Collects tasks from the provided data that match the specified category 
 * and stores them in the provided category array.
 * Each task is enhanced with an `id` and default empty array for `assignedContacts` if not present.
 *
 * @param {Object} data - The data object containing task information, where each key is a unique task identifier.
 * @param {string} category - The category to filter tasks by (e.g., "toDo", "inProgress").
 * @param {Array} categoryArray - The array to store the filtered tasks of the specified category.
 * @returns {void} This function does not return any value. It modifies the `categoryArray` directly.
 */
function collectTasksByCategory(data, category, categoryArray) {
    if (data) {
        Object.entries(data).forEach(([firebaseKey, value]) => {
            if (value.category === category) {
                value.id = firebaseKey;
                if (!value.assignedContacts) {
                    value.assignedContacts = [];
                }
                categoryArray.push(value);
            }
        });
    }
}

/**
 * Renders the content for a specific category based on the provided category array.
 * If there are tasks in the category, it renders the small cards; otherwise, it displays a "no cards" message.
 *
 * @param {string} category - The category to render (e.g., "toDo", "inProgress").
 * @param {Array} categoryArray - The array containing tasks for the specified category.
 * @param {string} dragFieldId - The ID of the drag field where the tasks should be rendered.
 * @returns {void} This function does not return any value. It directly modifies the UI by rendering the category content.
 */
function renderCategoryContent(category, categoryArray, dragFieldId) {
    if (categoryArray.length !== 0 && searchMode === "false") {
        renderSmallCard(dragFieldId, categoryArray);
    } else {
        document.getElementById(dragFieldId).innerHTML = noCardTemplate(categorysObject[category], searchMode);
    }
}