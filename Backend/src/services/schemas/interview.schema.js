const { z } = require("zod");

const nonEmptyString = (message) => z.string().trim().min(1, message);

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: nonEmptyString("Technical question must not be empty").describe("The technical question that can be asked in the interview"),
        intention: nonEmptyString("Intention must not be empty").describe("The intention of the interviewer behind asking this question"),
        answer: nonEmptyString("Answer must not be empty")
          .describe("How to answer this question, what points to cover, what approach to take etc."),
      })
    )
    .min(1, "At least one technical question is required")
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them"
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: nonEmptyString("Behavioral question must not be empty").describe("The behavioral question that can be asked in the interview"),
        intention: nonEmptyString("Intention must not be empty").describe("The intention of the interviewer behind asking this question"),
        answer: nonEmptyString("Answer must not be empty")
          .describe("How to answer this question, what points to cover, what approach to take etc."),
      })
    )
    .min(1, "At least one behavioral question is required")
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them"
    ),
  skillGaps: z
    .array(
      z.object({
        skill: nonEmptyString("Skill must not be empty").describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe(
            "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances"
          ),
      })
    )
    .min(1, "At least one skill gap is required")
    .describe("List of skill gaps in the candidate's profile along with their severity"),
  preparationPlan: z
    .array(
      z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: nonEmptyString("Focus must not be empty")
          .describe(
            "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."
          ),
        tasks: z
          .array(nonEmptyString("Task must not be empty"))
          .min(1, "Each preparation day must have at least one task")
          .describe(
            "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc."
          ),
      })
    )
    .min(1, "At least one preparation day is required")
    .describe(
      "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"
    ),
  title: nonEmptyString("Job title is required").describe(
    "The title of the job for which the interview report is generated"
  ),
});

module.exports = {
  interviewReportSchema
};