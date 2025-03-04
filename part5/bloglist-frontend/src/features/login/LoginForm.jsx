import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setNotification } from '../notification/notificationSlice';
import { setUser } from './loggedUserSlice';
import loginService from '../../services/login';
import blogService from '../../services/blogs';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
      navigate('/');
    } catch (exception) {
      dispatch(
        setNotification({ message: 'Wrong credentials', error: true }, 5)
      );
    }
  };
  return (
    <Form onSubmit={handleLogin}>
      <Form.Group>
        <Form.Label>Username</Form.Label>
        <Form.Control
          type='text'
          value={username}
          name='Username'
          onChange={handleUsernameChange}
          data-testid='username'
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control
          type='password'
          value={password}
          name='Password'
          onChange={handlePasswordChange}
          data-testid='password'
        />
      </Form.Group>
      <Button style={{ marginTop: 10 }} variant='primary' type='submit'>Login</Button>
    </Form>
  );
};

export default LoginForm;
