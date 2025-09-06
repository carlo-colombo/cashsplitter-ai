import { render, fireEvent, screen } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import { AddParticipantForm } from './AddParticipantForm';

describe('AddParticipantForm', () => {
  it('should call onParticipantAdd with the new participant name', async () => {
    const handleParticipantAdd = vi.fn();
    render(<AddParticipantForm onParticipantAdd={handleParticipantAdd} />);

    const input = screen.getByPlaceholderText('New participant name');
    const addButton = screen.getByText('Add Participant');

    await fireEvent.input(input, { target: { value: 'John Doe' } });
    await fireEvent.click(addButton);

    expect(handleParticipantAdd).toHaveBeenCalledWith('John Doe');
    expect(input.value).toBe('');
  });

  it('should not call onParticipantAdd if the participant name is empty', async () => {
    const handleParticipantAdd = vi.fn();
    render(<AddParticipantForm onParticipantAdd={handleParticipantAdd} />);

    const addButton = screen.getByText('Add Participant');

    await fireEvent.click(addButton);

    expect(handleParticipantAdd).not.toHaveBeenCalled();
  });
});
