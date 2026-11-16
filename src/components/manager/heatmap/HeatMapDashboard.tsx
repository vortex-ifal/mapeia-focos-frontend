"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";

import { DesktopNavigationRail } from "@/components/manager/navigation/DesktopNavigationRail";
import { ManagerHomeShortcut } from "@/components/manager/navigation/ManagerHomeShortcut";
import { getHeatMapData } from "@/services/api/heatmap.service";

const RiskHeatMap = dynamic(
  () =>
    import("@/components/manager/heatmap/RiskHeatMap").then(
      (mod) => mod.RiskHeatMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        aria-live="polite"
        className="
          flex
          h-full
          w-full
          min-h-[500px]
          items-center
          justify-center
          bg-[#F4EFE6]
        "
      >
        <span className="text-[12px] text-[#716B67]">
          Inicializando mapa...
        </span>
      </div>
    ),
  },
);

export function HeatMapDashboard() {
  const heatMapQuery = useQuery({
    queryKey: ["manager", "heatmap"],
    queryFn: getHeatMapData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  const points = heatMapQuery.data?.points ?? [];
  const total = heatMapQuery.data?.total ?? 0;

  const errorMessage =
    heatMapQuery.error instanceof Error
      ? heatMapQuery.error.message
      : "Não foi possível carregar o mapa de calor.";

  return (
    <main
      className="
        min-h-dvh
        overflow-x-hidden
        bg-[#FBF8F2]
        text-[#171717]
      "
    >
      <div
        className="
          mx-auto
          min-h-dvh
          w-full
          max-w-[1440px]
          px-5
          pb-5
          pt-[30px]
        "
      >
        <header
          className="
            flex
            h-14
            items-start
            gap-4
            lg:grid
            lg:grid-cols-[64px_minmax(0,1fr)]
            lg:gap-3
          "
        >
          <ManagerHomeShortcut className="ml-1" />

          <div className="flex flex-col">
            <h1
              className="
                pt-2
                text-[30px]
                font-extrabold
                leading-[1.2]
                tracking-[-0.6px]
                text-[#171717]
              "
            >
              Mapa de Calor
            </h1>
          </div>
        </header>

        <div
          className="
            mt-6
            grid
            min-w-0
            grid-cols-1
            gap-4
            lg:grid-cols-[64px_minmax(0,1fr)]
            lg:gap-3
          "
        >
          <DesktopNavigationRail />

          <section
            aria-label="Visualização do mapa de calor de risco"
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
              shadow-xs
              lg:h-[calc(100dvh-132px)]
              lg:min-h-[560px]
              lg:max-h-[768px]
            "
          >
            {heatMapQuery.isPending ? (
              <div
                role="status"
                aria-live="polite"
                className="
                  absolute
                  inset-0
                  z-10
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-3
                  bg-[#F4EFE6]/90
                  px-4
                  text-center
                "
              >
                <div
                  aria-hidden="true"
                  className="
                    h-8
                    w-8
                    animate-spin
                    rounded-full
                    border-3
                    border-[#C94F32]
                    border-t-transparent
                  "
                />
                <span className="text-[13px] font-medium text-[#716B67]">
                  Carregando mapa de calor de risco...
                </span>
              </div>
            ) : null}

            {heatMapQuery.isError ? (
              <div
                role="alert"
                className="
                  absolute
                  left-1/2
                  top-1/2
                  z-20
                  w-[calc(100%-40px)]
                  max-w-md
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-[16px]
                  border
                  border-[#F8E3E0]
                  bg-white
                  p-6
                  text-center
                  shadow-md
                "
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#F8E3E0] text-[#C94F32]">
                  <AlertCircle size={22} aria-hidden="true" />
                </div>

                <h2 className="mt-3 text-[15px] font-bold text-[#171717]">
                  Erro ao carregar mapa
                </h2>

                <p className="mt-1 text-[13px] leading-5 text-[#716B67]">
                  {errorMessage}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    void heatMapQuery.refetch();
                  }}
                  className="
                    mt-4
                    inline-flex
                    items-center
                    gap-2
                    rounded-[10px]
                    bg-[#C94F32]
                    px-4
                    py-2.5
                    text-[13px]
                    font-semibold
                    text-white
                    transition-opacity
                    hover:opacity-90
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#C94F32]
                    focus-visible:ring-offset-2
                  "
                >
                  <RefreshCw size={15} aria-hidden="true" />
                  Tentar novamente
                </button>
              </div>
            ) : null}

            {!heatMapQuery.isPending && !heatMapQuery.isError ? (
              <>
                <RiskHeatMap points={points} total={total} />

                {points.length === 0 ? (
                  <div
                    role="status"
                    className="
                      absolute
                      left-1/2
                      top-6
                      z-[1000]
                      -translate-x-1/2
                      rounded-[12px]
                      border
                      border-[#E9E0D4]
                      bg-white/95
                      px-4
                      py-2.5
                      text-center
                      text-[12px]
                      font-medium
                      text-[#716B67]
                      shadow-sm
                      backdrop-blur-sm
                    "
                  >
                    Nenhum foco confirmado com geolocalização no momento.
                  </div>
                ) : null}
              </>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
