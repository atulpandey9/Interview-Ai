const geminiProvider = require("../providers/gemini.provider");
const { resumePdfSchema } = require("../schemas/resume.schema");
const { resumeHtmlSchema }=require("../schemas/resume.schema")
const { buildResumeGenerationPrompt, RESUME_SYSTEM_PROMPT } = require("./prompt");

async function generateResumeHtml({ resume, selfDescription, jobDescription }) {
  const prompt = buildResumeGenerationPrompt({ resume, selfDescription, jobDescription });
 
  const html = await geminiProvider.generateText({
    prompt,
    systemPrompt: RESUME_SYSTEM_PROMPT,
    temperature: 0.4,
  });
 
  return resumeHtmlSchema.parse(html);
}
 
module.exports = {
  generateResumeHtml,
};