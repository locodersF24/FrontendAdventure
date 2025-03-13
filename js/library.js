
/**
 * @param {string} httpMethod `"GET"`, `"POST"`, `"PUT"`, `"DELETE"` etc.
 * @param {string} url Example: `"http://localhost:8080/endpoint"`.
 * @param {string} formClass `"here"` from `<form class="here">`.
 * @param {boolean} sendDataAsBody If not as url parameters.
 * - `true` gives Spring Web `@RequestBody`.
 * - `false` gives Spring Web one or many `@RequestParam`.
 * - Must be false if `httpMethod` is `"GET"`.
 * @param {(reponse: Response) => void} responseHandler Handles the response from backend.
 * @description Sends data from an html form to backend when the form is submitted.
 */
export function sendFormWhenSubmit(httpMethod, url, formClass, sendDataAsBody, responseHandler) {
    if (sendDataAsBody && httpMethod === "GET") {
        console.error("GET can't have a body.");
        return;
    }
    const htmlForm = document.querySelector("." + formClass);
    htmlForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(htmlForm);
        if (sendDataAsBody) {
            fetch(url, {
                method: httpMethod,
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: {
                    "Content-Type": "application/json",
                }
            }).then(responseHandler);
        } else {
            fetch(url + "?" + new URLSearchParams(formData), {
                method: httpMethod,
            })
                .then(responseHandler);
        }
    });
}

/**
 * @typedef {Object} TimeSlot
 * @property {number} id
 * @property {string} startTime - format 08:00:00 or 16:00:00
 * @property {string} endTime - format 08:00:00 or 16:00:00
 */

/**
 * @typedef {Object} Activity
 * @property {number} id
 * @property {string} name
 * @property {number} maxNumberOfPeople
 * @property {number} ageLimit
 * @property {TimeSlot[]} timeSlots
 */

/**
 * @typedef {Object} ContactPerson
 * @property {number} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} phoneNumber
 * @property {string} email
 */

/**
 * @typedef {Object} Reservation
 * @property {number} id
 * @property {number} numberOfPeople
 * @property {string} date - format 2025-03-2025
 * @property {TimeSlot} timeSlot
 * @property {Activity} activity
 * @property {ContactPerson} contactPerson
 */
