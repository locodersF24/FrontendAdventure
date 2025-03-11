
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
                body: formData
            }).then(responseHandler);
        } else {
            fetch(url + "?" + new URLSearchParams(formData).toString(), {
                method: httpMethod,
            })
                .then(responseHandler);
        }
    });
}

/**
 * @typedef Booking
 * @type {object}
 * @property {string} reservationId
 * @property {string} activity
 * @property {string} numberOfPeople
 * @property {string} date
 * @property {string} timeInterval
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} phoneNumber
 * @property {string} email
 */