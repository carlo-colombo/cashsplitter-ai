export function TransactionList({ transactions }) {
  return (
    <div class="list">
      {transactions.map((transaction) => (
        <div class="list-item" key={transaction.id}>
          <span>{transaction.description}</span>
          <span>${transaction.total.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}
