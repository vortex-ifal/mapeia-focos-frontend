import type {
  OperationalPriority,
  OperationalStatus,
} from "@/types/operations";

export type ProgressItem = {
  label: string;
  completed: boolean;
};

const priorityLabels: Record<OperationalPriority, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
};

const statusLabels: Record<string, string> = {
  registered: "Nova",
  under_review: "Em análise",
  rejected: "Reprovada",
  accepted: "Validada",
  forwarded_for_inspection: "Encaminhada para vistoria",
  resolved: "Resolvida",
};

export function getOccurrenceStatusLabel(status: OperationalStatus): string {
  return statusLabels[status.key] ?? status.name;
}

export function getOccurrencePriorityLabel(
  priority: OperationalPriority | null,
): string {
  if (!priority) {
    return "Não definida";
  }

  return priorityLabels[priority];
}

export function calculateElapsedMinutes(value: string): number {
  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return 0;
  }

  return Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));
}

export function formatElapsedTime(value: string): string {
  const minutes = calculateElapsedMinutes(value);

  if (minutes < 60) {
    return `há ${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);

  const remainingMinutes = minutes % 60;

  if (hours < 24) {
    if (remainingMinutes === 0) {
      return `há ${hours} h`;
    }

    return `há ${hours} h ${remainingMinutes} min`;
  }

  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;

  if (remainingHours === 0) {
    return `há ${days} d`;
  }

  return `há ${days} d ${remainingHours} h`;
}

export function getOccurrenceRegion(address: string): string {
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length <= 1) {
    return "Região não informada";
  }

  const possibleRegion = parts.find(
    (part, index) =>
      index > 0 &&
      !/^\d+$/.test(part) &&
      !/^arapiraca$/i.test(part) &&
      !/^alagoas$/i.test(part),
  );

  return possibleRegion ?? "Região não informada";
}

export function getLocationContext(
  address: string,
  latitude: number | null,
  longitude: number | null,
): string {
  const region = getOccurrenceRegion(address);

  if (latitude !== null && longitude !== null) {
    return `${region} · localização disponível`;
  }

  return region;
}

export function getOccurrenceProgress(
  status: OperationalStatus,
  priority: OperationalPriority | null,
  createdAt: string,
  updatedAt: string,
): ProgressItem[] {
  const registered: ProgressItem = {
    label: `Registrada · ${formatElapsedTime(createdAt)}`,
    completed: true,
  };

  const currentStatus: ProgressItem = {
    label: `${getOccurrenceStatusLabel(
      status,
    )} · atualizado ${formatElapsedTime(updatedAt)}`,
    completed: true,
  };

  if (status.key === "rejected") {
    return [
      registered,
      currentStatus,
      {
        label: "Fluxo encerrado",
        completed: true,
      },
    ];
  }

  if (status.key === "resolved") {
    return [
      registered,
      currentStatus,
      {
        label: "Ocorrência concluída",
        completed: true,
      },
    ];
  }

  if (status.key === "registered") {
    return [
      registered,
      currentStatus,
      {
        label: "Aguardando triagem",
        completed: false,
      },
    ];
  }

  if (status.key === "under_review") {
    return [
      registered,
      currentStatus,
      {
        label: "Aguardando conclusão da triagem",
        completed: false,
      },
    ];
  }

  if (status.key === "accepted" && !priority) {
    return [
      registered,
      currentStatus,
      {
        label: "Aguardando definição de prioridade",
        completed: false,
      },
    ];
  }

  if (status.key === "accepted" && priority) {
    return [
      registered,
      currentStatus,
      {
        label: "Aguardando atribuição de responsável",
        completed: false,
      },
    ];
  }

  if (status.key === "forwarded_for_inspection") {
    return [
      registered,
      currentStatus,
      {
        label: "Aguardando andamento da vistoria",
        completed: false,
      },
    ];
  }

  return [
    registered,
    currentStatus,
    {
      label: "Aguardando próximo andamento",
      completed: false,
    },
  ];
}