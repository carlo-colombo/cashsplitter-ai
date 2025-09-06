export function BalanceList({ balances, participants }) {
  const getParticipantName = (participantId) => {
    const participant = participants.find((p) => p.id === participantId);
    return participant ? participant.name : 'Unknown';
  };

  return (
    <div class="box">
      <h4 class="title is-6">Balances</h4>
      <ul>
        {[...balances.entries()].map(([participantId, balance]) => (
          <li class={`notification ${balance > 0 ? 'is-success' : 'is-danger'}`} key={participantId}>
            {getParticipantName(participantId)}: {balance.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}
