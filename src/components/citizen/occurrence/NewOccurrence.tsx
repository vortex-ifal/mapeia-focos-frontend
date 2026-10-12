"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ChevronDown,
  CircleCheck,
  ImageIcon,
  Layers3,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { ChangeEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";

import {
  getOccurrenceDraftSnapshot,
  saveOccurrenceDraft,
  setPendingFiles,
  getPendingFiles,
} from "@/controllers/citizen/occurrence.controller";
import {
  occurrenceSchema,
  type OccurrenceSchema,
} from "@/schemas/occurrence.schema";
import type { OccurrenceFormData } from "@/types/occurrence";
import { compressImage } from "@/utils/image-compression";
import type { CompressionProgress } from "@/utils/image-compression";

const MAX_MEDIA_COUNT = 3;

function subscribeToDraft() {
  return () => {};
}

function parseDraft(snapshot: string | null): OccurrenceFormData | null {
  if (!snapshot) {
    return null;
  }

  try {
    return JSON.parse(snapshot) as OccurrenceFormData;
  } catch {
    return null;
  }
}



function TerritoryMap({ selected }: { selected: boolean }) {
  return (
    <div className="relative h-[250px] w-full overflow-hidden rounded-[18px] border border-[#E9E0D4] bg-[#F4EFE6]">
      <div className="absolute left-[-40px] top-[35px] h-[11px] w-[470px] rotate-[3deg] bg-white" />
      <div className="absolute left-[-40px] top-[78px] h-[9px] w-[470px] -rotate-[1deg] bg-white" />
      <div className="absolute left-[-40px] top-[122px] h-[11px] w-[470px] rotate-[2deg] bg-white" />
      <div className="absolute left-[-40px] top-[168px] h-[9px] w-[470px] -rotate-[2deg] bg-white" />
      <div className="absolute left-[-40px] top-[214px] h-[11px] w-[470px] rotate-[1deg] bg-white" />

      <div className="absolute left-[63px] top-[-30px] h-[330px] w-[10px] -rotate-[3deg] bg-white" />
      <div className="absolute left-[148px] top-[-30px] h-[330px] w-[10px] rotate-[2deg] bg-white" />
      <div className="absolute left-[236px] top-[-30px] h-[330px] w-[10px] -rotate-[4deg] bg-white" />
      <div className="absolute left-[320px] top-[-30px] h-[330px] w-[10px] rotate-[2deg] bg-white" />

      {selected ? (
        <div className="absolute left-[66%] top-[36%] flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#C94F32]/40 bg-[#FBF8F2]/70">
          <span className="h-[14px] w-[14px] rounded-full border-[3px] border-white bg-[#C94F32] shadow-sm" />
        </div>
      ) : (
        <span className="absolute left-[68%] top-[38%] h-[14px] w-[14px] rounded-full border-[3px] border-white bg-[#584A57] shadow-sm" />
      )}

      <div className="absolute bottom-3 left-3 right-3 flex h-[44px] items-center justify-between rounded-[12px] border border-[#E9E0D4] bg-white px-3 text-[10px]">
        <div className="flex items-center gap-3 text-[#716B67]">
          <span className="flex items-center gap-1">
            <span className="h-[7px] w-[7px] rounded-full bg-[#584A57]" />
            ocorrência
          </span>

          <span className="flex items-center gap-1">
            <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full border border-[#C94F32]/40">
              <span className="h-[6px] w-[6px] rounded-full bg-[#C94F32]" />
            </span>
            selecionada
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-semibold text-[#171717]">
          <Layers3 size={16} />
          Camadas
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
}



function NewOccurrenceForm({ draft }: { draft: OccurrenceFormData | null }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showContact, setShowContact] = useState(
    Boolean(draft?.nome || draft?.email || draft?.telefone),
  );

  // Use in-memory store as single source of truth for media files
  const [mediaFiles, setMediaFiles] = useState<File[]>(() => getPendingFiles());
  const [mediaNames, setMediaNames] = useState<string[]>(() =>
    getPendingFiles().map((f) => f.name),
  );
  const [compressionProgress, setCompressionProgress] =
    useState<CompressionProgress | null>(null);

  const isCompressing = compressionProgress?.status === "loading" ||
    compressionProgress?.status === "compressing";
  const isLimitReached = mediaFiles.length >= MAX_MEDIA_COUNT;

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    control,
    formState: { errors },
  } = useForm<OccurrenceSchema>({
    resolver: zodResolver(occurrenceSchema),
    defaultValues: {
      endereco: draft?.endereco ?? "",
      tipo_situacao: draft?.tipo_situacao ?? "",
      descricao: draft?.descricao ?? "",
      nome: draft?.nome ?? "",
      email: draft?.email ?? "",
      telefone: draft?.telefone ?? "",
      evidencia_nomes: getPendingFiles().map((f) => f.name),
    },
  });

  useEffect(() => {
    if (
      draft?.evidencia_nomes &&
      draft.evidencia_nomes.length > 0 &&
      getPendingFiles().length === 0
    ) {
      toast.info(
        "A página foi recarregada. Selecione as mídias novamente se desejar anexá-las.",
      );
    }
  }, [draft]);

  const endereco =
    useWatch({
      control,
      name: "endereco",
    })?.trim() ?? "";

  const hasLocation = endereco.length > 0;

  const previewUrls = useMemo(() => {
    return mediaFiles.map((file) => URL.createObjectURL(file));
  }, [mediaFiles]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const [isDragging, setIsDragging] = useState(false);

  const processFiles = useCallback(
    async (incomingFiles: FileList | File[]) => {
      if (!incomingFiles || incomingFiles.length === 0) {
        return;
      }

      const filesToProcess = Array.from(incomingFiles);
      const availableSlots = MAX_MEDIA_COUNT - mediaFiles.length;

      if (availableSlots <= 0) {
        toast.warning(`Limite de ${MAX_MEDIA_COUNT} mídias atingido.`);
        return;
      }

      if (filesToProcess.length > availableSlots) {
        toast.warning(
          `Limite de ${MAX_MEDIA_COUNT} mídias. Apenas ${availableSlots} vaga(s) restante(s).`,
        );
        filesToProcess.splice(availableSlots);
      }

      if (filesToProcess.length === 0) {
        return;
      }

      const newFiles: File[] = [];
      const newNames: string[] = [];

      for (const file of filesToProcess) {
        try {
          const compressed = await compressImage(file, (progress) =>
            setCompressionProgress(progress),
          );

          newFiles.push(compressed);
          newNames.push(compressed.name);
        } catch {
          toast.error(`Erro ao comprimir: ${file.name}`);
        }
      }

      setCompressionProgress(null);

      if (newFiles.length > 0) {
        const updatedFiles = [...mediaFiles, ...newFiles];
        const updatedNames = [...mediaNames, ...newNames];

        setMediaFiles(updatedFiles);
        setMediaNames(updatedNames);
        setValue("evidencia_nomes", updatedNames);
        setPendingFiles(updatedFiles);

        toast.success(
          newFiles.length === 1
            ? "Mídia adicionada com sucesso!"
            : `${newFiles.length} mídias adicionadas com sucesso!`,
        );
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [mediaFiles, mediaNames, setValue],
  );

  const handleEvidence = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        void processFiles(event.target.files);
      }
    },
    [processFiles],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!isLimitReached && !isCompressing) {
        setIsDragging(true);
      }
    },
    [isLimitReached, isCompressing],
  );

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);

      if (isLimitReached || isCompressing) {
        return;
      }

      if (event.dataTransfer?.files) {
        void processFiles(event.dataTransfer.files);
      }
    },
    [isLimitReached, isCompressing, processFiles],
  );

  function handleRemoveMedia(index: number) {
    const updatedFiles = mediaFiles.filter((_, i) => i !== index);
    const updatedNames = mediaNames.filter((_, i) => i !== index);

    setMediaFiles(updatedFiles);
    setMediaNames(updatedNames);
    setValue("evidencia_nomes", updatedNames);
    setPendingFiles(updatedFiles);
  }

  function handlePrimaryAction() {
    if (!hasLocation) {
      setFocus("endereco");
    }
  }

  function onSubmit(data: OccurrenceSchema) {
    // Save files to in-memory store before navigating
    setPendingFiles(mediaFiles);

    saveOccurrenceDraft({
      ...data,
      nome: showContact ? data.nome : undefined,
      email: showContact ? data.email : undefined,
      telefone: showContact ? data.telefone : undefined,
      evidencia_nomes: mediaNames.length > 0 ? mediaNames : undefined,
    });

    router.push("/nova-ocorrencia/revisar");
  }


  return (
    <main className="min-h-dvh bg-[#FBF8F2] text-[#171717]">
      <div className="mx-auto w-full max-w-[390px] px-[18px] pb-[22px] pt-[18px]">
        <header className="flex h-[52px] items-center">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Voltar"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[#E9E0D4] bg-white"
          >
            <ArrowLeft size={20} />
          </button>

          <h1 className="ml-[10px] text-[18px] font-bold">Nova ocorrência</h1>
        </header>

        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="mt-[14px]">
            <h2 className="text-[20px] font-bold">Localização</h2>

            <div className="mt-[14px]">
              <TerritoryMap selected={hasLocation} />
            </div>

            {!hasLocation ? (
              <label className="mt-[14px] block h-[72px] rounded-[12px] border border-[#E9E0D4] bg-white px-[13px] py-[11px]">
                <span className="block text-[12px] font-semibold text-[#716B67]">
                  Endereço ou referência
                </span>

                <input
                  {...register("endereco")}
                  placeholder="Informe onde você observou a ocorrência."
                  className="mt-[6px] w-full bg-transparent text-[14px] text-[#171717] outline-none placeholder:text-[#666666]"
                />
              </label>
            ) : (
              <div className="mt-[14px] h-[88px] rounded-[12px] border border-[#E9E0D4] bg-white px-[13px] py-[11px]">
                <p className="text-[14px] font-bold">{endereco}</p>

                <p className="mt-1 text-[12px] text-[#716B67]">
                  Centro · terreno ao lado da praça
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setValue("endereco", "");

                    setTimeout(() => setFocus("endereco"), 0);
                  }}
                  className="mt-2 text-[11px] font-semibold text-[#C94F32]"
                >
                  Alterar localização
                </button>
              </div>
            )}

            {errors.endereco && (
              <p className="mt-1 text-[11px] text-red-600">
                {errors.endereco.message}
              </p>
            )}
          </section>

          <section className="mt-[14px]">
            <h2 className="text-[20px] font-bold">Evidências</h2>

            {/* Upload area */}
            <label
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mt-[14px] flex h-[128px] flex-col items-center justify-center rounded-[12px] border transition-colors ${
                isDragging
                  ? "border-[#C94F32] bg-[#F4EFE6]"
                  : "border-[#E9E0D4] bg-white"
              } ${
                isLimitReached || isCompressing
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer"
              }`}
            >
              {isCompressing ? (
                <>
                  <Loader2
                    size={20}
                    className="animate-spin text-[#C94F32]"
                  />

                  <span className="mt-[6px] text-[14px] font-semibold text-[#C94F32]">
                    Comprimindo imagem...
                  </span>

                  <span className="mt-[6px] text-[12px] text-[#716B67]">
                    {compressionProgress?.fileName}
                  </span>
                </>
              ) : mediaFiles.length > 0 ? (
                <>
                  <CircleCheck size={20} className="text-[#236B4D]" />

                  <span className="mt-[6px] text-[14px] font-semibold text-[#236B4D]">
                    {isLimitReached
                      ? "Limite de 3 mídias atingido"
                      : "Mídia adicionada"}
                  </span>

                  {!isLimitReached && (
                    <span className="mt-[6px] text-[12px] text-[#716B67]">
                      Toque para adicionar mais ({MAX_MEDIA_COUNT - mediaFiles.length} restante{MAX_MEDIA_COUNT - mediaFiles.length !== 1 ? "s" : ""})
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Upload size={20} />

                  <span className="mt-[6px] text-[14px] font-semibold">
                    Adicionar foto ou vídeo
                  </span>

                  <span className="mt-[6px] text-[12px] text-[#716B67]">
                    Imagem ou vídeo
                  </span>
                </>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                disabled={isLimitReached || isCompressing}
                onChange={handleEvidence}
                className="hidden"
              />
            </label>

            {/* Media file list */}
            {mediaNames.length > 0 && (
              <div className="mt-[14px] space-y-[10px]">
                {mediaNames.map((name, index) => (
                  <div
                    key={`${name}-${index}`}
                    className="flex items-start gap-3"
                  >
                    <div className="relative flex h-[82px] w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-[#E9E0D4] bg-[#F4EFE6]">
                      {previewUrls[index] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewUrls[index]}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon size={20} />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col pt-1">
                      <p className="text-[14px] text-[#716B67]">{name}</p>

                      <p className="mt-1 text-[12px] leading-[17px] text-[#716B67]">
                        Imagem selecionada · {index + 1} de {mediaNames.length}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(index)}
                      aria-label={`Remover ${name}`}
                      className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-[#716B67] transition hover:bg-[#F4EFE6] hover:text-[#C94F32]"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-[14px]">
            <h2 className="text-[20px] font-bold">Situação observada</h2>

            <label className="relative mt-[14px] block h-[72px] rounded-[12px] border border-[#E9E0D4] bg-white px-[13px] py-[11px]">
              <span className="block text-[12px] font-semibold text-[#716B67]">
                Tipo
              </span>

              <select
                {...register("tipo_situacao")}
                defaultValue=""
                className="mt-[6px] w-full appearance-none bg-transparent pr-7 text-[14px] outline-none"
              >
                <option value="" disabled>
                  Escolha uma opção
                </option>

                <option value="recipientes_agua_parada">
                  Recipientes com água parada
                </option>

                <option value="agua_acumulada_terreno">
                  Água acumulada em terreno
                </option>

                <option value="reservatorio_destampado">
                  Reservatório destampado
                </option>
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute bottom-[15px] right-[13px]"
              />
            </label>

            {errors.tipo_situacao && (
              <p className="mt-1 text-[11px] text-red-600">
                {errors.tipo_situacao.message}
              </p>
            )}

            <label className="mt-[14px] block h-[116px] rounded-[12px] border border-[#E9E0D4] bg-white px-[13px] py-[11px]">
              <span className="block text-[12px] font-semibold text-[#716B67]">
                Descrição
              </span>

              <textarea
                {...register("descricao")}
                placeholder="Descreva apenas o que você observou"
                className="mt-[6px] h-[68px] w-full resize-none bg-transparent text-[14px] outline-none placeholder:text-[#666666]"
              />
            </label>

            {errors.descricao && (
              <p className="mt-1 text-[11px] text-red-600">
                {errors.descricao.message}
              </p>
            )}
          </section>

          <section className="mt-[14px]">
            <h2 className="text-[20px] font-bold">Privacidade</h2>

            <button
              type="button"
              onClick={() => setShowContact((value) => !value)}
              className="mt-[14px] flex h-[48px] w-full items-center rounded-[12px] border border-[#E9E0D4] bg-white px-[10px] text-left"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  showContact
                    ? "border-[#C94F32]"
                    : "border-[#E9E0D4] bg-[#F4EFE6]"
                }`}
              >
                {showContact && (
                  <span className="h-2 w-2 rounded-full bg-[#C94F32]" />
                )}
              </span>

              <span className="ml-2 text-[13px] font-medium">
                Informar dados de contato (opcional)
              </span>
            </button>

            {showContact && (
              <div className="mt-[12px] space-y-[10px]">
                <label className="block h-[72px] rounded-[12px] border border-[#E9E0D4] bg-white px-[13px] py-[11px]">
                  <span className="block text-[12px] font-semibold text-[#716B67]">
                    Nome (opcional)
                  </span>
                  <input
                    {...register("nome")}
                    type="text"
                    className="mt-[6px] w-full bg-transparent text-[14px] text-[#171717] outline-none"
                  />
                </label>

                <label className="block rounded-[12px] border border-[#E9E0D4] bg-white px-[13px] py-[11px]">
                  <span className="block text-[12px] font-semibold text-[#716B67]">
                    E-mail (opcional)
                  </span>
                  <input
                    {...register("email")}
                    type="email"
                    className="mt-[6px] w-full bg-transparent text-[14px] text-[#171717] outline-none"
                  />
                  {errors.email && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </label>

                <label className="block h-[72px] rounded-[12px] border border-[#E9E0D4] bg-white px-[13px] py-[11px]">
                  <span className="block text-[12px] font-semibold text-[#716B67]">
                    Telefone (opcional)
                  </span>
                  <input
                    {...register("telefone")}
                    type="tel"
                    className="mt-[6px] w-full bg-transparent text-[14px] text-[#171717] outline-none"
                  />
                </label>
              </div>
            )}

            <p className="mt-[12px] text-[11px] leading-[17px] text-[#716B67]">
              Se desejar receber retorno, informe e-mail ou telefone. Seu nome é
              opcional e os dados não são públicos.
            </p>

            <div className="mt-[14px] flex h-[76px] items-center rounded-[12px] border border-[#E9E0D4] bg-[#EEE8ED] px-[13px]">
              <p className="text-[12px] font-medium leading-[16px] text-[#584A57]">
                Mídias são privadas e usadas somente no atendimento autorizado.
              </p>
            </div>
          </section>

          <button
            type={hasLocation ? "submit" : "button"}
            onClick={handlePrimaryAction}
            disabled={isCompressing}
            className="mt-[14px] h-[52px] w-full rounded-[12px] bg-[#C94F32] text-[14px] font-bold text-white transition hover:bg-[#B9472E] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {hasLocation ? "Revisar ocorrência" : "Selecionar localização"}
          </button>
        </form>
      </div>
    </main>
  );
}

export function NewOccurrence() {
  const draftSnapshot = useSyncExternalStore(
    subscribeToDraft,
    getOccurrenceDraftSnapshot,
    () => null,
  );

  const draft = useMemo(() => parseDraft(draftSnapshot), [draftSnapshot]);

  return (
    <NewOccurrenceForm key={draftSnapshot ?? "new-occurrence"} draft={draft} />
  );
}