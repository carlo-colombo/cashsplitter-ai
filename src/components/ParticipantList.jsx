import { useContext } from 'preact/hooks';
import { AppContext } from '../contexts/AppContext';

export function ParticipantList() {
  const { selectedGroup, handleParticipantRemove } = useContext(AppContext);
  const { participants } = selectedGroup;

  return (
    <div class="list" role="list" data-testid="participant-list">
      {participants.map((participant) => (
        <div class="box" key={participant.id}>
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <p>{participant.name}</p>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <button
                  class="button is-danger"
                  onClick={() => handleParticipantRemove(participant.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
