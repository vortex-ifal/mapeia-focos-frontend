/**
 * Constrói o endpoint completo para a API, lidando de forma resiliente com diferentes formatos de NEXT_PUBLIC_API_URL:
 * - Vazio -> "/api/occurrences" (usa rewrite interno do Next.js)
 * - "http://localhost:8000" -> "http://localhost:8000/api/occurrences"
 * - "http://localhost:8000/" -> "http://localhost:8000/api/occurrences"
 * - "http://localhost:8000/api" -> "http://localhost:8000/api/occurrences"
 * - "http://localhost:8000/api/" -> "http://localhost:8000/api/occurrences"
 */
export function buildApiUrl(path: string): string {
  const rawBase = (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");

  if (!rawBase) {
    return cleanPath.startsWith("api/") ? `/${cleanPath}` : `/api/${cleanPath}`;
  }

  // Se a base já possui "/api" no final, evita duplicação
  if (rawBase.endsWith("/api")) {
    const pathWithoutApi = cleanPath.startsWith("api/")
      ? cleanPath.slice(4)
      : cleanPath;
    return `${rawBase}/${pathWithoutApi}`;
  }

  const apiPath = cleanPath.startsWith("api/") ? cleanPath : `api/${cleanPath}`;
  return `${rawBase}/${apiPath}`;
}
