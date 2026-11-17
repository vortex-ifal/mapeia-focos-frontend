import { buildApiUrl } from "./api.config";

export type UploadMediaResponse = {
  id: string;
  storageKey: string;
  mimeType: string;
  fileSizeBytes: number;
  uploadedAt: string;
};

async function getErrorMessage(
  response: Response,
  fallbackMessage: string,
): Promise<string> {
  try {
    const errorData = await response.json();

    if (errorData?.message) {
      return Array.isArray(errorData.message)
        ? errorData.message.join(", ")
        : String(errorData.message);
    }
  } catch {
    // The response body may be empty or invalid JSON.
  }

  return fallbackMessage;
}

export async function uploadMedia(
  occurrenceId: string,
  files: File[],
): Promise<UploadMediaResponse[]> {
  const endpoint = buildApiUrl(`occurrences/${occurrenceId}/media`);

  const formData = new FormData();

  for (const file of files) {
    formData.append("files", file);
  }

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Erro ao enviar mídias."));
  }

  return response.json();
}