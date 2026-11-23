export type UserRole = "citizen" | "agent" | "manager";

export type UserProfileName = "Cidadão" | "Agente" | "Gestor";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  perfil: UserProfileName;
  token?: string;
}

export interface LoginResult {
  success: boolean;
  user?: AuthenticatedUser;
  error?: string;
}

export interface RegisterResult {
  success: boolean;
  user?: AuthenticatedUser;
  error?: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface CreatedUserResponse {
  id: string;
}
