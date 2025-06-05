const express = require("express");
const database = require("./config/database");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const routeApiVer1 = require("./api/v1/routes/index.route");

const app = express();
const port = process.env.PORT;
const corsOptions = { origin: process.env.CORS_ORIGIN };
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST"],
    },
});

global._io = io;

database.connect();

app.use("/uploads", express.static("uploads"));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());
app.use(cors());

routeApiVer1(app);

server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});