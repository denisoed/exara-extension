import { MessageData } from "@/types";
import { defineExtensionMessaging } from "@webext-core/messaging";

export const Message = {
  GET_SELECTION_TEXT: "get-selection-text",
  GET_ANSWER: "get-answer",
  OPEN_CUSTOM_POPUP: "open-custom-popup",
  GET_CLARIFICATION: "get-clarification",
  GET_CLARIFICATION_ANSWER: "get-clarification-answer",
  EXPLAIN_LIKE_CHILD: "explain-like-child",
  GET_EXPLAIN_SIMPLER: "get-explain-like-child-answer",
} as const;

export type Message = (typeof Message)[keyof typeof Message];

interface Messages {
  [Message.GET_SELECTION_TEXT]: (text: string, language: string) => void;
  [Message.GET_ANSWER]: (text: string) => void;
  [Message.OPEN_CUSTOM_POPUP]: () => void;
  [Message.GET_CLARIFICATION]: {
    originalQuestion: string;
    originalAnswer: string;
    clarificationQuestion: string;
    context: string;
  };
  [Message.GET_CLARIFICATION_ANSWER]: {
    clarificationQuestion: string;
    answer: string;
  };
  [Message.EXPLAIN_LIKE_CHILD]: {
    question: string;
    context: string;
  };
  [Message.GET_EXPLAIN_SIMPLER]: (text: string) => void;
}

export function sendMessageToActiveTab(message: Message, data: MessageData) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: message,
          data: data,
        });
      }
    }
  });
}

export function sendMessageToBackground(message: Message, data: MessageData) {
  chrome.runtime.sendMessage({
    type: message,
    data: data,
  });
}

export function addMessageListener(
  message: Message,
  callback: (data: MessageData) => void,
) {
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === message) {
      callback(msg.data);
    }
  });
}

export const { sendMessage, onMessage } = defineExtensionMessaging<Messages>();
