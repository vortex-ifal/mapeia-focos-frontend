import { z } from "zod";

export const occurrenceSchema = z.object({
  endereco: z.string().trim().min(3, "O endereço deve conter no mínimo 3 caracteres."),
  tipo_situacao: z.string().min(1, "Selecione o tipo da situação."),
  descricao: z.string().trim().min(5, "A descrição deve conter no mínimo 5 caracteres."),
  nome: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .email("Informe um e-mail válido.")
    .or(z.literal(""))
    .optional(),
  telefone: z.string().trim().optional(),
  evidencia_nome: z.string().optional(),
});

export type OccurrenceSchema = z.infer<typeof occurrenceSchema>;