import { Message } from '../types/prediction';

export class MessageHistory {
  private messages: Message[] = [];
  private readonly maxSize: number;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  add(user: string, content: string): void {
    this.messages.push({
      user,
      content: content.toLowerCase(),
      timestamp: Date.now()
    });

    if (this.messages.length > this.maxSize) {
      this.messages.shift();
    }
  }

  getLastMessages(count: number = 2): Message[] {
    return this.messages.slice(-count);
  }

  get length(): number {
    return this.messages.length;
  }

  get all(): Message[] {
    return [...this.messages];
  }
}