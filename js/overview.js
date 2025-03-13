import {sendFormWhenSubmit} from "./library.js";

const propertyToHeader = new Map()
    .set("activityName", "Activity")
    .set("numberOfPeople", "For")
    .set("date", "Event date")
    .set("timeSlot", "Event time")
    .set("firstName", "First Name")
    .set("lastName", "Last Name")
    .set("phoneNumber", "Phone number")
    .set("email", "E-mail address");

const order = new Map();

/**
 * @param {Map<String, any>[]} reservations
 */
function fillTableHead(reservations) {
    document.querySelector("thead").remove();
    const tableHead = document.createElement("thead");
    const upper = document.createElement("tr");
    const lower = document.createElement("tr");
    propertyToHeader.forEach((value, key) => {
        const asc = document.createElement("span");
        asc.className = order.get(key) === "asc" ? "black" : "gray";
        asc.innerText = "▲";
        const desc = document.createElement("span");
        desc.className = order.get(key) === "desc" ? "black" : "gray";
        desc.innerText = "▼";
        if (order.get(key) !== "asc") {
            asc.addEventListener("click", () => {
                order.set(key, "asc");
                let sorter;
                if (typeof value === "number") {
                    sorter = (x, y) => x[key] - y[key];
                } else {
                    sorter = (x, y) => x[key].toString().localeCompare(y[key].toString());
                }
                fillTableBody(reservations.toSorted(sorter));
            });
        }
        if (order.get(key) !== "desc") {
            desc.addEventListener("click", () => {
                order.set(key, "desc");
                let sorter;
                if (typeof value === "number") {
                    sorter = (x, y) => y[key] - x[key];
                } else {
                    sorter = (x, y) => y[key].toString().localeCompare(x[key].toString());
                }
                fillTableBody(reservations.toSorted(sorter));
            });
        }
        const text = document.createElement("th");
        text.rowSpan = 2;
        text.innerText = value;
        const ascTh = document.createElement("th");
        const descTh = document.createElement("th");
        ascTh.className = "small";
        descTh.className = "small";
        ascTh.append(asc);
        descTh.append(desc);
        upper.append(text, ascTh);
        lower.append(descTh);
    });
    tableHead.append(upper, lower);
    document.querySelector("table").append(tableHead);
}

/**
 * @param {Map<String, any>[]} reservations
 */
function fillTableBody(reservations) {
    document.querySelector("tbody").remove();
    const tableBody = document.createElement("tbody");
    reservations.forEach((reservation) => {
        const tableRow = document.createElement("tr");
        tableRow.addEventListener("click", () => {
            const params = new URLSearchParams();
            params.append("reservationId", reservation.reservationId);
            window.location.href = "see_booking.html?" + params.toString();
        });
        Array.from(reservation.values()).slice(4).forEach((value) => {
            const td = document.createElement("td");
            td.innerText = value;
            tableRow.append(td, document.createElement("td")); // her??
        });
        tableBody.append(tableRow);
    });
    document.querySelector("table").append(tableBody);
}

/**
 * @param {Map<String, any>[]} reservations
 */
function insertData(reservations) {
    if (reservations.length === 0) {
        document.querySelector("p").innerText = "No matches.";
        return;
    }
    document.querySelector("p").innerHTML = "";
    fillTableHead(reservations);
    fillTableBody(reservations);
}

/**
 * @param {Reservation[]} reservations
 * @return {Map<String, any>[]}
 */
function reservationArrayToMapArray(reservations) {
    return reservations.map((reservation) =>
        new Map()
            .set("activityId", reservation.activity.id)
            .set("contactPersonId", reservation.contactPerson.id)
            .set("timeSlotId", reservation.timeSlot.id)
            .set("reservationId", reservation.id)
            .set("activityName", reservation.activity.name)
            .set("numberOfPeople", reservation.numberOfPeople)
            .set("date", reservation.date)
            .set("timeSlot", reservation.timeSlot.startTime.slice(0, 5) + " - " + reservation.timeSlot.endTime.slice(0, 5))
            .set("firstName", reservation.contactPerson.firstName)
            .set("lastName", reservation.contactPerson.lastName)
            .set("phoneNumber", reservation.contactPerson.phoneNumber)
            .set("email", reservation.contactPerson.email)
    );
}

function run() {

    sendFormWhenSubmit(
        "GET",
        "http://localhost:8080/reservations",
        "searchForm",
        false,
        (response) => {
            response.json().then(data => {
                order.clear();
                insertData(reservationArrayToMapArray(data));
            });
        });

}

export default run;