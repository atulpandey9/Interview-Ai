const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";

function stripCodeFences(raw) {
  return raw
    .replace(/```json/g, "")
    .replace(/```html/g, "")
    .replace(/```/g, "")
    .trim();
}

function providerError(message, code) {
  const err = new Error(message);
  err.code = code;
  err.provider = "gemini";
  return err;
}

async function readText(result) {
  let rawContent;
  try {
    rawContent = result.response.text();
  } catch (error) {
    // blocked / stopped / no candidates
    throw providerError(`Gemini returned no text: ${error.message}`, "empty_response");
  }
  if (!rawContent || !rawContent.trim()) {
    throw providerError("Gemini provider returned an empty response", "empty_response");
  }
  return rawContent;
}

async function generateJSON({
  prompt,
  systemPrompt,
  model = DEFAULT_MODEL,
  temperature = 0.4,
}) {
  const genModel = genAI.getGenerativeModel({
    model,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature,
      responseMimeType: "application/json",
    },
  });

  let result;
  try {
    result = await genModel.generateContent(prompt);
  } catch (error) {
    throw providerError(
      `Gemini request failed: ${error.message}`,
      typeof error.status === "number" ? `http_${error.status}` : "network_error"
    );
  }

  const rawContent = await readText(result);
  const cleaned = stripCodeFences(rawContent);

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("[gemini.provider] Failed to parse JSON response:", cleaned);
    throw providerError("Gemini provider returned invalid JSON", "invalid_json");
  }
}

async function generateText({
  prompt,
  systemPrompt,
  model = DEFAULT_MODEL,
  temperature = 0.4,
}) {
  const genModel = genAI.getGenerativeModel({
    model,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature,
    },
  });

  let result;
  try {
    result = await genModel.generateContent(prompt);
  } catch (error) {
    throw providerError(
      `Gemini request failed: ${error.message}`,
      typeof error.status === "number" ? `http_${error.status}` : "network_error"
    );
  }

  const rawContent = await readText(result);

  return stripCodeFences(rawContent);
}

module.exports = {
  generateJSON,
  generateText,
};
