import diagnosisService from '../../services/diagnoses';

import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { InputLabel, MenuItem, Stack } from '@mui/material';

interface Props {
  selectedDiagnosisCodes: string[];
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSpecialistChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (event: SelectChangeEvent<string[]>) => void;
}

const BaseEntryForm = ({
  selectedDiagnosisCodes,
  handleDateChange,
  handleDescriptionChange,
  handleSpecialistChange,
  handleSelectChange,
}: Props) => {
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  useEffect(() => {
    diagnosisService.getAll().then((data) => {
      const codes: string[] = [];
      data.map((d) => codes.push(d.code));
      setDiagnosisCodes(codes);
    });
  }, []);

  return (
    <Stack spacing={2}>
      <InputLabel id='date-label'>Date:</InputLabel>
      <TextField variant='outlined' type='date' onChange={handleDateChange} />
      <br />
      <InputLabel id='description-label'>Description:</InputLabel>
      <TextField
        variant='outlined'
        type='text'
        onChange={handleDescriptionChange}
      />
      <br />
      <InputLabel id='specialist-label'>Specialist:</InputLabel>
      <TextField
        variant='outlined'
        type='text'
        onChange={handleSpecialistChange}
      />
      <InputLabel id='select-label'>Diagnosis codes:</InputLabel>
      <Select
        multiple
        labelId='select-label'
        value={selectedDiagnosisCodes}
        onChange={handleSelectChange}
      >
        {diagnosisCodes.map((code) => (
          <MenuItem key={code} value={code}>
            {code}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
};

export default BaseEntryForm;
