var apiUrl = "http://localhost:3404";

(async () => {
    document.querySelector("#verifyButton").onclick = async () => {
        var emailCode = document.querySelector("#emailCode").value

        var verifyFetch = await fetch(`${apiUrl}/api/v1/user/validateEmail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: emailCode
            })
        })
        window.location.href = "/login.html"
    }
})();