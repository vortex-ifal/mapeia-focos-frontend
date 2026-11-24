"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { updateOccurrenceArchive } from "@/services/api/occurrence-archive.service";
import type { OccurrenceArchiveAction as ArchiveAction } from "@/services/api/occurrence-archive.service";

type Props = {
  occurrenceId: string;
  protocol: string;
  isArchived: boolean;
  isClosed: boolean;
};

export function OccurrenceArchiveAction({
  occurrenceId,
  protocol,
  isArchived,
  isClosed,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const queryClient = useQueryClient();

  const action: ArchiveAction = isArchived ? "restore" : "archive";
  const isBlocked = !isArchived && isClosed;
  const verb = isArchived ? "Restaurar" : "Arquivar";

  const mutation = useMutation({
    mutationFn: () => updateOccurrenceArchive(occurrenceId, action),
    onSuccess: async () => {
      setConfirmOpen(false);
      triggerRef.current?.focus();
      toast.success(isArchived ? "Ocorrência restaurada com sucesso." : "Ocorrência arquivada com sucesso.");
      await Promise.all([
        // Inclui lista, detalhes, histórico e heatmap da gestão.
        queryClient.invalidateQueries({ queryKey: ["manager"] }),
        queryClient.invalidateQueries({ queryKey: ["operations"] }),
        queryClient.invalidateQueries({ queryKey: ["occurrences"] }),
        queryClient.invalidateQueries({ queryKey: ["assignment", "occurrence", occurrenceId] }),
        queryClient.invalidateQueries({ queryKey: ["triage", "occurrence", occurrenceId] }),
        queryClient.invalidateQueries({ queryKey: ["triage", "territorial-context", occurrenceId] }),
        queryClient.invalidateQueries({ queryKey: ["priority", "occurrence", occurrenceId] }),
      ]);
    },
  });

  function openDialog() {
    mutation.reset();
    setConfirmOpen(true);
  }

  function closeDialog() {
    if (mutation.isPending) return;
    mutation.reset();
    setConfirmOpen(false);
    // Return focus immediately to the control that opened the dialog.
    triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!confirmOpen) return;
    cancelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        if (!mutation.isPending) closeDialog();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLButtonElement>(
          'button:not([disabled])',
        ),
      );
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;
      if (event.shiftKey && (activeElement === first || !dialogRef.current.contains(activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (activeElement === last || !dialogRef.current.contains(activeElement))) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmOpen, mutation.isPending]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={isBlocked || mutation.isPending}
        onClick={openDialog}
        className="flex h-11 w-full items-center justify-center rounded-[12px] border border-[#E9E0D4] bg-white px-3 text-[13px] font-bold text-[#171717] transition-colors hover:bg-[#F4EFE6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94F32] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#F4EFE6] disabled:text-[#A8A29E]"
      >
        {verb} ocorrência
      </button>

      {isBlocked ? (
        <p className="text-[11px] leading-[1.4] text-[#716B67]">
          Ocorrências encerradas não podem ser arquivadas.
        </p>
      ) : null}

      {confirmOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <section
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="archive-dialog-title"
            aria-describedby="archive-dialog-description"
            className="w-full max-w-[430px] rounded-[16px] border border-[#E9E0D4] bg-[#FBF8F2] p-5 shadow-xl"
          >
            <h2 id="archive-dialog-title" className="text-[20px] font-bold text-[#171717]">
              {verb} ocorrência?
            </h2>
            <p id="archive-dialog-description" className="mt-3 text-[13px] leading-[1.5] text-[#716B67]">
              {isArchived
                ? `A ocorrência #${protocol.toUpperCase()} voltará a ficar disponível para gerenciamento. O histórico será preservado.`
                : `A ocorrência #${protocol.toUpperCase()} será identificada como arquivada e mantida no histórico. Nenhum registro será excluído.`}
            </p>
            {mutation.isError ? (
              <p role="alert" className="mt-3 rounded-[10px] bg-[#F8E3E0] p-3 text-[12px] text-[#9D352D]">
                {mutation.error instanceof Error ? mutation.error.message : "Não foi possível realizar a operação."}
              </p>
            ) : null}
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                ref={cancelRef}
                type="button"
                disabled={mutation.isPending}
                onClick={closeDialog}
                className="h-11 rounded-[12px] border border-[#E9E0D4] bg-white px-5 text-[13px] font-bold text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94F32] disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={mutation.isPending}
                onClick={() => mutation.mutate()}
                className="h-11 rounded-[12px] bg-[#C94F32] px-5 text-[13px] font-bold text-white hover:bg-[#B9472E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C94F32] focus-visible:ring-offset-2 disabled:opacity-60"
              >
                {mutation.isPending ? "Salvando..." : `Confirmar ${verb.toLowerCase()}`}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
