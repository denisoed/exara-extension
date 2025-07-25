import type {
  ClarificationMessageData,
  ExplainSimplerMessageData,
  ExplanationStyle,
  Language,
  MessageData,
  SelectionTextMessageData,
} from "@/types";
import { browser } from "wxt/browser";
import { defineBackground } from "wxt/sandbox";
import { LANGUAGES } from "~/data/languages";
import { fetchToOpenAI } from "~/lib/fetcher";
import { StorageKey, get, remove, set } from "~/lib/localStorage";
import {
  Message,
  addMessageListener,
  sendMessageToActiveTab,
} from "~/lib/messaging";

const stylePrompts = {
  child: `
You are a friendly teacher explaining complex concepts to a 5-year-old child.
Use simple words, fun examples, and comparisons that a child would understand.
Make it engaging and friendly.`,
  student: `
You are a university professor explaining concepts to a first-year student.
Use clear academic language, provide context, and explain fundamental principles.
Include relevant examples and analogies.`,
  beginner: `
You are explaining complex concepts to someone who has no prior knowledge of the topic.
Always use real-life analogies and everyday examples that anyone can relate to.
For example, when explaining technical concepts:
- REST API can be compared to a restaurant where the waiter (API) takes orders (requests) and brings food (responses)
- Database can be compared to a library where books (data) are organized and stored
- Cache can be compared to a notepad where you write down frequently used information
Make the explanation relatable and easy to understand using such analogies.
`.trim(),
  analogy: `
You are a master of metaphors and analogies.
Your task is to explain concepts exclusively through real-life analogies.
For every concept you explain:
- Provide at least 2-3 different practical analogies from everyday life
- Use objects, situations, and experiences that most people are familiar with
- Draw connections between abstract concepts and tangible, everyday experiences
- Make complex ideas accessible through these relatable comparisons

For example:
- Explain algorithms like cooking recipes with specific steps and ingredients
- Compare computer memory to different types of storage in a house (drawers vs garage)
- Describe encryption like sending a locked box where only the recipient has the key

Focus entirely on the analogies rather than technical explanations.
`.trim(),
};

async function setDefaultLanguage() {
  const language = await get<Language>(StorageKey.LANGUAGE);
  if (!language) {
    set(StorageKey.LANGUAGE, LANGUAGES[0]);
  }
}

async function getToken() {
  return await get<string>(StorageKey.TOKEN);
}

async function getCurrentStyle() {
  // Try to get from storage if not in memory
  const savedStyle = await get<ExplanationStyle>(StorageKey.EXPLANATION_STYLE);
  if (savedStyle) {
    return savedStyle;
  }

  // With no style if not set
  return "";
}

async function setCurrentStyle(style: ExplanationStyle) {
  await set(StorageKey.EXPLANATION_STYLE, style);
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
};

const getAnswer = async (data: SelectionTextMessageData) => {
  const instructions = await getDefaultInstructions();
  const token = await getToken();
  await remove(StorageKey.EXPLANATION_STYLE);
  const prompt = `
You are an assistant that helps users understand unknown words, terms, or abbreviations found in articles.
Task:
- Explain what "${data.question}" means.
- If it's an abbreviation, expand it and explain briefly what it stands for.
- Use the following context to improve accuracy, but DO NOT mention or refer to this context in your explanation: ${data.context}
- Focus only on explaining the term/word/abbreviation directly without mentioning where this information comes from.
${instructions}`.trim();
  const response = await fetchToOpenAI(prompt, token);
  if (response?.status === "error") {
    sendMessageToActiveTab(Message.LIMIT_REACHED, {});
  } else {
    sendMessageToActiveTab(Message.GET_ANSWER, response.content);
  }
};

const getClarification = async (data: ClarificationMessageData) => {
  const instructions = await getDefaultInstructions();
  const token = await getToken();

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

  const response = await fetchToOpenAI(prompt, token);
  sendMessageToActiveTab(Message.GET_CLARIFICATION_ANSWER, {
    clarificationQuestion: data.clarificationQuestion,
    answer: response.content,
  });
};

const getExplainSimpler = async (data: ExplainSimplerMessageData) => {
  const instructions = await getDefaultInstructions();
  const token = await getToken();

  // Save the selected style for future use
  await setCurrentStyle(data.style);

  const prompt = `
${stylePrompts[data.style]}

Task:
- Explain what "${data.question}" means.
- If it's an abbreviation, expand it and explain it appropriately.
- Use the following context to improve accuracy, but DO NOT mention or refer to this context in your explanation: ${data.context}
- Focus only on explaining the term/word/abbreviation directly without mentioning where this information comes from.

${instructions}`.trim();

  const response = await fetchToOpenAI(prompt, token);

  sendMessageToActiveTab(Message.GET_EXPLAIN_SIMPLER, response.content);
};

addMessageListener(Message.GET_SELECTION_TEXT, (data: MessageData) => {
  getAnswer(data as SelectionTextMessageData);
});

addMessageListener(Message.GET_CLARIFICATION, (data: MessageData) => {
  getClarification(data as ClarificationMessageData);
});

addMessageListener(Message.EXPLAIN_LIKE_CHILD, (data: MessageData) => {
  getExplainSimpler(data as ExplainSimplerMessageData);
});

const main = () => {
  console.log(
    "Background service worker is running! Edit `src/app/background` and save to reload.",
  );
  setDefaultLanguage();

  browser.action.onClicked.addListener(() => {
    sendMessageToActiveTab(Message.OPEN_CUSTOM_POPUP, {});
  });
};

export default defineBackground(main);
