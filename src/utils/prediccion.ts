import { MessageHistory } from './messageHistory';
import { PatternMatcher } from './patternMatcher';
import { PredictionStats } from '../types/prediction';

export class Prediccion {
  private messageHistory: MessageHistory;
  private patternMatcher: PatternMatcher;

  constructor(maxHistorySize: number = 1000, minPatternFrequency: number = 2) {
    this.messageHistory = new MessageHistory(maxHistorySize);
    this.patternMatcher = new PatternMatcher(minPatternFrequency);
  }

  addMessage(user: string, content: string): void {
    this.messageHistory.add(user, content);
    this.updatePatterns();
  }

  private updatePatterns(): void {
    const lastMessages = this.messageHistory.getLastMessages(2);
    if (lastMessages.length < 2) return;

    const [previousMessage, lastMessage] = lastMessages;
    this.patternMatcher.updatePattern(
      previousMessage.content,
      lastMessage.content
    );
  }

  getPredictions(message: string): string[] {
    return this.patternMatcher.findMatches(message.toLowerCase());
  }

  getStats(): PredictionStats {
    return {
      totalMessages: this.messageHistory.length,
      uniquePatterns: this.patternMatcher.size
    };
  }
}