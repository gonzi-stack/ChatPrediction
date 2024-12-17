interface Message {
  user: string;
  content: string;
  timestamp: number;
}

interface PredictionPattern {
  trigger: string;
  responses: string[];
  frequency: number;
}

export class ChatPredictor {
  private patterns: Map<string, PredictionPattern> = new Map();
  private messageHistory: Message[] = [];
  private readonly maxHistorySize = 1000;
  private readonly minPatternFrequency = 2;

  // Add a new message to the history
  addMessage(user: string, content: string): void {
    this.messageHistory.push({
      user,
      content: content.toLowerCase(),
      timestamp: Date.now()
    });

    if (this.messageHistory.length > this.maxHistorySize) {
      this.messageHistory.shift();
    }

    this.updatePatterns();
  }

  // Update pattern recognition based on message history
  private updatePatterns(): void {
    if (this.messageHistory.length < 2) return;

    const lastMessage = this.messageHistory[this.messageHistory.length - 1];
    const previousMessage = this.messageHistory[this.messageHistory.length - 2];

    const pattern = this.patterns.get(previousMessage.content) || {
      trigger: previousMessage.content,
      responses: [],
      frequency: 0
    };

    if (!pattern.responses.includes(lastMessage.content)) {
      pattern.responses.push(lastMessage.content);
    }
    pattern.frequency++;

    this.patterns.set(previousMessage.content, pattern);
  }

  // Get predictions for the given message
  getPredictions(message: string): string[] {
    message = message.toLowerCase();
    const predictions: string[] = [];
    const seenResponses = new Set<string>();

    // Direct pattern matching
    const pattern = this.patterns.get(message);
    if (pattern && pattern.frequency >= this.minPatternFrequency) {
      pattern.responses.forEach(response => {
        if (!seenResponses.has(response)) {
          predictions.push(response);
          seenResponses.add(response);
        }
      });
    }

    // Fuzzy matching for similar patterns
    this.patterns.forEach((p) => {
      if (p.trigger.includes(message) || message.includes(p.trigger)) {
        p.responses.forEach(response => {
          if (!seenResponses.has(response)) {
            predictions.push(response);
            seenResponses.add(response);
          }
        });
      }
    });

    return predictions.slice(0, 3); // Return top 3 predictions
  }

  // Get conversation statistics
  getStats(): { totalMessages: number; uniquePatterns: number } {
    return {
      totalMessages: this.messageHistory.length,
      uniquePatterns: this.patterns.size
    };
  }
}