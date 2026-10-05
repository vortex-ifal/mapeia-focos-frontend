import { z } from "zod";

export const occurrenceSchema = z.object({
  endereco: z.string().trim().min(1, "Informe o endereço ou referência."),

  tipo_situacao: z.string().min(1, "Selecione o tipo da situação."),

  descricao: z.string().trim().min(1, "Descreva a situação observada."),

  contato: z.string().trim().optional(),

  evidencia_nome: z.string().optional(),
});

export type OccurrenceSchema = z.infer<typeof occurrenceSchema>;