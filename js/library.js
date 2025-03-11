
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
 * @param {int} timeSlotCode
 */
export function timeSlotCodeToTimeInterval(timeSlotCode) {
    const timeIntervals = ["", "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00"];
    return timeIntervals[timeSlotCode];
}

/**
 * @typedef Booking
 * @type {object}
 * @property {int} reservationId
 * @property {string} activity
 * @property {int} numberOfPeople
 * @property {string} date
 * @property {string} timeSlotCode
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} phoneNumber
 * @property {string} email
 */