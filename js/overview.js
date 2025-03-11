import {sendFormWhenSubmit, timeSlotCodeToTimeInterval} from "./library.js";

const propertyToLabel = new Map()
    .set("numberOfPeople", "For")
    .set("date", "Event date")
    .set("timeSlotCode", "Event time")
    .set("activity", "Activity")
    .set("firstName", "First Name")
    .set("lastName", "Last Name")
    .set("phoneNumber", "Phone number")
    .set("email", "E-mail address");

const order = new Map();

/**
 * @param {Booking[]} bookings
 */
function insertRows(bookings) {

    if (bookings.length === 0) {
        document.querySelector("p").innerText = "No matches.";
        return;
    }

    document.querySelector("thead").remove();
    document.querySelector("tbody").remove();
    document.querySelector("p").innerHTML = "";

    const table = document.querySelector("table");

    const tableHead = document.createElement("thead");
    const upper = document.createElement("tr");
    const lower = document.createElement("tr");
    Object.keys(bookings[0]).slice(1).forEach((key) => {
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
                if (typeof bookings[0][key] === "number") {
                    sorter = (x, y) => x[key] - y[key];
                } else {
                    sorter = (x, y) => x[key].toString().localeCompare(y[key].toString());
                }
                insertRows(bookings.toSorted(sorter));
            });
        }
        if (order.get(key) !== "desc") {
            desc.addEventListener("click", () => {
                order.set(key, "desc");
                let sorter;
                if (typeof bookings[0][key] === "number") {
                    sorter = (x, y) => y[key] - x[key];
                } else {
                    sorter = (x, y) => y[key].toString().localeCompare(x[key].toString());
                }
                insertRows(bookings.toSorted(sorter));
            });
        }
        const text = document.createElement("th");
        text.rowSpan = 2;
        text.innerText = propertyToLabel.get(key);
        const ascTh = document.createElement("th");
        const descTh = document.createElement("th");
        ascTh.className = "small";
        descTh.className = "small";
        ascTh.append(asc);
        descTh.append(desc);
        upper.append(text, ascTh);
        lower.append(descTh);
        tableHead.append(upper, lower);
    });
    tableHead.append(upper, lower);

    const tableBody = document.createElement("tbody");
    bookings.forEach((booking) => {
        const tableRow = document.createElement("tr");
        tableRow.addEventListener("click", () => {
            const params = new URLSearchParams();
            params.append("reservationId", booking.reservationId);
            window.location.href = "change_booking.html?" + params.toString();
        });
        Object.entries(booking).slice(1).forEach(([key, value]) => {
            const td = document.createElement("td");
            if (key === "timeSlotCode") {
                td.innerText = timeSlotCodeToTimeInterval(value);
            } else {
                td.innerText = value;
            }
            tableRow.append(td, document.createElement("td"));
        })
        tableBody.append(tableRow);
    });

    table.append(tableHead, tableBody);
}

function run() {

    sendFormWhenSubmit(
        "GET",
        "http://localhost:8080/bookings",
        "searchForm",
        false,
        (response) => {
            response.json().then(data => {
                order.clear();
                insertRows(data);
            });
        });

}

export default run;