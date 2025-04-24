import { OpenAIResponse } from "@/types";
import { env } from "~/lib/env";

async function post<T>(url: string, data: any): Promise<T> {
  const response = await fetch(`${env.VITE_API_URL}${url}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
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
