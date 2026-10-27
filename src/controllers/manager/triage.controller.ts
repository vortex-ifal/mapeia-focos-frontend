import type {
  OccurrenceListItemResponse,
  TerritorialContextResponse,
  TriageMapPoint,
  TriageOccurrence,
  TriagePhase,
} from "@/types/triage";

const MAP_PADDING_PERCENT = 14;
const MAP_CONTENT_PERCENT = 72;

type CoordinateItem = {
  id: string;
  latitude: number;
  longitude: number;
  selected: boolean;
  distanceMeters: number | null;
};

export function mapOccurrenceToTriage(
  occurrence: OccurrenceListItemResponse,
): TriageOccurrence {
  return {
    id: occurrence.id,
    protocol: occurrence.protocol,
    displayCode: `#${occurrence.protocol.toUpperCase()}`,
    address: occurrence.address,
    latitude: occurrence.latitude,
    longitude: occurrence.longitude,
    createdAt: occurrence.createdAt,
    waitingMinutes: occurrence.waitingMinutes,
    status: occurrence.status,

    // The current list API does not expose these fields yet.
    description: null,
    evidence: [],
  };
}

export function getInitialTriagePhase(statusKey: string): TriagePhase {
  if (
    statusKey === "accepted" ||
    statusKey === "forwarded_for_inspection" ||
    statusKey === "resolved"
  ) {
    return "validated";
  }

  return "review";
}

export function getLocationContext(occurrence: TriageOccurrence): string {
  if (occurrence.latitude !== null && occurrence.longitude !== null) {
    return "Coordenadas disponíveis para revisão.";
  }

  return "Localização geográfica não disponível.";
}

export function getOccurrenceDescription(occurrence: TriageOccurrence): string {
  return occurrence.description ?? "Descrição não disponível nesta listagem.";
}

export function createTriageMapPoints(
  occurrence: TriageOccurrence,
  context: TerritorialContextResponse | null,
): TriageMapPoint[] {
  const coordinates: CoordinateItem[] = [];

  if (occurrence.latitude !== null && occurrence.longitude !== null) {
    coordinates.push({
      id: occurrence.id,
      latitude: occurrence.latitude,
      longitude: occurrence.longitude,
      selected: true,
      distanceMeters: 0,
    });
  }

  if (context) {
    for (const item of context.items) {
      coordinates.push({
        id: item.id,
        latitude: item.latitude,
        longitude: item.longitude,
        selected: false,
        distanceMeters: item.distanceMeters,
      });
    }
  }

  if (coordinates.length === 0) {
    return [];
  }

  const latitudes = coordinates.map((item) => item.latitude);

  const longitudes = coordinates.map((item) => item.longitude);

  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);

  const minLongitude = Math.min(...longitudes);

  const maxLongitude = Math.max(...longitudes);

  const latitudeRange = maxLatitude - minLatitude;

  const longitudeRange = maxLongitude - minLongitude;

  return coordinates.map((item) => {
    const normalizedX =
      longitudeRange === 0
        ? 0.5
        : (item.longitude - minLongitude) / longitudeRange;

    const normalizedY =
      latitudeRange === 0 ? 0.5 : (maxLatitude - item.latitude) / latitudeRange;

    return {
      id: item.id,
      selected: item.selected,
      distanceMeters: item.distanceMeters,
      x: MAP_PADDING_PERCENT + normalizedX * MAP_CONTENT_PERCENT,
      y: MAP_PADDING_PERCENT + normalizedY * MAP_CONTENT_PERCENT,
    };
  });
}