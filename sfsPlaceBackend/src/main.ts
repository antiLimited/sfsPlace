import * as Koa from "koa";
import * as Router from "koa-router";

import * as logger from "koa-logger";
import * as json from "koa-json";
import * as serve from "koa-static";
import * as bodyParser from "koa-bodyparser";
import * as ratelimit from "koa-ratelimit";

import CreateAccountRoute from "./routes/api/createAccount";
import Database from "./db/Database";
import ServerConfig from "./config";
import ValidateUserEmailRoute from "./routes/api/validateUserEmail";
import UserLoginRoute from "./routes/api/loginToUser";
import PlacePartRoute from "./routes/api/placePart";
import GetMapRoute from "./routes/api/getMap";
import MapManager from "./db/Map";
import MeRoute from "./routes/api/me";


const app = new Koa();
const router = new Router();

Database.connect(ServerConfig.clusterUrl);

MapManager.syncPartList();

// Init request routes

let routes = [new CreateAccountRoute(), new ValidateUserEmailRoute(), new UserLoginRoute(), new PlacePartRoute(), new GetMapRoute(), new MeRoute()];

for (let route of routes) {
    route.initRoutes(router);
}

app.use(json());
app.use(logger());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
app.use(serve("public"));


// rate limiting

const db = new Map();

app.use(ratelimit({
    driver: 'memory',
    db: db,
    duration: 60000,
    errorMessage: 'Sometimes You Just Have to Slow Down.',
    id: (ctx) => ctx.ip,
    headers: {
        remaining: 'Rate-Limit-Remaining',
        reset: 'Rate-Limit-Reset',
        total: 'Rate-Limit-Total'
    },
    max: 100,
    disableHeader: false,
}));


app.listen(process.env.PORT || 3404, () => {
    console.log("Started sfsPlace backend server");
})