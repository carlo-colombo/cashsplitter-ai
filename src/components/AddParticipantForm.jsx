import { useState, useContext } from 'preact/hooks';
import { AppContext } from '../contexts/AppContext';

export function AddParticipantForm() {
  const { handleParticipantAdd } = useContext(AppContext);
  const [participantName, setParticipantName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (participantName.trim()) {
      handleParticipantAdd(participantName);
      setParticipantName('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div class="field has-addons">
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="New participant name"
            value={participantName}
            onInput={(e) => setParticipantName(e.target.value)}
          />
        </div>
        <div class="control">
          <button class="button is-info" type="submit">
            Add Participant
          </button>
        </div>
      </div>
    </form>
  );
}
