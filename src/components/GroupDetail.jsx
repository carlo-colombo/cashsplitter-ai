import { h } from 'preact';
import { useAppState } from '../context/StateContext';
import { recalculateGroupBalances } from '../logic/projections';
import { Link } from 'preact-router/match';

const GroupDetail = ({ groupId }) => {
  const { groups } = useAppState();
  const group = groups.find(g => g.id === groupId);

  if (!group) {
    return <p>Group not found.</p>;
  }

  const balances = recalculateGroupBalances(group);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount / 100);
  };

  return (
    <section class="section">
      <div class="container">
        <h1 class="title">{group.name}</h1>
        <div class="box" id="balances-summary">
          <h2 class="subtitle">Balances</h2>
          <ul>
            {group.participants.map(p => (
              <li key={p.id}>
                {p.name}: {formatCurrency(balances[p.id] || 0)}
              </li>
            ))}
          </ul>
        </div>
        <Link href={`/group/${groupId}/add-expense`} class="button is-primary">
          Add Expense
        </Link>
      </div>
    </section>
  );
};

export default GroupDetail;
