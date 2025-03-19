export enum Gender {
  Female = 'female',
  Male = 'male',
  Other = 'other',
}

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

export enum HealthCheckRating {
  'Healthy' = 0,
  'LowRisk' = 1,
  'HighRisk' = 2,
  'CriticalRisk' = 3,
}

export interface HealthCheckEntry extends BaseEntry {
  type: 'HealthCheck';
  healthCheckRating: HealthCheckRating;
}

export type SickLeave = {
  startDate: string;
  endDate: string;
};

export interface OccupationalHealthCareEntry extends BaseEntry {
  type: 'OccupationalHealthcare';
  employerName: string;
  sickLeave?: SickLeave;
}

export type Discharge = {
  date: string;
  criteria: string;
};

export interface HospitalEntry extends BaseEntry{
  type: 'Hospital';
  discharge: Discharge;
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthCareEntry
  | HealthCheckEntry;

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries?: Entry[];
}

// Define omit especial para uniones
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry sin la propiedad 'id'
export type EntryWithoutId = UnionOmit<Entry, 'id'>;

export type NewPatient = Omit<Patient, 'id'>;

export type HospitalEntryWithoutId = Omit<HospitalEntry, 'id'>
export type HealthCheckEntryWithoutId = Omit<HealthCheckEntry, 'id'>
export type OccupationalHealthCareEntrywithoutId = Omit<OccupationalHealthCareEntry, 'id'>
export type BaseEntrywithoutId = Omit<BaseEntry, 'id'>

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;
