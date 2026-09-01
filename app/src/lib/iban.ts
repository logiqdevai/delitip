const IBAN_PATTERN = /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/;

function normalizeIban(iban: string): string {
  return iban.replace(/\s+/g, "").toUpperCase();
}

// Mirrors api/src/shared/utils/iban/iban.util.ts — ISO 7064 MOD-97-10
// checksum, so an obviously-invalid IBAN is caught before a network round
// trip, without duplicating server-side trust.
export function isValidIban(iban: string): boolean {
  const normalized = normalizeIban(iban);

  if (!IBAN_PATTERN.test(normalized)) {
    return false;
  }

  const rearranged = normalized.slice(4) + normalized.slice(0, 4);
  const numeric = rearranged.replace(
    /[A-Z]/g,
    (letter) => String(letter.charCodeAt(0) - 55),
  );

  let remainder = 0;
  for (let i = 0; i < numeric.length; i += 7) {
    remainder = Number(`${remainder}${numeric.slice(i, i + 7)}`) % 97;
  }

  return remainder === 1;
}

// Groups the IBAN into 4-character blocks for display, e.g.
// "GR1601101250000000012300695" -> "GR16 0110 1250 0000 0001 2300 695".
export function formatIbanInput(value: string): string {
  const normalized = normalizeIban(value).slice(0, 34);
  return normalized.replace(/(.{4})/g, "$1 ").trim();
}
