export function isValidCpf(cpf: string): boolean {
  if (typeof cpf !== "string") {
    return false;
  }

  const cleanCpf = cpf.replace(/\D/g, "");

  if (cleanCpf.length !== 11) {
    return false;
  }

  // Reject CPFs with all repeated digits
  if (/^(\d)\1{10}$/.test(cleanCpf)) {
    return false;
  }

  // Validate 1st verification digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf.charAt(i), 10) * (10 - i);
  }
  let rest = 11 - (sum % 11);
  const firstVerifier = rest >= 10 ? 0 : rest;

  if (firstVerifier !== parseInt(cleanCpf.charAt(9), 10)) {
    return false;
  }

  // Validate 2nd verification digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf.charAt(i), 10) * (11 - i);
  }
  rest = 11 - (sum % 11);
  const secondVerifier = rest >= 10 ? 0 : rest;

  return secondVerifier === parseInt(cleanCpf.charAt(10), 10);
}

export function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  }
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

export function cleanCpf(value: string): string {
  return value.replace(/\D/g, "");
}

