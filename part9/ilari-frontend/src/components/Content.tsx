import { Dispatch, SetStateAction } from 'react';
import { DiaryEntry } from '../types';
import Entry from './Entry';
import NewEntryForm from './NewEntryForm';

const Content = ({
  diaryEntries,
  setDiaryEntries,
}: {
  diaryEntries: DiaryEntry[];
  setDiaryEntries: Dispatch<SetStateAction<DiaryEntry[]>>;
}) => {
  if (!diaryEntries || diaryEntries.length === 0) {
    return null;
  }
  return (
    <div>
      <NewEntryForm
        setDiaryEntries={setDiaryEntries}
        diaryEntries={diaryEntries}
      />
      <h1>Diary Entries</h1>
      {diaryEntries.map((p) => (
        <Entry key={p.id} {...p} />
      ))}
    </div>
  );
};

export default Content;
