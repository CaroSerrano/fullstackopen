import personsService from "../services/persons"

const Person = ({ person, onDelete }) => {
  const handleDeletePerson = () => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService
        .deletePerson(person.id)
        .then(() => onDelete(person.id))
        .catch((error) => {
          alert(
            `Failed to delete ${person.name}. It may have already been removed.`
          );
          console.error(error);
        });
    }
  };
  return (
    <li>
      {person.name} {person.number}{" "}
      <button id={person.id} onClick={handleDeletePerson}>
        delete
      </button>
    </li>
  );
};

export default Person;
