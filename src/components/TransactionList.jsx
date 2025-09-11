export function TransactionList({ transactions }) {
  return (
    <div>
      {transactions.map((transaction) => (
        <div class="box" key={transaction.id}>
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <p>{transaction.description}</p>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <p>${transaction.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
