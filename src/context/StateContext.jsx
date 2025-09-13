import { createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';
import { Group } from '../models/Group';
import { Transaction } from '../models/Transaction';
import { useLocalStorage } from '../hooks/useLocalStorage';

const StateContext = createContext();

export const StateProvider = ({ children }) => {
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

  const value = {
    groups,
    selectedGroup,
    handleGroupCreate,
    handleGroupSelect,
    handleBackToGroups,
    handleParticipantAdd,
    handleParticipantRemove,
    handleTransactionAdd,
    handleExport,
    handleImport,
  };

  return (
    <StateContext.Provider value={value}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
};
