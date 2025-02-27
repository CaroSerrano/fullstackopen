import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setNotification } from '../notification/notificationSlice';
import loginService from '../../services/login'
import blogService from '../../services/blogs'

const LoginForm = (props) => {
  const dispatch = useDispatch();
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
      props.setUser(user);
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
LoginForm.propTypes = {
  setUser: PropTypes.func.isRequired,
};
export default LoginForm;
