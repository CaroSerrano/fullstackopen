export enum Gender {
  Female = 'female',
  Male = 'male',
  Other = 'other'
}

export interface Diagnose {
  code: string;
  name: string;
  latin?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Entry {
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries?: Entry[]
}

export type NewPatient = Omit<Patient, 'id'>

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;
