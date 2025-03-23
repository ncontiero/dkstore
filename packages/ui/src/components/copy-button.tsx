"use client";

import { forwardRef, useCallback, useState } from "react";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Copy, CopyCheck } from "lucide-react";
import { type ButtonProps, Button } from "./button";

export interface CopyButtonProps extends Omit<ButtonProps, "asChild"> {
  readonly valueToCopy: string;
}

export const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ variant, size, valueToCopy, onClick, children, ...props }, ref) => {
    const [, copyToClipboardHook] = useCopyToClipboard();
    const [hasCopiedText, setHasCopiedText] = useState(false);

    const copyToClipboard = useCallback(
      async (value: string) => {
        await copyToClipboardHook(value);

        setHasCopiedText(true);
        setTimeout(() => {
          setHasCopiedText(false);
        }, 2000);
      },
      [copyToClipboardHook],
    );

    return (
      <Button
        ref={ref}
        size="icon"
        variant="ghost"
        {...props}
        disabled={hasCopiedText}
        onClick={async (e) => {
          await copyToClipboard(valueToCopy);
          if (onClick) {
            onClick(e);
          }
        }}
      >
        {hasCopiedText ? (
          <CopyCheck className="size-5 text-green-600" />
        ) : (
          <Copy className="size-5 text-primary" />
        )}
        {children}
      </Button>
    );
  },
);
CopyButton.displayName = "CopyButton";
