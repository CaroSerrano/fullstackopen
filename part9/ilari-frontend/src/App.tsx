import { useState, useEffect } from 'react';
import { DiaryEntry } from './types';
import { getAllDiaryEntries } from './services/diaryEntries';
import Content from './components/Content';

function App() {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAllDiaryEntries().then((data) => {
      setDiaryEntries(data);
    });
  }, []);


  if(!diaryEntries || diaryEntries.length === 0){
    return null
  }

  return (
    <>
      <Content diaryEntries={diaryEntries} />
    </>
  );
}

export default App;
