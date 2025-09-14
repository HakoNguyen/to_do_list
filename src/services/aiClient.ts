export interface AiTaskDraft {
  title: string;
  deadline: string; // ISO string
  priority?: "low" | "medium" | "high";
}

export interface AiMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const DEFAULT_API_URL =
  import.meta.env.VITE_AI_API_URL || "https://to-do-list-tos5.onrender.com/api";

export async function chatGenerateTask(
  prompt: string,
  apiUrl: string = DEFAULT_API_URL,
  systemInstruction?: string
): Promise<{ draft?: AiTaskDraft; raw: unknown }> {
  const merged = systemInstruction
    ? `${systemInstruction}\n\n${prompt}`
    : prompt;
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: merged }),
  });
  if (!res.ok) {
    throw new Error(`AI request failed: ${res.status}`);
  }
  const data = await res.json();
 
  let draft: AiTaskDraft | undefined = undefined;
  try {
    const maybe = data.task ?? data.draft ?? data;
    if (typeof maybe === "string") {
      draft = JSON.parse(maybe);
    } else if (maybe && typeof maybe === "object") {
      draft = maybe as AiTaskDraft;
    }
  } catch {
    // ignore parse error; caller can inspect raw
  }
  return { draft, raw: data };
}

