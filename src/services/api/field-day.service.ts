import { getAllOccurrences } from "@/services/api/occurrences-list.service";
import type { FieldDayData } from "@/types/agent";
import type { OccurrenceListApiItem } from "@/types/occurrences-list";

// TODO(agent-api): replace this fixture with the dedicated agent API after it is merged.
export const FIELD_DAY_FIXTURE: FieldDayData = {
  stats: {
    assignedActivitiesCount: 4,
    highPriorityCount: 1,
    indicatedInspectionsCount: 1,
  },
  nextPriority: {
    id: "fixture-0248",
    protocol: "MF-0248",
    displayCode: "#MF-0248",
    statusName: "Validada",
    neighborhood: "Centro",
    waitingMinutes: 18,
    nextAction: "vistoria",
    priority: "high",
  },
};

export async function getFieldDayOccurrences(): Promise<OccurrenceListApiItem[]> {
  return getAllOccurrences();
}

