export const schema = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          possibleAnswers: {
            type: "array",
            items: { type: "string" },
            minItems: 5,
            maxItems: 5,
          },
          correctAnswer: { type: "string" },
        },
      },
    },
  },
};

export type QuizGeneration = {
  questions: {
    question: string;
    possibleAnswers: string[];
    correctAnswer: string;
  }[];
};
