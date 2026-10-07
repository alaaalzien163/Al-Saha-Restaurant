import { Container } from "@/components/ui/container";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

/** Streamed fallback while the menu is fetched on the server. */
export default function MenuLoading() {
  return (
    <>
      <section className="border-b border-border bg-muted/30">
        <Container className="py-7 sm:py-[var(--section-gap)]">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-4 h-9 w-72 max-w-full sm:h-10" />
          <div className="mt-4 max-w-prose">
            <SkeletonText lines={2} />
          </div>
        </Container>
      </section>

      <div className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <Container>
          <div className="flex gap-2 overflow-x-auto py-2.5">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton
                key={index}
                className="h-11 w-24 shrink-0 rounded-full"
              />
            ))}
          </div>
        </Container>
      </div>

      <Container className="py-[var(--section-gap)]">
        <Skeleton className="h-7 w-40" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-border bg-card"
            >
              <Skeleton className="aspect-[3/2] w-full rounded-none sm:aspect-[4/3]" />
              <div className="space-y-2 p-2.5 sm:space-y-3 sm:p-4">
                <Skeleton className="h-4 w-2/3 sm:h-5" />
                <Skeleton className="h-3 w-full sm:h-4" />
                <Skeleton className="h-3 w-1/2 sm:h-4" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
