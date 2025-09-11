import { useContext } from 'preact/hooks';
import { AppContext } from '../contexts/AppContext';
import { AddParticipantForm } from './AddParticipantForm';
import { ParticipantList } from './ParticipantList';
import { CreateTransactionForm } from './CreateTransactionForm';
import { TransactionList } from './TransactionList';
import { BalanceList } from './BalanceList';
import { SettlementList } from './SettlementList';

export function GroupView() {
  const {
    selectedGroup,
    handleBackToGroups,
    error,
    clearError,
  } = useContext(AppContext);

  if (!selectedGroup) {
    return null;
  }

  const { name } = selectedGroup;

  return (
    <div class="container">
      <section class="section">
        {error && (
          <div class="notification is-danger">
            <button class="delete" onClick={clearError}></button>
            {error}
          </div>
        )}
        <div class="level">
          <div class="level-left">
            <h2 class="title is-4">Group: {name}</h2>
          </div>
          <div class="level-right">
            <button class="button" onClick={handleBackToGroups}>
              Back to Groups
            </button>
          </div>
        </div>

        <div class="columns">
          <div class="column is-one-third">
            <h3 class="title is-5">Participants</h3>
            <AddParticipantForm />
            <div class="mt-4">
              <ParticipantList />
            </div>
            <div class="mt-4">
              <h3 class="title is-5">Add Transaction</h3>
              <CreateTransactionForm />
            </div>
          </div>
          <div class="column">
            <h3 class="title is-5">Transactions</h3>
            <div class="mt-4">
              <TransactionList />
            </div>
            <div class="mt-4">
              <BalanceList />
            </div>
            <div class="mt-4">
              <SettlementList />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
