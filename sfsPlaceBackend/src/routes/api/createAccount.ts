import { User, userRequestSchema } from "../../models/User";
import ApiRoute from "interfaces/ApiRoute";
import * as Router from "koa-router";
import ApiResponse from "../../models/ApiResponse";
import * as bcrypt from "bcrypt";
import Database from "../../db/Database";
import EmailValidator from "../../db/EmailValidator";
import { Logger } from "tslog";

export default class CreateAccountRoute implements ApiRoute {

    private log: Logger<String> = new Logger();

    initRoutes(router: Router): void {
        router.post("/api/v1/user/createUser", async (ctx, next) => {

            let resp = new ApiResponse();

            let validate = userRequestSchema.validate(ctx.request.body);

            if (validate.error != undefined) {
                resp.message = "User creation failed";
                resp.error.errorCode = 1;
                resp.error.errorMessage = validate.error.message;
            } else {

                if ((await Database.findUserWithEmail(validate.value.email)).length != 0) {
                    resp.message = "User creation failed";
                    resp.error.errorCode = 2;
                    resp.error.errorMessage = "User with same email already exists";
                } else if ((await Database.findUserWithName(validate.value.username)).length != 0) {
                    resp.message = "User creation failed";
                    resp.error.errorCode = 2;
                    resp.error.errorMessage = "User with same username already exists";
                } else {
                    const salt = await bcrypt.genSalt();
                    const hash = await bcrypt.hash(validate.value.password, salt);

                    let user = new User({
                        username: validate.value.username,
                        password: hash,
                        email: validate.value.email,
                        placedParts: 0,
                        validatedEmail: false
                    });

                    await user.save();

                    this.log.info("New user added to database");

                    await EmailValidator.sendValidationEmail(validate.value.email);

                    resp.message = "Created user, email validation required";
                }
            }

            ctx.body = resp;
            await next();
        })
    }

}