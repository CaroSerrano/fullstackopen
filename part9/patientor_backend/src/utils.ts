import { NewPatient } from './types';

//guardias de tipo: función que devuelve un booleano y que tiene un predicado de tipo como tipo de retorno.
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

//parsers

const parseStringParam = (param: unknown): string => {
  if (!isString(param)) {
    throw new Error('Incorrect or missing comment');
  }

  return param;
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
      gender: parseStringParam(object.gender),
      occupation: parseStringParam(object.occupation),
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};

export default toNewPatient;
