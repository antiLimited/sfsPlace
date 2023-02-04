var apiUrl = "http://localhost:3404";
var wsUrl = "localhost:3404";

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

export function handleSocket() {
    let protocolMode = "wss://";

    if (window.location.protocol != "https://") {
        protocolMode = "ws://";
    }

    let wsSocket = new WebSocket(`${protocolMode}${wsUrl}`);

    wsSocket.onclose = function () {
        alert("Realtime socket connection to server closed");
    }

    wsSocket.onerror = function (e) {
        alert("Socket error: " + e);
    }

    wsSocket.onmessage = async (msg) => {
        let message = JSON.parse(msg.data).message;
    
        // TODO: handle stuff idk :)

        if (message.op == "TIMEOUT_UPDATE"){
            window.placeTimer = message.payload
        } else if (message.op == "PART_PLACED") {
            let part = message.part;

            window.placedParts.push(part);
        } else if (message.op == "PART_DELETED") {
            let partId = message.partId;


            // simple find and remove, find the part with the same id and remove it
            let i = 0;
            for (let part of window.placedParts){
                if (part.identifier == partId){
                    window.placedParts.splice(i, 1);
                }
                i++;
            }

        } else if (message.op == "PING") {
            console.log("Got ping");
        } else {
            console.error("Got invalid socket message: ");
            console.error(message);
        }
    }

    wsSocket.onopen = async () => {
        let token = getLocalUserToken();

        wsSocket.send(JSON.stringify({
            "op": "IDENTIFY",
            "payload": {
                "token": token
            }
        }));

        console.log("Sent identify packet");
    };
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

    let partFetchJson = await partFetch.json();

    if (partFetchJson.error.errorCode != -1) {
        alert("Cannot place part: " + partFetchJson.error.errorMessage);
    }

    return partFetchJson;
}