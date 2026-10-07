import { resolveTranslator, type Translator } from "./translator";

/** Maximum upload size for menu images (5 MB). */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
] as const;

export const ALLOWED_IMAGE_ACCEPT = ALLOWED_IMAGE_TYPES.join(",");

export type ImageValidation = { ok: true } | { ok: false; message: string };

/**
 * Validates an image before upload. Safe to run on both the client (instant
 * feedback) and the server (authoritative check).
 */
export function validateImageFile(file: File, t?: Translator): ImageValidation {
  const translate = resolveTranslator(t);

  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return {
      ok: false,
      message: translate("image.typeInvalid"),
    };
  }

  if (file.size === 0) {
    return { ok: false, message: translate("image.empty") };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, message: translate("image.tooLarge") };
  }

  return { ok: true };
}

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export function extensionForImageType(type: string): string {
  return EXTENSIONS[type] ?? "bin";
}

/** Formats a byte count for a human-readable hint. */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
