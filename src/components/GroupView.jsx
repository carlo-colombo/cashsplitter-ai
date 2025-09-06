import { useState, useEffect } from 'preact/hooks';
import { AddParticipantForm } from './AddParticipantForm';
import { ParticipantList } from './ParticipantList';
import { CreateTransactionForm } from './CreateTransactionForm';
import { TransactionList } from './TransactionList';
import { BalanceList } from './BalanceList';
import { SettlementList } from './SettlementList';
import { Transaction } from '../models/Transaction';
import { calculateBalances } from '../logic/expenseCalculator';
import { calculateSettlements } from '../logic/settlementCalculator';

export function GroupView({ group, onBack }) {
  const [participants, setParticipants] = useState(group.participants);
  const [transactions, setTransactions] = useState([]);
  const [balances, setBalances] = useState(new Map());
  const [settlements, setSettlements] = useState([]);

  useEffect(() => {
    const newBalances = calculateBalances(transactions, participants);
    setBalances(newBalances);

    const newSettlements = calculateSettlements(newBalances);
    setSettlements(newSettlements);
  }, [transactions, participants]);

  const handleParticipantAdd = (participantName) => {
    const newParticipant = { id: crypto.randomUUID(), name: participantName };
    setParticipants([...participants, newParticipant]);
  };

  const handleParticipantRemove = (participantId) => {
    setParticipants(participants.filter(p => p.id !== participantId));
  };

  const handleTransactionAdd = ({ description, total, payers, beneficiaries }) => {
    const newTransaction = new Transaction(description, total, payers, beneficiaries);
    setTransactions([...transactions, newTransaction]);
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
              <ParticipantList participants={participants} onParticipantRemove={handleParticipantRemove} />
            </div>
            <div class="mt-4">
              <h3 class="title is-5">Add Transaction</h3>
              <CreateTransactionForm participants={participants} onTransactionAdd={handleTransactionAdd} />
            </div>
          </div>
          <div class="column">
            <h3 class="title is-5">Transactions</h3>
            <div class="mt-4">
              <TransactionList transactions={transactions} />
            </div>
            <div class="mt-4">
              <BalanceList balances={balances} participants={participants} />
            </div>
            <div class="mt-4">
              <SettlementList settlements={settlements} participants={participants} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
