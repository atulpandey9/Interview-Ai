function buildInterviewReportPrompt({ resume, selfDescription, jobDescription }) {
  return `
You are an expert technical recruiter and interview coach.

Analyze the following candidate:

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Generate ONLY valid JSON.

Hard rules:
- Every string value must be a non-empty string (no "", no blank whitespace, no placeholder text).
- Every array must contain at least one item.
- "title" must be a short, specific job title taken from the Job Description below (e.g. "Junior Software Developer").

Required JSON Structure:

{
  "matchScore": integer,
  "technicalQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],
  "behavioralQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],
  "skillGaps": [
    {
      "skill": "",
      "severity": "low | medium | high"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "",
      "tasks": []
    }
  ],
  "title": "Junior Software Developer"
}

Return only JSON.
`;
}

function buildResumeGenerationPrompt({ resume, selfDescription, jobDescription }) {
  return `Generate a polished, professional, ATS-friendly resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

Output ONLY the raw HTML document itself. Do NOT wrap it in JSON, do NOT wrap it in
markdown code fences, do NOT add any commentary before or after it - your entire
response must be the HTML, starting with <!DOCTYPE html> and ending with </html>.

Rules for the HTML document:
- MUST be a complete HTML document beginning with <!DOCTYPE html>.
- MUST include a <style> block inside <head> with ALL CSS embedded directly in it.
  Do NOT link to external stylesheets, CDNs, or Google Fonts - use only web-safe fonts
  (e.g. "Helvetica, Arial, sans-serif" or "Georgia, serif") since this HTML is rendered
  to PDF without network access.
- The <style> block MUST define: page margins/padding, a clear visual hierarchy for
  name/title vs section headers vs body text, consistent spacing between sections,
  and a clean single or two-column layout. Use a restrained color palette (1-2 accent
  colors max, plus black/gray text) - this is a professional resume, not a poster.
- Structure the body with clearly separated sections: header (name, contact info,
  optional title), summary, skills, experience (reverse chronological, with company,
  role, dates, bullet points), education, and any other relevant sections
  (projects, certifications) based on the candidate's resume.
- Tailor the emphasized skills/experience toward the job description provided.
- If you cannot generate the resume, still return a minimal but STYLED HTML page
  (with the same embedded <style> approach) explaining the issue - never return
  an empty or missing document.`;
}

const RESUME_SYSTEM_PROMPT =
  "You are a resume-design assistant. You output raw HTML documents only - never JSON, never markdown fences, never explanatory text.";

module.exports = {
  buildInterviewReportPrompt,
  buildResumeGenerationPrompt,
  RESUME_SYSTEM_PROMPT,
};