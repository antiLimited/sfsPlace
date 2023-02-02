import ApiRoute from "interfaces/ApiRoute";
import * as Router from "koa-router";
import ApiResponse from "../../models/ApiResponse";
import Database from "../../db/Database";

export default class MeRoute implements ApiRoute {
    initRoutes(router: Router): void {
        router.get("/api/v1/user/me", async (ctx, next) => {
            let resp = new ApiResponse();
            let token = ctx.headers.authorization;

            if (token == undefined) {
                resp.error.errorCode = 3;
                resp.error.errorMessage = '"token" is required';

                resp.message = "Failed to get current user";
                ctx.body = resp;
            } else {
                let users = await Database.authUserWithToken(token);
            
                ctx.body = users[0];
            }

            await next();
        })
    }

}