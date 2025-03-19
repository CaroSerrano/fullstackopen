import {
  NewPatient,
  Gender,
  EntryWithoutId,
  Diagnosis,
  Discharge,
  HospitalEntryWithoutId,
  HealthCheckRating,
  HealthCheckEntryWithoutId,
  OccupationalHealthCareEntrywithoutId,
  SickLeave,
} from './types';

//guardias de tipo: función que devuelve un booleano y que tiene un predicado de tipo como tipo de retorno.
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isGender = (gender: string): gender is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(gender);
};

const isDischarge = (discharge: object): discharge is Discharge =>
  typeof discharge === 'object' &&
  discharge !== null &&
  'date' in discharge &&
  'criteria' in discharge &&
  isString(discharge.date) &&
  isString(discharge.criteria);

const isSickLeave = (sickLeave: object): sickLeave is SickLeave =>
  typeof sickLeave === 'object' &&
  sickLeave !== null &&
  'startDate' in sickLeave &&
  'endDate' in sickLeave &&
  isString(sickLeave.startDate) &&
  isString(sickLeave.endDate);

const isHealthCheckRating = (
  healthCheckRating: number
): healthCheckRating is HealthCheckRating => {
  return Object.values(HealthCheckRating)
    .map((v) => Number(v))
    .includes(healthCheckRating);
};

const isEntry = (entry: object): entry is EntryWithoutId => {
  if (
    'type' in entry &&
    'description' in entry &&
    'date' in entry &&
    'specialist' in entry
  ) {
    return true;
  }

  return false;
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

const parseDischarge = (discharge: unknown): Discharge => {
  if (!discharge || typeof discharge !== 'object' || !isDischarge(discharge)) {
    throw new Error('Incorrect discharge');
  }
  return discharge;
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
  if (!sickLeave || typeof sickLeave !== 'object' || !isSickLeave(sickLeave)) {
    throw new Error('Incorrect sickLeave');
  }
  return sickLeave;
};

const parseHealthCheckRating = (
  healthCheckRating: unknown
): HealthCheckRating => {
  if (
    !healthCheckRating ||
    typeof healthCheckRating !== 'number' ||
    !isHealthCheckRating(healthCheckRating)
  ) {
    throw new Error('Incorrect healthCheckRating');
  }
  return healthCheckRating;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
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

const baseEntryFields = (object: any) => ({
  date: parseStringParam(object.date),
  description: parseStringParam(object.description),
  specialist: parseStringParam(object.specialist),
  diagnosisCodes:
    'diagnosisCodes' in object
      ? parseDiagnosisCodes(object.diagnosisCodes)
      : [],
});

export const toNewEntry = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== 'object' || !isEntry(object)) {
    throw new Error('Incorrect or missing data');
  }

  switch (object.type) {
    case 'Hospital':
      if ('discharge' in object) {
        const newEntry: HospitalEntryWithoutId = {
          type: 'Hospital',
          ...baseEntryFields(object),
          discharge: parseDischarge(object.discharge),
        };
        return newEntry;
      }
      throw new Error('Missing discharge');

    case 'HealthCheck':
      if ('healthCheckRating' in object) {
        const newEntry: HealthCheckEntryWithoutId = {
          type: 'HealthCheck',
          ...baseEntryFields(object),
          healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
        };
        return newEntry;
      }
      throw new Error('Missing healthCheckRating');

    case 'OccupationalHealthcare':
      if ('employerName' in object) {
        let newEntry: OccupationalHealthCareEntrywithoutId = {
          type: 'OccupationalHealthcare',
          ...baseEntryFields(object),
          employerName: parseStringParam(object.employerName),
        };
        if ('sickLeave' in object) {
          newEntry.sickLeave = parseSickLeave(object.sickLeave);
        }
        return newEntry;
      }
      throw new Error('Missing employerName');
    default:
      const _exhaustiveCheck: never = object;
      return _exhaustiveCheck;
  }
};

export default toNewPatient;
