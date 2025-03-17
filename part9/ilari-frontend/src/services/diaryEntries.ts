import axios from 'axios';
import { DiaryEntry } from '../types';

const baseUrl = 'http://localhost:3000/api/diary';

export const getAllDiaryEntries = async () => {
  const response = await axios.get<DiaryEntry[]>(baseUrl);
  
  return response.data;
};
