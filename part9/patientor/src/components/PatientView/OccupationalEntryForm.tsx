import BaseEntryForm from './BaseEntryForm';
import { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';
import patientService from '../../services/patients';
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material';
import { Entry, SickLeave } from '../../types';
import axios from 'axios';

interface Props {
  modalOpen: boolean;
  onCancel: () => void;
  patientId: string;
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  entries: Entry[];
}

const OccupationalEntryForm = ({
  modalOpen,
  onCancel,
  patientId,
  setEntries,
  entries,
}: Props) => {
  const [selectedDiagnosisCodes, setSelectedDiagnosisCodes] = useState<
    string[]
  >([]);
  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');
  const [employerName, setEmployerName] = useState<string>('');
  const [sickLeaveStart, setSickLeaveStart] = useState<string>('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSelectChange = (
    event: SelectChangeEvent<typeof selectedDiagnosisCodes>
  ) => {
    const {
      target: { value },
    } = event;
    setSelectedDiagnosisCodes(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleEmployerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployerName(e.target.value);
  };

  const handleSickLeaveStartChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSickLeaveStart(e.target.value);
  };

  const handleSickLeaveEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSickLeaveEnd(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleDecriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleSpecialistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpecialist(e.target.value);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const sickLeave: SickLeave = {
        startDate: sickLeaveStart,
        endDate: sickLeaveEnd,
      };
      const addedEntry = await patientService.createEntry(patientId, {
        type: 'OccupationalHealthcare',
        date,
        description,
        specialist,
        diagnosisCodes: selectedDiagnosisCodes,
        employerName,
        sickLeave,
      });
      setEntries(entries.concat(addedEntry));
      setDate('');
      setDescription('');
      setSpecialist('');
      setSelectedDiagnosisCodes([]);
      setEmployerName('');
      onCancel();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === 'string') {
          const message = e.response.data.replace(
            'Something went wrong. Error: ',
            ''
          );
          console.error(message);
          setError(message);
        } else {
          setError('Unrecognized axios error');
        }
      } else {
        console.error('Unknown error', e);
        setError('Unknown error');
      }
    }
  };

  return (
    <Dialog fullWidth={true} open={modalOpen} onClose={() => onCancel()}>
      <DialogTitle>Add a new occupational health care entry</DialogTitle>
      <Divider />
      <DialogContent style={{ margin: '1em' }}>
        {error && <Alert severity='error'>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <BaseEntryForm
            selectedDiagnosisCodes={selectedDiagnosisCodes}
            handleDateChange={handleDateChange}
            handleDescriptionChange={handleDecriptionChange}
            handleSpecialistChange={handleSpecialistChange}
            handleSelectChange={handleSelectChange}
          />
          <br />

          <InputLabel>Employer name: </InputLabel>
          <TextField
            fullWidth
            variant='outlined'
            value={employerName}
            onChange={handleEmployerNameChange}
          />

          <Divider />
          <br />
          <Typography variant='h6' style={{ justifySelf: 'center' }}>
            Sick Leave
          </Typography>
          <InputLabel>Start Date: </InputLabel>
          <TextField
            variant='outlined'
            type='date'
            value={sickLeaveStart}
            onChange={handleSickLeaveStartChange}
            fullWidth
            style={{ margin: '1em 0 1em 0' }}
          />
          <InputLabel>End Date: </InputLabel>
          <TextField
            variant='outlined'
            type='date'
            value={sickLeaveEnd}
            onChange={handleSickLeaveEndChange}
            fullWidth
            style={{ margin: '1em 0 1em 0' }}
          />
          <br />
          <Grid>
            <Grid item>
              <Button
                color='secondary'
                variant='contained'
                style={{ float: 'left' }}
                type='button'
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                style={{
                  float: 'right',
                }}
                type='submit'
                variant='contained'
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OccupationalEntryForm;
