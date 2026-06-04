export interface DecisionStoreSaveInput {
  traceId: string;
  intent: string;
  score: number;
  territory: string;
  metadata: Record<string, string | number | boolean>;
}

export interface DecisionStore {
  save(input: DecisionStoreSaveInput): void;
}

const decisions: DecisionStoreSaveInput[] = [];

export const decisionStore: DecisionStore & { list(): DecisionStoreSaveInput[] } = {
  save(input: DecisionStoreSaveInput) {
    decisions.push(input);
  },
  list() {
    return [...decisions];
  },
};
