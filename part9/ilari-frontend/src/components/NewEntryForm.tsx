import { Dispatch, SetStateAction, useState } from 'react';
import { createEntry } from '../services/diaryEntries';
import toNewDiaryEntry from '../utils';
import { DiaryEntry } from '../types';

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

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const newEntry = {
      date,
      visibility,
      weather,
      comment,
    };
    const addedEntry = await createEntry(toNewDiaryEntry(newEntry));
    setDiaryEntries(diaryEntries.concat(addedEntry));
  };

  return (
    <div>
      <h2>Add a new Diary entry</h2>
      <form onSubmit={handleSubmit}>
        date{' '}
        <input type='date' onChange={({ target }) => setDate(target.value)} />
        visibility{' '}
        <input
          type='text'
          onChange={({ target }) => setVisibility(target.value)}
        />
        weather{' '}
        <input
          type='text'
          onChange={({ target }) => setWeather(target.value)}
        />
        comment{' '}
        <input
          type='text'
          onChange={({ target }) => setComment(target.value)}
        />
        <button type='submit'>add</button>
      </form>
    </div>
  );
};

export default NewEntryForm;
