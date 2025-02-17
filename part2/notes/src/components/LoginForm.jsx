import { useState } from 'react'

const LoginForm = ({handleLogin}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = (event) => {
    event.preventDefault();
    handleLogin({username, password})
    setUsername("")
    setPassword("")

  }
  return (
    <form onSubmit={login}>
      <div>
        Username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={event => setUsername(event.target.value)}
        />
      </div>
      <div>
        Password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={event => setPassword(event.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  )};

  export default LoginForm