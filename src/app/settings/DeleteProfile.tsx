import { type Dispatch, type SetStateAction, useCallback } from "react";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { api } from "@/utils/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";
import { Button } from "@/components/ui/Button";

interface DeleteProfileProps {
  readonly isDeletingProfile: boolean;
  readonly setIsDeletingProfile: Dispatch<SetStateAction<boolean>>;
}

export function DeleteProfile({
  isDeletingProfile,
  setIsDeletingProfile,
}: DeleteProfileProps) {
  const router = useRouter();

  const deleteProfile = useCallback(async () => {
    setIsDeletingProfile(true);
    const { ok } = await api.delete("deleteProfile", {
      throwError: false,
    });
    if (!ok) {
      toast.error("Failed to delete profile. Please try again later.");
      setIsDeletingProfile(false);
    }
    toast.success("Profile deleted successfully. Goodbye!");
    setIsDeletingProfile(false);
    router.push("/api/auth/sign-out?redirect=true");
  }, [router, setIsDeletingProfile]);

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          type="button"
          variant="destructive"
          disabled={isDeletingProfile}
          className="gap-2"
        >
          {isDeletingProfile ? (
            <Loader2 className="size-4 animate-spin" />
          ) : null}
          {isDeletingProfile ? "Deleting" : "Delete"} profile
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            profile and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteProfile()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
