"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import {
  validateCategory,
  type CategoryActionResult,
} from "@/lib/validations/category";
import { getValidationTranslator } from "@/lib/validations/server-translator";
import type { Translator } from "@/lib/validations/translator";
import {
  deleteCategoryRecord,
  insertCategory,
  setCategoryActive,
  updateCategoryRecord,
} from "@/lib/data/categories";


function readId(formData: FormData): string {
  const id = formData.get("id");
  return typeof id === "string" ? id.trim() : "";
}

function validateForm(formData: FormData, t: Translator) {
  return validateCategory(
    {
      name: formData.get("name"),
      description: formData.get("description"),
      display_order: formData.get("display_order"),
      is_active: formData.get("is_active"),
    },
    t,
  );
}

export async function createCategory(
  formData: FormData,
): Promise<CategoryActionResult> {
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

  try {
    await insertCategory(validation.value);
  } catch (error) {
    console.error("createCategory failed:", error);
    return { ok: false, message: t("actions.categoryCreateFailed") };
  }

  revalidatePath("/[lang]/admin/categories", "page");
  return { ok: true };
}

export async function updateCategory(
  formData: FormData,
): Promise<CategoryActionResult> {
  const t = await getValidationTranslator();
  await requireAdmin();

  const id = readId(formData);
  if (!id) {
    return { ok: false, message: t("actions.categoryIdMissing") };
  }

  const validation = validateForm(formData, t);
  if (!validation.ok) {
    return {
      ok: false,
      message: t("actions.correctFields"),
      fieldErrors: validation.fields,
    };
  }

  try {
    await updateCategoryRecord(id, validation.value);
  } catch (error) {
    console.error("updateCategory failed:", error);
    return { ok: false, message: t("actions.categoryUpdateFailed") };
  }

  revalidatePath("/[lang]/admin/categories", "page");
  return { ok: true };
}

export async function toggleCategory(
  formData: FormData,
): Promise<CategoryActionResult> {
  const t = await getValidationTranslator();
  await requireAdmin();

  const id = readId(formData);
  if (!id) {
    return { ok: false, message: t("actions.categoryIdMissing") };
  }

  const isActive = formData.get("is_active") === "true";

  try {
    await setCategoryActive(id, isActive);
  } catch (error) {
    console.error("toggleCategory failed:", error);
    return { ok: false, message: t("actions.categoryStatusFailed") };
  }

  revalidatePath("/[lang]/admin/categories", "page");
  return { ok: true };
}

export async function deleteCategory(
  formData: FormData,
): Promise<CategoryActionResult> {
  const t = await getValidationTranslator();
  await requireAdmin();

  const id = readId(formData);
  if (!id) {
    return { ok: false, message: t("actions.categoryIdMissing") };
  }

  try {
    await deleteCategoryRecord(id);
  } catch (error) {
    console.error("deleteCategory failed:", error);
    return { ok: false, message: t("actions.categoryDeleteFailed") };
  }

  revalidatePath("/[lang]/admin/categories", "page");
  return { ok: true };
}
