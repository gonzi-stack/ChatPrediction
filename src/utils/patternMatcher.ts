import { PredictionPattern } from '../types/prediction';

export class PatternMatcher {
  private patterns: Map<string, PredictionPattern> = new Map();
  private readonly minFrequency: number;

  constructor(minFrequency: number = 2) {
    this.minFrequency = minFrequency;
  }

  updatePattern(trigger: string, response: string): void {
    const pattern = this.patterns.get(trigger) || {
      trigger,
      responses: [],
      frequency: 0
    };

    if (!pattern.responses.includes(response)) {
      pattern.responses.push(response);
    }
    pattern.frequency++;

    this.patterns.set(trigger, pattern);
  }

  findMatches(input: string, maxResults: number = 3): string[] {
    const predictions: string[] = [];
    const seenResponses = new Set<string>();

    // Direct matches
    this.addDirectMatches(input, predictions, seenResponses);
    
    // Fuzzy matches
    this.addFuzzyMatches(input, predictions, seenResponses);

    return predictions.slice(0, maxResults);
  }

  private addDirectMatches(input: string, predictions: string[], seenResponses: Set<string>): void {
    const pattern = this.patterns.get(input);
    if (pattern && pattern.frequency >= this.minFrequency) {
      this.addResponses(pattern.responses, predictions, seenResponses);
    }
  }

  private addFuzzyMatches(input: string, predictions: string[], seenResponses: Set<string>): void {
    this.patterns.forEach((pattern) => {
      if (pattern.trigger.includes(input) || input.includes(pattern.trigger)) {
        this.addResponses(pattern.responses, predictions, seenResponses);
      }
    });
  }

  private addResponses(responses: string[], predictions: string[], seenResponses: Set<string>): void {
    responses.forEach(response => {
      if (!seenResponses.has(response)) {
        predictions.push(response);
        seenResponses.add(response);
      }
    });
  }

  get size(): number {
    return this.patterns.size;
  }
}