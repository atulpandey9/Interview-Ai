const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const DEFAULT_MODEL ="gemini-3.5-flash";

function stripCodeFences(raw) {
  return raw
    .replace(/```json/g, "")
    .replace(/```html/g, "")
    .replace(/```/g, "")
    .trim();
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

  const result = await genModel.generateContent(prompt);
  const rawContent = result.response.text();
  const cleaned = stripCodeFences(rawContent);

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("[gemini.provider] Failed to parse JSON response:", cleaned);
    throw new Error("Gemini provider returned invalid JSON");
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

  const result = await genModel.generateContent(prompt);
  const rawContent = result.response.text();

  return stripCodeFences(rawContent);
}

module.exports = {
  generateJSON,
  generateText,
};