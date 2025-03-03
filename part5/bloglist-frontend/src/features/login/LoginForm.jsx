import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setNotification } from '../notification/notificationSlice';
import { setUser } from './loggedUserSlice';
import loginService from '../../services/login';
import blogService from '../../services/blogs';
import { useNavigate } from 'react-router-dom';

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
    <form onSubmit={handleLogin}>
      <div>
        Username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={handleUsernameChange}
          data-testid='username'
        />
      </div>
      <div>
        Password
        <input
          type='password'
          value={password}
          name='Password'
          onChange={handlePasswordChange}
          data-testid='password'
        />
      </div>
      <button type='submit'>Login</button>
    </form>
  );
};

export default LoginForm;
