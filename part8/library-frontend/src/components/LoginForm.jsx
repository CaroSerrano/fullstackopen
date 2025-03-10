import { useState } from 'react';
import { LOGIN, ME } from '../queries';
import { useMutation } from '@apollo/client';

const LoginForm = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, result] = useMutation(LOGIN, {
    refetchQueries: ME
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ variables: { username, password } });
    if (result.data) {
      localStorage.setItem('library-logged-user', result.data.login.value);
      props.setToken(result.data.login.value);
      setUsername('')
      setPassword('')
    }
  };

  if (!props.show) {

    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <div>
        Username:
        <input
          type='text'
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password:
        <input
          type='password'
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>Login</button>
    </form>
  );
};

export default LoginForm;
