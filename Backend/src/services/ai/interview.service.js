const groqProvider = require("../providers/groq.provider");
const geminiProvider = require("../providers/gemini.provider");
const { interviewReportSchema } = require("../schemas/interview.schema");
const { buildInterviewReportPrompt } = require("../ai/prompt")

// Reliability settings (wired to the AI_* variables already present in .env)
const MAX_ATTEMPTS_PER_PROVIDER =
  Math.max(1, Number(process.env.AI_MAX_ATTEMPTS_PER_PROVIDER) || 2);
const RETRY_DELAY_MS = Math.max(0, Number(process.env.AI_RETRY_DELAY_MS) || 500);
const ATTEMPT_TIMEOUT_MS = Math.max(1000, Number(process.env.AI_TIMEOUT_MS) || 20000);

const PROVIDERS = [
  { name: "groq", generateJSON: (opts) => groqProvider.generateJSON(opts) },
  { name: "gemini", generateJSON: (opts) => geminiProvider.generateJSON(opts) },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Rejects if the provider call exceeds the per-attempt budget, so a hung
 * provider can never hang the synchronous HTTP request forever.
 */
function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`${label} timed out after ${ms}ms`)),
      ms
    );
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/**
 * The model sometimes returns an empty (or missing) title. Zod/Mongoose require
 * a real one, so derive a safe title from the job description instead of failing.
 */
function deriveTitle(jobDescription) {
  const fallback = "Interview Preparation Plan";
  const line = String(jobDescription || "")
    .split("\n")
    .map((part) => part.trim())
    .find((part) => part.length > 0);

  if (!line) return fallback;

  const cleaned = line
    .replace(/^job title\s*[:\-–—]\s*/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);

  return cleaned || fallback;
}

function normalizeReport(raw, jobDescription) {
  if (!raw || typeof raw !== "object") return raw;
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  return { ...raw, title: title || deriveTitle(jobDescription) };
}

/**
 * One provider, up to MAX_ATTEMPTS_PER_PROVIDER tries.
 * Each attempt: call provider → normalize → Zod validate.
 * Any failure (invalid JSON, HTTP 400/429/5xx, timeout, Zod issue) retries,
 * with a different temperature on the retry to avoid repeating the same failure.
 * Returns the validated report, or null if the provider never succeeded.
 */
async function attemptProvider(provider, prompt, jobDescription) {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_PROVIDER; attempt++) {
    const temperature = attempt === 1 ? 0.1 : 0.5;
    try {
      const raw = await withTimeout(
        provider.generateJSON({ prompt, temperature }),
        ATTEMPT_TIMEOUT_MS,
        `${provider.name} (attempt ${attempt})`
      );
      return interviewReportSchema.parse(normalizeReport(raw, jobDescription));
    } catch (error) {
      const code = error.code || error.name || "error";
      console.warn(
        `[interview.service] ${provider.name} attempt ${attempt}/${MAX_ATTEMPTS_PER_PROVIDER} failed (${code}): ${error.message}`
      );
      if (attempt < MAX_ATTEMPTS_PER_PROVIDER) {
        await sleep(RETRY_DELAY_MS);
      }
    }
  }
  return null;
}

/**
 * Groq is primary; Gemini is the fallback. Both must produce a report that
 * passes the same Zod schema before anything is returned to the controller
 * (and therefore before anything is written to MongoDB).
 */
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = buildInterviewReportPrompt({ resume, selfDescription, jobDescription });

  for (const provider of PROVIDERS) {
    const report = await attemptProvider(provider, prompt, jobDescription);
    if (report) {
      if (provider.name !== "groq") {
        console.warn(`[interview.service] served by fallback provider: ${provider.name}`);
      }
      return report;
    }
    console.error(`[interview.service] provider exhausted all attempts: ${provider.name}`);
  }

  throw new Error(
    "Report generation failed: Groq and Gemini could not produce a valid report"
  );
}

module.exports = {
  generateInterviewReport,
};
