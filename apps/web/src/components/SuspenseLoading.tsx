import { cn } from "@dkstore/ui/utils";

export function SuspenseLoading({
  className,
}: {
  readonly className?: string;
}) {
  return (
    <div
      className={cn("mt-4 flex h-screen items-start justify-center", className)}
      aria-label="Loading"
    >
      <div className="size-16 animate-spin rounded-full border-y-2 border-primary" />
    </div>
  );
}
