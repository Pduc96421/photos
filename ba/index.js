const express = require("express");
const database = require("./config/database");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const routeApiVer1 = require("./api/v1/routes/index.route");

const app = express();
const port = process.env.PORT;

database.connect();

app.use("/uploads", express.static("uploads"));

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Khai báo routes
routeApiVer1(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
