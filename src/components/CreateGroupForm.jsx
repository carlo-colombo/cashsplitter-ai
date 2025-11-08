import { useState } from 'preact/hooks';
import { useAppState } from '../context/StateContext';

export function CreateGroupForm() {
  const [groupName, setGroupName] = useState('');
  const [participants, setParticipants] = useState('');
  const { handleGroupCreate } = useAppState();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (groupName.trim()) {
      const participantNames = participants.split(',').map(s => s.trim()).filter(Boolean);
      handleGroupCreate(groupName, participantNames);
      setGroupName('');
      setParticipants('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div class="field">
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="New group name"
            value={groupName}
            onInput={(e) => setGroupName(e.target.value)}
          />
        </div>
      </div>
      <div class="field">
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="Participant names (comma-separated)"
            value={participants}
            onInput={(e) => setParticipants(e.target.value)}
          />
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button class="button is-info" type="submit">
            Create Group
          </button>
        </div>
      </div>
    </form>
  );
}
