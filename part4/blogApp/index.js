const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const Blog = require('./models/blog');

app.use(cors());
app.use(express.json());



const mongoUrl =
  "mongodb+srv://fullstackopen:1234@cluster0.unnrajh.mongodb.net/blogApp?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoUrl);

app.get("/api/blogs", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

app.post("/api/blogs", (request, response) => {
  const blog = new Blog(request.body);
  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
