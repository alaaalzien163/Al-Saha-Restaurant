"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col">
        <main className="flex flex-1 items-center py-[var(--section-gap)]">
          <Container size="narrow" className="text-center">
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="mt-2 text-muted-foreground">
              An unexpected error occurred. Please try again.
            </p>
            <div className="mt-6 flex justify-center">
              <Button onClick={reset}>Try again</Button>
            </div>
          </Container>
        </main>
      </body>
    </html>
  );
}
