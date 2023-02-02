import * as http from "node:http";
import { Logger } from "tslog";
import * as joi from "joi";
import { WebSocket, WebSocketServer } from "ws";
import Joi = require("joi");

export class SocketErrorResponse {
    public errorCode: number = -1;
    public errorMessage: string;
}

export class SocketResponse {
    public message: any;
    public error: SocketErrorResponse = new SocketErrorResponse();
    public timestamp: number = Date.now();

    static createResponse(message: string, error?: SocketErrorResponse) : SocketResponse {
        let resp = new SocketResponse();
        resp.message = message;

        if (error != undefined){
            resp.error = error;
        }

        return resp;
    }

    json() {
        return JSON.stringify(this);
    }
}

export class SocketClient {
    
    private clientSocket: WebSocket;
    private log: Logger<String> = new Logger();

    constructor(socket: WebSocket){
        socket.on("close", () => {
            this.log.info("Client disconnected from server");
        });

        // socket.on("message", (messageBuffer) => {
        //     let messageString = messageBuffer.toString();

        //     try {
        //         let message = JSON.parse(messageString);

        //     } catch (e) {
        //         this.log.error(e);

        //         let error = new SocketErrorResponse();
        //         error.errorMessage = (e as Error).message;
        //         error.errorCode = 1;
        //         this.sendMessage(SocketResponse.createResponse("Message processing failed", error).json());
        //         return;
        //     }

        // });

        this.clientSocket = socket;
    }

    sendMessage(msg: string){
        this.clientSocket.send(msg);

        this.log.trace("Sent message to client");
    }
}

export default class SocketHandler {

    private static wss: WebSocketServer;
    private static log: Logger<String> = new Logger();
    private static clients: Array<SocketClient> = new Array();

    constructor(){

    }

    static listen(server: http.Server){
        this.wss = new WebSocketServer({ server });

        this.wss.on("connection", async (socket) => {
            this.log.info("New client has connected to the websocket server");

            this.clients.push(new SocketClient(socket));
        });
    }

    static broadcast(resp: SocketResponse){
        this.log.trace("Broadcasting message");
        for (let client of this.clients){
            client.sendMessage(resp.json());
        }
    }
}