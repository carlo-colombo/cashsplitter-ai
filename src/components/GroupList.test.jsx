import { render, fireEvent, screen } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import { GroupList } from './GroupList';
import { useAppState } from '../context/StateContext';
import { Group } from '../models/Group';

vi.mock('../context/StateContext', () => ({
  useAppState: vi.fn(),
}));

describe('GroupList', () => {
  it('should call handleGroupDelete when delete button is clicked and confirmed', () => {
    const groups = [new Group('Test Group 1'), new Group('Test Group 2')];
    const handleGroupDelete = vi.fn();
    const handleGroupSelect = vi.fn();

    useAppState.mockReturnValue({
      groups,
      handleGroupSelect,
      handleGroupDelete,
    });

    window.confirm = vi.fn(() => true);

    render(<GroupList />);

    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this group?');
    expect(handleGroupDelete).toHaveBeenCalledWith(groups[0].id);
  });
});
