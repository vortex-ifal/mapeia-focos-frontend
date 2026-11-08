"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { HeatLayer } from "leaflet.heat";
import "leaflet/dist/leaflet.css";

import { HeatMapLegend } from "@/components/manager/heatmap/HeatMapLegend";
import {
  ARAPIRACA_CENTER,
  ARAPIRACA_ZOOM,
} from "@/controllers/manager/heatmap.controller";
import type { HeatMapPoint } from "@/types/heatmap";

type RiskHeatMapProps = {
  points: HeatMapPoint[];
  total: number;
};

export function RiskHeatMap({ points, total }: RiskHeatMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<HeatLayer | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = L.map(containerRef.current, {
      center: ARAPIRACA_CENTER,
      zoom: ARAPIRACA_ZOOM,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      heatLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const heatLatLngs: [number, number, number][] = points.map((p) => [
      p.latitude,
      p.longitude,
      1,
    ]);

    if (heatLayerRef.current) {
      heatLayerRef.current.setLatLngs(heatLatLngs);
    } else {
      const heatLayer = new HeatLayer(heatLatLngs, {
        radius: 35,
        blur: 20,
        maxZoom: 15,
        minOpacity: 0.45,
        gradient: {
          0.1: "#FACC15",
          0.35: "#FB923C",
          0.6: "#F97316",
          0.8: "#EF4444",
          1.0: "#991B1B",
        },
      });

      heatLayer.addTo(map);
      heatLayerRef.current = heatLayer;
    }

    map.setView(ARAPIRACA_CENTER, ARAPIRACA_ZOOM);
  }, [points]);

  function handleRecenter() {
    if (mapRef.current) {
      mapRef.current.flyTo(ARAPIRACA_CENTER, ARAPIRACA_ZOOM, {
        duration: 1.2,
      });
    }
  }

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        role="region"
        aria-label="Mapa de calor de risco em Arapiraca"
        tabIndex={0}
        className="
          h-full
          w-full
          min-h-[500px]
          rounded-[18px]
          focus:outline-none
        "
      />

      <HeatMapLegend
        total={total}
        onRecenter={handleRecenter}
        className="
          absolute
          bottom-4
          left-4
          z-[1000]
        "
      />
    </div>
  );
}
