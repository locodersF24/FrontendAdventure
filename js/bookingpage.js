console.log("bookingpage.js loaded!"); //for at sikre at alt virker - ellers ligegyldig

const url = "http://localhost:8000/reservation";


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("bookingForm").addEventListener("submit", async function (event) {
        event.preventDefault();


            const reservationData = {
                activity: document.getElementById("activity").value,
                numberOfPeople: document.getElementById("numberOfPeople").value,
                date: document.getElementById("date").value,
                time: document.getElementById("time").value
            };

            try {
                const response = await fetch(url,{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(reservationData)
                });

                const messageElement = document.getElementById("confirmationMessage");

                if (response.ok) {
                    messageElement.innerText = "Booking successfully made!";
                } else {
                    messageElement.innerText = "Something went wrong. Please try again.";
                }
            } catch (error) {
                const messageElement = document.getElementById("confirmationMessage");
                messageElement.innerText = "Something went wrong.";
            }
        });

    // async function updateCalendarColours() {
    //     const activity = document.getElementById("activity").value;
    //     const numberOfPeople = document.getElementById("numberOfPeople").value;
    //     const date = document.getElementById("date").value;
    //     const time = document.getElementById("time").value;
    //
    //     try {
    //         const response = await fetch(url,{
    //
    //         }) if(response.ok) {
    //             const messageElement = document.getElementById("confirmationMessage");
    //
    //         }
    //     }
    //     catch (error) {
    //         const messageElement = document.getElementById("confirmationMessage");
    //         messageElement.innerText = "Something went wrong. Please try again.";
    //     }
    // }
    //
    // document.getElementById("activity").addEventListener("change", updateCalendarColours);

})
