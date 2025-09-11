export function ParticipantList({ participants, onParticipantRemove }) {
  return
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
                  onClick={() => onParticipantRemove(participant.id)}
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
