import { Patient } from '../../types';

import EntryDetails from './EntryDetails';

import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router';



interface Props {
  patients: Patient[];
}

const PatientView = ({ patients }: Props) => {
  const [errorMessage, setErrorMessage] = useState('');


  const { id } = useParams();
  const patient = patients.find((p) => p.id === id);

  useEffect(() => {
    if (!patient) {
      setErrorMessage(`Unable to find patient with id ${id}`);
      const timer = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [id, patient]);
  if (!patient) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div>
      <h2>
        {patient.name} {patient.gender === 'female' && <FemaleIcon />}
        {patient.gender === 'male' && <MaleIcon />}{' '}
        {patient.gender === 'other' && <TransgenderIcon />}
      </h2>

      <p>{patient.ssn}</p>
      <p>{patient.occupation}</p>
      {patient.entries.length > 0 &&
        patient.entries.map((e) => {
          return (
            <div key={e.id}>
            <EntryDetails  {...e}/>
            </div>
          );
        })}
    </div>
  );
};

export default PatientView;
