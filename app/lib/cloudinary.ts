import crypto from "node:crypto";

export type CloudinaryUploadResult = { url: string; public_id: string };

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
const API_KEY = process.env.CLOUDINARY_API_KEY!;
const API_SECRET = process.env.CLOUDINARY_API_SECRET!;

function generateSignature(params: Record<string, string | number>): string {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(sorted + API_SECRET).digest("hex");
}

/**
 * Sube un buffer a Cloudinary vía REST (sin SDK ni dependencias deprecated).
 */
export async function uploadBufferToCloudinary(buffer: Buffer, folder = "books"): Promise<CloudinaryUploadResult> {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = generateSignature({ folder, timestamp });

  const form = new FormData();
  // Convierte Buffer a Uint8Array para cumplir con el tipo BlobPart (evita error TS de ArrayBufferLike)
  const fileBlob = new Blob([new Uint8Array(buffer)], { type: "application/octet-stream" });
  form.append("file", fileBlob, "upload.bin");
  form.append("api_key", API_KEY);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
  }
  const json = await res.json();
  return { url: json.secure_url, public_id: json.public_id };
}

/**
 * Elimina un recurso de Cloudinary por su public_id usando el Upload API.
 * Retorna true si Cloudinary responde "ok"; lanza error en caso contrario.
 */
export async function deleteCloudinaryByPublicId(publicId: string, invalidate = true): Promise<boolean> {
  const timestamp = Math.floor(Date.now() / 1000);
  const params: Record<string, string | number> = { public_id: publicId, timestamp };
  if (invalidate) params.invalidate = "true";
  const signature = generateSignature(params);

  const form = new URLSearchParams();
  form.append("public_id", publicId);
  if (invalidate) form.append("invalidate", "true");
  form.append("api_key", API_KEY);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary destroy failed: ${res.status} ${text}`);
  }
  const json = await res.json();
  if (json.result !== "ok") {
    throw new Error(`Cloudinary destroy failed: ${json.result ?? "unknown error"}`);
  }
  return true;
}