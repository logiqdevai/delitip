function ipv4ToInt(ip: string): number | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;

  let value = 0;
  for (const part of parts) {
    const octet = Number(part);
    if (!Number.isInteger(octet) || octet < 0 || octet > 255) return null;
    value = (value << 8) + octet;
  }
  return value >>> 0;
}

// Matches a client IPv4 address against an allowlist of exact IPs and/or
// CIDR ranges (e.g. "34.140.0.0/16"). IPv6 entries are matched by exact
// string equality only — Viva's published ranges are IPv4.
export function isIpAllowed(clientIp: string, allowlist: string[]): boolean {
  const normalizedClient = clientIp.replace(/^::ffff:/, '');

  for (const entry of allowlist) {
    if (!entry.includes('/')) {
      if (normalizedClient === entry) return true;
      continue;
    }

    const [rangeIp, prefixRaw] = entry.split('/');
    const prefix = Number(prefixRaw);
    const rangeInt = ipv4ToInt(rangeIp);
    const clientInt = ipv4ToInt(normalizedClient);

    if (rangeInt === null || clientInt === null || Number.isNaN(prefix)) {
      continue;
    }

    const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    if ((rangeInt & mask) === (clientInt & mask)) return true;
  }

  return false;
}
