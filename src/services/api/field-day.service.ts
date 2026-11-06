import { getAllOccurrences } from "@/services/api/occurrences-list.service";
import type { OccurrenceListApiItem } from "@/types/occurrences-list";

export async function getFieldDayOccurrences(): Promise<OccurrenceListApiItem[]> {
  return getAllOccurrences();
}
