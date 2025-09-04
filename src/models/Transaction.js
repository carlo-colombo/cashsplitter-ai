export class Transaction {
  constructor(description, total, payers, beneficiaries) {
    this.id = crypto.randomUUID();
    this.date = new Date();
    this.description = description;
    this.total = total;
    this.payers = payers; // [{ participantId, amount }]
    this.beneficiaries = beneficiaries; // [{ participantId }]
  }
}
