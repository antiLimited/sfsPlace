import { User } from "../models/User";
import * as Mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { Logger } from "tslog";
import { intervalToDuration } from "date-fns";
import SocketHandler, { SocketResponse } from "../socket/SocketHandler";

export class UserToken {
    public userEmail: string
    public token: string
};

export class UserTimeout {
    public userEmail: string;
    public startTime: number;
};


export default class Database {

    private static log: Logger<String> = new Logger();

    constructor() {

    }

    static tokenIsValid(userToken: string): boolean {
        let hasFound = false;

        for (let token of this.tokens) {
            if (token.token == userToken) {
                hasFound = true;
                break;
            }
        }

        return hasFound;
    }

    static createEmailValidationToken(userEmail: string): string {
        let token = 'SFS-';

        for (let i = 0; i < 7; i++) {
            token += `${Math.floor(Math.random() * 10)}`
        }

        let userToken: UserToken = {
            userEmail,
            token
        }

        this.emailTokens.push(userToken);

        return token;
    }

    static createUserToken(userEmail: string): string {
        let token = uuidv4();

        let userToken: UserToken = {
            userEmail,
            token
        };

        this.tokens.push(userToken);

        return token;
    }

    static async findUserWithName(username: string) {
        const query = await User.find({ username: username }).exec();

        return query;
    }

    static async findUserWithEmail(email: string) {
        const query = await User.find({ email: email }).exec();

        return query;
    }


    static async validateEmail(token: string) {
        let i = 0;
        for (let emailToken of this.emailTokens) {
            if (emailToken.token == token) {

                this.log.debug(`Email: ${emailToken.userEmail} is now valid`);

                // issue database update
                await User.findOneAndUpdate({ email: emailToken.userEmail }, { validatedEmail: true });

                this.emailTokens.splice(i, 1);

                break;
            }

            i++;
        }
    }

    static async authUserWithToken(token: string) {
        for (let userToken of this.tokens) {
            if (userToken.token == token) {

                // lookup user in database
                let user = await this.findUserWithEmail(userToken.userEmail);
                return user;

                break;
            }
        }
    }

    static async connect(databaseUri: string) {
        await Mongoose.connect(databaseUri, {
            dbName: "sfsPlace"
        });

        this.log.info("Connected to backend database");
    }

    static addTimeoutForUser(userEmail: string){
        let timeout = new UserTimeout();
        timeout.userEmail = userEmail;
        timeout.startTime = Date.now();

        this.timeouts.push(timeout);
    }

    static userHasTimeout(userEmail: string){
        let found = false;

        for (let timeout of this.timeouts){
            if (timeout.userEmail == userEmail){
                found = true;
                break;
            }
        }

        return found;
    }

    // Update part placement timeouts
    static updateTimeouts() {
        let i = 0;
        let total = 0;

        for (let timeout of this.timeouts) {
            let result = intervalToDuration({
                start: new Date(timeout.startTime),
                end: Date.now()
            });

            if (result.minutes >= 5){
                this.timeouts.splice(i, 1);
                total++;
            }

            let resp = new SocketResponse();
            resp.message = {
                op: "TIMEOUT_UPDATE",
                payload: {
                    sinceTimeout: result,
                    timeoutStart: new Date(timeout.startTime)
                }
            };

            SocketHandler.sendMessageToClientWithEmail(timeout.userEmail, resp);

            i++;
        }

        this.log.debug("Removed a total of " + total + " timeouts from memory");
    }


    private static tokens: Array<UserToken> = new Array();
    private static emailTokens: Array<UserToken> = new Array();
    private static timeouts: Array<UserTimeout> = new Array();
}