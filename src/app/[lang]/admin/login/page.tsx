import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAdminUser } from "@/lib/auth/session";
import { safeRedirectPath } from "@/lib/utils/redirect";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./login-form";

type AdminLoginPageProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ next?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "Admin" });

  return {
    title: t("login.title"),
    robots: { index: false, follow: false },
  };
}

function BackArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

/**
 * Login page.
 *
 * The card shell (title, description, back link) renders in the static
 * prerendered shell. Everything request-specific — the session read and the
 * `searchParams` promise — lives in `AdminLoginContent` behind a `<Suspense>`
 * boundary, so `next` streams in from the URL instead of blocking prerender.
 */
export default async function AdminLoginPage({
  params,
  searchParams,
}: AdminLoginPageProps) {
  const { lang } = await params;
  setRequestLocale(lang);
  const t = await getTranslations({ locale: lang, namespace: "Admin" });

  return (
    <main className="flex min-h-dvh items-center justify-center px-[var(--page-gutter)] py-12">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle as="h1">{t("login.title")}</CardTitle>
            <CardDescription>{t("login.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoginFallback label={t("loading")} />}>
              <AdminLoginContent searchParams={searchParams} />
            </Suspense>
          </CardContent>
        </Card>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <BackArrowIcon />
            {t("login.backToSite")}
          </Link>
        </p>
      </div>
    </main>
  );
}

/** Lightweight placeholder shown while the URL/session-dependent form streams. */
function LoginFallback({ label }: { label: string }) {
  return (
    <div className="flex min-h-32 items-center justify-center">
      <Spinner className="text-muted-foreground" label={label} />
    </div>
  );
}

/**
 * Reads the session and the `next` redirect target, then renders the form.
 *
 * Runs inside the `<Suspense>` boundary above: both the Supabase session and
 * `searchParams` are request-time data and must not sit in the static shell.
 */
async function AdminLoginContent({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // Already authenticated? Skip the form entirely (verified server-side).
  const user = await getAdminUser();
  if (user) redirect("/admin");

  const { next } = await searchParams;

  return <LoginForm nextPath={safeRedirectPath(next)} />;
}
