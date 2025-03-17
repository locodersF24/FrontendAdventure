import {urlActivities, urlReservationsById, urlReservations, urlTimeSlotsByDate} from "./urls.js";

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
            }).then(responseHandler);
        }
    });
}

const emptyReservation = {
    id: 0,
    numberOfPeople: -1,
    date: "Not assigned.",
    timeSlot: {
        id: 0,
        startTime: "Not assigned.",
        endTime: "Not assigned.",
        activity: {
            id: 0,
            name: "Not assigned.",
            maxNumberOfPeople: -1,
            ageLimit: -1
        }
    },
    contactPerson: {
        id: 0,
        firstName: "Not assigned.",
        lastName: "Not assigned.",
        phoneNumber: "Not assigned.",
        email: "Not assigned."
    }
}

function Activity(object) {
    this.id = object.id;
    this.name = object.name;
    this.maxNumberOfPeople = object.maxNumberOfPeople;
    this.ageLimit = object.ageLimit;
}

function TimeSlot(object) {
    this.id = object.id;
    this.startTime = object.startTime;
    this.endTime = object.endTime;
    this.activity = new Activity(object.activity);
    if (typeof object.availableNumberOfPeople === "number") {
        this.availableNumberOfPeople = object.availableNumberOfPeople;
    }
}

TimeSlot.prototype.timeInterval = function() {
    return this.startTime.slice(0, 5) + "-" + this.endTime.slice(0, 5);
}

function ContactPerson(object) {
    this.id = object.id;
    this.firstName = object.firstName;
    this.lastName = object.lastName;
    this.phoneNumber = object.phoneNumber;
    this.email = object.email;
}

export function Reservation(object = emptyReservation) {
    this.id = object.id;
    this.numberOfPeople = object.numberOfPeople;
    this.date = object.date;
    this.timeSlot = new TimeSlot(object.timeSlot);
    this.contactPerson = new ContactPerson(object.contactPerson);
}

/**
 * @return {Promise<Activity[]>}
 */
export function downloadActivities() {
    return fetch(urlActivities)
        .then(response => response.json())
        .then(data => data.map(object => new Activity(object)));
}

/**
 * @return {Promise<TimeSlot[]>}
 */
export function downloadTimeSlotsWithAvailability(date) {
    return fetch(urlTimeSlotsByDate(date))
        .then(response => response.json())
        .then(data => data.map(object => new TimeSlot(object)));
}

/**
 * @return {Promise<Reservation[]>}
 */
export function downloadAllReservations() {
    return fetch(urlReservations)
        .then(response => response.json())
        .then(data => data.map(object => new Reservation(object)));
}

/**
 * @return {Promise<Reservation>}
 */
export function downloadReservationById(id) {
    return fetch(urlReservationsById(id))
        .then(response => response.json())
        .then(data => data.map(object => new Reservation(object)));
}
