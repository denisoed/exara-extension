import { defineExtensionMessaging } from "@webext-core/messaging";

export const Message = {
  USER: "user",
  GET_SELECTION_TEXT: "get-selection-text",
  GET_ANSWER: "get-answer",
  OPEN_CUSTOM_POPUP: "open-custom-popup",
} as const;

export type Message = (typeof Message)[keyof typeof Message];

interface Messages {
  [Message.GET_SELECTION_TEXT]: (text: string, language: string) => void;
  [Message.GET_ANSWER]: (text: string) => void;
  [Message.OPEN_CUSTOM_POPUP]: () => void;
}

export function sendMessageToActiveTab(message: Message, data: any) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: message,
          data: data,
        });
      }
    });
  });
}

export function sendMessageToBackground(message: Message, data: any) {  
  chrome.runtime.sendMessage({
    type: message,
    data: data,
  });
}

export function addMessageListener(
  message: Message,
  callback: (data: any) => void,
) {
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === message) {
      callback(msg.data);
    }
  });
}

export const { sendMessage, onMessage } = defineExtensionMessaging<Messages>();
