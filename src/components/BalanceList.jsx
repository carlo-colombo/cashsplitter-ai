export function BalanceList({ balances, participants }) {
  const getParticipantName = (participantId) => {
    const participant = participants.find((p) => p.id === participantId);
    return participant ? participant.name : 'Unknown';
  };

  return (
    <div>
      <h4 class="title is-6">Balances</h4>
      <ul>
        {[...balances.entries()].map(([participantId, balance]) => (
          <li key={participantId}>
            {getParticipantName(participantId)}: {balance.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
