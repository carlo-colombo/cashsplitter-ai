import { fireEvent, screen, render } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import { AddParticipantForm } from './AddParticipantForm';
import { AppContext } from '../contexts/AppContext';

describe('AddParticipantForm', () => {
  it('should call handleParticipantAdd with the new participant name', async () => {
    const handleParticipantAdd = vi.fn();
    const providerProps = {
      handleParticipantAdd,
    };
    render(<AddParticipantForm />, {
      wrapper: ({ children }) => (
        <AppContext.Provider value={providerProps}>{children}</AppContext.Provider>
      ),
    });

    const input = screen.getByPlaceholderText('New participant name');
    const addButton = screen.getByText('Add Participant');

    await fireEvent.input(input, { target: { value: 'John Doe' } });
    await fireEvent.click(addButton);

    expect(handleParticipantAdd).toHaveBeenCalledWith('John Doe');
    expect(input.value).toBe('');
  });

  it('should not call handleParticipantAdd if the participant name is empty', async () => {
    const handleParticipantAdd = vi.fn();
    const providerProps = {
      handleParticipantAdd,
    };
    render(<AddParticipantForm />, {
      wrapper: ({ children }) => (
        <AppContext.Provider value={providerProps}>{children}</AppContext.Provider>
      ),
    });

    const addButton = screen.getByText('Add Participant');
    await fireEvent.click(addButton);

    expect(handleParticipantAdd).not.toHaveBeenCalled();
  });
});
