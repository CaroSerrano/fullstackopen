import PropTypes from 'prop-types';

const LoginForm = ({
  handleLogin,
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
}) => (
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
LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};
export default LoginForm;
