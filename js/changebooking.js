import {sendFormWhenSubmit, timeSlotCodeToTimeInterval} from "./library.js";

async function checkAvailability(activity, date, numberOfPeople) {
    try {
        const params = new URLSearchParams({
            activity: activity,
            date: date,
            numberOfPeople: numberOfPeople
        });

        const response = await fetch(`http://localhost:8080/availability?${params.toString()}`);

        if (!response.ok) {
            throw new Error('Failed to fetch availability');
        }

        const data = await response.json();
        fillCalender(data);
    } catch (error) {
        console.error('Error:', error);
        document.querySelector('.confirmationMessage').innerText = 'Error checking availability';
    }
}

function fillCalender(availabilityData){
    console.log(availabilityData);
    const table = document.querySelector(".calendar-grid");
    table.innerHTML = ""; // Rydder kalenderen før tilføjelse af nye tider

    //definer rows med td med timer og availability
    Object.entries(availabilityData).forEach(([key, value]) => {
        const tableRow = document.createElement("tr");
        const time = document.createElement("td");
        const availability = document.createElement("td");

        time.innerHTML = key;
        availability.innerHTML = value;

        if (value === "available") {
            time.classList.add("clickable");
            time.addEventListener("click", () => selectTime(time, key));
        } else if (value === "limited availability") {
            time.classList.add("limited");
        } else if (value === "unavailable") {
            time.classList.add("unavailable");
        }
        tableRow.append(time);
        tableRow.append(availability);
        table.append(tableRow);
    });

}
let selectedTime = null
function selectTime(row,time){
    if (selectedTime) {
        selectedTime.classList.remove("selected");
    }
    row.classList.add("selected");

    selectedTime = row;

    document.querySelector("#selectedTime").textContent = `Selected Time: ${time}`;
    document.querySelector("#nextStep").disabled = false;
    document.querySelector("#nextStep").style.display = "block";

}

function goBack() {
    // Går tilbage til den forrige side
    document.querySelector(".goBackButton").addEventListener("click", (event) => {
        event.preventDefault();
        window.history.back();
    });
}


function deleteBooking(id) {
    // Slet-funktion
    document.querySelector(".deleteButton").addEventListener("click", function (event) {
        event.preventDefault();  // Forhindrer formularen i at blive sendt

        const userConfirmed = window.confirm("Do you want to delete this reservation?");

        if (userConfirmed) {
            // Send en DELETE-anmodning til serveren
            fetch("http://localhost:8080/reservations/" + id, {
                method: "DELETE", headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(response => {
                    if (response.ok) {
                        alert("Reservationen is succesfully deleted.");
                        window.history.back(); // Gå tilbage til forrige side
                    } else {
                        alert("Something went wrong, try again.");
                    }
                })
                .catch(error => {
                    console.error("error:", error);
                    alert("something went wrong");
                });

        } else {
            alert("reservation was NOT deleted")
        }

    });
}

async function run() {

    goBack();

//fylde tomeslots:
    const id = new URLSearchParams(window.location.search).get("reservationId");
    /*
    for (let i = 1; i < 10; i++) {
        const option = document.createElement("option");
        document.querySelector(".timeSlotCode").append(option);
        option.value = i.toString();
        option.className = "t" + i; // Class name cannot start with number.
        option.innerText = timeSlotCodeToTimeInterval(i);
    }
     */

    let timeSlotCode;

    //fylder formen med tidligere info
    await fetch("http://localhost:8080/reservations/" + id)
        .then((response) => response.json())
        .then((data) => {
            Object.entries(data).forEach(([key, value]) => {
                if (key === "activity") {
                    const option = document.querySelector("." + value);
                    option.selected = true;
                } else if (key === "timeSlotCode") {
                    timeSlotCode = value;
                } else {
                    const input = document.querySelector("." + key);
                    input.setAttribute("value", value);
                }
            });
        });


    //form submission for at lave update:
    sendFormWhenSubmit("PUT", "http://localhost:8080/reservations/" + id, "updateBooking", true, (response) => {
        if (response.ok) {
            alert("Saved successfully!");
        } else {
            alert("Something went wrong.");
        }
    });

    deleteBooking(id);

    document.querySelector(".check").addEventListener('click', (event) => {
        event.preventDefault();
        const activity = document.querySelector('.activity').value;
        const date = document.querySelector('.date').value;
        const numberOfPeople = document.querySelector('.numberOfPeople').value;
        checkAvailability(activity, date, numberOfPeople);
    });

}

export default run