import { render, fireEvent, screen, waitFor } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import { GroupView } from './GroupView';
import { Group } from '../models/Group';

describe('GroupView', () => {
  it('should not add a participant with a duplicate name', async () => {
    const group = new Group('Test Group');
    group.participants = [{ id: '1', name: 'Alice' }];

    // Mock the alert function
    const alertMock = vi.fn();
    window.alert = alertMock;

    render(<GroupView group={group} onBack={() => {}} />);

    const input = screen.getByPlaceholderText('New participant name');
    const addButton = screen.getByText('Add Participant');

    // Add a participant that already exists
    await fireEvent.input(input, { target: { value: 'Alice' } });
    await fireEvent.click(addButton);

    // Wait for the DOM to update
    await waitFor(() => {
      const participantList = screen.getByTestId('participant-list');
      const participants = participantList.querySelectorAll('.list-item');
      // There should only be one Alice
      expect(participants.length).toBe(1);
    });
  });
});
