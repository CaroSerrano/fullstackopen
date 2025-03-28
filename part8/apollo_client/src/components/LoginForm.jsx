import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../gql/queries';

const LoginForm = ({ setError, setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.message);
    },
  });
  

  // useEffect(() => {
  //   if (result.data) {
  //     const token = result.data.login.value;
  //     setToken(token);
  //     localStorage.setItem('phonenumbers-user-token', token);
  //   }
  // }, [result]); // eslint-disable-line

  const submit = async (e) => {
    e.preventDefault();
    await login({ variables: { username, password } });
    
    if (result.data) {
      localStorage.setItem('phonenumbers-user-token', result.data.login.value);
      setToken(result.data.login.value);
      setUsername('')
      setPassword('')
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username{' '}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{' '}
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  );
};

export default LoginForm;
