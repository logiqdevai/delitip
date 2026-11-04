import { zodResolver as baseZodResolver } from "@hookform/resolvers/zod";
import { tr } from "@/lib/i18n-runtime";
import { parseValidationMessage } from "@/lib/validation-message";

/**
 * Drop-in replacement for `zodResolver` from `@hookform/resolvers/zod`.
 * Schema messages are message keys (see `validation-message.ts`); this turns
 * every field error's `message` into text in the active language. Messages that
 * aren't keys pass through untouched. Client-side only (relies on `tr`).
 */
const translateMessage = (message: string) => {
  const parsed = parseValidationMessage(message);
  return parsed ? tr(parsed.key, parsed.params) : message;
};

const translateErrors = (node: unknown): void => {
  if (!node || typeof node !== "object") return;
  for (const [key, value] of Object.entries(node)) {
    if (key === "ref") continue;
    if (key === "message" && typeof value === "string") {
      (node as Record<string, unknown>)[key] = translateMessage(value);
    } else if (key === "types" && value && typeof value === "object") {
      for (const [type, text] of Object.entries(value)) {
        const types = value as Record<string, unknown>;
        if (typeof text === "string") types[type] = translateMessage(text);
        else if (Array.isArray(text)) {
          types[type] = text.map((item) =>
            typeof item === "string" ? translateMessage(item) : item,
          );
        }
      }
    } else if (value && typeof value === "object") {
      translateErrors(value);
    }
  }
};

export const zodResolver = ((...args: Parameters<typeof baseZodResolver>) => {
  const resolver = (
    baseZodResolver as (...a: unknown[]) => (...r: unknown[]) => Promise<unknown>
  )(...args);
  return async (...resolverArgs: unknown[]) => {
    const result = (await resolver(...resolverArgs)) as { errors?: unknown };
    translateErrors(result.errors);
    return result;
  };
}) as typeof baseZodResolver;
