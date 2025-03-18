"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { searchAction } from "./actions";
import { type SearchSchema, searchSchema } from "./actions/schema";

export function SearchForm({ size = "md" }: { readonly size?: "sm" | "md" }) {
  const searchQuery = useSearchParams().get("q");
  const search = useAction(searchAction);

  const form = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: searchQuery || "",
    },
  });

  function onSubmit(data: SearchSchema) {
    search.execute(data);
  }

  return (
    <form
      className={cn(
        "hidden size-full max-w-lg items-center sm:flex sm:flex-1",
        size === "sm" && "flex max-w-none",
      )}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="group flex w-full rounded-md">
        <input
          placeholder="Search for products, brands and more..."
          className="w-full rounded-l-md border border-secondary bg-background px-3 py-2 shadow-md outline-none ring-ring duration-200 focus:ring-2"
          {...form.register("search")}
        />
        <button
          type="submit"
          className="rounded-r-md border-y border-r border-secondary bg-background px-3 shadow-md outline-none ring-ring duration-200 disabled:cursor-not-allowed disabled:opacity-70 group-focus-within:ring-2 [&:not(:disabled):hover]:bg-foreground/5"
          title="Search"
          aria-label="Search"
          disabled={search.status === "executing" || !form.formState.isValid}
        >
          {search.status === "executing" ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Search />
          )}
        </button>
      </div>
    </form>
  );
}
