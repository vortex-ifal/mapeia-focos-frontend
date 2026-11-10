const STREET_PREFIXES = [
  "rua ",
  "avenida ",
  "av. ",
  "travessa ",
  "estrada ",
  "rodovia ",
  "alameda ",
  "praça ",
  "praca ",
];

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

function looksLikeStreet(value: string): boolean {
  const normalizedValue = normalizeText(value);

  return STREET_PREFIXES.some((prefix) => normalizedValue.startsWith(prefix));
}

export function getOccurrenceRegion(address: string): string {
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const explicitNeighborhood = parts.find((part) => /^bairro\s+/i.test(part));

  if (explicitNeighborhood) {
    return explicitNeighborhood.replace(/^bairro\s+/i, "");
  }

  if (parts.length === 0) {
    return "Região não informada";
  }

  if (parts.length >= 2 && looksLikeStreet(parts[0])) {
    const possibleRegion = parts.find(
      (part, index) =>
        index > 0 &&
        !/^\d+$/.test(part) &&
        !/^alagoas$/i.test(part) &&
        !/^arapiraca$/i.test(part),
    );

    return possibleRegion ?? "Região não informada";
  }

  if (parts.length >= 3 && !looksLikeStreet(parts[0])) {
    return parts[0];
  }

  return "Região não informada";
}

export function calculateElapsedMinutes(value: string): number {
  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return 0;
  }

  return Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));
}

export function formatElapsedDuration(elapsedMinutes: number): string {
  const safeMinutes = Math.max(0, Math.floor(elapsedMinutes));

  if (safeMinutes < 60) {
    return `${safeMinutes} min`;
  }

  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  if (hours < 24) {
    return `${hours} h ${String(minutes).padStart(2, "0")}`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (remainingHours === 0) {
    return `${days} d`;
  }

  return `${days} d ${remainingHours} h`;
}

export function formatRelativeElapsedTime(value: string): string {
  const elapsedMinutes = calculateElapsedMinutes(value);

  if (elapsedMinutes < 60) {
    return `há ${elapsedMinutes} min`;
  }

  const hours = Math.floor(elapsedMinutes / 60);
  const remainingMinutes = elapsedMinutes % 60;

  if (hours < 24) {
    if (remainingMinutes === 0) {
      return `há ${hours} h`;
    }

    return `há ${hours} h ${remainingMinutes} min`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (remainingHours === 0) {
    return `há ${days} d`;
  }

  return `há ${days} d ${remainingHours} h`;
}