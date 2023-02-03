import ServerConfig from "../config";
import * as nodemailer from "nodemailer";
import Database from "../db/Database";
import { Logger } from "tslog";


export default class EmailValidator {

    private static log: Logger<String> = new Logger();

    private static transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sfsplace@gmail.com',
            pass: ServerConfig.nodeMailerPassword
        }
    });


    static async sendValidationEmail(toEmail: string) {

        this.log.info(`Sending validation email to: ${toEmail}`);

        let emailToken = Database.createEmailValidationToken(toEmail);

        const mailOptions = {
            from: 'sfsplace@gmail.com',
            to: toEmail,
            subject: 'Please validate your new sfsPlace account',
            text: `Please validate your sfsPlace account, this is to prevent spam.\nSteps:\n\n* Open the sfsPlace login page, and click 'Validate email'\n* Enter the following email validation code: ${emailToken}`
        };

        this.transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
            }
        });

    }
}