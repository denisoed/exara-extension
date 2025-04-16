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
  - The response should consist of a maximum of 100-150 words.
  - Provide a clear and concise clarification.
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
});
const DEFAULT_MODEL = "gpt-3.5-turbo";

const getAnswer = async (data: { question: string, context: string }) => {
  const instructions = await getDefaultInstructions();
  const prompt = `Briefly explain what "${data.question}" means. If it's an abbreviation, expand it. Context: ${data.context}`;
  const response = await openai.responses.create({
    model: DEFAULT_MODEL,
    input: prompt,
    instructions,
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
Original question: "${data.originalQuestion}".
Original answer: "${data.originalAnswer}".
Clarification question: "${data.clarificationQuestion}".
Context: ${data.context}.
Rules:
- If the clarifying question has nothing to do with the original question or answer or context, just say that the clarification is off-topic.
`;

  const response = await openai.responses.create({
    model: DEFAULT_MODEL,
    input: prompt,
    instructions,
  });

  sendMessageToActiveTab(Message.GET_CLARIFICATION_ANSWER, {
    clarificationQuestion: data.clarificationQuestion,
    answer: response.output_text
  });
};

addMessageListener(Message.GET_SELECTION_TEXT, (data) => {
  getAnswer(data);
});

addMessageListener(Message.GET_CLARIFICATION, (data) => {
  getClarification(data);
});

export default defineBackground(main);
