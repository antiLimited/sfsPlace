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
                await Database.validateEmail(ctx.request.body["token"]);

                resp.message = "Verified user email address";
            }

            ctx.body = resp;
            await next();
        })
    }

}