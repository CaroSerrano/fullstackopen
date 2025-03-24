import { Entry, Patient } from '../../types';

import EntryDetails from './EntryDetails';
import DisplayEntryForm from './DisplayEntryForm';

import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

interface Props {
  patients: Patient[];
}

const PatientView = ({ patients }: Props) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedEntryForm, setSelectedEntryForm] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [disableButton, setDisableButton] = useState<boolean>(true);

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const { id } = useParams();
  const patient = patients.find((p) => p.id === id);

  useEffect(() => {
    if (!patient) {
      setError(`Unable to find patient with id ${id}`);
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
    setEntries(patient?.entries);
  }, [id, patient]);

  useEffect(() => {
    if (patient) {
      setEntries(patient?.entries);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patients]);

  if (!patient) {
    return <p>{error}</p>;
  }

  const handleSelectChange = (
    event: SelectChangeEvent<typeof selectedEntryForm>
  ) => {
    setDisableButton(false);
    setSelectedEntryForm(event.target.value);
  };

  return (
    <div>
      <h2>
        {patient.name} {patient.gender === 'female' && <FemaleIcon />}
        {patient.gender === 'male' && <MaleIcon />}{' '}
        {patient.gender === 'other' && <TransgenderIcon />}
      </h2>

      <p>{patient.ssn}</p>
      <p>{patient.occupation}</p>

      <Stack spacing={2}>
        <h3>Add new entry</h3>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id='select-label'>Select entry type</InputLabel>
          <Select
            labelId='select-label'
            value={selectedEntryForm}
            displayEmpty
            onChange={handleSelectChange}
          >
            <MenuItem value='Hospital'>Hospital</MenuItem>
            <MenuItem value='HealthCheck'>Heath Check</MenuItem>
            <MenuItem value='OccupationalHealthCare'>
              Occupational Health Care
            </MenuItem>
          </Select>
        </FormControl>
        <DisplayEntryForm
          modalOpen={modalOpen}
          onClose={closeModal}
          patientId={patient.id}
          selectedEntryForm={selectedEntryForm}
          entries={entries}
          setEntries={setEntries}
        />
        <Button
          variant='contained'
          onClick={() => openModal()}
          disabled={disableButton}
        >
          Add New Entry
        </Button>
      </Stack>

      <br />
      <div>
        <h3>Entries</h3>
        {entries.length > 0 &&
          entries.map((e) => {
            return (
              <div key={e.id}>
                <EntryDetails {...e} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PatientView;
