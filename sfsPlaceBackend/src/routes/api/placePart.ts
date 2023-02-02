import ApiRoute from "interfaces/ApiRoute";
import * as Router from "koa-router";
import ApiResponse from "../../models/ApiResponse";
import MapManager, { placePartRequestSchema, IMapPart } from "../../db/Map";
import Database from "../../db/Database";
import { v4 as uuidv4 } from 'uuid';

export default class PlacePartRoute implements ApiRoute {
    initRoutes(router: Router): void {
        router.put("/api/v1/map/placePart", async (ctx, next) => {
            let resp = new ApiResponse();

            let token = ctx.headers.authorization;
            let validate = placePartRequestSchema.validate(ctx.request.body);

            if (validate.error != undefined) {
                resp.error.errorCode = 5;
                resp.error.errorMessage = validate.error.message;
                resp.message = "Failed to place part";
            } else {
                let users = await Database.authUserWithToken(token);
                if (users == undefined || users.length == 0) {
                    resp.error.errorCode = 6;
                    resp.error.errorMessage = "No authorization";
                    resp.message = "Failed to place part";
                } else {

                    let user = users[0];

                    // less then .1 or higher than 2
                    if (validate.value.scale > 2 || validate.value.scale < 0.1) {
                        resp.message = "Failed to place part";
                        resp.error.errorCode = 5;
                        resp.error.errorMessage = "Scale cannot be less than .1 or higher than 2";
                    } else {

                        let part: IMapPart = {
                            placeTime: Date.now(),
                            name: validate.value.partName,
                            position: { x: validate.value.partPosition.x, y: validate.value.partPosition.y },
                            owner: user.username,
                            rotation: Math.round(validate.value.rotation),
                            scale: validate.value.scale,
                            texture: validate.value.texture,
                            identifier: uuidv4()
                        }

                        MapManager.addPart(part);     
                        
                        user.placedParts += 1;
                        user.save();

                        resp.message = "Placed part";
                    }
                }
            }

            ctx.body = resp;
            await next();
        })
    }

}