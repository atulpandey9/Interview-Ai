const groqProvider = require("../providers/groq.provider");
const { interviewReportSchema} = require("../schemas/interview.schema");
const { buildInterviewReportPrompt } = require("../ai/prompt")

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = buildInterviewReportPrompt({ resume, selfDescription, jobDescription });
 
  const parsedJson = await groqProvider.generateJSON({
    prompt,
    temperature: 0.1,
  });
 
  return interviewReportSchema.parse(parsedJson);
}
 
module.exports = {
  generateInterviewReport,
};