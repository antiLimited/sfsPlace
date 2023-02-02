import ApiRoute from "interfaces/ApiRoute";
import * as Router from "koa-router";
import ApiResponse from "../../models/ApiResponse";
import Database from "../../db/Database";
import * as bcrypt from "bcrypt";
import { Logger } from "tslog";

export default class UserLoginRoute implements ApiRoute {
    private log: Logger<String> = new Logger();

    initRoutes(router: Router): void {
        router.post("/api/v1/user/login", async (ctx, next) => {
            let resp = new ApiResponse();

            if (ctx.request.body["username"] == undefined) {
                resp.error.errorCode = 3;
                resp.error.errorMessage = '"username" is required';

                resp.message = "Failed to login";
            } else if (ctx.request.body["username"] == undefined) {
                resp.error.errorCode = 3;
                resp.error.errorMessage = '"password" is required';

                resp.message = "Failed to login";
            } else {

                let users = await Database.findUserWithName(ctx.request.body["username"]);

                if (users.length == 0) {
                    resp.message = "Invalid username or password";
                    resp.error.errorCode = 4;
                    resp.error.errorMessage = "Failed to find user with username, or password";
                } else {
                    let user = users[0];

                    let passwordStatus = await bcrypt.compare(ctx.request.body["password"], user.password);

                    if (passwordStatus && user.validatedEmail) {
                        let token = Database.createUserToken(user.email);

                        resp.message = token;

                        this.log.info(`${user.username} has logged in!`);
                    } else {
                        resp.message = "Invalid username or password";
                        resp.error.errorCode = 4;
                        resp.error.errorMessage = "Failed to find user with username, or password";
                    }
                }
            }

            ctx.body = resp;
            await next();
        })
    }

}