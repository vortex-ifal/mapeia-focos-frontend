import { z } from "zod";

import { buildApiUrl } from "./api.config";

export type UploadMediaResponse = {
  id: string;
  storageKey: string;
  mimeType: string;
  fileSizeBytes: number;
  uploadedAt: string;
};

export type MediaSignedUrlResponse = {
  signedUrl: string;
  expiresAt: string;
};

export type MediaWithSignedUrl<T extends { id: string }> = T & {
  signedUrl: string | null;
  signedUrlExpiresAt: string | null;
};

const signedUrlResponseSchema = z.object({
  signedUrl: z.string().url(),
  expiresAt: z.string(),
});

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

export async function getMediaSignedUrl(
  mediaId: string,
): Promise<MediaSignedUrlResponse> {
  const endpoint = buildApiUrl(
    `media/${encodeURIComponent(mediaId)}/signed-url`,
  );

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Não foi possível carregar a mídia."),
    );
  }

  let responseData: unknown;

  try {
    responseData = await response.json();
  } catch {
    throw new Error("A API retornou uma resposta de mídia inválida.");
  }

  const parsedResponse = signedUrlResponseSchema.safeParse(responseData);

  if (!parsedResponse.success) {
    throw new Error("A API retornou a URL da mídia em formato inesperado.");
  }

  return parsedResponse.data;
}

export async function resolveMediaSignedUrls<T extends { id: string }>(
  mediaItems: T[],
): Promise<MediaWithSignedUrl<T>[]> {
  return Promise.all(
    mediaItems.map(async (media) => {
      try {
        const result = await getMediaSignedUrl(media.id);

        return {
          ...media,
          signedUrl: result.signedUrl,
          signedUrlExpiresAt: result.expiresAt,
        };
      } catch {
        /*
         * One unavailable media item must not prevent the
         * occurrence itself from loading.
         */
        return {
          ...media,
          signedUrl: null,
          signedUrlExpiresAt: null,
        };
      }
    }),
  );
}