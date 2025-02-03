import { useState, useEffect } from "react";
import personsService from "./services/persons";
import Notification from "./components/Notification";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";


const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    console.log("effect");
    personsService.getAll().then((response) => {
      console.log("promise fulfilled");
      setPersons(response);
    });
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const person = persons.find((p) => p.name === newName);
    if (person) {
      updatePerson(person)
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      };
      personsService
        .create(personObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNewName("");
          setNewNumber("");
          setNotificationMessage(`${personObject.name} successfully added to phonebook!`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 3000)
        })
        .catch((error) => {
          alert(`Failed to create ${personObject.name}.`);
          console.error(error);
        });
    }
  };

  const updatePerson = (person) => {
    if (
      window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
    ) {
      const fieldsToUpdate = {
        name: newName,
        number: newNumber,
      };
      personsService
        .update(person.id, fieldsToUpdate)
        .then((returnedPerson) => {
          setPersons(
            persons.filter((p) => p.id != person.id).concat(returnedPerson)
          );
          setNewName("");
          setNewNumber("");
          setNotificationMessage(`${person.name} successfully updated!`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 3000)
        })
        .catch((error) => {
          alert(`Failed to update ${person.name}.`);
          console.error(error);
        });
    } else {
      setNewName("");
      setNewNumber("");
    }
  }

  const deletePerson = (id) => {
    setPersons(persons.filter((p) => p.id !== id));
  };

  const personsToShow = persons.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} onDelete={deletePerson} />
    </div>
  );
};

export default App;
