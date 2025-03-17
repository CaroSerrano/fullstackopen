import { Dispatch, SetStateAction, useState } from 'react';
import { createEntry } from '../services/diaryEntries';
import toNewDiaryEntry from '../utils';
import { DiaryEntry } from '../types';
import axios from 'axios';

const NewEntryForm = ({
  setDiaryEntries,
  diaryEntries,
}: {
  setDiaryEntries: Dispatch<SetStateAction<DiaryEntry[]>>;
  diaryEntries: DiaryEntry[];
}) => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState('');
  const [weather, setWeather] = useState('');
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const newEntry = {
        date,
        visibility,
        weather,
        comment,
      };
      const addedEntry = await createEntry(toNewDiaryEntry(newEntry));
      setDiaryEntries(diaryEntries.concat(addedEntry));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.message);

        console.log(error.status);
        console.error(error.response);
      } else {
        if (error instanceof Error) {
          setErrorMessage(error.message);
          setTimeout(() => {
            setErrorMessage('');
          }, 5000);
        }
      }
    }
  };

  return (
    <div>
      <h2>Add a new Diary entry</h2>
      <p style={{ color: 'red' }}>{errorMessage != '' && errorMessage}</p>
      <form onSubmit={handleSubmit}>
        Date{' '}
        <input
          required
          type='date'
          onChange={({ target }) => setDate(target.value)}
        />
        <fieldset>
          <legend>Visibility: </legend>
          <div>
            <input
              type='radio'
              name='visibility'
              id='visibilityChoice1'
              value='great'
              required
              onChange={({ target }) => setVisibility(target.value)}
            />
            <label htmlFor='visibilityChoice1'> Great </label>
          </div>
          <div>
            <input
              type='radio'
              name='visibility'
              id='visibilityChoice2'
              value='good'
              onChange={({ target }) => setVisibility(target.value)}
            />
            <label htmlFor='visibilityChoice2'> Good </label>
          </div>
          <div>
            <input
              type='radio'
              name='visibility'
              id='visibilityChoice3'
              value='ok'
              onChange={({ target }) => setVisibility(target.value)}
            />
            <label htmlFor='visibilityChoice3'> Ok </label>
          </div>
          <div>
            <input
              type='radio'
              name='visibility'
              id='visibilityChoice4'
              value='poor'
              onChange={({ target }) => setVisibility(target.value)}
            />
            <label htmlFor='visibilityChoice4'> Poor </label>
          </div>
        </fieldset>
        <fieldset>
          <legend>Weather: </legend>
          <div>
            <input
              type='radio'
              name='weather'
              id='weatherChoice1'
              value='sunny'
              required
              onChange={({ target }) => setWeather(target.value)}
            />
            <label htmlFor='weatherChoice1'> Sunny </label>
          </div>
          <div>
            <input
              type='radio'
              name='weather'
              id='weatherChoice2'
              value='rainy'
              onChange={({ target }) => setWeather(target.value)}
            />
            <label htmlFor='weatherChoice2'> Rainy </label>
          </div>
          <div>
            <input
              type='radio'
              name='weather'
              id='weatherChoice3'
              value='cloudy'
              onChange={({ target }) => setWeather(target.value)}
            />
            <label htmlFor='weatherChoice3'> Cloudy </label>
          </div>
          <div>
            <input
              type='radio'
              name='weather'
              id='weatherChoice4'
              value='stormy'
              onChange={({ target }) => setWeather(target.value)}
            />
            <label htmlFor='weatherChoice4'> Stormy </label>
          </div>
          <div>
            <input
              type='radio'
              name='weather'
              id='weatherChoice5'
              value='windy'
              onChange={({ target }) => setWeather(target.value)}
            />
            <label htmlFor='weatherChoice5'> Windy </label>
          </div>
        </fieldset>
        <div>
          <label htmlFor='comment'>Comment: </label>
          <textarea
            id='comment'
            onChange={({ target }) => setComment(target.value)}
          />
        </div>
        <br />
        <button type='submit'>add</button>
      </form>
    </div>
  );
};

export default NewEntryForm;
