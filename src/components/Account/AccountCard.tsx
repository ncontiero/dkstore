import { type HTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface AccountCardProps extends HTMLAttributes<HTMLDivElement> {
  readonly asChild?: boolean;
}

export const AccountCard = forwardRef<HTMLDivElement, AccountCardProps>(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        className={cn("mt-7 rounded-md border", className)}
        {...props}
      />
    );
  },
);
AccountCard.displayName = "AccountCard";

export interface AccountCardContentProps extends AccountCardProps {}

export const AccountCardContent = forwardRef<
  HTMLDivElement,
  AccountCardContentProps
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp ref={ref} className={cn("flex flex-col p-6", className)} {...props} />
  );
});
AccountCardContent.displayName = "AccountCardContent";

export interface AccountCardTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  readonly asChild?: boolean;
}

export const AccountCardTitle = forwardRef<
  HTMLDivElement,
  AccountCardTitleProps
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "h3";

  return (
    <Comp ref={ref} className={cn("text-lg font-bold", className)} {...props} />
  );
});
AccountCardTitle.displayName = "AccountCardTitle";

export interface AccountCardDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  readonly asChild?: boolean;
}

export const AccountCardDescription = forwardRef<
  HTMLDivElement,
  AccountCardDescriptionProps
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "p";

  return (
    <Comp
      ref={ref}
      className={cn("my-3 text-sm font-light", className)}
      {...props}
    />
  );
});
AccountCardDescription.displayName = "AccountCardDescription";

export interface AccountCardFooterProps extends AccountCardProps {}

export const AccountCardFooter = forwardRef<
  HTMLDivElement,
  AccountCardFooterProps
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      ref={ref}
      className={cn(
        "flex items-center justify-between border-t bg-secondary/40 px-6 py-3",
        className,
      )}
      {...props}
    />
  );
});
AccountCardFooter.displayName = "AccountCardFooter";

export interface AccountCardFooterDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  readonly asChild?: boolean;
}

export const AccountCardFooterDescription = forwardRef<
  HTMLDivElement,
  AccountCardFooterDescriptionProps
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "p";

  return (
    <Comp
      ref={ref}
      className={cn("text-sm font-light text-muted-foreground", className)}
      {...props}
    />
  );
});
AccountCardFooterDescription.displayName = "AccountCardFooterDescription";
