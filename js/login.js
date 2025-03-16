    //***EVENT LISTENERS***-------------------------------------------------------------------------------------------------
    document.querySelector("form").addEventListener("submit", login);

    //***FUNCTIONS***-------------------------------------------------------------------------------------------------------
    async function login(event) { // The async keyword in JavaScript is used to declare a function as asynchronous, meaning that the function will perform operations that can be executed in parallel without blocking the rest of the code from running.
    event.preventDefault(); // Prevent page reload

    // Get the latest values from input fields
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Send a request to the backend
     await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, //means you are telling the backend that the body of the request will be JSON.
        body: JSON.stringify({ username, password }) // Send login credentials and converts the username and password into a JSON-formatted string
    })
         .then(response => response.text()) // Expecting role (e.g., "reservation-manager" or "activity-manager")
         .then(data => redirectIfLoginSucceed(data));

    function redirectIfLoginSucceed(userRole){
        if (userRole.toLowerCase() === "reservation-manager"){
            window.location.href = "booking-overview.html";//

        } else if (userRole.toLowerCase() === "activity-manager"){
            window.location.href = "activity-overview"; //TODO change html page to correct name

        } else {
           alert("Invalid login. Try again.");
        }
    }
}

    //***END CLASS***---------------------------------------------------------------------------------------------------
