"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import {
  validateAnnouncement,
  type AnnouncementActionResult,
} from "@/lib/validations/announcement";
import { getValidationTranslator } from "@/lib/validations/server-translator";
import type { Translator } from "@/lib/validations/translator";
import {
  deleteAnnouncementRecord,
  insertAnnouncement,
  setAnnouncementActive,
  updateAnnouncementRecord,
} from "@/lib/data/announcements";

const ADMIN_ANNOUNCEMENTS_PATH = "/[lang]/admin/announcements";

function readId(formData: FormData): string {
  const id = formData.get("id");
  return typeof id === "string" ? id.trim() : "";
}

function validateForm(formData: FormData, t: Translator) {
  return validateAnnouncement(
    {
      message_ar: formData.get("message_ar"),
      message_en: formData.get("message_en"),
      link_url: formData.get("link_url"),
      link_label_ar: formData.get("link_label_ar"),
      link_label_en: formData.get("link_label_en"),
      is_active: formData.get("is_active"),
      starts_at: formData.get("starts_at"),
      ends_at: formData.get("ends_at"),
      display_order: formData.get("display_order"),
    },
    t,
  );
}

export async function createAnnouncement(
  formData: FormData,
): Promise<AnnouncementActionResult> {
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
    await insertAnnouncement(validation.value);
  } catch (error) {
    console.error("createAnnouncement failed:", error);
    return { ok: false, message: t("actions.announcementCreateFailed") };
  }

  revalidatePath(ADMIN_ANNOUNCEMENTS_PATH, "page");
  return { ok: true };
}

export async function updateAnnouncement(
  formData: FormData,
): Promise<AnnouncementActionResult> {
  const t = await getValidationTranslator();
  await requireAdmin();

  const id = readId(formData);
  if (!id) {
    return { ok: false, message: t("actions.announcementIdMissing") };
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
    await updateAnnouncementRecord(id, validation.value);
  } catch (error) {
    console.error("updateAnnouncement failed:", error);
    return { ok: false, message: t("actions.announcementUpdateFailed") };
  }

  revalidatePath(ADMIN_ANNOUNCEMENTS_PATH, "page");
  return { ok: true };
}

export async function toggleAnnouncement(
  formData: FormData,
): Promise<AnnouncementActionResult> {
  const t = await getValidationTranslator();
  await requireAdmin();

  const id = readId(formData);
  if (!id) {
    return { ok: false, message: t("actions.announcementIdMissing") };
  }

  const isActive = formData.get("is_active") === "true";

  try {
    await setAnnouncementActive(id, isActive);
  } catch (error) {
    console.error("toggleAnnouncement failed:", error);
    return { ok: false, message: t("actions.announcementStatusFailed") };
  }

  revalidatePath(ADMIN_ANNOUNCEMENTS_PATH, "page");
  return { ok: true };
}

export async function deleteAnnouncement(
  formData: FormData,
): Promise<AnnouncementActionResult> {
  const t = await getValidationTranslator();
  await requireAdmin();

  const id = readId(formData);
  if (!id) {
    return { ok: false, message: t("actions.announcementIdMissing") };
  }

  try {
    await deleteAnnouncementRecord(id);
  } catch (error) {
    console.error("deleteAnnouncement failed:", error);
    return { ok: false, message: t("actions.announcementDeleteFailed") };
  }

  revalidatePath(ADMIN_ANNOUNCEMENTS_PATH, "page");
  return { ok: true };
}
