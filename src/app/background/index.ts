import OpenAI from "openai";
import { defineBackground } from "wxt/sandbox";
import { Message, addMessageListener, sendMessageToActiveTab } from "~/lib/messaging";
import { env } from "~/lib/env";
import { get, set, StorageKey } from "~/lib/localStorage";
import { Language } from "@/types";
import { LANGUAGES } from "~/data/languages";
import { browser } from "wxt/browser";

async function setDefaultLanguage() {
  const language = await get<Language>(StorageKey.LANGUAGE);
  if (!language) {
    set(StorageKey.LANGUAGE, LANGUAGES[0]);
  }
}

const getDefaultInstructions = async () => {
  const language = await get<Language>(StorageKey.LANGUAGE);
  return `
  - Answer only in ${language.label} language.
  - Limit the response to 100–150 words.
  - Be clear, concise, and avoid filler phrases.
  - Your explanation should be simple, yet informative.
  - Don't ask questions, only give answers.
  `.trim();
}

const main = () => {
  console.log(
    "Background service worker is running! Edit `src/app/background` and save to reload.",
  );
  setDefaultLanguage();
  
  browser.action.onClicked.addListener(() => {
    sendMessageToActiveTab(Message.OPEN_CUSTOM_POPUP, '');
  });
};

const openai = new OpenAI({
  apiKey: env.VITE_OPEN_AI_API_KEY,
  dangerouslyAllowBrowser: true,
});
const DEFAULT_MODEL = "gpt-3.5-turbo";

const getAnswer = async (data: { question: string, context: string }) => {
  const instructions = await getDefaultInstructions();
  const prompt = `
You are an assistant that helps users understand unknown words, terms, or abbreviations found in articles.
Task:
- Explain what "${data.question}" means.
- If it's an abbreviation, expand it and explain briefly what it stands for.
- Use this context to improve accuracy: ${data.context}
${instructions}`.trim();
  const response = await openai.responses.create({
    model: DEFAULT_MODEL,
    input: prompt,
  });
  sendMessageToActiveTab(Message.GET_ANSWER, response.output_text);
};

const getClarification = async (data: { 
  originalQuestion: string;
  originalAnswer: string;
  clarificationQuestion: string;
  context: string;
}) => {
  const instructions = await getDefaultInstructions();
  const prompt = `
You are a context-aware assistant continuing a conversation.

Original question: "${data.originalQuestion}"
Original answer: "${data.originalAnswer}"
Clarifying question: "${data.clarificationQuestion}"
Full context: ${data.context}

Instructions:
- Compare the clarifying question with the original question, answer, and context.
- If the clarifying question is logically related to the topic (even implicitly), provide a direct and specific answer to it.
- DO NOT repeat or summarize the original answer or question.
- DO NOT introduce new information beyond what is requested in the clarifying question.
- If the clarifying question is completely unrelated, reply with:
   → "Sorry, I don't know how to answer that."
${instructions}
`.trim();

  const response = await openai.responses.create({
    model: DEFAULT_MODEL,
    input: prompt,
  });

  sendMessageToActiveTab(Message.GET_CLARIFICATION_ANSWER, {
    clarificationQuestion: data.clarificationQuestion,
    answer: response.output_text
  });
};

const getExplainLikeChild = async (data: { 
  question: string;
  context: string;
}) => {
  const instructions = await getDefaultInstructions();
  const prompt = `
You are a friendly teacher explaining complex concepts to a 10-year-old child.

Task:
- Explain what "${data.question}" means in the simplest possible way.
- Use simple words and short sentences.
- Use fun examples and comparisons that a child would understand.
- Make it engaging and friendly.
- If it's an abbreviation, expand it and explain it in a child-friendly way.
- Use this context to improve accuracy: ${data.context}

${instructions}`.trim();

  const response = await openai.responses.create({
    model: DEFAULT_MODEL,
    input: prompt,
  });

  sendMessageToActiveTab(Message.GET_EXPLAIN_LIKE_CHILD_ANSWER, response.output_text);
};

addMessageListener(Message.GET_SELECTION_TEXT, (data) => {
  getAnswer(data);
});

addMessageListener(Message.GET_CLARIFICATION, (data) => {
  getClarification(data);
});

addMessageListener(Message.EXPLAIN_LIKE_CHILD, (data) => {
  getExplainLikeChild(data);
});

export default defineBackground(main);
