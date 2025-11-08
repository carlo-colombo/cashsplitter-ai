/**
 * Calculates the running balances for each member of a group.
 *
 * @param {object} group - The group object, containing participants and transactions.
 * @returns {object} An object mapping participant IDs to their net balance in cents.
 */
export function recalculateGroupBalances(group) {
  const balances = {};
  group.participants.forEach(p => {
    balances[p.id] = 0;
  });

  group.transactions.forEach(t => {
    const numBeneficiaries = t.beneficiaries.length;
    if (numBeneficiaries === 0) return;

    const share = Math.floor(t.total / numBeneficiaries);
    const remainder = t.total % numBeneficiaries;

    t.payers.forEach(payer => {
      balances[payer.participantId] += payer.amount;
    });

    t.beneficiaries.forEach((beneficiary, index) => {
      const isLast = index === numBeneficiaries - 1;
      const beneficiaryShare = isLast ? share + remainder : share;
      balances[beneficiary.participantId] -= beneficiaryShare;
    });
  });

  return balances;
}
