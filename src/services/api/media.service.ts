export type UploadMediaResponse = {
  id: string;
  storageKey: string;
  mimeType: string;
  fileSizeBytes: number;
  uploadedAt: string;
};

export async function uploadMedia(
  occurrenceId: string,
  files: File[],
): Promise<UploadMediaResponse[]> {
  const apiBaseUrl = (
    process.env.NEXT_PUBLIC_API_URL || ""
  ).replace(/\/+$/, "");

  const endpoint = apiBaseUrl
    ? `${apiBaseUrl}/api/occurrences/${occurrenceId}/media`
    : `/api/occurrences/${occurrenceId}/media`;

  const formData = new FormData();

  for (const file of files) {
    formData.append("files", file);
  }

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "Erro ao enviar mídias.";
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : String(errorData.message);
      }
    } catch {
      // response body was empty or not valid JSON
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
