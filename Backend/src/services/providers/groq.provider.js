const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const DEFAULT_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

function cleanJsonString(raw) {
  return raw
    .replace(/<think>[\s\S]*?<\/think>/g, "")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}


async function generateJSON({
  prompt,
  systemPrompt,
  model = DEFAULT_MODEL,
  temperature = 0.1,
}) {
  const messages = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const completion = await groq.chat.completions.create({
    model,
    messages,
    temperature,
    response_format: { type: "json_object" },
  });

  const rawContent = completion.choices[0].message.content;
  const cleaned = cleanJsonString(rawContent);

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("[groq.provider] Failed to parse JSON response:", cleaned);
    throw new Error("Groq provider returned invalid JSON");
  }
}

async function generateText({
  prompt,
  systemPrompt,
  model = DEFAULT_MODEL,
  temperature = 0.4,
}) {
  const messages = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const completion = await groq.chat.completions.create({
    model,
    messages,
    temperature,
  });

  const rawContent = completion.choices[0].message.content;
  return cleanJsonString(rawContent); 
}

module.exports = {
  generateJSON,
  generateText,
};