import { render, fireEvent, screen, waitFor } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import { GroupView } from './GroupView';
import { Group } from '../models/Group';
import { useAppState } from '../context/StateContext';

vi.mock('../context/StateContext', () => ({
  useAppState: vi.fn(),
}));

describe('GroupView', () => {
  it('should not add a participant with a duplicate name', async () => {
    const group = new Group('Test Group');
    group.participants = [{ id: '1', name: 'Alice' }];

    useAppState.mockReturnValue({
      groups: [group],
      handleBackToGroups: vi.fn(),
      handleParticipantAdd: vi.fn(),
      handleParticipantRemove: vi.fn(),
      handleTransactionAdd: vi.fn(),
    });

    // Mock the alert function
    const alertMock = vi.fn();
    window.alert = alertMock;

    render(<GroupView groupId={group.id} />);

    const input = screen.getByPlaceholderText('New participant name');
    const addButton = screen.getByText('Add Participant');

    // Add a participant that already exists
    await fireEvent.input(input, { target: { value: 'Alice' } });
    await fireEvent.click(addButton);

    expect(alertMock).toHaveBeenCalledWith('Participant "Alice" already exists.');
  });
});
