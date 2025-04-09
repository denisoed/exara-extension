import { StorageKey, getStorage } from "@/lib/storage";
import OpenAI from "openai";
import { defineBackground } from "wxt/sandbox";
import { Message, onMessage, sendMessageToActiveTab } from "~/lib/messaging";
import { env } from "~/lib/env";

const main = () => {
  console.log(
    "Background service worker is running! Edit `src/app/background` and save to reload.",
  );
};

const openai = new OpenAI({
  apiKey: env.VITE_OPEN_AI_API_KEY,
});

const getAnswer = async (selectedText: string) => {
  const prompt = `Briefly explain (maximum 100 words) what "${selectedText}" means. If it's an abbreviation, expand it. Answer in Russian.`;
  const response = await openai.responses.create({
    model: "gpt-4o",
    input: prompt,
    max_output_tokens: 150,
  });
  sendMessageToActiveTab(Message.GET_ANSWER, response.output_text);
};

onMessage(Message.USER, () => {
  const storage = getStorage(StorageKey.USER);
  return storage.getValue();
});

onMessage(Message.GET_SELECTION_TEXT, (response) => {
  getAnswer(response.data);
});

export default defineBackground(main);
