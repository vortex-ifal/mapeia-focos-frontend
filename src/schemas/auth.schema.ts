import { z } from "zod";

import { isValidCpf } from "@/utils/cpf.utils";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .email("Informe um e-mail válido."),
  password: z
    .string()
    .min(1, "Informe sua senha.")
    .min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerCitizenSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .max(255, "O nome deve conter no máximo 255 caracteres.")
      .refine((val) => val.length === 0 || val.length >= 3, {
        message: "O nome deve conter no mínimo 3 caracteres.",
      })
      .optional()
      .or(z.literal("")),
    cpf: z
      .string()
      .trim()
      .min(1, "Informe seu CPF.")
      .refine((val) => isValidCpf(val), {
        message: "Informe um CPF válido com 11 dígitos.",
      }),
    email: z
      .string()
      .trim()
      .min(1, "Informe seu e-mail.")
      .email("Informe um e-mail válido.")
      .max(255, "O e-mail deve conter no máximo 255 caracteres."),
    password: z
      .string()
      .min(1, "Informe sua senha.")
      .min(6, "A senha deve conter no mínimo 6 caracteres.")
      .max(72, "A senha deve conter no máximo 72 caracteres."),
    confirmPassword: z.string().min(1, "Confirme sua senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type RegisterCitizenFormData = z.infer<typeof registerCitizenSchema>;

export interface RegisterBackendPayload {
  name: string;
  email: string;
  password: string;
  cpf: string;
}
