var apiUrl = "http://localhost:3404";

(async () => {
    var signupForm = document.querySelector(".signup-form")
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        var username = document.querySelector("#username").value
        var email = document.querySelector("#email").value
        var password = document.querySelector("#password").value

        var accFetch = await fetch(`${apiUrl}/api/v1/user/createUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        })
        var accJSON = await accFetch.json()
        console.log(accJSON)

        if (accJSON.error.errorCode != -1){
            alert("Oh No! An error occured: " + accJSON.error.errorMessage)
        } else {
            window.location.href = "/verify.html"
        }
    })
})();