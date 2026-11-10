import type {
  AgentPrioritiesSort,
  AgentPriorityItem,
  AgentPriorityMapPoint,
  AgentWorkOccurrenceApiItem,
} from "@/types/agent-priorities";
import type { OperationalPriority } from "@/types/operations";
import { getOccurrenceRegion } from "@/utils/occurrence.utils";

type AgentStatusPresentation = {
  statusLabel: string;
  actionLabel: string;
};

const priorityOrder: Record<OperationalPriority, number> = {
  high: 1,
  medium: 2,
  low: 3,
};

const priorityLabels: Record<OperationalPriority, string> = {
  high: "Prioridade alta",
  medium: "Prioridade média",
  low: "Prioridade baixa",
};

const agentStatusPresentation: Record<string, AgentStatusPresentation> = {
  registered: {
    statusLabel: "Em triagem",
    actionLabel: "Aguardar triagem",
  },

  under_review: {
    statusLabel: "Em análise",
    actionLabel: "Aguardar análise",
  },

  accepted: {
    statusLabel: "Aguardando encaminhamento",
    actionLabel: "Aguardar encaminhamento",
  },

  forwarded_for_inspection: {
    statusLabel: "Pronta para vistoria",
    actionLabel: "Realizar vistoria",
  },

  resolved: {
    statusLabel: "Concluída",
    actionLabel: "Nenhuma ação pendente",
  },

  rejected: {
    statusLabel: "Encerrada",
    actionLabel: "Nenhuma ação pendente",
  },
};

function getPriorityRank(priority: OperationalPriority | null): number {
  if (!priority) {
    return 4;
  }

  return priorityOrder[priority];
}

function getPriorityLabel(priority: OperationalPriority | null): string {
  if (!priority) {
    return "Sem prioridade";
  }

  return priorityLabels[priority];
}

function getAgentStatusPresentation(
  statusKey: string,
  fallbackStatusName: string,
): AgentStatusPresentation {
  return (
    agentStatusPresentation[statusKey] ?? {
      statusLabel: fallbackStatusName,
      actionLabel: "Acompanhar ocorrência",
    }
  );
}

function compareByPriority(
  first: AgentPriorityItem,
  second: AgentPriorityItem,
): number {
  const priorityDifference =
    getPriorityRank(first.priority) - getPriorityRank(second.priority);

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  const firstCreatedAt = new Date(first.createdAt).getTime();

  const secondCreatedAt = new Date(second.createdAt).getTime();

  return firstCreatedAt - secondCreatedAt;
}

export function mapAgentOccurrence(
  occurrence: AgentWorkOccurrenceApiItem,
): AgentPriorityItem {
  const presentation = getAgentStatusPresentation(
    occurrence.status.key,
    occurrence.status.name,
  );

  return {
    id: occurrence.id,

    protocol: occurrence.protocol,

    displayCode: occurrence.protocol.startsWith("#")
      ? occurrence.protocol.toUpperCase()
      : `#${occurrence.protocol.toUpperCase()}`,

    address: occurrence.address,

    region: getOccurrenceRegion(occurrence.address),

    status: occurrence.status,

    statusLabel: presentation.statusLabel,

    actionLabel: presentation.actionLabel,

    priority: occurrence.priority,

    priorityLabel: getPriorityLabel(occurrence.priority),

    createdAt: occurrence.createdAt,

    latitude: occurrence.latitude,

    longitude: occurrence.longitude,
  };
}

export function sortAgentPriorities(
  items: AgentPriorityItem[],
  sortBy: AgentPrioritiesSort,
): AgentPriorityItem[] {
  const sorted = [...items];

  if (sortBy === "area") {
    return sorted.sort((first, second) => {
      const regionDifference = first.region.localeCompare(
        second.region,
        "pt-BR",
      );

      if (regionDifference !== 0) {
        return regionDifference;
      }

      return compareByPriority(first, second);
    });
  }

  if (sortBy === "status") {
    return sorted.sort((first, second) => {
      const statusDifference = first.statusLabel.localeCompare(
        second.statusLabel,
        "pt-BR",
      );

      if (statusDifference !== 0) {
        return statusDifference;
      }

      return compareByPriority(first, second);
    });
  }

  return sorted.sort(compareByPriority);
}

export function createAgentPriorityMapPoints(
  items: AgentPriorityItem[],
): AgentPriorityMapPoint[] {
  const locatedItems = items.filter(
    (
      item,
    ): item is AgentPriorityItem & {
      latitude: number;
      longitude: number;
    } => item.latitude !== null && item.longitude !== null,
  );

  if (locatedItems.length === 0) {
    return [];
  }

  const latitudes = locatedItems.map((item) => item.latitude);

  const longitudes = locatedItems.map((item) => item.longitude);

  const minLatitude = Math.min(...latitudes);

  const maxLatitude = Math.max(...latitudes);

  const minLongitude = Math.min(...longitudes);

  const maxLongitude = Math.max(...longitudes);

  const latitudeRange = maxLatitude - minLatitude;

  const longitudeRange = maxLongitude - minLongitude;

  return locatedItems.map((item, index) => {
    const normalizedX =
      longitudeRange === 0
        ? 0.5
        : (item.longitude - minLongitude) / longitudeRange;

    const normalizedY =
      latitudeRange === 0 ? 0.5 : (maxLatitude - item.latitude) / latitudeRange;

    return {
      id: item.id,

      x: 14 + normalizedX * 72,

      y: 14 + normalizedY * 72,

      selected: index === 0,
    };
  });
}