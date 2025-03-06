import { useState, useEffect } from 'react';
import { UPDATE_AUTHOR, GET_AUTHORS } from '../queries';
import { useMutation, useQuery } from '@apollo/client';
import Select from 'react-select'

const UpdateAuthorForm = () => {
  const [name, setName] = useState('');
  const {data} = useQuery(GET_AUTHORS)
  const [born, setBorn] = useState('');
  const [updateAuthor, result] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [
        GET_AUTHORS
    ]
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    
    updateAuthor({variables: {name: name.value, born: parseInt(born)}})
  };

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      console.error('author not found');
    }
  }, [result.data]); // eslint-disable-line 

  const selectOptions = data.allAuthors.map((a) =>  {return {value: a.name, label: a.name}})
  

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={handleSubmit}>
        <div>
          name
          <Select
            options={selectOptions}
            onChange={(value) => setName(value)}
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
