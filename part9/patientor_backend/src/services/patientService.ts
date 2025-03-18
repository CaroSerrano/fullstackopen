import { NonSensitivePatient, NewPatient, Patient } from '../types';
import patients from '../../data/patients-full';
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

const getAllPatients = (): Patient[] => {
  return patients
}

const getPatientById = (id: string): Patient | undefined => {
  const patient = patients.find((p) => p.id === id)
  if(patient){
    return patient
  }
  return undefined
}
const addPatient = (entry: NewPatient): Patient =>  {
  const id = uuid()
  const newPatient = {
    id,
    ...entry,
    entries: []
  };

  patients.push(newPatient);
  console.log(patients)
  return newPatient;
}

export default {
  getAllPatients,
  getNonSensitiveEntries,
  getPatientById,
  addPatient
};
