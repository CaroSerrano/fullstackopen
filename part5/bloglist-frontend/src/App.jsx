import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setNotification } from './reducers/notificationReducer';
import Blog from './components/Blog';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import CreateBlogForm from './components/CreateBlogForm';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
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
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      dispatch(
        setNotification({ message: 'Wrong credentials', error: true }, 5)
      );
    }
  };

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    setUsername('');
    setPassword('');
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

      dispatch(
        setNotification(
          {
            message: 'A new blog added',
            error: false,
          },
          5
        )
      );
    } catch (error) {
      dispatch(
        setNotification(
          {
            message: 'Creation of a new blog failed :(',
            error: true,
          },
          5
        )
      );
    }
  };

  const handleLikeClick = (blog) => {
    console.log('like cliked');
    setBlogs(blogs.filter((b) => b.id !== blog.id).concat(blog));
  };

  const handleRemoveBlog = (id) => {
    dispatch(
      setNotification(
        {
          message: 'Blog deleted successfully',
          error: false,
        },
        5
      )
    );
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
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
      <Notification />
      <p>{user.name} logged-in</p>
      <button onClick={handleLogout}>logout</button>
      <Togglable buttonLabel='create blog' ref={blogFormRef}>
        <h3>Create new</h3>
        <CreateBlogForm handleCreateBlog={handleCreateBlog} />
      </Togglable>

      <br></br>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            onRemove={handleRemoveBlog}
            onLike={handleLikeClick}
          />
        ))}
    </div>
  );
};

export default App;
