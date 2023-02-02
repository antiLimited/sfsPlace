import * as Router from "koa-router";

export default interface ApiRoute {
    initRoutes(router: Router) : void
}