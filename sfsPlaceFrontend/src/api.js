var apiUrl = "http://localhost:3404";

export async function getParts() {
    var partFetch = await fetch(`${apiUrl}/api/v1/map/parts`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    return await partFetch.json()
}

export function getLocalUserToken() {
    return localStorage.getItem("authToken")
}

export async function placePart(name, scale, rotation, texture, partX, partY) {
    var partFetch = await fetch(`${apiUrl}/api/v1/map/placePart`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": getLocalUserToken()
        },
        body: JSON.stringify({
            "partName": name,
            "scale": scale,
            "rotation": rotation,
            "texture": texture,
            "partPosition": {
                "x": partX,
                "y": partY
            }
        })
    })
    return await partFetch.json()
}