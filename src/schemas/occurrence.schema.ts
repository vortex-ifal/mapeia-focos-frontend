import { z } from "zod";

export const occurrenceSchema = z.object({
  address: z
    .string()
    .trim()
    .min(3, "O endereço deve conter no mínimo 3 caracteres."),

  situationType: z.string().min(1, "Selecione o tipo da situação."),

  description: z
    .string()
    .trim()
    .min(5, "A descrição deve conter no mínimo 5 caracteres."),

  name: z.string().trim().optional(),

  email: z
    .string()
    .trim()
    .email("Informe um e-mail válido.")
    .or(z.literal(""))
    .optional(),

  phone: z.string().trim().optional(),

  evidenceNames: z.array(z.string()).optional(),

  latitude: z.number().optional(),

  longitude: z.number().optional(),
});

export type OccurrenceSchema = z.infer<typeof occurrenceSchema>;
