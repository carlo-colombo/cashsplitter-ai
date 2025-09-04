import { useState, useEffect } from 'preact/hooks';

export function CreateTransactionForm({ participants, onTransactionAdd }) {
  const [description, setDescription] = useState('');
  const [total, setTotal] = useState(0);
  const [payers, setPayers] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize payers with default amount 0
    setPayers(participants.map(p => ({ participantId: p.id, amount: 0 })));
    // By default, all participants are beneficiaries
    setBeneficiaries(participants.map(p => p.id));
  }, [participants]);

  const handlePayerChange = (participantId, amount) => {
    const newPayers = payers.map(p =>
      p.participantId === participantId ? { ...p, amount: parseFloat(amount) || 0 } : p
    );
    setPayers(newPayers);
  };

  const handleBeneficiaryChange = (participantId) => {
    const newBeneficiaries = beneficiaries.includes(participantId)
      ? beneficiaries.filter(id => id !== participantId)
      : [...beneficiaries, participantId];
    setBeneficiaries(newBeneficiaries);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payersSum = payers.reduce((sum, p) => sum + p.amount, 0);

    if (Math.abs(payersSum - total) > 0.01) {
      setError(`The sum of payments ($${payersSum.toFixed(2)}) does not match the total amount ($${total.toFixed(2)}).`);
      return;
    }
    if (beneficiaries.length === 0) {
      setError('At least one beneficiary must be selected.');
      return;
    }
    setError('');
    onTransactionAdd({
      description,
      total,
      payers: payers.filter(p => p.amount > 0),
      beneficiaries: beneficiaries.map(id => ({ participantId: id })),
    });
    // Reset form can be improved
    setDescription('');
    setTotal(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div class="notification is-danger">{error}</div>}
      <div class="field">
        <label class="label" for="description">Description</label>
        <div class="control">
          <input class="input" id="description" type="text" value={description} onInput={e => setDescription(e.target.value)} />
        </div>
      </div>
      <div class="field">
        <label class="label" for="total">Total Amount</label>
        <div class="control">
          <input class="input" id="total" type="number" step="any" value={total} onInput={e => setTotal(parseFloat(e.target.value) || 0)} />
        </div>
      </div>

      <div class="field">
        <label class="label" id="paid-by-label">Paid by</label>
        {participants.map(participant => (
          <div class="field has-addons" key={participant.id}>
            <p class="control">
              <a class="button is-static">{participant.name}</a>
            </p>
            <p class="control">
              <input
                class="input"
                type="number"
                step="any"
                aria-labelledby="paid-by-label"
                value={payers.find(p => p.participantId === participant.id)?.amount || 0}
                onInput={e => handlePayerChange(participant.id, e.target.value)}
              />
            </p>
          </div>
        ))}
      </div>

      <div class="field">
        <label class="label">For whom</label>
        {participants.map(participant => (
          <div class="control" key={participant.id}>
            <label class="checkbox">
              <input
                type="checkbox"
                checked={beneficiaries.includes(participant.id)}
                onChange={() => handleBeneficiaryChange(participant.id)}
              />
              {participant.name}
            </label>
          </div>
        ))}
      </div>

      <div class="control">
        <button class="button is-primary" type="submit">Add Transaction</button>
      </div>
    </form>
  );
}
