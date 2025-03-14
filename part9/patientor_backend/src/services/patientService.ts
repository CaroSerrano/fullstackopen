import { NonSensitivePatient, NewPatient, Patient } from '../types';
import patients from '../../data/patients';
import { v1 as uuid } from 'uuid'


const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatient): Patient =>  {
  const id = uuid()
  const newPatient = {
    id,
    ...entry
  };

  patients.push(newPatient);
  console.log(patients)
  return newPatient;
}

export default {
  getNonSensitiveEntries,
  addPatient
};
