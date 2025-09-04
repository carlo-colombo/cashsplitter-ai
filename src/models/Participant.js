export class Participant {
  constructor(name) {
    this.id = crypto.randomUUID();
    this.name = name;
  }
}
