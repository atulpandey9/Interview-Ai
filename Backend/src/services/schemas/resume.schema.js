const { z } = require("zod");

const resumeHtmlSchema = z
  .string()
  .min(1, "html must never be empty")
  .refine((html) => html.trim().toLowerCase().startsWith("<!doctype html"), {
    message: "Response does not look like a complete HTML document",
  });
module.exports = {
  resumeHtmlSchema,
};