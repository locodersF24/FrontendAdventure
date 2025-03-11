console.log("bookingpage.js loaded!"); //for at sikre at alt virker - ellers ligegyldig

let selectedTime = null;  // Definer variablen til at holde den valgte tid

const url = "http://localhost:8080/reservation";
const availabilityUrl = "http://localhost:8080/availability";

document.addEventListener("DOMContentLoaded", function() {
    addConfirmButton();
    addNextStepButton();
    hideAdditionalFields();

    const confirmationMessage = document.querySelector(".confirmationMessage")
    const nextStepButton = document.getElementById("nextStep");

    //next step knap
    nextStepButton.addEventListener("click", function() {
        document.querySelector(".additionalFields").style.display = "block";
        nextStepButton.style.display = "none";
    })

    //confirm knao
    const confirmButton = document.getElementById("confirmBooking");
    confirmButton.addEventListener("click", function () {
        confirmationMessage.textContent = "Your booking has been confirmed."
        confirmationMessage.style.color = "green"
    });
});

//fyld kalenderen med ledige tider
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

//function til at vælge timer der er tilgængelige
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

function addNextStepButton() {
    let nextStepButton = document.querySelector("#nextStep");

    if(!nextStepButton){
        nextStepButton.documentElement.createElement("button")
        nextStepButton.id="nextStep"
        nextStepButton.textContent = "Next"
        nextStepButton.disabled = true;
        nextStepButton.style.display= "none";
        nextStepButton.addEventListener("click", handleNextStep);
        document.body.appendChild(nextStepButton);
    }
}

function hideAdditionalFields() {
    document.querySelector(".additionalFields").style.display = "none";
}

function addConfirmButton() {
    let confirmButton = document.querySelector("#confirmBooking");

    if (!confirmButton) {
        confirmButton = document.createElement("button");
        confirmButton.id = "confirmBooking";
        confirmButton.textContent = "Confirm Booking";
        confirmButton.disabled = true;
        confirmButton.style.display = "none"; // Skjult fra start
        confirmButton.addEventListener("click", confirmBooking);
        document.body.appendChild(confirmButton);
    }
}

// Håndter bekræftelse af booking
async function confirmBooking() {
    if (!selectedTime) {
        alert("Please select a time before confirming.");
        return;
    }
    const formData = new FormData(document.querySelector(".bookingForm"));
    let reservationData = Object.fromEntries(formData);

    reservationData.time = selectedTime.textContent.trim(); // Get the time from the selected table row

    try {
        const response = await fetch("/reservation", {
            method: "POST",
            body: JSON.stringify(reservationData),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        document.querySelector(".confirmationMessage").textContent = "Your booking has been confirmed!";
        document.querySelector(".confirmationMessage").style.color = "green";

        document.querySelector("#selectedTime").textContent = "";
        selectedTime.classList.remove("selected");
        selectedTime = null;

        document.querySelector("#confirmBooking").disabled = true;
    } catch (error) {
        console.error("Error confirming booking:", error);
    }
}

//bookingformen hvor man vælger activity, date og NoP
document.querySelector('.bookingForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const activity = document.querySelector('.activity').value;
    const date = document.querySelector('.date').value;
    const numberOfPeople = document.querySelector('.numberOfPeople').value;
    checkAvailability(activity, date, numberOfPeople);
})


async function checkAvailability(activity, date, numberOfPeople) {
    try {
        const params = new URLSearchParams({
            activity: activity,
            date: date,
            numberOfPeople: numberOfPeople
        });

        const response = await fetch(`${availabilityUrl}?${params.toString()}`);

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

function handleNextStep() {
    document.querySelector(".additionalFields").style.display = "block";
    document.querySelector("#nextStep").style.display = "none";
    document.querySelector("#confirmBooking").style.display = "block";
}




