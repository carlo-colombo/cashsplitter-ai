import { useState } from 'preact/hooks';
import { Group } from './models/Group';
import { Transaction } from './models/Transaction';
import { CreateGroupForm } from './components/CreateGroupForm';
import { GroupList } from './components/GroupList';
import { GroupView } from './components/GroupView';
import { useLocalStorage } from './hooks/useLocalStorage';
import './app.css';

export function App() {
  const [groups, setGroups] = useLocalStorage('groups', []);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleGroupCreate = (groupName) => {
    const newGroup = new Group(groupName);
    setGroups([...groups, newGroup]);
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
  };

  const handleBackToGroups = () => {
    setSelectedGroup(null);
  };

  const handleParticipantAdd = (groupId, participantName) => {
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        // In a real app, you might want to use a more robust way to
        // update the group, e.g., by creating a new Group instance.
        const updatedParticipants = [...group.participants, { id: crypto.randomUUID(), name: participantName }];
        return { ...group, participants: updatedParticipants };
      }
      return group;
    });
    setGroups(updatedGroups);
    setSelectedGroup(updatedGroups.find(g => g.id === groupId));
  };

  const handleParticipantRemove = (groupId, participantId) => {
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        const updatedParticipants = group.participants.filter(p => p.id !== participantId);
        return { ...group, participants: updatedParticipants };
      }
      return group;
    });
    setGroups(updatedGroups);
    setSelectedGroup(updatedGroups.find(g => g.id === groupId));
  };

  const handleTransactionAdd = (groupId, { description, total, payers, beneficiaries }) => {
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        const newTransaction = new Transaction(description, total, payers, beneficiaries);
        const updatedTransactions = [...group.transactions, newTransaction];
        return { ...group, transactions: updatedTransactions };
      }
      return group;
    });
    setGroups(updatedGroups);
    setSelectedGroup(updatedGroups.find(g => g.id === groupId));
  };

  const handleExport = () => {
    const data = JSON.stringify({ groups }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expense-splitter-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.groups) {
            // A more sophisticated merge logic could be implemented here.
            // For now, we just replace the data.
            setGroups(data.groups);
          }
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          alert('Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };


  if (selectedGroup) {
    return <GroupView
      group={selectedGroup}
      onBack={handleBackToGroups}
      onParticipantAdd={(participantName) => handleParticipantAdd(selectedGroup.id, participantName)}
      onParticipantRemove={(participantId) => handleParticipantRemove(selectedGroup.id, participantId)}
      onTransactionAdd={(transaction) => handleTransactionAdd(selectedGroup.id, transaction)}
    />;
  }

  return (
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-half">
          <section class="section">
            <h1 class="title">Expense Splitter</h1>
            <p class="subtitle">
              Create groups and split expenses with your friends.
            </p>
            <div class="buttons">
              <button class="button is-primary" onClick={handleExport}>
                Export Data
              </button>
              <div class="file is-primary">
                <label class="file-label">
                  <input class="file-input" type="file" name="resume" onChange={handleImport} accept=".json" />
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fas fa-upload"></i>
                    </span>
                    <span class="file-label">
                      Import Data
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </section>
          <section class="section">
            <h2 class="title is-4">My Groups</h2>
            <CreateGroupForm onGroupCreate={handleGroupCreate} />
            <div class="mt-4">
              <GroupList groups={groups} onGroupSelect={handleGroupSelect} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
