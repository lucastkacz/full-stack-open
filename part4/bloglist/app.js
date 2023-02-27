const config = require("./utils/config");
const logger = require("./utils/logger");
const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const blogRouter = require("./controllers/blogs");
const middleware = require("./utils/middleware");

mongoose.set("strictQuery", false);

const app = express();
// require("dotenv").config();

logger.info("connecting to", config.MONGODB_URI);

mongoose
	.connect(config.MONGODB_URI)
	.then(() => {
		logger.info("connected to MongoDB");
	})
	.catch((error) => {
		logger.error("error connecting to MongoDB:", error.message);
	});

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/blogs", blogRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
