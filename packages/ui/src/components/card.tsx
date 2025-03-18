import type { PropsWithChildren } from "react";

export interface CardProps extends PropsWithChildren {
  readonly title?: string;
  readonly description?: string;
}

export function Card(props: CardProps) {
  const {
    title = "Invalid link",
    description = "The link you clicked is invalid or expired.",
    children,
  } = props;

  return (
    <div className="xs:px-4 mt-16 flex flex-col items-center justify-center">
      <div className="w-full max-w-md border px-3 py-6 sm:rounded-md sm:p-6">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-base font-medium text-foreground/60">
            {description}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
