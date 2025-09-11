import { createContext } from 'preact';
import { useState, useMemo } from 'preact/hooks';
import { Group } from '../models/Group';
import { Participant } from '../models/Participant';
import { Transaction } from '../models/Transaction';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateBalances } from '../logic/expenseCalculator';
import { calculateSettlements } from '../logic/settlementCalculator';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [groups, setGroups] = useLocalStorage('groups', []);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [error, setError] = useState(null);

  const selectedGroup = useMemo(() => {
    return groups.find(g => g.id === selectedGroupId) || null;
  }, [groups, selectedGroupId]);

  const balances = useMemo(() => {
    if (!selectedGroup) return new Map();
    return calculateBalances(selectedGroup.transactions || [], selectedGroup.participants || []);
  }, [selectedGroup]);

  const settlements = useMemo(() => {
    if (!selectedGroup) return [];
    const newBalances = calculateBalances(selectedGroup.transactions || [], selectedGroup.participants || []);
    return calculateSettlements(newBalances);
  }, [selectedGroup]);

  const handleGroupCreate = (groupName) => {
    const newGroup = new Group(groupName);
    newGroup.transactions = [];
    setGroups([...groups, newGroup]);
  };

  const handleGroupSelect = (group) => {
    setSelectedGroupId(group.id);
  };

  const handleBackToGroups = () => {
    setSelectedGroupId(null);
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
            const importedGroups = data.groups.map(g => {
                const group = new Group(g.name);
                group.id = g.id;
                group.participants = g.participants || [];
                group.transactions = g.transactions || [];
                return group;
            });
            setGroups(importedGroups);
          }
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          alert('Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const handleParticipantAdd = (participantName) => {
    if (!selectedGroup) return;
    if (selectedGroup.participants.some(p => p.name === participantName)) {
      setError(`Participant "${participantName}" already exists.`);
      return;
    }
    setError(null);
    const newParticipant = new Participant(participantName);
    const updatedGroups = groups.map(group => {
      if (group.id === selectedGroupId) {
        return {
          ...group,
          participants: [...group.participants, newParticipant]
        };
      }
      return group;
    });
    setGroups(updatedGroups);
  };

  const handleParticipantRemove = (participantId) => {
    if (!selectedGroup) return;
    const updatedGroups = groups.map(group => {
      if (group.id === selectedGroupId) {
        return {
          ...group,
          participants: group.participants.filter(p => p.id !== participantId)
        };
      }
      return group;
    });
    setGroups(updatedGroups);
  };

  const handleTransactionAdd = ({ description, total, payers, beneficiaries }) => {
    if (!selectedGroup) return;
    const newTransaction = new Transaction(description, total, payers, beneficiaries);
    const updatedGroups = groups.map(group => {
      if (group.id === selectedGroupId) {
        return {
          ...group,
          transactions: [...(group.transactions || []), newTransaction]
        };
      }
      return group;
    });
    setGroups(updatedGroups);
  };


  const value = {
    groups,
    selectedGroup,
    balances,
    settlements,
    error,
    handleGroupCreate,
    handleGroupSelect,
    handleBackToGroups,
    handleExport,
    handleImport,
    handleParticipantAdd,
    handleParticipantRemove,
    handleTransactionAdd,
    setSelectedGroupId,
    clearError
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
