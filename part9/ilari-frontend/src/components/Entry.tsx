import { DiaryEntry } from '../types';

const Entry = (entry: DiaryEntry) => {
  return (
    <div>
      <h2>{entry.date}</h2>
      <p>Visibility: {entry.visibility}</p>
      <p>Weather: {entry.weather}</p>
      <p>{entry.comment}</p>
    </div>
  );
};

export default Entry;
