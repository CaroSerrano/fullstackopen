import { NewPatient, Gender } from './types';

//guardias de tipo: función que devuelve un booleano y que tiene un predicado de tipo como tipo de retorno.
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isGender = (gender: string): gender is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(gender);
};
//parsers

const parseStringParam = (param: unknown): string => {
  if (!isString(param)) {
    throw new Error('Incorrect comment');
  }

  return param;
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect gender');
  }
  return gender;
};

const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (
    'name' in object &&
    'dateOfBirth' in object &&
    'ssn' in object &&
    'gender' in object &&
    'occupation' in object
  ) {
    const newEntry: NewPatient = {
      name: parseStringParam(object.name),
      dateOfBirth: parseStringParam(object.dateOfBirth),
      ssn: parseStringParam(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseStringParam(object.occupation),
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};

export default toNewPatient;
