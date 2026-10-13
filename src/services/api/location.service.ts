type NominatimAddress = {
  house_number?: string;
  road?: string;
  pedestrian?: string;
  footway?: string;
  neighbourhood?: string;
  suburb?: string;
  quarter?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
};

type NominatimReverseResponse = {
  display_name?: string;
  address?: NominatimAddress;
};

export type ReverseGeocodeResult = {
  address: string;
  context: string;
};

const REVERSE_GEOCODE_TIMEOUT_MS = 8000;

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<ReverseGeocodeResult> {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(latitude),
    lon: String(longitude),
    addressdetails: "1",
    zoom: "18",
    "accept-language": "pt-BR",
  });

  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, REVERSE_GEOCODE_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
        },

        signal: controller.signal,
      },
    );

    if (!response.ok) {
      throw new Error("Não foi possível identificar o endereço.");
    }

    const data = (await response.json()) as NominatimReverseResponse;

    const details = data.address ?? {};

    const street =
      details.road ??
      details.pedestrian ??
      details.footway ??
      details.neighbourhood;

    const primaryAddress =
      [street, details.house_number].filter(Boolean).join(", ") ||
      data.display_name?.split(",").slice(0, 3).join(",").trim();

    const neighbourhood =
      details.neighbourhood ?? details.suburb ?? details.quarter;

    const city =
      details.city ?? details.town ?? details.village ?? details.municipality;

    return {
      address:
        primaryAddress || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,

      context:
        [neighbourhood, city].filter(Boolean).join(" · ") ||
        "Localização obtida pelo GPS",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
