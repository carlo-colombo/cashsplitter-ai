import { fireEvent, screen, render } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import { CreateGroupForm } from './CreateGroupForm';
import { AppContext } from '../contexts/AppContext';

describe('CreateGroupForm', () => {
  it('should call handleGroupCreate with the new group name', async () => {
    const handleGroupCreate = vi.fn();
    const providerProps = {
      handleGroupCreate,
    };
    render(<CreateGroupForm />, {
      wrapper: ({ children }) => (
        <AppContext.Provider value={providerProps}>{children}</AppContext.Provider>
      ),
    });

    const input = screen.getByPlaceholderText('New group name');
    const createButton = screen.getByText('Create Group');

    await fireEvent.input(input, { target: { value: 'New Awesome Group' } });
    await fireEvent.click(createButton);

    expect(handleGroupCreate).toHaveBeenCalledWith('New Awesome Group');
    expect(input.value).toBe('');
  });

  it('should not call handleGroupCreate if the group name is empty', async () => {
    const handleGroupCreate = vi.fn();
    const providerProps = {
      handleGroupCreate,
    };
    render(<CreateGroupForm />, {
      wrapper: ({ children }) => (
        <AppContext.Provider value={providerProps}>{children}</AppContext.Provider>
      ),
    });

    const createButton = screen.getByText('Create Group');

    await fireEvent.click(createButton);

    expect(handleGroupCreate).not.toHaveBeenCalled();
  });
});
