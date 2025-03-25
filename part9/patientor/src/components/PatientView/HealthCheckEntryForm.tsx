import BaseEntryForm from './BaseEntryForm';
import Select, { SelectChangeEvent } from '@mui/material/Select';
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
  MenuItem,
  Typography,
} from '@mui/material';
import { Entry, HealthCheckRating } from '../../types';
import axios from 'axios';

interface Props {
  modalOpen: boolean;
  onCancel: () => void;
  patientId: string;
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  entries: Entry[];
}

const HealthCheckEntryForm = ({
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
  const [rating, setRating] = useState<string>('');
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

  const handleSelectRatingChange = (
    event: SelectChangeEvent<typeof rating>
  ) => {
    const {
      target: { value },
    } = event;
    setRating(value);
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
      let healthCheckRating: number = 0;
      if (rating === 'LowRisk') {
        healthCheckRating = 1;
      } else if (rating === 'HighRisk') {
        healthCheckRating = 2;
      } else if (rating === 'CriticalRisk') {
        healthCheckRating = 3;
      }

      const addedEntry = await patientService.createEntry(patientId, {
        type: 'HealthCheck',
        date,
        description,
        specialist,
        diagnosisCodes: selectedDiagnosisCodes,
        healthCheckRating,
      });
      setEntries(entries.concat(addedEntry));
      setDate('');
      setDescription('');
      setSpecialist('');
      setSelectedDiagnosisCodes([]);
      setRating('');
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
      <DialogTitle>Add a new health check entry</DialogTitle>
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
            Health Check Rating
          </Typography>
          <Select fullWidth onChange={handleSelectRatingChange} value={rating} style={{ margin: '1em 0 1em 0' }}>
            {Object.keys(HealthCheckRating).map((r) => {
              if (isNaN(Number(r))) {
                let optionName: string = '';
                switch (r) {
                  case 'LowRisk':
                    optionName = 'Low Risk';
                    break;
                  case 'HighRisk':
                    optionName = 'High Risk';
                    break;
                  case 'CriticalRisk':
                    optionName = 'Critical Risk';
                    break;

                  default:
                    optionName = r;
                    break;
                }
                return (
                  <MenuItem key={r} value={r}>
                    {optionName}
                  </MenuItem>
                );
              }
            })}
          </Select>
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

export default HealthCheckEntryForm;
