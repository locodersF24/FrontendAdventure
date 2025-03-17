import {Reservation, downloadActivities, downloadTimeSlotsWithAvailability} from "./library.js";
import {urlReservations} from "./urls.js";

let reservation;
let timeSlots;
let activities;

function updateTimeSlots() {
    if (reservation.numberOfPeople >= reservation.timeSlot.activity.maxNumberOfPeople) {
        reservation.numberOfPeople = reservation.timeSlot.activity.maxNumberOfPeople;
        document.querySelector("#person-count").value = reservation.numberOfPeople + " (maximum)";
    }
    const div = document.querySelector("#time-slots");
    div.replaceChildren();
    let noTimeSlots = true;
    timeSlots.forEach((timeSlot) => {
        if (timeSlot.activity.id === reservation.timeSlot.activity.id
            && timeSlot.availableNumberOfPeople >= reservation.numberOfPeople) {
            noTimeSlots = false;
            const button = document.createElement("button");
            div.append(button);
            button.classList.add("time-slot");
            if (timeSlot.id === reservation.timeSlot.id) {
                button.classList.add("selected");
            }
            button.innerText = timeSlot.timeInterval();
            button.addEventListener("click", (event) => {
                event.preventDefault();
                reservation.timeSlot = timeSlot;
                const lastSelected = document.querySelector(".selected");
                if (lastSelected != null) {
                    lastSelected.classList.remove("selected");
                }
                button.classList.add("selected");
            });
        }
    });
    if (noTimeSlots) {
        const p = document.createElement("p");
        p.innerText = "No time slots available.";
        div.append(p);
    }
}

function setupFormSubmit() {
    const form = document.querySelector("form.contact");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        new FormData(form).forEach((value, key) => reservation.contactPerson[key] = value);
        fetch(urlReservations, {
            method: "POST",
            body: JSON.stringify(reservation),
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => {
            const p = document.createElement("p");
            if (response.status === 201) {
                response.json().then((data) => {
                    reservation = new Reservation(data);
                    document.querySelector(".activity-description").replaceChildren(p);
                    p.innerText = `Reservation for ${reservation.contactPerson.firstName} ${reservation.contactPerson.lastName} on ${reservation.date} at ${reservation.timeSlot.timeInterval()} is confirmed.`;
                    document.querySelector(".booking-container").remove();
                });
            } else {
                document.querySelector(".activity-description").append(p);
                p.innerText = `Reservation was not saved.`; // Add status info.
            }
        });
    });
}

function setupNumberOfPeople() {
    reservation.numberOfPeople = 1;
    const input = document.querySelector("#person-count");
    input.value = reservation.numberOfPeople;
    document.querySelector("#minus-btn").addEventListener("click", (e) => {
        if (reservation.numberOfPeople > 1) {
            input.value = --reservation.numberOfPeople;
            updateTimeSlots();
            if (reservation.numberOfPeople === 1) {
                input.value = reservation.numberOfPeople + " (minimum)";
            }
        }
    });
    document.querySelector("#plus-btn").addEventListener("click", (e) => {
        if (reservation.numberOfPeople < reservation.timeSlot.activity.maxNumberOfPeople) {
            input.value = ++reservation.numberOfPeople;
            updateTimeSlots();
        }
    });
}

function setupActivity() {
    let urlId = new URLSearchParams(window.location.search).get("id");
    if (urlId == null) {
        urlId = "1";
    }
    const select = document.querySelector("#activity-select")
    activities.forEach(activity => {
        const option = document.createElement("option");
        select.append(option);
        option.value = activity.id;
        option.innerText = activity.name;
        if (urlId === activity.id.toString()) {
            option.selected = true;
            reservation.timeSlot.activity = activity;
        }
    });
    select.addEventListener("change", (event) => {
        reservation.timeSlot.activity = activities.find((activity) => activity.id.toString() === event.target.value.toString());
        updateTimeSlots();
    });
}

function setupDate() {
    const today = new Date(Date.now());
    const year = today.getFullYear().toString();
    const month = today.getMonth() > 8
        ? (today.getMonth() + 1).toString()
        : "0" + (today.getMonth() + 1).toString();
    const tomorrow = today.getDate() > 8
        ? (today.getDate() + 1).toString()
        : "0" + (today.getDate() + 1).toString();
    reservation.date = `${year}-${month}-${tomorrow}`;
    const date = document.querySelector("#date-picker");
    date.setAttribute("min", reservation.date);
    date.setAttribute("value", reservation.date);
    date.addEventListener("change", (event) => {
        reservation.date = event.target.value;
        fetchTimeSlots();
    });
}

function fetchTimeSlots() {
    downloadTimeSlotsWithAvailability(reservation.date)
        .then(data => {
            timeSlots = data;
            updateTimeSlots();
        });
}

function run() {
    reservation = new Reservation();
    setupDate();
    downloadActivities().then(data => {
        activities = data;
        setupActivity();
        setupNumberOfPeople();
        setupFormSubmit();
        fetchTimeSlots();
    });
}

export default run;