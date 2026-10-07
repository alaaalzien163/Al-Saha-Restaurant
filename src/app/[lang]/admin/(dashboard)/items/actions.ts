"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import {
  validateItem,
  type ItemActionResult,
} from "@/lib/validations/item";
import { validateImageFile } from "@/lib/validations/image";
import { getValidationTranslator } from "@/lib/validations/server-translator";
import type { Translator } from "@/lib/validations/translator";
import {
  deleteItemRecord,
  getAdminItemById,
  insertItem,
  setItemAvailability,
  updateItemRecord,
} from "@/lib/data/items";
import {
  removeMenuImageByUrl,
  uploadMenuImage,
} from "@/lib/supabase/storage";
import type { MenuItem } from "@/types/domain";

function readId(formData: FormData): string {
  const id = formData.get("id");
  return typeof id === "string" ? id.trim() : "";
}

function readImageFile(formData: FormData): File | null {
  const value = formData.get("image");
  if (value instanceof File && value.size > 0) return value;
  return null;
}

function validateForm(formData: FormData, t: Translator) {
  return validateItem(
    {
      name: formData.get("name"),
      description: formData.get("description"),
      category_id: formData.get("category_id"),
      price: formData.get("price"),
      display_order: formData.get("display_order"),
      is_available: formData.get("is_available"),
    },
    t,
  );
}

/** Best-effort cleanup; never throws (so it can't mask the real error). */
async function safeRemoveImage(url: string | null | undefined): Promise<void> {
  try {
    await removeMenuImageByUrl(url);
  } catch (error) {
    console.error("Item image cleanup failed:", error);
  }
}

export async function createItem(
  formData: FormData,
): Promise<ItemActionResult> {
  const t = await getValidationTranslator();
  await requireAdmin();

  const validation = validateForm(formData, t);
  if (!validation.ok) {
    return {
      ok: false,
      message: t("actions.correctFields"),
      fieldErrors: validation.fields,
    };
  }

  const file = readImageFile(formData);
  if (file) {
    const imageCheck = validateImageFile(file, t);
    if (!imageCheck.ok) {
      return {
        ok: false,
        message: imageCheck.message,
        fieldErrors: { image: imageCheck.message },
      };
    }
  }

  let uploadedUrl: string | null = null;
  if (file) {
    try {
      uploadedUrl = await uploadMenuImage(file);
    } catch (error) {
      console.error("createItem upload failed:", error);
      const uploadFailed = t("actions.imageUploadFailed");
      return {
        ok: false,
        message: uploadFailed,
        fieldErrors: { image: uploadFailed },
      };
    }
  }

  try {
    await insertItem({ ...validation.value, image_url: uploadedUrl });
  } catch (error) {
    console.error("createItem insert failed:", error);
    // The database write failed, so the freshly uploaded image is orphaned.
    await safeRemoveImage(uploadedUrl);
    return { ok: false, message: t("actions.itemCreateFailed") };
  }

  revalidatePath("/[lang]/admin/items", "page");
  return { ok: true };
}

export async function updateItem(
  formData: FormData,
): Promise<ItemActionResult> {
  const t = await getValidationTranslator();
  await requireAdmin();

  const id = readId(formData);
  if (!id) {
    return { ok: false, message: t("actions.itemIdMissing") };
  }

  const validation = validateForm(formData, t);
  if (!validation.ok) {
    return {
      ok: false,
      message: t("actions.correctFields"),
      fieldErrors: validation.fields,
    };
  }

  let current: MenuItem | null;
  try {
    current = await getAdminItemById(id);
  } catch (error) {
    console.error("updateItem load failed:", error);
    return { ok: false, message: t("actions.itemLoadFailed") };
  }
  if (!current) {
    return { ok: false, message: t("actions.itemNotFound") };
  }

  const file = readImageFile(formData);
  if (file) {
    const imageCheck = validateImageFile(file, t);
    if (!imageCheck.ok) {
      return {
        ok: false,
        message: imageCheck.message,
        fieldErrors: { image: imageCheck.message },
      };
    }
  }

  // 1. Upload the new image first (if any).
  let uploadedUrl: string | null = null;
  if (file) {
    try {
      uploadedUrl = await uploadMenuImage(file);
    } catch (error) {
      console.error("updateItem upload failed:", error);
      const uploadFailed = t("actions.imageUploadFailed");
      return {
        ok: false,
        message: uploadFailed,
        fieldErrors: { image: uploadFailed },
      };
    }
  }

  const previousUrl = current.image_url;

  // 2 & 3. Persist the row (keeping the old image if no new one was uploaded).
  try {
    await updateItemRecord(id, {
      ...validation.value,
      image_url: uploadedUrl ?? previousUrl,
    });
  } catch (error) {
    console.error("updateItem update failed:", error);
    // Database update failed: roll back the new upload so it isn't orphaned.
    await safeRemoveImage(uploadedUrl);
    return { ok: false, message: t("actions.itemUpdateFailed") };
  }

  // 4. Only now that the DB change succeeded, delete the replaced image.
  if (uploadedUrl && previousUrl && previousUrl !== uploadedUrl) {
    await safeRemoveImage(previousUrl);
  }

  revalidatePath("/[lang]/admin/items", "page");
  return { ok: true };
}

export async function toggleItemAvailability(
  formData: FormData,
): Promise<ItemActionResult> {
  const t = await getValidationTranslator();
  await requireAdmin();

  const id = readId(formData);
  if (!id) {
    return { ok: false, message: t("actions.itemIdMissing") };
  }

  const isAvailable = formData.get("is_available") === "true";

  try {
    await setItemAvailability(id, isAvailable);
  } catch (error) {
    console.error("toggleItemAvailability failed:", error);
    return {
      ok: false,
      message: t("actions.itemAvailabilityFailed"),
    };
  }

  revalidatePath("/[lang]/admin/items", "page");
  return { ok: true };
}

export async function deleteItem(
  formData: FormData,
): Promise<ItemActionResult> {
  const t = await getValidationTranslator();
  await requireAdmin();

  const id = readId(formData);
  if (!id) {
    return { ok: false, message: t("actions.itemIdMissing") };
  }

  let current: MenuItem | null;
  try {
    current = await getAdminItemById(id);
  } catch (error) {
    console.error("deleteItem load failed:", error);
    return { ok: false, message: t("actions.itemLoadFailed") };
  }

  try {
    await deleteItemRecord(id);
  } catch (error) {
    console.error("deleteItem failed:", error);
    return { ok: false, message: t("actions.itemDeleteFailed") };
  }

  // Remove the image only after the row is gone.
  await safeRemoveImage(current?.image_url);

  revalidatePath("/[lang]/admin/items", "page");
  return { ok: true };
}
