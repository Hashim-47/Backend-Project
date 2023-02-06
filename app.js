const express = require("express");
const cors = require("cors");

const { getApi } = require("./controllers/api.controller");
const {
  customErrorHandling,
  invalidEndpointError,
  psqlErrorHandling,
  serverErrorHandling,
} = require("./errors/errors");
const apiRouter = require("./routers/api.router");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/api", getApi);
app.use("/api", apiRouter);

app.all("/*", invalidEndpointError);

app.use(customErrorHandling);

app.use(psqlErrorHandling);

app.use(serverErrorHandling);

module.exports = app;
