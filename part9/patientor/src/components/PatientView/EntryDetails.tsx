import {
  Diagnosis,
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthCareEntry,
} from '../../types';

import HealthRatingBar from '../HealthRatingBar';

import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import diagnosesService from '../../services/diagnoses';

import { useEffect, useState } from 'react';

const BaseEntry = (entry: Entry) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  useEffect(() => {
    diagnosesService.getAll().then((data) => setDiagnoses(data));
  }, []);

  return (
    <div>
      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
        {entry.date}
      </Typography>
      {entry.diagnosisCodes ? <ul>
        Diagnoses:{' '}
        {entry.diagnosisCodes?.map((c) => {
          const diagnosis = diagnoses.find((d) => d.code === c);
          const diagnosisName = diagnosis?.name;
          return <li key={c}>{diagnosisName}</li>;
        })}
      </ul> : null}
      <Typography variant='body1'>{entry.description}</Typography>
      <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
        Diagnose by: {entry.specialist}
      </Typography>
    </div>
  );
};

const Hospital = (entry: HospitalEntry) => {
  return (
    <Card variant='outlined'>
      <CardContent>
        <LocalHospitalIcon />
        <BaseEntry {...entry} />
        <Typography variant='body1'>
          Discharge: {entry.discharge.date} {entry.discharge.criteria}
        </Typography>
      </CardContent>
    </Card>
  );
};

const HealthCheck = (entry: HealthCheckEntry) => {
  return (
    <Card variant='outlined'>
      <CardContent>
        <MonitorHeartIcon />
        <BaseEntry {...entry} />
        <HealthRatingBar rating={entry.healthCheckRating} showText={true} />
      </CardContent>
    </Card>
  );
};

const OccupationalHealthcare = (entry: OccupationalHealthCareEntry) => {
  return (
    <Card variant='outlined'>
      <CardContent>
        <WorkIcon />
        <BaseEntry {...entry} />
        <Typography variant='body1'>Employer: {entry.employerName}</Typography>
        {entry.sickLeave ? <Typography variant='body1'>
          Sick Leave: {entry.sickLeave?.startDate} - {entry.sickLeave?.endDate}
        </Typography> : null}
      </CardContent>
    </Card>
  );
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails = (entry: Entry) => {
  switch (entry.type) {
    case 'Hospital':
      return <Hospital {...entry} />;
    case 'HealthCheck':
      return <HealthCheck {...entry} />;
    case 'OccupationalHealthcare':
      return <OccupationalHealthcare {...entry} />;

    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
