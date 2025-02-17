import Note from "./components/Note";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import LoginForm from "./components/LoginForm";
import NoteForm from "./components/NoteForm";
import Footer from "./components/Footer";
import { useState, useEffect, useRef } from "react";
import noteService from "./services/notes";
import loginService from "./services/login";

const App = () => {
  /* State hooks */
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);
  /* Effect hooks */
  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  /* useRef hooks */
  const noteFormRef = useRef();

  /* Funciones auxiliares */
  const addNote = async (noteObject) => {
    try {
      noteFormRef.current.toggleVisibility()
      const returnedNote = await noteService.create(noteObject);
      setNotes(notes.concat(returnedNote));
    } catch (error) {
      setErrorMessage(
        "An error occurred while trying to create note: " +
        error.message
      );
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const toggleImportanceOf = async (id) => {
    try {
      const note = notes.find((n) => n.id === id);
      const changedNote = { ...note, important: !note.important };
      const returnedNote = await noteService.update(id, changedNote);
      setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
    } catch (error) {
      setErrorMessage(
        "An error occurred while trying to update note: ",
        error.message
      );
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      setNotes(notes.filter((n) => n.id !== id));
    }
  };

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user);
    } catch (error) {
      setErrorMessage("Wrong credentials", error.message);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
  /* Filtrado de notas */
  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {user === null ? (
        <Togglable buttonLabel="login">
          <LoginForm handleLogin={handleLogin} />
        </Togglable>
      ) : (
        <div>
          <p>{user.name} logged-in</p>
          <Togglable buttonLabel="new note" ref={noteFormRef}>
            <NoteForm createNote={addNote} />
          </Togglable>
        </div>
      )}
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <Footer />
    </div>
  );
};

export default App;
