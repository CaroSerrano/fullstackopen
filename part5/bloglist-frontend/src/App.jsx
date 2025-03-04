import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { inicializeBlogs } from './features/blogs/blogSlice';
import { inicializeUsers } from './features/users/usersSlice';
import { removeUser, setUser } from './features/login/loggedUserSlice';
import { Routes, Route, Link, useMatch } from 'react-router-dom';
import { Button, Navbar, Nav, Container } from 'react-bootstrap';
import Blogs from './features/blogs/Blogs';
import Blog from './features/blogs/Blog';
import Notification from './features/notification/Notification';
import LoginForm from './features/login/LoginForm';
import CreateBlogForm from './features/createBlogForm/CreateBlogForm';
import Users from './features/users/Users';
import User from './features/users/User';
import blogService from './services/blogs';

const App = () => {
  const userlogged = useSelector((state) => state.loggedUser);
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const users = useSelector((state) => state.users);

  const match = useMatch('/blogs/:id');
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  const matchUser = useMatch('/users/:id');
  const user = matchUser
    ? users.find((user) => user.id === matchUser.params.id)
    : null;

  useEffect(() => {
    dispatch(inicializeBlogs());
  }, []);
  useEffect(() => {
    dispatch(inicializeUsers());
  }, []);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const userlogged = JSON.parse(loggedUserJSON);
      dispatch(setUser(userlogged));
      blogService.setToken(userlogged.token);
    }
  }, []);

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogappUser');
    dispatch(removeUser());
  };

  if (userlogged === null) {
    return (
      <div className='container'>
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm />
      </div>
    );
  }
  const margin = {
    margin: 5,
  };
  return (
    <div className='container'>
      <Navbar collapseOnSelect expand='lg' bg='light' data-bs-theme='light'>
        <Container>
          <Navbar.Brand>BlogApp</Navbar.Brand>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav>
              <Nav.Link>
                <Link style={margin} to='/users'>
                  users
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link style={margin} to='/'>
                  blogs
                </Link>
              </Nav.Link>
              <Navbar.Text>{userlogged.name} logged-in</Navbar.Text>
              <Button
                size='sm'
                variant='outline-secondary'
                style={margin}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Notification />
      <Routes>
        <Route path='/login' element={<LoginForm />} />
        <Route path='/' element={<Blogs />} />
        <Route path='/create-blog' element={<CreateBlogForm />} />
        <Route path='/blogs/:id' element={<Blog blog={blog} />} />
        <Route path='/users' element={<Users />} />
        <Route path='/users/:id' element={<User user={user} />} />
      </Routes>
    </div>
  );
};

export default App;
