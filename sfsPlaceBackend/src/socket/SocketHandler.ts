import * as http from "node:http";
import { Logger } from "tslog";
import * as joi from "joi";
import { WebSocket, WebSocketServer } from "ws";
import { IUser } from "../models/User";
import Joi = require("joi");
import Database from "../db/Database";

export class SocketErrorResponse {
    public errorCode: number = -1;
    public errorMessage: string;
}

export class SocketResponse {
    public message: any;
    public error: SocketErrorResponse = new SocketErrorResponse();
    public timestamp: number = Date.now();

    static createResponse(message: string, error?: SocketErrorResponse): SocketResponse {
        let resp = new SocketResponse();
        resp.message = message;

        if (error != undefined) {
            resp.error = error;
        }

        return resp;
    }

    json() {
        return JSON.stringify(this);
    }
}

export class SocketMessage {
    public op: string;
    public payload: any;
};

export class SocketClient {

    private clientSocket: WebSocket;
    private log: Logger<String> = new Logger();
    public user: IUser = null;

    constructor(socket: WebSocket) {
        socket.on("close", () => {
            this.log.info("Client disconnected from server");
        });

        socket.on("message", async (messageBuffer) => {
            let messageString = messageBuffer.toString();

            try {
                let message = JSON.parse(messageString) as SocketMessage;

                if (message.op == "IDENTIFY") {
                    if (message.payload.token == undefined) {
                        let error = new SocketErrorResponse();
                        error.errorMessage = "Expected valid 'token' in payload";
                        error.errorCode = 1;

                        this.sendMessage(SocketResponse.createResponse("No authorization", error).json());
                    } else {

                        if (this.user != null) {
                            let error = new SocketErrorResponse();
                            error.errorMessage = "Client already authenticated";
                            error.errorCode = 1;

                            this.sendMessage(SocketResponse.createResponse("Failed to authenticate", error).json());
                        } else {

                            // check if token is valid
                            if (Database.tokenIsValid(message.payload.token)) {
                                let users = await Database.authUserWithToken(message.payload.token);
                                this.user = users[0];

                                this.sendMessage(SocketResponse.createResponse("Client identify success").json());
                                this.log.info("New user connected: " + this.user.username);
                            } else {
                                this.log.error("Client attempted login with invalid token: " + message.payload.token);
                                let error = new SocketErrorResponse();
                                error.errorMessage = "Invalid 'token' in payload";
                                error.errorCode = 1;

                                this.sendMessage(SocketResponse.createResponse("No authorization", error).json());
                            }
                        }
                    }
                } else {
                    let error = new SocketErrorResponse();
                    error.errorMessage = "Expected valid op code";
                    error.errorCode = 1;

                    this.sendMessage(SocketResponse.createResponse("Invalid op code", error).json());
                }

            } catch (e) {
                this.log.error(e);

                let error = new SocketErrorResponse();
                error.errorMessage = (e as Error).message;
                error.errorCode = 1;
                this.sendMessage(SocketResponse.createResponse("Message processing failed", error).json());
                return;
            }

        });

        this.clientSocket = socket;
    }

    sendMessage(msg: string) {
        this.clientSocket.send(msg);

        this.log.trace("Sent message to client");
    }
}

export default class SocketHandler {

    private static wss: WebSocketServer;
    private static log: Logger<String> = new Logger();
    private static clients: Array<SocketClient> = new Array();
    private static pingCount: number = 0;

    constructor() {

    }

    static listen(server: http.Server) {
        this.wss = new WebSocketServer({ server });

        this.wss.on("connection", async (socket) => {
            this.log.info("New client has connected to the websocket server");

            this.clients.push(new SocketClient(socket));
        });

        // Broadcast status packet every 5 seconds
        // If the client does not receive a ping packet, for awhile they can assume that the server is down/lagging
        setInterval(async () => {
            let resp = new SocketResponse();
            resp.message = {
                op: "PING",
                payload: {
                    pingCount: this.pingCount
                }
            };
            
            this.broadcast(resp);
            this.pingCount += 1;
        }, 10000);
    }

    static broadcast(resp: SocketResponse) {
        this.log.trace("Broadcasting message");
        for (let client of this.clients) {
            client.sendMessage(resp.json());
        }
    }

    static sendMessageToClientWithEmail(email: string, resp: SocketResponse){
        this.log.trace("Sending private message");
        for (let client of this.clients) {
            if (client.user != null && client.user.email == email){
                client.sendMessage(resp.json());
            }
        }
    }
}