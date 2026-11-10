"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { MapControlsLegend } from "@/components/manager/map/MapControlsLegend";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  OSM_ATTRIBUTION,
  OSM_TILE_URL,
} from "@/components/manager/map/map-constants";
import { createOccurrenceDivIcon } from "@/components/manager/map/leaflet-icons";
import type { OperationalOccurrence } from "@/types/operations";

export type OperationalMapProps = {
  occurrences: OperationalOccurrence[];
  selectedOccurrenceId: string | null;
  onSelectOccurrence: (occurrenceId: string) => void;
};

export function OperationalMapLeaflet({
  occurrences,
  selectedOccurrenceId,
  onSelectOccurrence,
}: OperationalMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const onSelectRef = useRef(onSelectOccurrence);

  useEffect(() => {
    onSelectRef.current = onSelectOccurrence;
  }, [onSelectOccurrence]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = L.map(containerRef.current, {
      center: DEFAULT_MAP_CENTER,
      zoom: DEFAULT_MAP_ZOOM,
      zoomControl: true,
    });

    L.tileLayer(OSM_TILE_URL, {
      attribution: OSM_ATTRIBUTION,
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;
    const markers = markersRef.current;

    return () => {
      map.remove();
      mapRef.current = null;
      markers.clear();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const locatedOccurrences = occurrences.filter(
      (
        occ,
      ): occ is OperationalOccurrence & {
        latitude: number;
        longitude: number;
      } => occ.latitude !== null && occ.longitude !== null,
    );

    const activeIds = new Set(locatedOccurrences.map((occ) => occ.id));

    // Remove obsolete markers
    markersRef.current.forEach((marker, id) => {
      if (!activeIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // Create or update markers
    for (const occ of locatedOccurrences) {
      const isSelected = occ.id === selectedOccurrenceId;
      const existingMarker = markersRef.current.get(occ.id);

      if (existingMarker) {
        existingMarker.setIcon(createOccurrenceDivIcon(isSelected));
        existingMarker.setLatLng([occ.latitude, occ.longitude]);
        existingMarker.setZIndexOffset(isSelected ? 1000 : 0);
      } else {
        const marker = L.marker([occ.latitude, occ.longitude], {
          icon: createOccurrenceDivIcon(isSelected),
          zIndexOffset: isSelected ? 1000 : 0,
        });

        marker.bindTooltip(occ.displayCode, {
          direction: "top",
        });

        marker.on("click", () => {
          onSelectRef.current(occ.id);
        });

        marker.addTo(map);
        markersRef.current.set(occ.id, marker);
      }
    }
  }, [occurrences, selectedOccurrenceId]);

  // Smoothly center on selected occurrence when selection changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedOccurrenceId) {
      return;
    }

    const selectedOcc = occurrences.find(
      (occ) => occ.id === selectedOccurrenceId,
    );

    if (
      selectedOcc &&
      selectedOcc.latitude !== null &&
      selectedOcc.longitude !== null
    ) {
      map.panTo([selectedOcc.latitude, selectedOcc.longitude], {
        animate: true,
        duration: 0.8,
      });
    }
  }, [selectedOccurrenceId, occurrences]);

  const locatedOccurrencesCount = occurrences.filter(
    (occ) => occ.latitude !== null && occ.longitude !== null,
  ).length;

  return (
    <section
      aria-label="Mapa operacional"
      className="
        relative
        h-[600px]
        w-full
        min-w-0
        overflow-hidden
        rounded-[18px]
        border
        border-[#E9E0D4]
        bg-[#F4EFE6]
        lg:h-full
        lg:min-h-0
      "
    >
      <div
        ref={containerRef}
        role="region"
        aria-label="Mapa operacional georreferenciado de Arapiraca"
        tabIndex={0}
        className="
          h-full
          w-full
          min-h-[500px]
          rounded-[18px]
          focus:outline-none
        "
      />

      {occurrences.length > 0 && locatedOccurrencesCount === 0 ? (
        <div
          className="
            absolute
            left-1/2
            top-1/2
            z-[1000]
            -translate-x-1/2
            -translate-y-1/2
            rounded-[12px]
            border
            border-[#E9E0D4]
            bg-white
            px-4
            py-3
            text-center
            text-[12px]
            text-[#716B67]
            shadow-sm
          "
        >
          Nenhuma ocorrência possui localização disponível.
        </div>
      ) : null}

      <MapControlsLegend
        className="
          absolute
          bottom-[14px]
          left-[14px]
          z-[1000]
        "
      />
    </section>
  );
}
