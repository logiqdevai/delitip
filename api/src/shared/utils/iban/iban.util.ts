const IBAN_PATTERN = /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/;

function normalizeIban(iban: string): string {
  return iban.replace(/\s+/g, '').toUpperCase();
}

// ISO 7064 MOD-97-10 checksum, per the IBAN registry spec: move the first
// four characters to the end, convert letters to numbers (A=10..Z=35), and
// verify the resulting numeric string mod 97 === 1.
export function isValidIban(iban: string): boolean {
  const normalized = normalizeIban(iban);

  if (!IBAN_PATTERN.test(normalized)) {
    return false;
  }

  const rearranged = normalized.slice(4) + normalized.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (letter) =>
    String(letter.charCodeAt(0) - 55),
  );

  let remainder = 0;
  for (let i = 0; i < numeric.length; i += 7) {
    remainder = Number(`${remainder}${numeric.slice(i, i + 7)}`) % 97;
  }

  return remainder === 1;
}

export function maskIban(iban: string): string {
  const normalized = normalizeIban(iban);
  return normalized.slice(-4);
}
