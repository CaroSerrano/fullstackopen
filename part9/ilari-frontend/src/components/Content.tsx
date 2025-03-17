import { DiaryEntry } from '../types';
import Entry from './Entry';

const Content = ({ diaryEntries }: { diaryEntries: DiaryEntry[] }) => {
  if(!diaryEntries || diaryEntries.length === 0){
    return null
  }
  return (
    <div>
      <h1>Diary Entries</h1>
      {diaryEntries.map((p) => (
        <Entry key={p.id} {...p} />
      ))}
    </div>
  );
};

export default Content;
