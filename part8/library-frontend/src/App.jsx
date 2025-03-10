import { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(() => localStorage.getItem('library-logged-user'))

  const handleLogout = () => {
    localStorage.removeItem('library-logged-user')
    setToken('')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token === '' && <button onClick={() => setPage('login')}>login</button>}
        {token !== '' &&
          <>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={handleLogout}>logout</button>
          </>
        }
        
      </div>
      <LoginForm show={page === 'login'} setToken={setToken} />

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />
    </div>
  );
};

export default App;
