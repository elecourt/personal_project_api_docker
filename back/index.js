require("dotenv").config();
require("./src/utils/mongoose");
require('express-async-errors');


const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const app = express();
const server = http.createServer(app);
const router = express.Router();
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use("/api", router);

require("./src/controllers")(app, router);

app.use((error, req, res, next) => {
  if(error?.status) {
    res.status(error?.status).send({
      code : error?.code,
      message:error?.message
    })
  } else {
    res.status(500).send({
      code : "SERVER_ERRROR",
      message: "Internal Server Error"
    })
  }
})

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(process.env.APP_PORT, () => {
  console.log(`Api listening at http://localhost:${process.env.APP_PORT}`);
});
