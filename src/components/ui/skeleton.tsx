import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

/** Base loading placeholder. Decorative — hidden from assistive tech. */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export type SkeletonTextProps = {
  lines?: number;
  className?: string;
};

/** A stack of text-line placeholders. */
export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div aria-hidden="true" className={cn("space-y-2", className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={cn("h-4", index === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}
