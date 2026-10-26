import {
  getOccurrenceDraft,
  saveOccurrenceDraft,
} from "@/controllers/citizen/occurrence.controller";
import type { LocationSource } from "@/types/occurrence";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type SelectedLocation = {
  address: string;
  context?: string;
  source: LocationSource;
  latitude?: number;
  longitude?: number;
};

export type LocationErrorReason =
  | "denied"
  | "unavailable"
  | "timeout"
  | "unsupported";

export class LocationRequestError extends Error {
  constructor(
    public readonly reason: LocationErrorReason,
    message: string,
  ) {
    super(message);
    this.name = "LocationRequestError";
  }
}

export function requestCurrentCoordinates(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(
        new LocationRequestError(
          "unsupported",
          "Seu navegador não oferece suporte à localização.",
        ),
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6)),
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(
            new LocationRequestError(
              "denied",
              "A localização não foi permitida.",
            ),
          );

          return;
        }

        if (error.code === error.TIMEOUT) {
          reject(
            new LocationRequestError(
              "timeout",
              "Não foi possível obter sua localização a tempo.",
            ),
          );

          return;
        }

        reject(
          new LocationRequestError(
            "unavailable",
            "Não foi possível obter sua localização.",
          ),
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  });
}

export function saveSelectedLocation(location: SelectedLocation) {
  const currentDraft = getOccurrenceDraft() ?? {
    address: "",
    situationType: "",
    description: "",
  };

  saveOccurrenceDraft({
    ...currentDraft,

    address: location.address,

    latitude: location.source === "gps" ? location.latitude : undefined,

    longitude: location.source === "gps" ? location.longitude : undefined,

    locationSource: location.source,

    locationContext:
      location.context ??
      (location.source === "gps"
        ? "Localização obtida pelo GPS"
        : "Endereço informado manualmente"),
  });
}