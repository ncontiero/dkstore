import { type LinkProps, Link as LinkPrimitive } from "@dkstore/ui/link";
import NextLink from "next/link";

export function Link({ children, ...props }: LinkProps) {
  return (
    <LinkPrimitive asChild {...props}>
      <NextLink href={props.href!}>{children}</NextLink>
    </LinkPrimitive>
  );
}
