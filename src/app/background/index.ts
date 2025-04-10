import OpenAI from "openai";
import { defineBackground } from "wxt/sandbox";
import { Message, addMessageListener, sendMessageToActiveTab } from "~/lib/messaging";
import { env } from "~/lib/env";
import { get, StorageKey } from "~/lib/localStorage";
import { Language } from "@/types";

const main = () => {
  console.log(
    "Background service worker is running! Edit `src/app/background` and save to reload.",
  );
};

const openai = new OpenAI({
  apiKey: env.VITE_OPEN_AI_API_KEY,
});

const getAnswer = async (data: { question: string, context: string }) => {
  const language = await get<Language>(StorageKey.LANGUAGE);
  const prompt = `Briefly explain (maximum 100 words) what "${data.question}" means. If it's an abbreviation, expand it. Answer in ${language.label} language. Context: ${data.context}`;
  const response = await openai.responses.create({
    model: "gpt-3.5-turbo",
    input: prompt,
    max_output_tokens: 150,
  });
  sendMessageToActiveTab(Message.GET_ANSWER, response.output_text);
};

addMessageListener(Message.GET_SELECTION_TEXT, (data) => {
  getAnswer(data);
});

export default defineBackground(main);
