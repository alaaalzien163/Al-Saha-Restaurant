import { getTranslations } from "next-intl/server";
import { signOut } from "@/app/[lang]/(site)/admin/login/actions";
import { Button } from "@/components/ui/button";
import { AdminMobileNav } from "./admin-mobile-nav";
import { LogOutIcon } from "./admin-icons";

export type AdminHeaderProps = {
  email: string | null;
};

/** Dashboard header: mobile menu trigger, current user, and logout. */
export async function AdminHeader({ email }: AdminHeaderProps) {
  const t = await getTranslations("Admin");

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
      <AdminMobileNav />

      <div className="ms-auto flex items-center gap-3">
        {email ? (
          <span className="hidden max-w-[18rem] truncate text-sm text-muted-foreground sm:inline">
            {email}
          </span>
        ) : null}

        <form action={signOut}>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            startIcon={<LogOutIcon className="size-4" />}
          >
            {t("header.signOut")}
          </Button>
        </form>
      </div>
    </header>
  );
}
