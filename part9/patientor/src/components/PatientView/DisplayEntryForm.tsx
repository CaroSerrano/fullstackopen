import { Entry } from '../../types';
import HospitalEntryForm from './HospitalEntryForm';

interface EntryFormProps {
  modalOpen: boolean;
  onClose: () => void;
  selectedEntryForm: string;
  patientId: string;
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  entries: Entry[];
}

const DisplayEntryForm = ({
  modalOpen,
  onClose,
  selectedEntryForm,
  patientId,
  setEntries,
  entries,
}: EntryFormProps) => {
  switch (selectedEntryForm) {
    case 'Hospital':
      return (
        <HospitalEntryForm
          modalOpen={modalOpen}
          onCancel={onClose}
          patientId={patientId}
          setEntries={setEntries}
          entries={entries}
        />
      );
    case 'HealthCheck':
      break;
    case 'OccupationalHealthCare':
      break;

    default:
      return null;
  }
};

export default DisplayEntryForm;
