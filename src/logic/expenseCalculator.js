export function calculateBalances(transactions, participants) {
  const balances = new Map();

  // Initialize balances for all participants
  for (const participant of participants) {
    balances.set(participant.id, 0);
  }

  for (const transaction of transactions) {
    // Add payments to payers' balances
    for (const payer of transaction.payers) {
      const currentBalance = balances.get(payer.participantId) || 0;
      balances.set(payer.participantId, currentBalance + payer.amount);
    }

    // Subtract costs from beneficiaries' balances
    if (transaction.beneficiaries.length > 0) {
      const costPerBeneficiary = transaction.total / transaction.beneficiaries.length;
      for (const beneficiary of transaction.beneficiaries) {
        const currentBalance = balances.get(beneficiary.participantId) || 0;
        balances.set(beneficiary.participantId, currentBalance - costPerBeneficiary);
      }
    }
  }

  return balances;
}
