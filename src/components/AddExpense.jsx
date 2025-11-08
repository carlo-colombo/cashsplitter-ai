import { h } from 'preact';
import { useAppState } from '../context/StateContext';
import { route } from 'preact-router';

const AddExpense = ({ groupId }) => {
  const { groups, handleTransactionAdd } = useAppState();
  const group = groups.find(g => g.id === groupId);

  if (!group) {
    console.error("AddExpense: Group not found");
    return <p>Group not found.</p>;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("AddExpense: Form submitted");

    const form = e.target;
    const amount = parseFloat(form.elements.amount.value);
    const payerId = form.elements.payer.value;
    const beneficiaryIds = Array.from(form.elements.beneficiaries)
      .filter(input => input.checked)
      .map(input => input.value);

    console.log("AddExpense: Form data", { amount, payerId, beneficiaryIds });

    if (isNaN(amount) || amount <= 0 || !payerId || beneficiaryIds.length === 0) {
      console.error("AddExpense: Invalid expense data");
      alert("Invalid expense data. Please check your inputs.");
      return;
    }

    const amountCents = Math.round(amount * 100);
    console.log("AddExpense: Calling handleTransactionAdd with", { groupId, amountCents });

    handleTransactionAdd(groupId, {
      description: "Simple Expense",
      total: amountCents,
      payers: [{ participantId: payerId, amount: amountCents }],
      beneficiaries: beneficiaryIds.map(id => ({ participantId: id })),
    });

    console.log("AddExpense: Navigating back to group detail");
    route(`/group-detail/${groupId}`);
  };

  console.log("AddExpense: Rendering for group", group.name);

  return (
    <section class="section">
      <div class="container">
        <h1 class="title">Add Expense to {group.name}</h1>
        <form id="add-expense-form" onSubmit={handleFormSubmit}>
          <div class="field">
            <label class="label">Amount (€)</label>
            <div class="control">
              <input name="amount" class="input" type="number" placeholder="0.00" min="0.01" step="0.01" required />
            </div>
          </div>
          <div class="field">
            <label class="label">Paid by</label>
            <div class="control">
              <div class="select is-fullwidth">
                <select name="payer">
                  {group.participants.map(p => <option value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">For</label>
            <div class="control">
              {group.participants.map(p => (
                <label class="checkbox">
                  <input name="beneficiaries" type="checkbox" value={p.id} checked />
                  {p.name}
                </label>
              ))}
            </div>
          </div>
          <div class="field is-grouped">
            <div class="control">
              <button class="button is-success" type="submit">Save Expense</button>
            </div>
            <div class="control">
              <button class="button" type="button" onClick={() => route(`/group-detail/${groupId}`)}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddExpense;
