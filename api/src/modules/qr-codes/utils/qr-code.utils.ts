import { randomBytes } from 'crypto';

// Short alnum code embedded in the scan URL, e.g. delitip.com/{store_slug}/q/{code}.
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const CODE_LENGTH = 8;

function generateCandidateCode(): string {
    const bytes = randomBytes(CODE_LENGTH);
    let code = '';
    for (let i = 0; i < CODE_LENGTH; i++) {
        code += ALPHABET[bytes[i] % ALPHABET.length];
    }
    return code;
}

export async function ensureUniqueQrCode(exists: (candidate: string) => Promise<boolean>): Promise<string> {
    let candidate = generateCandidateCode();

    while (await exists(candidate)) {
        candidate = generateCandidateCode();
    }

    return candidate;
}
