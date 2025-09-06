export function SettlementList({ settlements, participants }) {
  const getParticipantName = (participantId) => {
    const participant = participants.find((p) => p.id === participantId);
    return participant ? participant.name : 'Unknown';
  };

  if (settlements.length === 0) {
    return <p>All debts are settled!</p>;
  }

  return (
    <div class="box">
      <h4 class="title is-6">Suggested Settlements</h4>
      <ul>
        {settlements.map((settlement, index) => (
          <li class="notification is-info" key={index}>
            {getParticipantName(settlement.from)} owes {getParticipantName(settlement.to)}{' '}
            <strong>${settlement.amount.toFixed(2)}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
