import type {
  OperationalPriority,
  OperationalStatus,
} from "@/types/operations";
import { getOccurrenceRegion } from "@/utils/occurrence.utils";

export type BadgePresentation = {
  label: string;
  className: string;
};

export type LocationDetailsPresentation = {
  street: string;
  context: string;
};

const priorityPresentations: Record<OperationalPriority, BadgePresentation> = {
  high: {
    label: "Prioridade alta",
    className: "bg-[#FAEBC8] text-[#171717]",
  },
  medium: {
    label: "Prioridade média",
    className: "bg-[#FEF3C7] text-[#92400E]",
  },
  low: {
    label: "Prioridade baixa",
    className: "bg-[#EEE8ED] text-[#584A57]",
  },
};

const defaultPriorityPresentation: BadgePresentation = {
  label: "Sem prioridade",
  className: "bg-[#F4EFE6] text-[#716B67]",
};

const statusPresentations: Record<string, BadgePresentation> = {
  accepted: {
    label: "Validada",
    className: "bg-[#EEE8ED] text-[#584A57]",
  },
  forwarded_for_inspection: {
    label: "Pronta para vistoria",
    className: "bg-[#EEE8ED] text-[#584A57]",
  },
  under_review: {
    label: "Em análise",
    className: "bg-[#EEE8ED] text-[#584A57]",
  },
  registered: {
    label: "Em triagem",
    className: "bg-[#EEE8ED] text-[#584A57]",
  },
  resolved: {
    label: "Resolvida",
    className: "bg-[#E6F4EA] text-[#137333]",
  },
  rejected: {
    label: "Encerrada",
    className: "bg-[#FCE8E6] text-[#C5221F]",
  },
};

export function canStartInspection(
  status: OperationalStatus | string | null | undefined,
): boolean {
  if (!status) {
    return false;
  }

  const key = typeof status === "string" ? status : status.key;
  return key === "accepted" || key === "forwarded_for_inspection";
}

export function getAgentOccurrencePriorityPresentation(
  priority: OperationalPriority | null | undefined,
): BadgePresentation {
  if (!priority) {
    return defaultPriorityPresentation;
  }

  return priorityPresentations[priority] ?? defaultPriorityPresentation;
}

export function getAgentOccurrenceStatusPresentation(
  status: OperationalStatus | string | null | undefined,
): BadgePresentation {
  if (!status) {
    return {
      label: "Não informada",
      className: "bg-[#EEE8ED] text-[#584A57]",
    };
  }

  const key = typeof status === "string" ? status : status.key;
  const name = typeof status === "string" ? status : status.name;

  return (
    statusPresentations[key] ?? {
      label: name || "Status desconhecido",
      className: "bg-[#EEE8ED] text-[#584A57]",
    }
  );
}

export function formatProtocolDisplay(protocol: string | null | undefined): string {
  if (!protocol) {
    return "Ocorrência";
  }

  const trimmed = protocol.trim();
  if (trimmed.startsWith("Ocorrência")) {
    return trimmed;
  }

  const cleanProtocol = trimmed.replace(/^#+/, "");
  return `Ocorrência #${cleanProtocol.toUpperCase()}`;
}

export function getLocationDetails(occurrence: {
  address: string;
  description?: string | null;
  situationType?: string | null;
}): LocationDetailsPresentation {
  const fullAddress = occurrence.address?.trim() ?? "";
  const rawRegion = getOccurrenceRegion(fullAddress);
  const hasValidRegion =
    Boolean(rawRegion) && rawRegion !== "Região não informada";
  const region = hasValidRegion ? rawRegion : "";

  // Split street and potential extra parts
  const addressParts = fullAddress
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  let street = addressParts.length > 0 ? addressParts[0] : fullAddress;
  if (addressParts.length > 1 && /^\d+$/.test(addressParts[1])) {
    street = `${addressParts[0]}, ${addressParts[1]}`;
  }

  const referenceDetail =
    occurrence.description?.trim() || occurrence.situationType?.trim() || "";

  let context = region;
  if (referenceDetail) {
    context = region ? `${region} · ${referenceDetail}` : referenceDetail;
  }

  return {
    street: street || "Endereço não informado",
    context: context || "Localização sem referência adicional",
  };
}

export function getAgentPrioritiesPath(): string {
  return "/dia-em-campo/prioridades";
}

export function getAgentOccurrenceDetailsPath(occurrenceId: string): string {
  return `/dia-em-campo/ocorrencias/${encodeURIComponent(occurrenceId)}`;
}

export { getAgentInspectionPath } from "@/controllers/agent/inspection.controller";

