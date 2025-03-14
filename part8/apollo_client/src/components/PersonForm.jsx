import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PERSON } from '../gql/queries';

const PersonForm = ({ setError, updateCacheWith }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');

  const [createPerson] = useMutation(CREATE_PERSON, {
    onError: (error) => {
      console.log(error.message);

      // const errors = error.graphQLErrors[0].extensions.stacktrace[0]
      // const messages = Object.values(error).map(e => e.message).join('\n')
      setError(error.message);
    },
    update: (cache, response) => {
      updateCacheWith(response.data.addPerson)
    },
  });

  const submit = (event) => {
    event.preventDefault();

    createPerson({
      variables: {
        name,
        street,
        city,
        phone: phone.length > 0 ? phone : undefined,
      },
    });

    setName('');
    setPhone('');
    setStreet('');
    setCity('');
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>
          name{' '}
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          phone{' '}
          <input
            value={phone}
            onChange={({ target }) => setPhone(target.value)}
          />
        </div>
        <div>
          street{' '}
          <input
            value={street}
            onChange={({ target }) => setStreet(target.value)}
          />
        </div>
        <div>
          city{' '}
          <input
            value={city}
            onChange={({ target }) => setCity(target.value)}
          />
        </div>
        <button type='submit'>add!</button>
      </form>
    </div>
  );
};

export default PersonForm;
