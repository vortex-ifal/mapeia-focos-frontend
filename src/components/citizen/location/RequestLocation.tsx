"use client";

import { ArrowLeft, ChevronDown, Layers3, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import {
  LocationRequestError,
  requestCurrentCoordinates,
  saveSelectedLocation,
} from "@/controllers/citizen/location.controller";
import { getOccurrenceDraft } from "@/controllers/citizen/occurrence.controller";
import { reverseGeocode } from "@/services/api/location.service";

type ScreenMode = "request" | "manual" | "denied";

function TerritoryMap() {
  return (
    <div className="relative h-[300px] w-full overflow-hidden rounded-[18px] border border-[#E9E0D4] bg-[#F4EFE6]">
      {/* Ruas horizontais */}
      <div className="absolute left-[-5%] top-[12%] h-[12px] w-[110%] rotate-[3deg] bg-white" />
      <div className="absolute left-[-5%] top-[27%] h-[10px] w-[110%] -rotate-[2deg] bg-white" />
      <div className="absolute left-[-5%] top-[42%] h-[12px] w-[110%] rotate-[3deg] bg-white" />
      <div className="absolute left-[-5%] top-[57%] h-[10px] w-[110%] -rotate-[2deg] bg-white" />
      <div className="absolute left-[-5%] top-[72%] h-[12px] w-[110%] rotate-[2deg] bg-white" />

      {/* Ruas verticais */}
      <div className="absolute left-[14%] top-[-12%] h-[130%] w-[10px] -rotate-[4deg] bg-white" />
      <div className="absolute left-[34%] top-[-12%] h-[130%] w-[10px] rotate-[4deg] bg-white" />
      <div className="absolute left-[64%] top-[-12%] h-[130%] w-[10px] -rotate-[4deg] bg-white" />
      <div className="absolute left-[84%] top-[-12%] h-[130%] w-[10px] rotate-[4deg] bg-white" />

      {/* Localização selecionada */}
      <div className="absolute left-[66%] top-[30%] flex h-[52px] w-[52px] -translate-x-1/2 items-center justify-center rounded-full border border-[#C94F32]/40 bg-[#FBF8F2]/70">
        <span className="h-[14px] w-[14px] rounded-full border-[3px] border-white bg-[#C94F32] shadow-sm" />
      </div>

      {/* Legenda */}
      <div className="absolute bottom-3 left-3 right-3 flex h-[44px] items-center justify-between rounded-[12px] border border-[#E9E0D4] bg-white px-[10px] text-[11px]">
        <div className="flex items-center gap-2 text-[#716B67]">
          <span className="flex items-center gap-1">
            <span className="h-[7px] w-[7px] rounded-full bg-[#584A57]" />
            ocorrência
          </span>

          <span className="flex items-center gap-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#C94F32]/40">
              <span className="h-[6px] w-[6px] rounded-full bg-[#C94F32]" />
            </span>
            selecionada
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-semibold text-[#171717]">
          <Layers3 size={18} />
          Camadas
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
}

export function RequestLocation() {
  const router = useRouter();

  const requestVersionRef = useRef(0);

  const [mode, setMode] = useState<ScreenMode>("request");

  const [manualAddress, setManualAddress] = useState(
    () => getOccurrenceDraft()?.endereco ?? "",
  );

  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    return () => {
      requestVersionRef.current += 1;
    };
  }, []);

  function invalidateGpsRequest() {
    requestVersionRef.current += 1;

    setIsLocating(false);
  }

  function handleBack() {
    invalidateGpsRequest();

    router.back();
  }

  function handleOpenManual() {
    invalidateGpsRequest();

    setMode("manual");
  }

  async function handleCurrentLocation() {
    if (isLocating) {
      return;
    }

    const requestVersion = ++requestVersionRef.current;

    setIsLocating(true);

    try {
      const coordinates = await requestCurrentCoordinates();

      if (requestVersionRef.current !== requestVersion) {
        return;
      }

      let address = `${coordinates.latitude.toFixed(
        6,
      )}, ${coordinates.longitude.toFixed(6)}`;

      let context = "Localização obtida pelo GPS";

      try {
        const resolved = await reverseGeocode(
          coordinates.latitude,
          coordinates.longitude,
        );

        if (requestVersionRef.current !== requestVersion) {
          return;
        }

        address = resolved.address;

        context = resolved.context;
      } catch {
        if (requestVersionRef.current !== requestVersion) {
          return;
        }

        toast.info(
          "Localização obtida, mas não foi possível identificar o endereço automaticamente.",
        );
      }

      if (requestVersionRef.current !== requestVersion) {
        return;
      }

      saveSelectedLocation({
        address,
        context,
        source: "gps",
        ...coordinates,
      });

      router.push("/nova-ocorrencia");
    } catch (error) {
      if (requestVersionRef.current !== requestVersion) {
        return;
      }

      if (error instanceof LocationRequestError) {
        if (error.reason === "denied") {
          setMode("denied");

          return;
        }

        if (error.reason === "unsupported") {
          setMode("manual");

          toast.warning(error.message);

          return;
        }

        setMode("request");

        toast.warning(error.message);

        return;
      }

      setMode("request");

      toast.warning("Não foi possível obter sua localização. Tente novamente.");
    } finally {
      if (requestVersionRef.current === requestVersion) {
        setIsLocating(false);
      }
    }
  }

  function handleManualLocation() {
    const address = manualAddress.trim();

    if (address.length < 3) {
      toast.warning("Informe um endereço ou referência.");

      return;
    }

    invalidateGpsRequest();

    saveSelectedLocation({
      address,
      context: "Endereço informado manualmente",
      source: "manual",
    });

    router.push("/nova-ocorrencia");
  }

  const showManualField = mode === "manual" || mode === "denied";

  return (
    <main className="min-h-dvh bg-[#FBF8F2] text-[#171717]">
      <div className="mx-auto min-h-dvh w-full px-[18px] pb-[22px] pt-[18px] md:max-w-[760px] md:px-8">
        <header className="flex h-[52px] items-center">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Voltar"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[#E9E0D4] bg-white"
          >
            <ArrowLeft size={20} />
          </button>

          <h1 className="ml-[10px] text-[18px] font-bold">Localização</h1>
        </header>

        <h2 className="mt-[14px] w-full text-[24px] font-extrabold leading-normal">
          Onde está a situação observada?
        </h2>

        <div className="mt-[14px]">
          <TerritoryMap />
        </div>

        <div
          className={`mt-[14px] flex items-center rounded-[12px] border border-[#E9E0D4] px-[12px] ${
            mode === "denied"
              ? "min-h-[94px] bg-[#FAEBC8]"
              : showManualField
                ? "min-h-[94px] bg-[#EEE8ED]"
                : "min-h-[80px] bg-[#EEE8ED]"
          }`}
        >
          <p className="text-[12px] font-medium leading-[16px] text-[#584A57]">
            {mode === "denied"
              ? "A localização não foi permitida. Você ainda pode informar o endereço manualmente."
              : mode === "manual"
                ? "Informe o local manualmente. Não é necessário permitir acesso ao GPS."
                : "Permita o uso da sua localização para posicionar o mapa."}
          </p>
        </div>

        {showManualField ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();

              handleManualLocation();
            }}
          >
            <label className="mt-[14px] block min-h-[72px] rounded-[12px] border border-[#E9E0D4] bg-white px-[12px] py-[10px]">
              <span className="block text-[12px] font-semibold text-[#716B67]">
                Endereço ou referência
              </span>

              <input
                value={manualAddress}
                onChange={(event) => setManualAddress(event.target.value)}
                autoFocus
                placeholder={
                  mode === "denied"
                    ? "Digite uma rua, bairro ou ponto de referência"
                    : "Rua, bairro ou ponto de referência"
                }
                className="mt-[6px] w-full bg-transparent text-[14px] text-[#171717] outline-none placeholder:text-[#666666]"
              />
            </label>

            <button
              type="submit"
              className="mt-[14px] flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#C94F32] px-4 text-[14px] font-bold text-white transition hover:bg-[#B9472E] active:scale-[0.99]"
            >
              Confirmar localização
            </button>
          </form>
        ) : (
          <>
            <button
              type="button"
              onClick={() => void handleCurrentLocation()}
              disabled={isLocating}
              className="mt-[14px] flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#C94F32] px-4 text-[14px] font-bold text-white transition hover:bg-[#B9472E] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLocating ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Obtendo localização...
                </>
              ) : (
                "Usar minha localização"
              )}
            </button>

            <button
              type="button"
              onClick={handleOpenManual}
              className="mt-[14px] flex h-[48px] w-full items-center justify-center rounded-[12px] border border-[#E9E0D4] bg-white px-4 text-[14px] font-bold text-[#171717] transition hover:bg-[#F4EFE6] active:scale-[0.99]"
            >
              Informar manualmente
            </button>
          </>
        )}
      </div>
    </main>
  );
}
