import {sendFormWhenSubmit, timeSlotCodeToTimeInterval} from "./library.js";

function run() {

    function goBack() {
        // Går tilbage til den forrige side
        window.history.back();
    }

    function deleteBooking() {
        // Slet-funktion
        document.getElementById("deleteButton").addEventListener("click", function (event) {
            event.preventDefault();  // Forhindrer formularen i at blive sendt

            const userConfirmed = window.confirm("Do you want to delete this reservation?");

            if (userConfirmed) {
                // Send en DELETE-anmodning til serveren
                fetch("http://localhost:8080/bookings/" + id, {
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

    const id = new URLSearchParams(window.location.search).get("reservationId");
    for (let i = 1; i < 10; i++) {
        const option = document.createElement("option");
        document.querySelector(".timeSlotCode").append(option);
        option.value = i.toString();
        option.className = "t" + i; // Class name cannot start with number.
        option.innerText = timeSlotCodeToTimeInterval(i);
    }
    fetch("http://localhost:8080/bookings/" + id)
        .then((response) => response.json())
        .then((data) => {
            Object.entries(data).forEach(([key, value]) => {
                if (key === "activity") {
                    const option = document.querySelector("." + value);
                    option.selected = true;
                } else if (key === "timeSlotCode") {
                    const option = document.querySelector(".t" + value);
                    option.selected = true;
                } else {
                    const input = document.querySelector("." + key);
                    input.setAttribute("value", value);
                }
            });
        });
    sendFormWhenSubmit("PUT", "http://localhost:8080/bookings/" + id, "updateBooking", true, (response) => {
        if (response.ok) {
            alert("Saved successfully!");
        } else {
            alert("Something went wrong.");
        }
    });

    deleteBooking();

    document.querySelector("button[onclick='goBack()']").addEventListener("click", goBack);

}

export default run

