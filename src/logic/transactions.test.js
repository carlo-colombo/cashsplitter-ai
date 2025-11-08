import { describe, it, expect } from 'vitest';
import { createExpenseTransaction } from './transactions';

describe('createExpenseTransaction', () => {
  it('should create a balanced transaction for a simple expense with equal split', () => {
    const amountCents = 1000;
    const payerId = 'user1';
    const beneficiaryIds = ['user1', 'user2'];
    const postings = createExpenseTransaction(amountCents, payerId, beneficiaryIds);

    const debits = postings.filter(p => p.type === 'debit').reduce((sum, p) => sum + p.amount, 0);
    const credits = postings.filter(p => p.type === 'credit').reduce((sum, p) => sum + p.amount, 0);

    expect(debits).toBe(credits);
    expect(debits).toBe(2000); // 1000 for liabilities, 1000 for clearing
  });

  it('should handle rounding correctly for non-divisible splits', () => {
    const amountCents = 100;
    const payerId = 'user1';
    const beneficiaryIds = ['user1', 'user2', 'user3'];
    const postings = createExpenseTransaction(amountCents, payerId, beneficiaryIds);

    const debits = postings.filter(p => p.type === 'debit').reduce((sum, p) => sum + p.amount, 0);
    const credits = postings.filter(p => p.type === 'credit').reduce((sum, p) => sum + p.amount, 0);

    expect(debits).toBe(credits);

    const liabilityPostings = postings.filter(p => p.account.startsWith('Liabilities'));
    expect(liabilityPostings.length).toBe(3);
    expect(liabilityPostings[0].amount).toBe(33);
    expect(liabilityPostings[1].amount).toBe(33);
    expect(liabilityPostings[2].amount).toBe(34);
  });
});
