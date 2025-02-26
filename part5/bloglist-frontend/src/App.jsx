import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from './reducers/notificationReducer';
import { inicializeBlogs, createBlog } from './reducers/blogReducer';
import Blog from './components/Blog';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import CreateBlogForm from './components/CreateBlogForm';
import Togglable from './components/Togglable';
import blogService from './services/blogs';

const App = () => {
  const blogs = useSelector(({ blogs }) => blogs)
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(inicializeBlogs())
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

  const handleCreateBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      dispatch(createBlog(blogObject))
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
    // setBlogs(blogs.filter((b) => b.id !== blog.id).concat(blog));
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
    // setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm setUser = {setUser}/>
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
      {[...blogs]
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
