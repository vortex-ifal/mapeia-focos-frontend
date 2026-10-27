import type {
  OperationalMapPosition,
  OperationalOccurrence,
  TriageQueueItemResponse,
  TriageQueueResponse,
} from "@/types/operations";

const MAP_PADDING_PERCENT = 14;
const MAP_CONTENT_PERCENT = 72;

function createMapPositions(
  items: TriageQueueItemResponse[],
): Map<string, OperationalMapPosition> {
  const locatedItems = items.filter(
    (
      item,
    ): item is TriageQueueItemResponse & {
      latitude: number;
      longitude: number;
    } => item.latitude !== null && item.longitude !== null,
  );

  const positions = new Map<string, OperationalMapPosition>();

  if (locatedItems.length === 0) {
    return positions;
  }

  const latitudes = locatedItems.map((item) => item.latitude);

  const longitudes = locatedItems.map((item) => item.longitude);

  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);

  const minLongitude = Math.min(...longitudes);

  const maxLongitude = Math.max(...longitudes);

  const latitudeRange = maxLatitude - minLatitude;

  const longitudeRange = maxLongitude - minLongitude;

  for (const item of locatedItems) {
    const normalizedX =
      longitudeRange === 0
        ? 0.5
        : (item.longitude - minLongitude) / longitudeRange;

    const normalizedY =
      latitudeRange === 0 ? 0.5 : (maxLatitude - item.latitude) / latitudeRange;

    positions.set(item.id, {
      x: MAP_PADDING_PERCENT + normalizedX * MAP_CONTENT_PERCENT,
      y: MAP_PADDING_PERCENT + normalizedY * MAP_CONTENT_PERCENT,
    });
  }

  return positions;
}

export function mapTriageQueueToOperationalOccurrences(
  response: TriageQueueResponse,
): OperationalOccurrence[] {
  const mapPositions = createMapPositions(response.data);

  return response.data.map((item) => ({
    id: item.id,
    protocol: item.protocol,
    displayCode: `#${item.protocol.toUpperCase()}`,
    address: item.address,
    neighborhood: null,
    locationContext: null,
    latitude: item.latitude,
    longitude: item.longitude,
    createdAt: item.createdAt,
    waitingMinutes: item.waitingMinutes,
    nextAction: null,
    priority: null,
    status: item.status,
    mapPosition: mapPositions.get(item.id) ?? null,
    evidence: [],
  }));
}

export function getInitialSelectedOccurrenceId(
  occurrences: OperationalOccurrence[],
): string | null {
  return occurrences[0]?.id ?? null;
}

export function getOperationalOccurrenceById(
  occurrences: OperationalOccurrence[],
  occurrenceId: string | null,
): OperationalOccurrence | null {
  if (!occurrenceId) {
    return null;
  }

  return (
    occurrences.find((occurrence) => occurrence.id === occurrenceId) ?? null
  );
}

export function formatWaitingTime(waitingMinutes: number): string {
  const safeMinutes = Math.max(0, Math.floor(waitingMinutes));

  if (safeMinutes < 60) {
    return `${safeMinutes} min`;
  }

  const hours = Math.floor(safeMinutes / 60);

  const minutes = safeMinutes % 60;

  if (minutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${String(minutes).padStart(2, "0")}`;
}

export function getHumanTriagePath(occurrenceId: string): string {
  return `/central-operacional/triagem?occurrenceId=${encodeURIComponent(
    occurrenceId,
  )}`;
}