const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.7;
const OUTPUT_MIME = "image/jpeg";

export type CompressionProgress = {
  status: "loading" | "compressing" | "done" | "error";
  fileName: string;
};

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Não foi possível carregar a imagem: ${file.name}`));
    };

    img.src = url;
  });
}

function calculateDimensions(
  width: number,
  height: number,
): { width: number; height: number } {
  if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
    return { width, height };
  }

  const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Falha ao comprimir a imagem."));
        }
      },
      mimeType,
      quality,
    );
  });
}

export async function compressImage(
  file: File,
  onProgress?: (progress: CompressionProgress) => void,
): Promise<File> {
  onProgress?.({ status: "loading", fileName: file.name });

  const img = await loadImage(file);

  onProgress?.({ status: "compressing", fileName: file.name });

  const { width, height } = calculateDimensions(
    img.naturalWidth,
    img.naturalHeight,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas 2D não suportado neste navegador.");
  }

  ctx.drawImage(img, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, OUTPUT_MIME, JPEG_QUALITY);

  const compressedName = file.name.replace(/\.[^.]+$/, ".jpg");

  const compressedFile = new File([blob], compressedName, {
    type: OUTPUT_MIME,
    lastModified: Date.now(),
  });

  onProgress?.({ status: "done", fileName: compressedName });

  return compressedFile;
}
