import { fireEvent, screen, render } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import { CreateTransactionForm } from './CreateTransactionForm';
import { AppContext } from '../contexts/AppContext';

const participants = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
];

describe('CreateTransactionForm', () => {
  it('should allow entering decimal values for total and payer amounts', async () => {
    const handleTransactionAdd = vi.fn();
    const providerProps = {
      selectedGroup: { participants },
      handleTransactionAdd,
    };
    render(<CreateTransactionForm />, {
      wrapper: ({ children }) => (
        <AppContext.Provider value={providerProps}>{children}</AppContext.Provider>
      ),
    });

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

  it('should reset the form after successful submission', async () => {
    const handleTransactionAdd = vi.fn();
    const providerProps = {
      selectedGroup: { participants },
      handleTransactionAdd,
    };
    render(<CreateTransactionForm />, {
      wrapper: ({ children }) => (
        <AppContext.Provider value={providerProps}>{children}</AppContext.Provider>
      ),
    });

    // Fill out the form
    const descriptionInput = screen.getByLabelText('Description');
    await fireEvent.input(descriptionInput, { target: { value: 'Test Transaction' } });

    const totalInput = screen.getByLabelText('Total Amount');
    await fireEvent.input(totalInput, { target: { value: '100' } });

    const payerInputs = screen.getAllByLabelText('Paid by');
    await fireEvent.input(payerInputs[0], { target: { value: '100' } });

    const beneficiaryCheckboxes = screen.getAllByRole('checkbox');
    await fireEvent.click(beneficiaryCheckboxes[1]); // Uncheck Bob

    // Submit the form
    const submitButton = screen.getByText('Add Transaction');
    await fireEvent.click(submitButton);

    // Check that the form is reset
    expect(descriptionInput.value).toBe('');
    expect(totalInput.value).toBe('0');
    expect(payerInputs[0].value).toBe('0');
    expect(beneficiaryCheckboxes[0].checked).toBe(true);
    expect(beneficiaryCheckboxes[1].checked).toBe(true);
  });
});
