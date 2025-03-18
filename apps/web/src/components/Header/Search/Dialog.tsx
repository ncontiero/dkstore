import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { SearchForm } from "./Form";

export function SearchDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full sm:hidden">
          <Search />
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          variant="custom"
          className="flex h-14 w-full p-0 sm:rounded-none md:h-16"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Search</DialogTitle>
            <DialogDescription>
              Search for products, brands and more.
            </DialogDescription>
          </DialogHeader>
          <div className="xxs:pl-2 xxs:pr-4 xs:gap-4 xs:pr-8 flex size-full items-center gap-2 bg-secondary p-2">
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                title="Go back"
                aria-label="Go back"
              >
                <ArrowLeft />
              </Button>
            </DialogClose>
            <SearchForm size="sm" />
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
