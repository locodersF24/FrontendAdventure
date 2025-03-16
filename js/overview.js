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

        // ▲ row
        const asc = document.createElement("span");
        asc.className = order.get(value) === "asc" ? "black" : "gray";
        asc.innerText = "▲";
        if (order.get(value) !== "asc") {
            asc.addEventListener("click", () => {
                order.set(value, "asc");
                let sorter;
                if (key === "numberOfPeople") {
                    sorter = (x, y) => x.get(key) - y.get(key);
                } else {
                    sorter = (x, y) => x.get(key).localeCompare(y.get(key));
                }
                insertData(reservations.toSorted(sorter));
            });
        }
        const ascTh = document.createElement("th");
        ascTh.className = "small";
        ascTh.append(asc);

        // ▼ row
        const desc = document.createElement("span");
        desc.className = order.get(value) === "desc" ? "black" : "gray";
        desc.innerText = "▼";
        if (order.get(value) !== "desc") {
            desc.addEventListener("click", () => {
                order.set(value, "desc");
                let sorter;
                if (key === "numberOfPeople") {
                    sorter = (x, y) => y.get(key) - x.get(key);
                } else {
                    sorter = (x, y) => y.get(key).localeCompare(x.get(key));
                }
                insertData(reservations.toSorted(sorter));
            });
        }
        const descTh = document.createElement("th");
        descTh.className = "small";
        descTh.append(desc);

        // Combined row
        const text = document.createElement("th");
        text.rowSpan = 2;
        text.innerText = value;
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
            window.location.href = "change_booking.html?" + params.toString();
        });
        Array.from(reservation.values()).slice(4).forEach((value) => {
            const td = document.createElement("td");
            td.innerText = value;
            tableRow.append(td, document.createElement("td"));
        });
        tableBody.append(tableRow);
    });
    document.querySelector("table").append(tableBody);
}

/**
 * @param {Map<String, any>[]} reservations
 */
function insertData(reservations) {
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
            response.json()
                .then(data => {
                    order.clear();
                    if (data.length > 0) {
                        document.querySelector("p").innerHTML = "";
                        insertData(reservationArrayToMapArray(data))
                    } else {
                        document.querySelector("p").innerText = "No matches.";
                        document.querySelector("tbody").remove();
                        document.querySelector("thead").remove();
                        document.querySelector("table").append(document.createElement("thead"), document.createElement("tbody"));
                    }
                });
        });

}

export default run;