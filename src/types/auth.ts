export type UserRole = "citizen" | "agent" | "manager";

export type UserProfileName = "Cidadão" | "Agente" | "Gestor";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  perfil: UserProfileName;
}

export interface LoginResult {
  success: boolean;
  user?: AuthenticatedUser;
  error?: string;
}

