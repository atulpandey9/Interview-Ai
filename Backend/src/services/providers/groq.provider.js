const Groq = require("groq-sdk");

const REQUEST_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS) || 20000;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: REQUEST_TIMEOUT_MS,
});

const DEFAULT_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

function cleanJsonString(raw) {
  return raw
    .replace(/[\s\S]*?<\/think>/g, "")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

function providerError(message, code) {
  const err = new Error(message);
  err.code = code;
  err.provider = "groq";
  return err;
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

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model,
      messages,
      temperature,
      response_format: { type: "json_object" },
    });
  } catch (error) {
    // 429 rate limits, 400 json_validate_failed, 5xx model errors, timeouts, network failures
    throw providerError(
      `Groq request failed: ${error.message}`,
      typeof error.status === "number" ? `http_${error.status}` : "network_error"
    );
  }

  const rawContent = completion?.choices?.[0]?.message?.content;

  if (!rawContent || !rawContent.trim()) {
    throw providerError("Groq provider returned an empty response", "empty_response");
  }

  const cleaned = cleanJsonString(rawContent);

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("[groq.provider] Failed to parse JSON response:", cleaned);
    throw providerError("Groq provider returned invalid JSON", "invalid_json");
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

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model,
      messages,
      temperature,
    });
  } catch (error) {
    throw providerError(
      `Groq request failed: ${error.message}`,
      typeof error.status === "number" ? `http_${error.status}` : "network_error"
    );
  }

  const rawContent = completion?.choices?.[0]?.message?.content;

  if (!rawContent || !rawContent.trim()) {
    throw providerError("Groq provider returned an empty response", "empty_response");
  }

  return cleanJsonString(rawContent);
}

module.exports = {
  generateJSON,
  generateText,
};
