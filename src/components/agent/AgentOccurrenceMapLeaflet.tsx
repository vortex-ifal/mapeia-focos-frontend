"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import clsx from "clsx";
import "leaflet/dist/leaflet.css";

import { MapControlsLegend } from "@/components/manager/map/MapControlsLegend";
import {
  DETAIL_MAP_ZOOM,
  OSM_ATTRIBUTION,
  OSM_TILE_URL,
} from "@/components/manager/map/map-constants";
import { createOccurrenceDivIcon } from "@/components/manager/map/leaflet-icons";
import { MapMarker } from "@/components/manager/map/MapMarker";

export type AgentOccurrenceMapProps = {
  latitude: number | null;
  longitude: number | null;
  displayCode?: string;
  className?: string;
};

const fallbackRoadSegments = [
  { left: "-10%", top: "18%", width: "120%", height: "16px", rotation: "12deg" },
  { left: "-8%", top: "45%", width: "118%", height: "14px", rotation: "-10deg" },
  { left: "-12%", top: "70%", width: "124%", height: "16px", rotation: "6deg" },
  { left: "20%", top: "-8%", width: "14px", height: "116%", rotation: "16deg" },
  { left: "55%", top: "-10%", width: "16px", height: "120%", rotation: "-8deg" },
  { left: "82%", top: "-8%", width: "14px", height: "116%", rotation: "12deg" },
];

export function AgentOccurrenceMapLeaflet({
  latitude,
  longitude,
  displayCode,
  className,
}: AgentOccurrenceMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const hasCoordinates = latitude !== null && longitude !== null;

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !hasCoordinates) {
      return;
    }

    const centerLatLng: [number, number] = [latitude, longitude];

    const map = L.map(containerRef.current, {
      center: centerLatLng,
      zoom: DETAIL_MAP_ZOOM,
      zoomControl: false,
    });

    L.tileLayer(OSM_TILE_URL, {
      attribution: OSM_ATTRIBUTION,
      maxZoom: 19,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      layerGroupRef.current = null;
    };
  }, [hasCoordinates, latitude, longitude]);

  useEffect(() => {
    const map = mapRef.current;
    const layerGroup = layerGroupRef.current;

    if (!map || !layerGroup || !hasCoordinates) {
      return;
    }

    layerGroup.clearLayers();

    const centerLatLng: [number, number] = [latitude, longitude];

    // Light beige halo representing the focus radius
    const halo = L.circle(centerLatLng, {
      radius: 90,
      color: "transparent",
      fillColor: "#FAEBC8",
      fillOpacity: 0.7,
    });
    layerGroup.addLayer(halo);

    // Selected occurrence marker
    const marker = L.marker(centerLatLng, {
      icon: createOccurrenceDivIcon(true),
      zIndexOffset: 1000,
    });

    if (displayCode) {
      marker.bindTooltip(displayCode, {
        direction: "top",
      });
    }

    layerGroup.addLayer(marker);
    map.setView(centerLatLng, DETAIL_MAP_ZOOM);
  }, [hasCoordinates, latitude, longitude, displayCode]);

  return (
    <div
      aria-label="Mapa da ocorrência"
      className={clsx(
        `
          relative
          h-[240px]
          w-full
          min-w-0
          overflow-hidden
          rounded-[16px]
          border
          border-[#E9E0D4]
          bg-[#F4EFE6]
        `,
        className,
      )}
    >
      {hasCoordinates ? (
        <div
          ref={containerRef}
          role="region"
          tabIndex={0}
          aria-label="Mapa georreferenciado da ocorrência"
          className="h-full w-full rounded-[16px] focus:outline-none"
        />
      ) : (
        /* Schematic map fallback when coordinates are not available */
        <div
          aria-hidden="true"
          className="relative h-full w-full overflow-hidden"
        >
          {fallbackRoadSegments.map((road, index) => (
            <span
              key={index}
              className="absolute bg-white/90"
              style={{
                left: road.left,
                top: road.top,
                width: road.width,
                height: road.height,
                transform: `rotate(${road.rotation})`,
                transformOrigin: "center",
              }}
            />
          ))}

          {/* Halo and marker centered */}
          <div
            className="
              absolute
              left-1/2
              top-1/2
              flex
              h-32
              w-32
              -translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              bg-[#FAEBC8]/70
            "
          >
            <MapMarker selected size="map" />
          </div>
        </div>
      )}

      <MapControlsLegend
        className="
          absolute
          bottom-3
          left-3
          right-3
          z-[1000]
          !w-auto
          !max-w-none
          shadow-sm
        "
      />
    </div>
  );
}
