import type {
  AssignmentAgent,
  AssignmentAgentResponse,
  AssignmentOccurrence,
  AssignmentOccurrenceResponse,
} from "@/types/assignment";
import type { OperationalPriority } from "@/types/operations";

const priorityLabels: Record<OperationalPriority, string> = {
  low: "baixa",
  medium: "média",
  high: "alta",
};

const streetPrefixes = [
  "rua ",
  "avenida ",
  "av. ",
  "travessa ",
  "estrada ",
  "rodovia ",
  "alameda ",
  "praça ",
];

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

function looksLikeStreet(value: string): boolean {
  const normalized = normalizeText(value);

  return streetPrefixes.some((prefix) => normalized.startsWith(prefix));
}

export function getAssignmentRegion(address: string): string {
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const explicitNeighborhood = parts.find((part) => /^bairro\s+/i.test(part));

  if (explicitNeighborhood) {
    return explicitNeighborhood.replace(/^bairro\s+/i, "");
  }

  if (parts.length === 0) {
    return "Região não informada";
  }

  if (parts.length >= 2 && looksLikeStreet(parts[0])) {
    return (
      parts.find(
        (part, index) =>
          index > 0 &&
          !/^arapiraca$/i.test(part) &&
          !/^alagoas$/i.test(part) &&
          !/^\d+$/.test(part),
      ) ?? "Região não informada"
    );
  }

  if (parts.length >= 3) {
    return parts[0];
  }

  return parts[0] ?? "Região não informada";
}

export function mapOccurrenceToAssignment(
  occurrence: AssignmentOccurrenceResponse,
): AssignmentOccurrence {
  return {
    id: occurrence.id,
    protocol: occurrence.protocol,
    displayCode: `#${occurrence.protocol.toUpperCase()}`,
    address: occurrence.address,
    region: getAssignmentRegion(occurrence.address),
    priority: occurrence.priority,
    priorityLabel: occurrence.priority
      ? priorityLabels[occurrence.priority]
      : "não definida",
    status: occurrence.status,
  };
}

export function mapAgentToAssignment(
  agent: AssignmentAgentResponse,
): AssignmentAgent {
  return {
    id: agent.agentId,
    name: agent.name,
    region: agent.sectorRegion ?? "Região não informada",
    activeTasks: agent.totalActiveTasks,
  };
}

export function getAgentMetadata(agent: AssignmentAgent): string {
  const taskLabel =
    agent.activeTasks === 1 ? "1 tarefa" : `${agent.activeTasks} tarefas`;

  return `${taskLabel} · ${agent.region}`;
}

export function getOccurrenceAssignmentContext(
  occurrence: AssignmentOccurrence,
): string {
  return `${occurrence.region} · prioridade ${occurrence.priorityLabel}`;
}

export function canAssignOccurrence(occurrence: AssignmentOccurrence): boolean {
  return occurrence.status.key === "accepted" && occurrence.priority !== null;
}

export function formatAssignedElapsed(assignedAt: number): string {
  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - assignedAt) / 60_000),
  );

  return `Atribuída há ${elapsedMinutes} min`;
}