import * as Koa from "koa";
import * as Router from "koa-router";

import * as logger from "koa-logger";
import * as json from "koa-json";
import * as serve from "koa-static";
import * as bodyParser from "koa-bodyparser";
import * as cors from "koa-cors";

import CreateAccountRoute from "./routes/api/createAccount";
import Database from "./db/Database";
import ServerConfig from "./config";
import ValidateUserEmailRoute from "./routes/api/validateUserEmail";
import UserLoginRoute from "./routes/api/loginToUser";
import PlacePartRoute from "./routes/api/placePart";
import GetMapRoute from "./routes/api/getMap";
import MapManager from "./db/Map";
import MeRoute from "./routes/api/me";
import DeletePartRoute from "./routes/api/deletePart";
import SocketHandler from "./socket/SocketHandler";


const app = new Koa();
const router = new Router();

Database.connect(ServerConfig.clusterUrl);

MapManager.syncPartList();

// Init request routes

let routes = [new CreateAccountRoute(), new ValidateUserEmailRoute(), new UserLoginRoute(), new PlacePartRoute(), new GetMapRoute(), new MeRoute(), new DeletePartRoute()];

for (let route of routes) {
    route.initRoutes(router);
}

app.use(json());
app.use(logger());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
app.use(serve("public"));
app.use(cors());


setInterval(() => {
    Database.updateTimeouts();
}, 1000);

// rate limiting

const db = new Map();

let server = app.listen(process.env.PORT || 3404, () => {
    console.log("Started sfsPlace backend server");
});

SocketHandler.listen(server);