import MapManager from "../../db/Map";
import ApiRoute from "interfaces/ApiRoute";
import * as Router from "koa-router";

export default class GetMapRoute implements ApiRoute {
    initRoutes(router: Router): void {
        router.get("/api/v1/map/parts", async (ctx, next) => {
            ctx.body = MapManager.getParts();
            await next();
        })
    }

}