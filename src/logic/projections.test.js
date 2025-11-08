import { describe, it, expect } from 'vitest';
import { recalculateGroupBalances } from './projections';

describe('recalculateGroupBalances', () => {
  it('should calculate the correct net balances for a group', () => {
    const group = {
      participants: [
        { id: 'user1', name: 'Alice' },
        { id: 'user2', name: 'Bob' },
      ],
      transactions: [
        {
          total: 1000,
          payers: [{ participantId: 'user1', amount: 1000 }],
          beneficiaries: [
            { participantId: 'user1' },
            { participantId: 'user2' },
          ],
        },
        {
          total: 500,
          payers: [{ participantId: 'user2', amount: 500 }],
          beneficiaries: [{ participantId: 'user2' }],
        },
      ],
    };

    const balances = recalculateGroupBalances(group);

    expect(balances['user1']).toBe(500); // Paid 1000, share was 500
    expect(balances['user2']).toBe(-500); // Paid 500, share was 500 + 500
  });
});
