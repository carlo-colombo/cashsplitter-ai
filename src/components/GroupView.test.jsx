import { render, screen } from '@testing-library/preact';
import { describe, it, expect } from 'vitest';
import { GroupView } from './GroupView';
import { AppContext } from '../contexts/AppContext';
import { Group } from '../models/Group';

describe('GroupView', () => {
  it('should render the group name', () => {
    const group = new Group('Test Group');
    const providerProps = {
      selectedGroup: group,
      handleBackToGroups: () => {},
      error: null,
      clearError: () => {},
      balances: new Map(),
      settlements: [],
    };
    render(<GroupView />, {
      wrapper: ({ children }) => (
        <AppContext.Provider value={providerProps}>{children}</AppContext.Provider>
      ),
    });

    expect(screen.getByText('Group: Test Group')).toBeInTheDocument();
  });
});
