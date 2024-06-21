import { Copy, File, FileText, Globe, MessagesSquare } from "lucide-react";
import { SiOpenai } from "react-icons/si";

export const mission = `
At Study AI our mission is to use AI to make studying easier and efficient rather than using AI to replace studying altogether. 
If you need to create a quiz or flashcards and all you have is a zoom recording of a lecture, or a pdf file of notes, or a link to a website, Study AI can help!
`;

export const featuresPara = `
Study AI includes many different features like file uploading and
link parsing to help students study efficiently.
`;

export const cards = [
  {
    icon: <SiOpenai className="h-8 w-8" />,
    title: "OpenAI",
    description:
      "We use OpenAI's latest LLMs to provide the most accurate and performant generations.",
  },
  {
    icon: <MessagesSquare className="h-8 w-8" />,
    title: "AI Tutor Chatbots",
    description: "AI tutors that you can talk to about any subject.",
  },
  {
    icon: <Copy className="h-8 w-8" />,
    title: "Flashcards",
    description: "AI flashcard set generation. Full UI to study on the go.",
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Quizzes",
    description: "AI multiple quiz quiz generation.",
  },
  {
    icon: <File className="h-8 w-8" />,
    title: "Upload Files",
    description:
      "File handling. Give the AI a txt, pdf, video, or audio file to generate an item of choice.",
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: "Paste Links",
    description:
      "Link handling. Give the AI a link to generate an item of choice.",
  },
];

export const faq = [
  {
    question: "What are the limits?",
    answer: `We currently allow up to ${process.env.GENERATION_LIMIT} generations per month on our hobby plan. A pro plan will be coming soon.`,
  },
  {
    question: "Who are we?",
    answer: (
      <>
        I am{" "}
        <a
          href="https://twitter.com/dzachmcm"
          className="text-primary underline"
        >
          Zach McMullen
        </a>
        . An entrepreneur and current freshman studying CS at Purdue University.
      </>
    ),
  },
  {
    question: "How does it work?",
    answer: `By simply pasting a link, uploading a text, pdf, video, or audio file, or just typing a subject using the latest AI models we can generate you AI tutors, flashcard sets, and quizzes.`,
  },
  {
    question: `What does "Study" mean?`,
    answwer: "Study is the latin for study.",
  },
  {
    question: "How can I get in touch?",
    answer: (
      <>
        We have a{" "}
        <a
          href="https://discord.gg/rCGEZwWUPt"
          className="text-primary underline"
        >
          Discord
        </a>{" "}
        where users can interact with each other, provide feedback and
        suggestions, and get the latest news.
      </>
    ),
  },
  {
    question: "What is the max character length?",
    answer:
      "The max character length is 50,000 characters. Any source longer than this will be shortened accordingly.",
  },
];

export const plans = [
  {
    title: "Hobby",
    description: "Get started now and upgrade once you've reached the limits.",
    generations: process.env.GENERATION_LIMIT,
    price: 0,
    comingSoon: false,
    link: "/dashboard",
  },
  {
    title: "Pro",
    description: "Unlimited generations to meet your study needs.",
    generations: "Unlimited",
    price: "TBA",
    comingSoon: true,
    link: "#",
  },
];
