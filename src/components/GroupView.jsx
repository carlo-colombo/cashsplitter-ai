import { useState, useEffect } from 'preact/hooks';
import { AddParticipantForm } from './AddParticipantForm';
import { ParticipantList } from './ParticipantList';
import { CreateTransactionForm } from './CreateTransactionForm';
import { TransactionList } from './TransactionList';
import { BalanceList } from './BalanceList';
import { SettlementList } from './SettlementList';
import { calculateBalances } from '../logic/expenseCalculator';
import { calculateSettlements } from '../logic/settlementCalculator';

export function GroupView({ group, onBack, onParticipantAdd, onParticipantRemove, onTransactionAdd }) {
  const [balances, setBalances] = useState(new Map());
  const [settlements, setSettlements] = useState([]);

  useEffect(() => {
    const newBalances = calculateBalances(group.transactions, group.participants);
    setBalances(newBalances);

    const newSettlements = calculateSettlements(newBalances);
    setSettlements(newSettlements);
  }, [group]);

  const handleParticipantAdd = (participantName) => {
    if (group.participants.some(p => p.name === participantName)) {
      alert(`Participant "${participantName}" already exists.`);
      return;
    }
    onParticipantAdd(participantName);
  };

  return (
    <div class="container">
      <section class="section">
        <div class="level">
          <div class="level-left">
            <h2 class="title is-4">Group: {group.name}</h2>
          </div>
          <div class="level-right">
            <button class="button" onClick={onBack}>
              Back to Groups
            </button>
          </div>
        </div>

        <div class="columns">
          <div class="column is-one-third">
            <h3 class="title is-5">Participants</h3>
            <AddParticipantForm onParticipantAdd={handleParticipantAdd} />
            <div class="mt-4">
              <ParticipantList participants={group.participants} onParticipantRemove={onParticipantRemove} />
            </div>
            <div class="mt-4">
              <h3 class="title is-5">Add Transaction</h3>
              <CreateTransactionForm participants={group.participants} onTransactionAdd={onTransactionAdd} />
            </div>
          </div>
          <div class="column">
            <h3 class="title is-5">Transactions</h3>
            <div class="mt-4">
              <TransactionList transactions={group.transactions} />
            </div>
            <div class="mt-4">
              <BalanceList balances={balances} participants={group.participants} />
            </div>
            <div class="mt-4">
              <SettlementList settlements={settlements} participants={group.participants} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
