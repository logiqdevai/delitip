import { isAxiosError } from "axios";
import { tr } from "@/lib/i18n-runtime";

/**
 * Turns anything that can go wrong on a request into a sentence a person can
 * read. Raw framework / HTTP / validator text ("Cannot POST /api/…",
 * "Request failed with status code 500", "email must be an email") must never
 * reach the UI — every place that shows an error goes through this file.
 */

export const getNetworkErrorMessage = () => tr("errors.network");
export const getServerErrorMessage = () => tr("errors.server");
export const getUnreachableServiceMessage = () => tr("errors.unreachable");
export const getGenericErrorMessage = () => tr("errors.generic");

const statusMessage = (status: number): string | undefined => {
  switch (status) {
    case 400:
    case 422:
      return tr("errors.status.invalidInput");
    case 401:
      return tr("errors.status.unauthorized");
    case 403:
      return tr("errors.status.forbidden");
    case 404:
      return tr("errors.status.notFound");
    case 405:
    case 502:
    case 503:
    case 504:
      return getUnreachableServiceMessage();
    case 408:
      return getNetworkErrorMessage();
    case 409:
      return tr("errors.status.conflict");
    case 413:
      return tr("errors.status.fileTooLarge");
    case 415:
      return tr("errors.status.fileType");
    case 429:
      return tr("errors.status.tooManyAttempts");
    default:
      return undefined;
  }
};

/** Statuses where the status text beats an action-specific fallback. */
const STATUS_OVERRIDES_FALLBACK = new Set([401, 403, 413, 415, 429]);

/** Known API messages that are technical or leak provider internals. */
const REWRITES: Array<[RegExp, () => string]> = [
  [/^invalid credentials$/i, () => tr("errors.rewrites.invalidCredentials")],
  [/^invalid token$/i, () => tr("errors.status.unauthorized")],
  [/invalid or expired reset token/i, () => tr("errors.rewrites.resetTokenInvalid")],
  [/password login is not set up/i, () => tr("errors.rewrites.noPasswordLogin")],
  [/user with this email already exists/i, () => tr("errors.rewrites.emailExists")],
  [
    /unable to .*payment processor|failed to refund payment/i,
    () => tr("errors.rewrites.paymentProvider"),
  ],
  [/not configured|VIVA_/i, () => tr("errors.rewrites.notAvailable")],
  [/failed to send message/i, () => tr("errors.rewrites.messageNotSent")],
  [/failed to send (bulk )?email/i, () => tr("errors.rewrites.emailNotSent")],
  [
    /employee_id is required for EMPLOYEE recipients/i,
    () => tr("errors.rewrites.employeeRecipientRequired"),
  ],
  [
    /employee_id must not be set for STORE recipients/i,
    () => tr("errors.rewrites.storeRecipientNoEmployee"),
  ],
  [/sender ip not allowed/i, () => getUnreachableServiceMessage()],
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
    return tr("errors.fieldRules.email");
  }
  if (/should not be empty|must not be empty/i.test(rule)) {
    return tr("errors.fieldRules.empty", { field });
  }
  const longer = rule.match(/must be longer than or equal to (\d+) characters/i);
  if (longer) return tr("errors.fieldRules.minLength", { field: capitalize(field), count: Number(longer[1]) });
  const shorter = rule.match(/must be shorter than or equal to (\d+) characters/i);
  if (shorter) return tr("errors.fieldRules.maxLength", { field: capitalize(field), count: Number(shorter[1]) });
  const min = rule.match(/must not be less than (\d+)/i);
  if (min) return tr("errors.fieldRules.minValue", { field: capitalize(field), value: Number(min[1]) });
  const max = rule.match(/must not be greater than (\d+)/i);
  if (max) return tr("errors.fieldRules.maxValue", { field: capitalize(field), value: Number(max[1]) });
  if (
    /must be (a|an|one of|a valid|a positive|a boolean|an array|a url|a uuid|a string|a number|an integer|a date|an iso)|should not exist|must contain|must match/i.test(
      rule,
    )
  ) {
    return tr("errors.fieldRules.check", { field });
  }
  return null;
};

const cleanServerMessage = (raw: unknown): string | null => {
  const text = Array.isArray(raw) ? raw.find((m) => typeof m === "string") : raw;
  if (typeof text !== "string" || text.trim().length === 0) return null;
  const trimmed = text.trim();

  for (const [pattern, replacement] of REWRITES) {
    if (pattern.test(trimmed)) return replacement();
  }
  const validation = humanizeValidation(trimmed);
  if (validation) return validation;
  if (isTechnical(trimmed)) return null;
  return trimmed;
};

const messageFromStatus = (status: number, fallback?: string): string => {
  const text = statusMessage(status);
  if (STATUS_OVERRIDES_FALLBACK.has(status) && text) return text;
  if (fallback) return fallback;
  if (text) return text;
  if (status >= 500) return getServerErrorMessage();
  return getGenericErrorMessage();
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
      return getNetworkErrorMessage();
    }
    const rawMessage = error.response?.data?.message;
    const rawText = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
    if (
      status === 404 &&
      typeof rawText === "string" &&
      /^cannot (get|post|put|patch|delete)\b/i.test(rawText)
    ) {
      // The route doesn't exist: the app can't reach a matching API.
      return getUnreachableServiceMessage();
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
  return fallback ?? getGenericErrorMessage();
};

/** For payloads parsed by hand (e.g. a JSON error body returned as a Blob). */
export const getFriendlyMessage = (raw: unknown, fallback: string): string =>
  cleanServerMessage(raw) ?? fallback;

/**
 * Payment-provider failure text is written for the provider's own staff. For
 * the people using delitip we only say what happened and what to do next.
 */
export const getTransferFailedMessage = () => tr("errors.transferFailed");
