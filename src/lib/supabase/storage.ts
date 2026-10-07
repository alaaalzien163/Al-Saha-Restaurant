import { createClient } from "@/lib/supabase/server";
import { extensionForImageType } from "@/lib/validations/image";
import { storagePathFromPublicUrl } from "@/lib/utils/storage-url";

export const MENU_IMAGES_BUCKET = "menu-images";

/**
 * Uploads a menu image using the authenticated user's session (Storage RLS
 * applies — never service_role) and returns its public URL.
 *
 * Storage metadata is managed by the Storage API itself; we never insert into
 * any storage table manually.
 */
export async function uploadMenuImage(file: File): Promise<string> {
  const supabase = await createClient();
  const extension = extensionForImageType(file.type);
  const path = `items/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(MENU_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from(MENU_IMAGES_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Removes a previously uploaded menu image, given its public URL. Only paths
 * inside our own bucket are ever removed; anything else is ignored.
 */
export async function removeMenuImageByUrl(
  url: string | null | undefined,
): Promise<void> {
  const path = storagePathFromPublicUrl(url, MENU_IMAGES_BUCKET);
  if (!path) return;

  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(MENU_IMAGES_BUCKET)
    .remove([path]);

  if (error) {
    throw new Error(error.message);
  }
}
