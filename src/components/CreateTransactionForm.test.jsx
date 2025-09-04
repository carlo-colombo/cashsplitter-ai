import { render, fireEvent, screen } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import { CreateTransactionForm } from './CreateTransactionForm';

describe('CreateTransactionForm', () => {
  const participants = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
  ];

  it('should allow entering decimal values for total and payer amounts', async () => {
    const handleTransactionAdd = vi.fn();
    render(
      <CreateTransactionForm
        participants={participants}
        onTransactionAdd={handleTransactionAdd}
      />
    );

    const totalInput = screen.getByLabelText('Total Amount');
    await fireEvent.input(totalInput, { target: { value: '123.45' } });

    // Find the input for the first participant
    const payerInputs = screen.getAllByLabelText('Paid by');
    const alicePayerInput = payerInputs[0];
    await fireEvent.input(alicePayerInput, { target: { value: '123.45' } });

    // Check if the state is updated correctly by checking the input's value
    expect(totalInput.value).toBe('123.45');
    expect(alicePayerInput.value).toBe('123.45');

    // Submit the form
    const submitButton = screen.getByText('Add Transaction');
    await fireEvent.click(submitButton);

    // Check if the onTransactionAdd callback was called with the correct values
    expect(handleTransactionAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        total: 123.45,
        payers: expect.arrayContaining([
          expect.objectContaining({ amount: 123.45 }),
        ]),
      })
    );
  });
});
