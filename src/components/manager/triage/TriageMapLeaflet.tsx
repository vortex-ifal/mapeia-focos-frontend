"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import clsx from "clsx";
import "leaflet/dist/leaflet.css";

import { MapControlsLegend } from "@/components/manager/map/MapControlsLegend";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  DETAIL_MAP_ZOOM,
  OSM_ATTRIBUTION,
  OSM_TILE_URL,
} from "@/components/manager/map/map-constants";
import { createOccurrenceDivIcon } from "@/components/manager/map/leaflet-icons";
import type {
  TerritorialContextResponse,
  TriageOccurrence,
} from "@/types/triage";

export type TriageMapVariant = "detail" | "territorial";

export type TriageMapProps = {
  occurrence: TriageOccurrence;
  context: TerritorialContextResponse | null;
  variant: TriageMapVariant;
  loading?: boolean;
  errorMessage?: string | null;
};

export function TriageMapLeaflet({
  occurrence,
  context,
  variant,
  loading = false,
  errorMessage = null,
}: TriageMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const isDetail = variant === "detail";
  const hasCoordinates =
    occurrence.latitude !== null && occurrence.longitude !== null;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const initialCenter: [number, number] = hasCoordinates
      ? [occurrence.latitude!, occurrence.longitude!]
      : DEFAULT_MAP_CENTER;

    const initialZoom = isDetail ? DETAIL_MAP_ZOOM : 15;

    const map = L.map(containerRef.current, {
      center: initialCenter,
      zoom: hasCoordinates ? initialZoom : DEFAULT_MAP_ZOOM,
      zoomControl: !isDetail,
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
  }, [hasCoordinates, isDetail, occurrence.latitude, occurrence.longitude]);

  useEffect(() => {
    const map = mapRef.current;
    const layerGroup = layerGroupRef.current;

    if (!map || !layerGroup) {
      return;
    }

    layerGroup.clearLayers();

    if (!hasCoordinates) {
      map.setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);
      return;
    }

    const centerLatLng: [number, number] = [
      occurrence.latitude!,
      occurrence.longitude!,
    ];

    // Main selected occurrence marker
    const mainMarker = L.marker(centerLatLng, {
      icon: createOccurrenceDivIcon(true),
      zIndexOffset: 1000,
    });

    mainMarker.bindTooltip(occurrence.displayCode, {
      direction: "top",
    });

    layerGroup.addLayer(mainMarker);

    if (isDetail) {
      map.setView(centerLatLng, DETAIL_MAP_ZOOM);
      return;
    }

    // Territorial variant: draw search radius circle and nearby points
    if (context?.radiusMeters) {
      const circle = L.circle(centerLatLng, {
        radius: context.radiusMeters,
        color: "#C94F32",
        weight: 1.5,
        opacity: 0.8,
        fillColor: "#C94F32",
        fillOpacity: 0.08,
        dashArray: "4, 4",
      });

      layerGroup.addLayer(circle);
    }

    if (context?.items && context.items.length > 0) {
      for (const item of context.items) {
        const itemMarker = L.marker([item.latitude, item.longitude], {
          icon: createOccurrenceDivIcon(false),
        });

        const distanceLabel =
          item.distanceMeters !== null
            ? `Registro próximo a ~${Math.round(item.distanceMeters)}m`
            : "Registro próximo";

        itemMarker.bindTooltip(distanceLabel, {
          direction: "top",
        });

        layerGroup.addLayer(itemMarker);
      }
    }

    map.setView(centerLatLng, 15);
  }, [hasCoordinates, occurrence, context, isDetail]);

  return (
    <div
      aria-label={
        isDetail ? "Mapa da ocorrência" : "Mapa de contexto territorial"
      }
      className={clsx(
        `
          relative
          w-full
          min-w-0
          overflow-hidden
          rounded-[14px]
          border
          border-[#E9E0D4]
          bg-[#F4EFE6]
        `,
        isDetail ? "h-[220px]" : "h-[360px]",
      )}
    >
      <div
        ref={containerRef}
        role="region"
        tabIndex={0}
        aria-label={
          isDetail ? "Mini mapa da ocorrência" : "Mapa territorial da ocorrência"
        }
        className="h-full w-full rounded-[14px] focus:outline-none"
      />

      {loading ? (
        <div
          className="
            absolute
            inset-0
            z-[1000]
            flex
            items-center
            justify-center
            bg-[#F4EFE6]/80
            px-4
            text-center
            text-[12px]
            text-[#716B67]
          "
        >
          Carregando contexto territorial...
        </div>
      ) : null}

      {!loading && errorMessage ? (
        <div
          role="alert"
          className="
            absolute
            left-1/2
            top-1/2
            z-[1000]
            w-[calc(100%-32px)]
            -translate-x-1/2
            -translate-y-1/2
            rounded-[10px]
            bg-white
            px-4
            py-3
            text-center
            text-[12px]
            leading-[1.4]
            text-[#9D352D]
            shadow-sm
          "
        >
          {errorMessage}
        </div>
      ) : null}

      {!loading && !errorMessage && !hasCoordinates ? (
        <div
          className="
            absolute
            left-1/2
            top-1/2
            z-[1000]
            w-[calc(100%-32px)]
            -translate-x-1/2
            -translate-y-1/2
            rounded-[10px]
            bg-white
            px-4
            py-3
            text-center
            text-[12px]
            leading-[1.4]
            text-[#716B67]
            shadow-sm
          "
        >
          Localização não disponível para esta ocorrência.
        </div>
      ) : null}

      {!loading && !errorMessage && hasCoordinates && !isDetail ? (
        <MapControlsLegend
          className="
            absolute
            bottom-[14px]
            left-[14px]
            z-[1000]
          "
        />
      ) : null}
    </div>
  );
}
