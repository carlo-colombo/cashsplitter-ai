import { render, fireEvent, screen } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import { CreateGroupForm } from './CreateGroupForm';

describe('CreateGroupForm', () => {
  it('should call onGroupCreate with the new group name', async () => {
    const handleGroupCreate = vi.fn();
    render(<CreateGroupForm onGroupCreate={handleGroupCreate} />);

    const input = screen.getByPlaceholderText('New group name');
    const createButton = screen.getByText('Create Group');

    await fireEvent.input(input, { target: { value: 'New Awesome Group' } });
    await fireEvent.click(createButton);

    expect(handleGroupCreate).toHaveBeenCalledWith('New Awesome Group');
    expect(input.value).toBe('');
  });

  it('should not call onGroupCreate if the group name is empty', async () => {
    const handleGroupCreate = vi.fn();
    render(<CreateGroupForm onGroupCreate={handleGroupCreate} />);

    const createButton = screen.getByText('Create Group');

    await fireEvent.click(createButton);

    expect(handleGroupCreate).not.toHaveBeenCalled();
  });
});
