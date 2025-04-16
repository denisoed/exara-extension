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
  const language = await get<Language>(StorageKey.LANGUAGE);
  const prompt = `Briefly explain (maximum 100 words) what "${data.question}" means. If it's an abbreviation, expand it. Answer only in ${language.label} language. Context: ${data.context}`;
  const response = await openai.responses.create({
    model: DEFAULT_MODEL,
    input: prompt,
    max_output_tokens: 150,
  });
  sendMessageToActiveTab(Message.GET_ANSWER, response.output_text);
};

const getClarification = async (data: { 
  originalQuestion: string;
  originalAnswer: string;
  clarificationQuestion: string;
  context: string;
}) => {
  const language = await get<Language>(StorageKey.LANGUAGE);
  const prompt = `
Original question: "${data.originalQuestion}".
Original answer: "${data.originalAnswer}".
Clarification question: "${data.clarificationQuestion}".
Context: ${data.context}.
Rules:
- Answer only in ${language.label} language.
- Answer in maximum 100 words.
- Please provide a clear and concise clarification.
- If the clarifying question has nothing to do with the original question, just say that the clarification is off-topic.
`;

  const response = await openai.responses.create({
    model: DEFAULT_MODEL,
    input: prompt,
    max_output_tokens: 150,
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
