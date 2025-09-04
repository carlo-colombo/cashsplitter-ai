export function calculateSettlements(balances) {
  const settlements = [];
  const debtors = [];
  const creditors = [];

  for (const [participantId, balance] of balances.entries()) {
    if (balance > 0) {
      creditors.push({ id: participantId, amount: balance });
    } else if (balance < 0) {
      debtors.push({ id: participantId, amount: -balance });
    }
  }

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      from: debtor.id,
      to: creditor.id,
      amount: amount,
    });

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount < 0.01) {
      i++;
    }
    if (creditor.amount < 0.01) {
      j++;
    }
  }

  return settlements;
}
