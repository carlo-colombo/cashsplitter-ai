/**
 * Creates a balanced, double-entry transaction for a simple expense.
 * The number of postings will be the number of beneficiaries + 3.
 *
 * This function generates the following postings:
 * - A debit to each beneficiary's liability account for their share.
 * - A credit to the payer's asset account for the total amount.
 * - A balancing debit and credit to a clearing account.
 *
 * @param {number} amountCents - The total expense amount in cents.
 * @param {string} payerId - The ID of the user who paid.
 * @param {string[]} beneficiaryIds - An array of user IDs who benefited from the expense.
 * @returns {object[]} An array of ledger posting objects.
 */
export function createExpenseTransaction(amountCents, payerId, beneficiaryIds) {
  const postings = [];
  const numBeneficiaries = beneficiaryIds.length;
  if (numBeneficiaries === 0 || amountCents <= 0) {
    return postings;
  }

  const share = Math.floor(amountCents / numBeneficiaries);
  const remainder = amountCents % numBeneficiaries;

  // 1. Debit each beneficiary's liability account for their share.
  // The last beneficiary is assigned the remainder to ensure the total is correct.
  beneficiaryIds.forEach((id, index) => {
    const isLast = index === numBeneficiaries - 1;
    const beneficiaryShare = isLast ? share + remainder : share;
    postings.push({
      account: `Liabilities:Users:${id}`,
      amount: beneficiaryShare,
      type: 'debit',
    });
  });

  // 2. Credit the payer's asset account for the full amount.
  postings.push({
    account: `Assets:Users:${payerId}`,
    amount: amountCents,
    type: 'credit',
  });

  // 3. The balancing entries for the clearing account.
  // These ensure that the sum of all debits equals the sum of all credits in the transaction.
  postings.push({
    account: 'Expenses:Clearing',
    amount: amountCents,
    type: 'debit',
  });
  postings.push({
    account: 'Expenses:Clearing',
    amount: amountCents,
    type: 'credit',
  });

  return postings;
}
