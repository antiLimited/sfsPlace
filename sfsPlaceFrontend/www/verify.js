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

        let verifyJson = await verifyFetch.json();

        if (verifyJson.error.errorCode != -1) {
            alert(verifyJson.error.errorMessage);
        } else {
            window.location.href = "/login.html"
        }
    }
})();