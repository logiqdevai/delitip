import { z } from "zod";

/**
 * Default wording for form validation. Any schema rule that carries its own
 * message keeps it; this only replaces zod's developer-facing defaults
 * ("Required", "Expected number, received nan", "Invalid input").
 */
z.setErrorMap((issue) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.received === "undefined" || issue.received === "null") {
        return { message: "This field is required." };
      }
      if (issue.expected === "number" || issue.expected === "integer") {
        return { message: "Enter a valid number." };
      }
      return { message: "Please check this field." };
    case z.ZodIssueCode.too_small:
      if (issue.type === "string") {
        return {
          message:
            Number(issue.minimum) <= 1
              ? "This field is required."
              : `Must be at least ${issue.minimum} characters.`,
        };
      }
      if (issue.type === "array") {
        return {
          message:
            Number(issue.minimum) <= 1
              ? "Choose at least one option."
              : `Choose at least ${issue.minimum} options.`,
        };
      }
      return { message: `Must be ${issue.minimum} or more.` };
    case z.ZodIssueCode.too_big:
      if (issue.type === "string") {
        return { message: `Must be at most ${issue.maximum} characters.` };
      }
      if (issue.type === "array") {
        return { message: `Choose at most ${issue.maximum} options.` };
      }
      return { message: `Must be ${issue.maximum} or less.` };
    case z.ZodIssueCode.invalid_string:
      if (issue.validation === "email") {
        return { message: "Enter a valid email address." };
      }
      if (issue.validation === "url") {
        return { message: "Enter a valid web address, including https://" };
      }
      return { message: "This value isn't in the right format." };
    case z.ZodIssueCode.invalid_enum_value:
    case z.ZodIssueCode.invalid_literal:
    case z.ZodIssueCode.invalid_union:
      return { message: "Please choose one of the available options." };
    default:
      return { message: "This value isn't valid." };
  }
});
