import { cn } from "@dkstore/ui/utils";
import {
  type TextProps,
  Text as ReactEmailText,
} from "@react-email/components";

export function Text({ className, ...props }: TextProps) {
  return (
    <ReactEmailText
      className={cn("text-[16px] leading-[24px] text-[#121212]", className)}
      {...props}
    />
  );
}
