"use client";

import { type InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils";

export interface PasswordInputProps
  extends InputHTMLAttributes<HTMLInputElement> {}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [isHidden, setIsHidden] = useState(true);

    return (
      <div
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background text-sm ring-offset-background duration-200 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:border-foreground/30",
          className,
        )}
      >
        <input
          ref={ref}
          className="size-full bg-transparent px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          {...props}
          type={isHidden ? "password" : "text"}
        />
        <button
          type="button"
          className="rounded-r-md p-2 text-foreground/60 duration-200 hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={props.disabled}
          onClick={() => setIsHidden(!isHidden)}
        >
          {isHidden ? <Eye /> : <EyeOff />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";
