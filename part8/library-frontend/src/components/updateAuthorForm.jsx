import { useState, useEffect } from 'react';
import { UPDATE_AUTHOR, GET_AUTHORS } from '../queries';
import { useMutation } from '@apollo/client';

const UpdateAuthorForm = () => {
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');
  const [updateAuthor, result] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [
        GET_AUTHORS
    ]
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    updateAuthor({variables: {name, born: parseInt(born)}})
  };

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      console.error('author not found');
    }
  }, [result.data]); // eslint-disable-line 
  
  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={handleSubmit}>
        <div>
          name
          <input
            type='text'
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
          <input
            type='number'
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  );
};

export default UpdateAuthorForm;
