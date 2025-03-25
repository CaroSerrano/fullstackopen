import { Entry } from '../../types';
import HealthCheckEntryForm from './HealthCheckEntryForm';
import HospitalEntryForm from './HospitalEntryForm';
import OccupationalEntryForm from './OccupationalEntryForm';

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
      return (
        <HealthCheckEntryForm
          modalOpen={modalOpen}
          onCancel={onClose}
          patientId={patientId}
          setEntries={setEntries}
          entries={entries}
        />
      );
    case 'OccupationalHealthCare':
      return (
        <OccupationalEntryForm
          modalOpen={modalOpen}
          onCancel={onClose}
          patientId={patientId}
          setEntries={setEntries}
          entries={entries}
        />
      );

    default:
      return null;
  }
};

export default DisplayEntryForm;
