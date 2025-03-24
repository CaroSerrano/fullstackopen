import TextField from '@mui/material/TextField';
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
  Typography,
} from '@mui/material';
import { Entry } from '../../types';
import axios from 'axios';

interface Props {
  modalOpen: boolean;
  onCancel: () => void;
  patientId: string;
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  entries: Entry[];
}

const HospitalEntryForm = ({
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
  const [dischargeDate, setDischargeDate] = useState<string>('');
  const [dischargeCriteria, setDischargeCriteria] = useState<string>('');
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
    const discharge = {
      date: dischargeDate,
      criteria: dischargeCriteria,
    };
    try {
      const addedEntry = await patientService.createEntry(patientId, {
        type: 'Hospital',
        date,
        description,
        specialist,
        diagnosisCodes: selectedDiagnosisCodes,
        discharge,
      });
      setEntries(entries.concat(addedEntry));
      setDate('');
      setDescription('');
      setSpecialist('');
      setDischargeCriteria('');
      setDischargeDate('');
      setSelectedDiagnosisCodes([]);
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
      <DialogTitle>Add a new hospital entry</DialogTitle>
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

          <Divider />
          <br />
          <Typography variant='h6' style={{ justifySelf: 'center' }}>
            Discharge
          </Typography>
          <InputLabel id='date-label'>Date:</InputLabel>
          <TextField
            variant='outlined'
            fullWidth
            style={{ margin: '1em 0 1em 0' }}
            type='date'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDischargeDate(e.target.value)
            }
          />
          <InputLabel id='criteria-label'>Criteria:</InputLabel>
          <TextField
            fullWidth
            variant='outlined'
            style={{ margin: '1em 0 1em 0' }}
            type='text'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDischargeCriteria(e.target.value)
            }
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

export default HospitalEntryForm;
