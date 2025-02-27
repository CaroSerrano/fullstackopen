import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { inicializeBlogs } from './features/blogs/blogSlice';
import Blog from './features/blogs/Blog';
import Notification from './features/notification/Notification';
import LoginForm from './features/login/LoginForm';
import CreateBlogForm from './features/createBlogForm/CreateBlogForm';
import Togglable from './features/togglable/Togglable';
import blogService from './services/blogs';

const App = () => {
  const blogs = useSelector(({ blogs }) => blogs);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(inicializeBlogs());
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

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm setUser={setUser} />
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
        <CreateBlogForm />
      </Togglable>

      <br></br>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </div>
  );
};

export default App;
