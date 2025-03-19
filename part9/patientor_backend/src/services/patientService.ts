import { NonSensitivePatient, NewPatient, Patient, EntryWithoutId } from '../types';
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
  return newPatient;
}

const addEntry = (patientId: string, entry: EntryWithoutId): void => {
  const id = uuid()
  const patient = patients.find((p) => p.id === patientId)
  const newEntry = {
    id,
    ...entry
  }
  if(patient){
    patient.entries?.push(newEntry)
  } else {
    throw new Error('Patient not found')
  }
}

export default {
  getAllPatients,
  getNonSensitiveEntries,
  getPatientById,
  addPatient,
  addEntry
};
