
const propertyToLabel = new Map()
    .set("numberOfPeople", "For")
    .set("date", "Event date")
    .set("timeInterval", "Event time")
    .set("activity", "Activity")
    .set("firstName", "First Name")
    .set("lastName", "Last Name")
    .set("phoneNumber", "Phone number")
    .set("email", "E-mail address");

function insertRows(bookings) {

    const tableHead = document.querySelector("thead");
    Object.keys(bookings[0]).forEach((key) => {
        const th = document.createElement("th");
        th.innerHTML = propertyToLabel.get(key);
        tableHead.append(th);
    });

    const tableBody = document.querySelector("tbody");
    bookings.forEach((booking) => {
        const tableRow = document.createElement("tr");
        Object.values(booking).forEach((value) => {
            const td = document.createElement("td");
            td.innerHTML = value;
            tableRow.append(td);
        })
        tableBody.append(tableRow);
    });
}

fetch("http://localhost:8080/bookings")
    .then(response => response.json())
    .then((data) => insertRows(data));