import { User } from "../models/User";
import * as Mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { Logger } from "tslog";

export class UserToken {
    public userEmail: string
    public token: string
};


export default class Database {

    private static log: Logger<String> = new Logger();

    constructor() {

    }

    static createEmailValidationToken(userEmail: string) : string {
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

    static createUserToken(userEmail: string) : string {
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

    
    static async validateEmail(token: string){
        let i = 0;
        for (let emailToken of this.emailTokens){
            if (emailToken.token == token){
                
                this.log.debug(`Email: ${emailToken.userEmail} is now valid`);

                // issue database update
                await User.findOneAndUpdate({ email: emailToken.userEmail }, { validatedEmail: true });

                this.emailTokens.splice(i, 1);
                
                break;
            }

            i++;
        }
    }

    static async authUserWithToken(token: string){
        for (let userToken of this.tokens){
            if (userToken.token == token){

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
    

    private static tokens: Array<UserToken> = new Array();
    private static emailTokens: Array<UserToken> = new Array();
}