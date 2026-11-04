import { isAxiosError } from "axios";

/**
 * Turns anything that can go wrong on a request into a sentence a person can
 * read. Raw framework / HTTP / validator text ("Cannot POST /api/…",
 * "Request failed with status code 500", "email must be an email") must never
 * reach the UI — every place that shows an error goes through this file.
 */

export const NETWORK_ERROR_MESSAGE =
  "We couldn't reach delitip. Please check your internet connection and try again.";
export const SERVER_ERROR_MESSAGE =
  "Something went wrong on our side. Please try again in a moment.";
export const UNREACHABLE_SERVICE_MESSAGE =
  "We're having trouble connecting to delitip right now. Please try again in a moment.";
export const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";

const STATUS_MESSAGES: Record<number, string> = {
  400: "Some of the information isn't valid. Please check it and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  405: UNREACHABLE_SERVICE_MESSAGE,
  408: NETWORK_ERROR_MESSAGE,
  409: "This conflicts with something that already exists. Please refresh the page and try again.",
  413: "That file is too large. Please choose a smaller one.",
  415: "That file type isn't supported.",
  422: "Some of the information isn't valid. Please check it and try again.",
  429: "Too many attempts. Please wait a moment and try again.",
  502: UNREACHABLE_SERVICE_MESSAGE,
  503: UNREACHABLE_SERVICE_MESSAGE,
  504: UNREACHABLE_SERVICE_MESSAGE,
};

/** Statuses where the status text beats an action-specific fallback. */
const STATUS_OVERRIDES_FALLBACK = new Set([401, 403, 413, 415, 429]);

/** Known API messages that are technical or leak provider internals. */
const REWRITES: Array<[RegExp, string]> = [
  [/^invalid credentials$/i, "The email or password is incorrect."],
  [/^invalid token$/i, "Your session has expired. Please sign in again."],
  [
    /invalid or expired reset token/i,
    "This reset link is invalid or has expired. Please request a new one.",
  ],
  [
    /password login is not set up/i,
    "This account doesn't use a password. Try signing in another way.",
  ],
  [/user with this email already exists/i, "An account with this email already exists. Try signing in instead."],
  [
    /unable to .*payment processor|failed to refund payment/i,
    "We couldn't complete this with our payment provider. Please try again in a moment.",
  ],
  [
    /not configured|VIVA_/i,
    "This isn't available yet. Please contact support if it keeps happening.",
  ],
  [/failed to send message/i, "We couldn't send your message. Please try again."],
  [/failed to send (bulk )?email/i, "We couldn't send the email. Please try again in a moment."],
  [
    /employee_id is required for EMPLOYEE recipients/i,
    "Choose an employee for every employee recipient.",
  ],
  [
    /employee_id must not be set for STORE recipients/i,
    "A store recipient can't have an employee selected.",
  ],
  [/sender ip not allowed/i, UNREACHABLE_SERVICE_MESSAGE],
];

/** Text that is only meaningful to a developer. */
const TECHNICAL_PATTERNS: RegExp[] = [
  /^cannot (get|post|put|patch|delete|head|options)\b/i,
  /^(internal server error|bad request|unauthorized|forbidden( resource)?|not found|conflict|bad gateway|service unavailable|gateway timeout|unprocessable entity|too many requests|payload too large|method not allowed|network error|error|failed|undefined|null)\.?$/i,
  /request failed with status code/i,
  /timeout of \d+ms exceeded/i,
  /^(ECONN\w+|ETIMEDOUT|ENOTFOUND|EAI_AGAIN)\b/,
  /\b(ECONNREFUSED|ECONNRESET|ETIMEDOUT|ENOTFOUND)\b/,
  /validation failed|invalid query parameters/i,
  /webhook error/i,
  /^failed to (get|change) /i,
  /invalid (alert type|template id)/i,
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i,
  /cannot read propert|is not a function|is not defined|unexpected token|is not valid json|\[object |failed to fetch|fetch failed|load failed|networkerror|aborterror|aborted|stack|prisma|\bsql\b|\bnull\b|\bundefined\b|\bNaN\b/i,
];

const isTechnical = (text: string) =>
  TECHNICAL_PATTERNS.some((pattern) => pattern.test(text.trim()));

const humanizeField = (field: string) =>
  field
    .replace(/\[\d+\]/g, "")
    .split(".")
    .pop()!
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase();

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

/**
 * class-validator style messages: "email must be an email",
 * "password must be longer than or equal to 8 characters".
 * Returns null when the text isn't one.
 */
const humanizeValidation = (text: string): string | null => {
  const match = text.match(/^([\w.[\]]+) (.+)$/);
  if (!match) return null;
  const [, rawField, rule] = match;
  const field = humanizeField(rawField);

  if (/must be an email/i.test(rule)) {
    return "Please enter a valid email address.";
  }
  if (/should not be empty|must not be empty/i.test(rule)) {
    return `Please fill in the ${field} field.`;
  }
  const longer = rule.match(/must be longer than or equal to (\d+) characters/i);
  if (longer) return `${capitalize(field)} must be at least ${longer[1]} characters long.`;
  const shorter = rule.match(/must be shorter than or equal to (\d+) characters/i);
  if (shorter) return `${capitalize(field)} can be at most ${shorter[1]} characters long.`;
  const min = rule.match(/must not be less than (\d+)/i);
  if (min) return `${capitalize(field)} must be at least ${min[1]}.`;
  const max = rule.match(/must not be greater than (\d+)/i);
  if (max) return `${capitalize(field)} can be at most ${max[1]}.`;
  if (
    /must be (a|an|one of|a valid|a positive|a boolean|an array|a url|a uuid|a string|a number|an integer|a date|an iso)|should not exist|must contain|must match/i.test(
      rule,
    )
  ) {
    return `Please check the ${field} field and try again.`;
  }
  return null;
};

const cleanServerMessage = (raw: unknown): string | null => {
  const text = Array.isArray(raw) ? raw.find((m) => typeof m === "string") : raw;
  if (typeof text !== "string" || text.trim().length === 0) return null;
  const trimmed = text.trim();

  for (const [pattern, replacement] of REWRITES) {
    if (pattern.test(trimmed)) return replacement;
  }
  const validation = humanizeValidation(trimmed);
  if (validation) return validation;
  if (isTechnical(trimmed)) return null;
  return trimmed;
};

const messageFromStatus = (status: number, fallback?: string): string => {
  if (STATUS_OVERRIDES_FALLBACK.has(status)) return STATUS_MESSAGES[status];
  if (fallback) return fallback;
  if (STATUS_MESSAGES[status]) return STATUS_MESSAGES[status];
  if (status >= 500) return SERVER_ERROR_MESSAGE;
  return GENERIC_ERROR_MESSAGE;
};

/**
 * The one place that decides what an error looks like to a user.
 * `fallback` is an action-specific sentence ("We couldn't delete this store.")
 * used when the server gave nothing a person could read.
 */
export const getErrorMessage = (error: unknown, fallback?: string): string => {
  if (isAxiosError(error)) {
    const serverMessage = cleanServerMessage(error.response?.data?.message);
    if (serverMessage) return serverMessage;

    const status = error.response?.status;
    if (status === undefined) {
      // Never reached the server: offline, DNS, CORS, timeout.
      return NETWORK_ERROR_MESSAGE;
    }
    const rawMessage = error.response?.data?.message;
    const rawText = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
    if (
      status === 404 &&
      typeof rawText === "string" &&
      /^cannot (get|post|put|patch|delete)\b/i.test(rawText)
    ) {
      // The route doesn't exist: the app can't reach a matching API.
      return UNREACHABLE_SERVICE_MESSAGE;
    }
    return messageFromStatus(status, fallback);
  }

  if (error instanceof Error) {
    const cleaned = cleanServerMessage(error.message);
    if (cleaned) return cleaned;
  } else if (typeof error === "string") {
    const cleaned = cleanServerMessage(error);
    if (cleaned) return cleaned;
  }
  return fallback ?? GENERIC_ERROR_MESSAGE;
};

/** For payloads parsed by hand (e.g. a JSON error body returned as a Blob). */
export const getFriendlyMessage = (raw: unknown, fallback: string): string =>
  cleanServerMessage(raw) ?? fallback;

/**
 * Payment-provider failure text is written for the provider's own staff. For
 * the people using delitip we only say what happened and what to do next.
 */
export const TRANSFER_FAILED_MESSAGE =
  "The bank transfer didn't go through. Please try again, or contact support if it keeps happening.";
