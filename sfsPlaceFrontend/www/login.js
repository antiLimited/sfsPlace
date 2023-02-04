var apiUrl = "http://localhost:3404";

(async () => {
    var loginForm = document.querySelector(".login-form")
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        var username = document.querySelector("#username").value
        var password = document.querySelector("#password").value

        var accFetch = await fetch(`${apiUrl}/api/v1/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        })
        var accJSON = await accFetch.json()
        console.log(accJSON)

        if (accJSON.error.errorCode != -1){
            alert("Oh No! An error occured: " + accJSON.error.errorMessage)
        } else {
            localStorage.setItem("authToken", accJSON.message)
            window.location.href = "/"
        }
    })
})();