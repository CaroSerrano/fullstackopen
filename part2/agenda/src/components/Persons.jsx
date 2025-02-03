import Person from "./Person";

const Persons = ({ personsToShow, onDelete }) => {
  return (
    <ul>
      {personsToShow.map((person) => (
        <Person key={person.id} person={person} onDelete={onDelete} />
      ))}
    </ul>
  );
};

export default Persons;
