import { Diagnose } from '../types';
import diagnoses from '../../data/diagnoses';

const getEntries = (): Diagnose[] => {
  return diagnoses;
};

export default {
  getEntries,
};
