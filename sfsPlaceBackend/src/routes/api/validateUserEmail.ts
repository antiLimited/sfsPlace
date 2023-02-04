import ApiRoute from "interfaces/ApiRoute";
import * as Router from "koa-router";
import ApiResponse from "../../models/ApiResponse";
import Database from "../../db/Database";

export default class ValidateUserEmailRoute implements ApiRoute {
    initRoutes(router: Router): void {
        router.post("/api/v1/user/validateEmail", async (ctx, next) => {
            let resp = new ApiResponse();

            if (ctx.request.body["token"] == undefined) {
                resp.error.errorCode = 3;
                resp.error.errorMessage = '"token" is required';

                resp.message = "Failed to validate user email";
            } else {
                let validatedEmail = await Database.validateEmail(ctx.request.body["token"]);


                if (validatedEmail) {
                    resp.message = "Verified user email address";
                } else {
                    resp.message = "Failed to validate email address";
                    resp.error.errorCode = 4;
                    resp.error.errorMessage = "Invalid email verification code";

                }
            }

            ctx.body = resp;
            await next();
        })
    }

}