console.log("Jeg er i changebooking.js");


function fillForm(booking){
    const activity = document.querySelector(".inpActivity")
    activity.setAttribute("value", booking.activity)
    const numberOfPeople = document.querySelector(".inpNumberOfPeople")
    numberOfPeople.setAttribute("value", booking.numberOfPeople)
    const date = document.querySelector(".inpDate")
    date.setAttribute("value", booking.date)
    const timeSlot = document.querySelector(".inpTimeSlot")
    timeSlot.setAttribute("value", booking.timeSlot)
    const firstName = document.querySelector(".inpFirstName")
    firstName.setAttribute("value", booking.firstName)
    const lastName = document.querySelector(".inpLastName")
    lastName.setAttribute("value", booking.lastName)
    const email = document.querySelector(".inpEmail")
    email.setAttribute("value", booking.email)
    const phoneNumber = document.querySelector(".inpPhoneNumber")
    phoneNumber.setAttribute("value", booking.phoneNumber)

}

function submitForm(event){
    event.preventDefault();

    const data = Object.fromEntries(new FormData(event.target).entries());

    console.log("submitForm i changebooking", data)
    fetch("http://localhost:8080/reservations/" + new URLSearchParams(window.location.search).get("reservationId"), {
        method: "PUT",
        body: data,
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(response => {
            if (response.ok) {
                alert("save succesfull")
            } else {
                alert("something went wrong")
            }
        })
}

const form = document.querySelector("form")
form.addEventListener("submit", submitForm)


fetch("http://localhost:8080/bookings/" + new URLSearchParams(window.location.search).get("reservationId"))
    .then(response => response.json())
    .then(data => fillForm(data));


/*
    // Funktion til at slette reservationen
    document.querySelector('button[type="submit"]:nth-child(2)').addEventListener('click', async function (event) {
        event.preventDefault();

        try {
            const response = await fetch(`http://localhost:8080/reservations/${id}`, {
                method: "DELETE",
            });

            const messageElement = document.getElementById("confirmationMessage");

            if (response.ok) {
                messageElement.innerText = "Reservation deleted successfully!";
            } else {
                messageElement.innerText = "Could not delete reservation.";
            }
        } catch (error) {
            const messageElement = document.getElementById("confirmationMessage");
            messageElement.innerText = "Something went wrong.";
        }
    });
}); */
