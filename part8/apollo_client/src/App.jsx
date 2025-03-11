import React from 'react';
import { useQuery, useApolloClient, useSubscription } from '@apollo/client';
import { useState } from 'react';
import Persons from './components/Persons';
import PersonForm from './components/PersonForm';
import Notify from './components/Notify';
import PhoneForm from './components/PhoneForm';
import LoginForm from './components/LoginForm';
import { ALL_PERSONS, PERSON_ADDED } from './gql/queries';

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem('phonenumbers-user-token')
  );
  const client = useApolloClient();

  const result = useQuery(ALL_PERSONS, {
    // pollInterval: 2000
  });

  const updateCacheWith = (addedPerson) => {
    const includedIn = (set, object) =>
      set.map((p) => p.id).includes(object.id);

    const dataInStore = client.readQuery({ query: ALL_PERSONS });
    if (!includedIn(dataInStore.allPersons, addedPerson)) {
      client.writeQuery({
        query: ALL_PERSONS,
        data: { allPersons: dataInStore.allPersons.concat(addedPerson) },
      });
    }
  };

  useSubscription(PERSON_ADDED, {
    onData: ({ data }) => {
      const addedPerson = data.data.personAdded;
      notify(`${addedPerson.name} added`);
      updateCacheWith(addedPerson);
    },
  });
  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };
  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm setToken={setToken} setError={notify} />
      </div>
    );
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <>
      <Notify errorMessage={errorMessage} />
      <button onClick={logout}>logout</button>
      <Persons persons={result.data.allPersons} />
      <PersonForm updateCacheWith={updateCacheWith} setError={notify} />
      <PhoneForm setError={notify} />
    </>
  );
};

export default App;
