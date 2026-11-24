import { z } from "zod";

export const inspectionRegistrationSchema = z.object({
  condition: z
    .string()
    .trim()
    .min(1, "Selecione a condição encontrada.")
    .max(100, "A condição encontrada deve ter no máximo 100 caracteres."),

  actionsTaken: z
    .string()
    .trim()
    .min(1, "Informe as ações realizadas.")
    .max(1000, "As ações realizadas devem ter no máximo 1000 caracteres."),

  notes: z
    .string()
    .trim()
    .max(1000, "As observações devem ter no máximo 1000 caracteres."),
});

export type InspectionRegistrationFormData = z.infer<
  typeof inspectionRegistrationSchema
>;
