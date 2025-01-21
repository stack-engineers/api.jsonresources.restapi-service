"use strict";
const express = require("express");
const application = express();
const http = require("node:http");
const server = http.createServer(application);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("dotenv").configDotenv();
const apicache = require("apicache");
const cache = apicache.middleware;

const cors = require("cors");
const allowedOrigins = ["*"];
application.use(cors({
    origin: "*",
    credentials: true
}));

application.use(function (request, response, next) {
    response.statusCode = Number(parseInt(200));
    response.contentType = "Application/json";

    response.setHeader("Access-Control-Allow-Credentials", Boolean(true))
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, UPDATE");

    next();
});

application.use(bodyParser.urlencoded({ extended: Boolean(false) }));
application.use(express.urlencoded({ extended: Boolean(false) }));
application.use(cookieParser());
application.use(bodyParser.json());
application.use(express.json());
application.use(express.static(require("node:path").join(__dirname, "../../view")));
application.use(express.static(require("node:path").join(__dirname, "../../view/public")));

application.use("/", require("../routers/root.router.controller"));
application.use("/resources", cache("5 minutes"), require("../routers/resources.controller"));

application.use(require("../middleware/error/404.middleware.controller"));

application.set("port", 3500);
const events = require("node:events");
const emitter = new events();
emitter.on("start", () => console.log("server running!"));

server.listen(application.get("port") || process.env.PORT, () => {
    server.listening ? emitter.emit("start") : console.log("server not running!");
});

module.exports = application;