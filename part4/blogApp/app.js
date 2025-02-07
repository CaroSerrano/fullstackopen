const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const blogRouter = require("./controllers/blogs");

const mongoUrl =
  "mongodb+srv://fullstackopen:1234@cluster0.unnrajh.mongodb.net/blogApp?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogRouter);
module.exports = app;
