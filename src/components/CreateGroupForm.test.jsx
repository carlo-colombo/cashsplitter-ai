import { render, fireEvent, screen } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import { CreateGroupForm } from './CreateGroupForm';
import { useAppState } from '../context/StateContext';

vi.mock('../context/StateContext', () => ({
  useAppState: vi.fn(),
}));

describe('CreateGroupForm', () => {
  it('should call handleGroupCreate with the group name and participants', async () => {
    const handleGroupCreate = vi.fn();
    useAppState.mockReturnValue({ handleGroupCreate });

    render(<CreateGroupForm />);

    const groupNameInput = screen.getByPlaceholderText('New group name');
    const participantsInput = screen.getByPlaceholderText('Participant names (comma-separated)');
    const createButton = screen.getByText('Create Group');

    await fireEvent.input(groupNameInput, { target: { value: 'New Awesome Group' } });
    await fireEvent.input(participantsInput, { target: { value: 'Alice, Bob' } });
    await fireEvent.click(createButton);

    expect(handleGroupCreate).toHaveBeenCalledWith('New Awesome Group', ['Alice', 'Bob']);
    expect(groupNameInput.value).toBe('');
    expect(participantsInput.value).toBe('');
  });

  it('should not call onGroupCreate if the group name is empty', async () => {
    const handleGroupCreate = vi.fn();
    useAppState.mockReturnValue({ handleGroupCreate });

    render(<CreateGroupForm />);

    const createButton = screen.getByText('Create Group');

    await fireEvent.click(createButton);

    expect(handleGroupCreate).not.toHaveBeenCalled();
  });
});
