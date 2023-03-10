import ApiRoute from "interfaces/ApiRoute";
import * as Router from "koa-router";
import ApiResponse from "../../models/ApiResponse";
import MapManager, { placePartRequestSchema, IMapPart, deletePartRequestSchema } from "../../db/Map";
import Database from "../../db/Database";
import { v4 as uuidv4 } from 'uuid';
import SocketHandler, { SocketResponse } from "../../socket/SocketHandler";

export default class DeletePartRoute implements ApiRoute {

    initRoutes(router: Router): void {
        router.delete("/api/v1/map/deletePart", async (ctx, next) => {
            let resp = new ApiResponse();

            let token = ctx.headers.authorization;
            let validate = deletePartRequestSchema.validate(ctx.request.body);

            if (validate.error != undefined) {
                resp.error.errorCode = 5;
                resp.error.errorMessage = validate.error.message;
                resp.message = "Failed to delete part";
            } else {
                let users = await Database.authUserWithToken(token);
                if (users == undefined || users.length == 0) {
                    resp.error.errorCode = 6;
                    resp.error.errorMessage = "No authorization";
                    resp.message = "Failed to delete part";
                } else {

                    let user = users[0];

                    if (Database.userHasTimeout(user.email)) {
                        resp.error.errorCode = 10;
                        resp.error.errorMessage = "Place timeout is not over";
                        resp.message = "Failed to delete part";
                    } else {

                        await MapManager.deletePartWithId(validate.value.identifier);

                        resp.message = "Deleted part";

                        let socketResponse = new SocketResponse();
                        socketResponse.message = {
                            op: "PART_DELETED",
                            user: user.username,
                            partId: validate.value.identifier
                        };

                        SocketHandler.broadcast(socketResponse);
                        Database.addTimeoutForUser(user.email);
                    }
                }
            }

            ctx.body = resp;
            await next();
        })
    }

}