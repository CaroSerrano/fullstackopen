const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});
test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("The name of the unique identifier is id", async () => {
  const response = await api.get("/api/blogs");
  const identifiers = response.body.map((r) => r.id);

  expect(identifiers).toBeDefined();
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "async/await simplifies making async calls",
    author: "Fulanito",
    url: "http://sklnlskdnvlsknvsl",
    likes: 2,
  };
  const userToken = await api
    .post("/api/login")
    .send({ username: "root", password: "sekret" });
  await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", `Bearer ${userToken._body.token}`)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((n) => n.title);
  expect(titles).toContain("async/await simplifies making async calls");
});

test("addition of a new blog fails with status code 401 if token not provided", async () => {
  const newBlog = {
    title: "async/await simplifies making async calls",
    author: "Fulanito",
    url: "http://sklnlskdnvlsknvsl",
    likes: 2,
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(401)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test("property likes has a default value of zero", async () => {
  const blogWithoutLikes = {
    title: "async/await simplifies making async calls",
    author: "Fulanito",
    url: "http://sklnlskdnvlsknvsl",
  };
  const userToken = await api
    .post("/api/login")
    .send({ username: "root", password: "sekret" });

  const savedBlog = await api
    .post("/api/blogs")
    .send(blogWithoutLikes)
    .set("Authorization", `Bearer ${userToken._body.token}`)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  expect(savedBlog._body.likes).toBe(0);
});

test("title and url required", async () => {
  const blogWithMissingParams = {
    author: "Fulanito",
    url: "http://sklnlskdnvlsknvsl",
    likes: 6,
  };
  const userToken = await api
    .post("/api/login")
    .send({ username: "root", password: "sekret" });
  await api
    .post("/api/blogs")
    .send(blogWithMissingParams)
    .set("Authorization", `Bearer ${userToken._body.token}`)
    .expect(400);
});

test("delete one blog by id successfully", async () => {
  const blogs = Object.values(await helper.blogsInDb());
  const randomBlog = blogs[Math.floor(Math.random() * blogs.length)];
  const userToken = await api
    .post("/api/login")
    .send({ username: "root", password: "sekret" });
  console.log("randomBlog.id ", randomBlog.id);
  console.log("userToken._body.token ", userToken._body.token);

  await api
    .del(`/api/blogs/${randomBlog.id}`)
    .set("Authorization", `Bearer ${userToken._body.token}`)
    .expect(204);
});

test("updates a blog correctly", async () => {
  const blogs = Object.values(await helper.blogsInDb());
  const randomBlog = blogs[Math.floor(Math.random() * blogs.length)];
  const newBlog = {
    title: randomBlog.title,
    author: randomBlog.author,
    url: randomBlog.url,
    likes: Math.floor(Math.random() * 100),
  };
  await api
    .put(`/api/blogs/${randomBlog.id}`)
    .send(newBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

afterAll(() => {
  mongoose.connection.close();
});
