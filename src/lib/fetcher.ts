import type { OpenAIResponse } from "@/types";
import { env } from "~/lib/env";

async function post<T>(
  url: string,
  data: Record<string, string | number | boolean | object>,
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["x-api-key"] = token;
  }

  const response = await fetch(`${env.VITE_API_URL}${url}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers,
  });

  return response.json() as Promise<T>;
}

function fetchToOpenAI(prompt: string) {
  return post<OpenAIResponse>("/api/openai/chat", {
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
}

export { fetchToOpenAI };
