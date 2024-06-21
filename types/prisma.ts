import { Prisma } from "@prisma/client";

export type ExtendedFlashcardSet = Prisma.FlashcardSetGetPayload<{
  include: {
    flashcards: true;
  };
}>;

export type ExtendedQuiz = Prisma.QuizGetPayload<{
  include: {
    questions: true;
    attempts: true;
  };
}>;

export type ExtendedTutor = Prisma.TutorGetPayload<{
  include: {
    messages: true;
  };
}>;

export type ExtendedAttempt = Prisma.AttemptGetPayload<{
  include: {
    quiz: {
      include: {
        questions: true;
      };
    };
  };
}>;

export type ExtendedUser = Prisma.UserGetPayload<{
  include: {
    quizAttempts: {
      include: {
        quiz: true;
      };
    };
    flashcardSets: true;
    tutors: true;
    generations: true;
  };
}>;
