document.addEventListener("DOMContentLoaded", function () {
    const minusBtn = document.getElementById("minus-btn");
    const plusBtn = document.getElementById("plus-btn");
    const personCount = document.getElementById("person-count");
    const activitySelect = document.getElementById("activity-select");
    const timeSlotsContainer = document.getElementById("time-slots");
    const dateInput = document.getElementById("date-picker");
    let selectedTimeSlot = null;

    const activities = {
        "minigolf": { duration: 90, minPersons: 1, maxPersons: 4 },
        "gokart": { duration: 30, minPersons: 1, maxPersons: 8 },
        "climbing": { duration: 60, minPersons: 1, maxPersons: 6 },
        "sumowrestling": { duration: 45, minPersons: 1, maxPersons: 2 },
        "minigolf_group": { duration: 240, minPersons: 12, maxPersons: 20 },
        "gokart_group": { duration: 240, minPersons: 12, maxPersons: 20 },
        "climbing_group": { duration: 240, minPersons: 12, maxPersons: 20 },
        "sumowrestling_group": { duration: 180, minPersons: 12, maxPersons: 16 }
    };


    function getCopenhagenTime() {
        const now = new Date();
        const copenhagenTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Copenhagen" }));
        console.log("📅 København-tid nu:", copenhagenTime);
        return copenhagenTime;
    }

    function disablePastDates() {
        const today = getCopenhagenTime();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split("T")[0];
        console.log("⛔ Block dates prior to:", todayStr);
        dateInput.setAttribute("min", todayStr);
    }

    function updatePersonCount() {
        const selectedActivity = activitySelect.value;
        const minPersons = activities[selectedActivity].minPersons || 1; // Standard til 1 hvis ikke defineret
        const maxPersons = activities[selectedActivity].maxPersons;

        personCount.value = minPersons; // Sætter startværdien

        if (parseInt(personCount.value) < minPersons) {
            personCount.value = minPersons;
        } else if (parseInt(personCount.value) > maxPersons) {
            personCount.value = maxPersons;
        }
    }

    function generateTimeSlots() {
        timeSlotsContainer.innerHTML = "";
        const selectedActivity = activitySelect.value;
        const duration = activities[selectedActivity].duration;
        const selectedDate = dateInput.value;

        if (!selectedDate) {
            console.warn("⚠ No date chosen yet.");
            return;
        }

        console.log("📆 Choose date:", selectedDate);

        let startTime = 10 * 60;
        const endTime = 16 * 60;

        const now = getCopenhagenTime();
        const selectedDay = new Date(selectedDate);
        selectedDay.setHours(0, 0, 0, 0);

        while (startTime + duration <= endTime) {
            const hours = Math.floor(startTime / 60);
            const minutes = startTime % 60;
            const timeString = `${hours}:${minutes === 0 ? "00" : minutes}`;

            const button = document.createElement("button");
            button.classList.add("time-slot");
            button.innerText = timeString;

            const slotTime = new Date(selectedDay);
            slotTime.setHours(hours, minutes, 0, 0);

            const minBookingTime = new Date(now);
            minBookingTime.setMinutes(now.getMinutes() + 90);

            console.log(`⏰ Tester tid ${timeString} (${slotTime}) mod minimum ${minBookingTime}`);

            if (slotTime >= minBookingTime) {
                button.onclick = function () {
                    if (selectedTimeSlot) {
                        selectedTimeSlot.classList.remove("selected");
                    }
                    button.classList.add("selected");
                    selectedTimeSlot = button;
                    console.log("✔ Chosen timeslot", timeString);
                };
                timeSlotsContainer.appendChild(button);
            }
            startTime += 30;
        }

        if (timeSlotsContainer.children.length === 0) {
            const noTimeMessage = document.createElement("p");
            noTimeMessage.innerText = "No time slots available";
            timeSlotsContainer.appendChild(noTimeMessage);
            console.warn("❌ No time slots available.");
        }
    }

    dateInput.addEventListener("change", generateTimeSlots);
    activitySelect.addEventListener("change", function () {
        updatePersonCount();
        generateTimeSlots();
    });


    minusBtn.addEventListener("click", function () {
        let count = parseInt(personCount.value);
        const minPersons = activities[activitySelect.value].minPersons;

        if (count > minPersons) {
            personCount.value = count - 1;
        }
    });

    plusBtn.addEventListener("click", function () {
        let count = parseInt(personCount.value);
        const maxPersons = activities[activitySelect.value].maxPersons;
        if (count < maxPersons) {
            personCount.value = count + 1;
        }
    });

    disablePastDates();
    generateTimeSlots();
});

activitySelect.addEventListener("change", function () {
    updatePersonCount();
    generateTimeSlots();
});

minusBtn.addEventListener("click", function () {
    let count = parseInt(personCount.value);
    const minPersons = activities[activitySelect.value].minPersons;
    if (count > minPersons) {
        personCount.value = count - 1;
    }
});

plusBtn.addEventListener("click", function () {
    let count = parseInt(personCount.value);
    const maxPersons = activities[activitySelect.value].maxPersons;
    if (count < maxPersons) {
        personCount.value = count + 1;
    }
});


//Booking form brugeroplysninger

document.getElementById("book-btn").addEventListener("click", function(event) {
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let phonePattern = /^\d{8}$/;
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phonePattern.test(phone)) {
        alert("Please enter a valid 8-digit phone number.");
        event.preventDefault();
        return;
    }

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        event.preventDefault();
        return;
    }
});

