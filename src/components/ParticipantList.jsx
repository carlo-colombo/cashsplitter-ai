export function ParticipantList({ participants, onParticipantRemove }) {
  return (
    <div class="list">
      {participants.map((participant) => (
        <div class="list-item" key={participant.id}>
          <span>{participant.name}</span>
          <button
            class="button is-small is-danger is-outlined"
            onClick={() => onParticipantRemove(participant.id)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
