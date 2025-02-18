import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import CreateBlogForm from "./components/CreateBlogForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const blogFormRef = useRef();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setNotificationMessage({ message: "Wrong credentials", error: true });
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    }
  };

  const handleLogout = (event) => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    setUsername("");
    setPassword("");
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleCreateBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const returnedBlog = await blogService.create(blogObject);

      setBlogs(blogs.concat(returnedBlog));

      setNotificationMessage({
        message: `A new blog added`,
        error: false,
      });
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    } catch (error) {
      setNotificationMessage({
        message: "Creation of a new blog failed :(",
        error: true,
      });
      setTimeout(() => {
        setNotificationMessage(null);
      }, 5000);
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notificationMessage} />
        <LoginForm
          username={username}
          password={password}
          handleLogin={handleLogin}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notificationMessage} />
      <p>{user.name} logged-in</p>
      <button onClick={handleLogout}>logout</button>
      <Togglable buttonLabel="create blog" ref={blogFormRef}>
        <h3>Create new</h3>
        <CreateBlogForm handleCreateBlog={handleCreateBlog} />
      </Togglable>

      <br></br>
      {blogs
      .sort((a, b) => b.likes - a.likes)
      .map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
