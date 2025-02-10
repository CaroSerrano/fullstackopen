const express = require("express");
const app = express();
const cors = require("cors");
const middleware = require("./utils/middleware")
const config = require("./utils/config");
const mongoose = require("mongoose");
require('express-async-errors')
const blogRouter = require("./controllers/blogs");

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogRouter);
app.use(middleware.errorHandler)

module.exports = app;
