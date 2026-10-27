import type { LoginFormData } from "@/schemas/auth.schema";

export const MOCK_CITIZEN_CREDENTIALS = {
  email: "cidadao@teste.com",
  password: "123456",
} as const;

export const MOCK_MANAGER_CREDENTIALS = {
  email: "admin@gestao.com",
  password: "123456",
} as const;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateCitizenCredentials(
  credentials: LoginFormData,
): boolean {
  return (
    normalizeEmail(credentials.email) === MOCK_CITIZEN_CREDENTIALS.email &&
    credentials.password === MOCK_CITIZEN_CREDENTIALS.password
  );
}

export function validateManagerCredentials(
  credentials: LoginFormData,
): boolean {
  return (
    normalizeEmail(credentials.email) === MOCK_MANAGER_CREDENTIALS.email &&
    credentials.password === MOCK_MANAGER_CREDENTIALS.password
  );
}