export const schema = {
  type: "object",
  properties: {
    flashcards: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          answer: { type: "string" },
        },
      },
    },
  },
};

export type FlashcardGeneration = {
  flashcards: {
    question: string;
    answer: string;
  }[];
};
