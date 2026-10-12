import { toast } from "react-toastify";

import { createOccurrence } from "@/services/api/occurrence.service";
import { uploadMedia } from "@/services/api/media.service";
import type {
  OccurrenceFormData,
  OccurrenceResponse,
} from "@/types/occurrence";

const DRAFT_KEY = "mapeia-occurrence-draft";
const DRAFT_EVENT = "mapeia-occurrence-draft-change";

let pendingFiles: File[] = [];

export function setPendingFiles(files: File[]) {
  pendingFiles = files;
}

export function getPendingFiles(): File[] {
  return pendingFiles;
}

export function clearPendingFiles() {
  pendingFiles = [];
}

export function saveOccurrenceDraft(data: OccurrenceFormData) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data));

  window.dispatchEvent(new Event(DRAFT_EVENT));
}

export function getOccurrenceDraft(): OccurrenceFormData | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedDraft = sessionStorage.getItem(DRAFT_KEY);

  if (!storedDraft) {
    return null;
  }

  try {
    return JSON.parse(storedDraft) as OccurrenceFormData;
  } catch {
    return null;
  }
}

export function getOccurrenceDraftSnapshot(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return sessionStorage.getItem(DRAFT_KEY);
}

export function subscribeToOccurrenceDraft(callback: () => void) {
  if (typeof window === "undefined") {
    return () => { };
  }

  window.addEventListener(DRAFT_EVENT, callback);

  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(DRAFT_EVENT, callback);

    window.removeEventListener("storage", callback);
  };
}

export function clearOccurrenceDraft() {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(DRAFT_KEY);

  window.dispatchEvent(new Event(DRAFT_EVENT));
}

export async function submitOccurrence(
  data: OccurrenceFormData,
): Promise<OccurrenceResponse> {
  try {
    const result = await createOccurrence(data);

    const files = getPendingFiles();

    if (files.length > 0 && result.id) {
      try {
        await uploadMedia(result.id, files);
      } catch {
        toast.warning(
          "Ocorrência registrada, mas houve um erro ao enviar as mídias.",
        );
        clearPendingFiles();
        clearOccurrenceDraft();
        return result;
      }
    }

    clearPendingFiles();
    clearOccurrenceDraft();

    toast.success("Ocorrência enviada com sucesso.");

    return result;
  } catch (error) {
    toast.error("Não foi possível enviar a ocorrência.");

    throw error;
  }
}