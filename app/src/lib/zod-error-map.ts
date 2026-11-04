import { z } from "zod";
import { vmsg } from "@/lib/validation-message";

/**
 * Default wording for form validation. Any schema rule that carries its own
 * message keeps it; this only replaces zod's developer-facing defaults
 * ("Required", "Expected number, received nan", "Invalid input").
 *
 * Messages are message keys (see `@/lib/validation-message`), translated by
 * `@/lib/i18n-zod-resolver` when the form reports its errors.
 */
z.setErrorMap((issue) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.received === "undefined" || issue.received === "null") {
        return { message: vmsg("required") };
      }
      if (issue.expected === "number" || issue.expected === "integer") {
        return { message: vmsg("invalidNumber") };
      }
      return { message: vmsg("checkField") };
    case z.ZodIssueCode.too_small:
      if (issue.type === "string") {
        return {
          message:
            Number(issue.minimum) <= 1
              ? vmsg("required")
              : vmsg("minChars", { min: Number(issue.minimum) }),
        };
      }
      if (issue.type === "array") {
        return {
          message:
            Number(issue.minimum) <= 1
              ? vmsg("chooseAtLeastOne")
              : vmsg("chooseAtLeast", { min: Number(issue.minimum) }),
        };
      }
      return { message: vmsg("minValue", { min: Number(issue.minimum) }) };
    case z.ZodIssueCode.too_big:
      if (issue.type === "string") {
        return { message: vmsg("maxChars", { max: Number(issue.maximum) }) };
      }
      if (issue.type === "array") {
        return { message: vmsg("chooseAtMost", { max: Number(issue.maximum) }) };
      }
      return { message: vmsg("maxValue", { max: Number(issue.maximum) }) };
    case z.ZodIssueCode.invalid_string:
      if (issue.validation === "email") {
        return { message: vmsg("invalidEmail") };
      }
      if (issue.validation === "url") {
        return { message: vmsg("invalidUrl") };
      }
      return { message: vmsg("invalidFormat") };
    case z.ZodIssueCode.invalid_enum_value:
    case z.ZodIssueCode.invalid_literal:
    case z.ZodIssueCode.invalid_union:
      return { message: vmsg("chooseOption") };
    default:
      return { message: vmsg("invalid") };
  }
});
