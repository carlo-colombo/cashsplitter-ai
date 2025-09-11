import { Participant } from './Participant';

export class Group {
  constructor(name) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.participants = [];
    this.transactions = [];
  }

  addParticipant(name) {
    const participant = new Participant(name);
    this.participants.push(participant);
    return participant;
  }

  removeParticipant(participantId) {
    this.participants = this.participants.filter(p => p.id !== participantId);
  }
}
