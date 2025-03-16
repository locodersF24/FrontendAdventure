document.addEventListener("DOMContentLoaded", function () {
    const selectActivity = document.querySelector(".activity");
    const equipmentSection = document.querySelector(".equipment-section");

    // Hent aktiviteter fra backend
    function fetchActivities() {
        fetch("http://localhost:8080/activities")
            .then(response => response.json())
            .then(activities => {
                selectActivity.innerHTML = '<option value="">Choose an activity</option>';
                activities.forEach((activity) => {
                    const option = document.createElement("option");
                    option.value = activity.name;
                    option.textContent = activity.name;
                    selectActivity.appendChild(option);
                });
            })
            .catch(error => console.error(error));
    }

    // Hent udstyr for en valgt aktivitet
    function fetchEquipment(activityName) {
        fetch(`http://localhost:8080/equipment/${activityName}`)
            .then(response => response.json())
            .then(data => {
                showEquipments(data);
            })
            .catch(error => console.error("Error fetching equipment:", error));
    }

    function showEquipments(equipmentList) {
        equipmentSection.innerHTML = '';

        equipmentList.forEach(equipment => {
            const equipmentItem = document.createElement("div");
            equipmentItem.classList.add("equipment-item");

            const label = document.createElement("label");
            label.textContent = equipment.name;
            label.setAttribute("for", `equipment_${equipment.id}`);

            const input = document.createElement("input");
            input.type = "number";
            input.id = `equipment_${equipment.id}`;
            input.name = `equipment_${equipment.id}`;
            input.value = equipment.available;
            input.min = 0;

            equipmentItem.appendChild(label);
            equipmentItem.appendChild(input);

            equipmentSection.appendChild(equipmentItem);
        });
    }
    fetchActivities();

    document.getElementById("nextButton").addEventListener("click", function () {
        const selectedActivity = selectActivity.value;
        if (selectedActivity) {
            fetchEquipment(selectedActivity);
        }
    });

    document.querySelector(".equipmentForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const selectedActivity = selectActivity.value;
        const formData = new FormData(e.target);

        formData.forEach((value, key) => {
            if (key.startsWith("equipment_")) {
                const equipmentId = key.split("_")[1];
                const equipmentData = {
                    id: equipmentId,
                    available: Number(value),
                };
            }
        });
    })
    document.getElementById("saveButton")?.addEventListener("click", function () {
        document.querySelector(".equipmentForm").dispatchEvent(new Event('submit'));
    });
})
