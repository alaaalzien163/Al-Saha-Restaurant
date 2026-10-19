import { cacheLife } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Announcement, PublicAnnouncement } from "@/types/domain";
import type { TableInsert, TableUpdate } from "@/types/database";

/* ------------------------------------------------------------------ Public */

const PUBLIC_COLUMNS =
  "id, message_ar, message_en, link_url, link_label_ar, link_label_en, is_active, starts_at, ends_at, display_order";

/**
 * Whether an announcement's schedule window covers `now`.
 *
 * Both bounds are optional: an announcement with no `starts_at` is live
 * immediately, and one with no `ends_at` never expires.
 */
function isWithinWindow(
  { starts_at, ends_at }: Pick<PublicAnnouncement, "starts_at" | "ends_at">,
  now: number,
): boolean {
  if (starts_at && new Date(starts_at).getTime() > now) return false;
  if (ends_at && new Date(ends_at).getTime() < now) return false;
  return true;
}

/**
 * Announcements to show on the public site right now: active and inside their
 * schedule window, ordered for display. Only public columns are selected.
 *
 * Private-cached for the same reason as the other public reads: the Supabase
 * server client reads the request cookies, and `'use cache: private'` keeps the
 * read out of the static shell so Supabase's internal `Date.now()` is never
 * treated as prerender-blocking sync IO. `stale: Infinity` means the entry is
 * deduped within the request only — every request re-runs this function.
 *
 * That request scope is what keeps scheduling correct: the window is evaluated
 * against the current clock on each request, so an announcement disappears as
 * soon as its end time passes instead of lingering in a shared cache entry.
 */
export async function getActiveAnnouncements(): Promise<PublicAnnouncement[]> {
  "use cache: private";
  cacheLife({ stale: Infinity });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select(PUBLIC_COLUMNS)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to load announcements: ${error.message}`);
  }

  const now = Date.now();
  return (data ?? []).filter((announcement) =>
    isWithinWindow(announcement, now),
  );
}

/* ------------------------------------------------------------------- Admin */

const ADMIN_COLUMNS =
  "id, message_ar, message_en, link_url, link_label_ar, link_label_en, is_active, starts_at, ends_at, display_order, created_at, updated_at";

/**
 * Every announcement (active or not, scheduled or not), ordered for
 * management. Private-cached for the same reason as the public read.
 */
export async function getAdminAnnouncements(): Promise<Announcement[]> {
  "use cache: private";
  cacheLife({ stale: Infinity });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select(ADMIN_COLUMNS)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load announcements: ${error.message}`);
  }

  return data ?? [];
}

export async function insertAnnouncement(
  values: TableInsert<"announcements">,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("announcements").insert(values);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateAnnouncementRecord(
  id: string,
  patch: TableUpdate<"announcements">,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("announcements")
    .update(patch)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function setAnnouncementActive(
  id: string,
  isActive: boolean,
): Promise<void> {
  await updateAnnouncementRecord(id, { is_active: isActive });
}

export async function deleteAnnouncementRecord(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("announcements").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
