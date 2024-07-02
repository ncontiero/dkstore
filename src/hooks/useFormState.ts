import { type FormEvent, useState, useTransition } from "react";

export interface FormState<ErrorsKey extends string> {
  success: boolean;
  message: string | null;
  errors: Partial<Record<ErrorsKey, string[]>> | null;
}
export type ActionsReturn<T extends string> = Promise<FormState<T>>;

export function useFormState<T extends string>(
  action: (data: FormData) => Promise<FormState<T>>,
  onSuccess?: (message: string | null) => Promise<void> | void,
  initialState?: FormState<T>,
) {
  const [isPending, startTransition] = useTransition();

  const [formState, setFormState] = useState(
    initialState ?? { success: false, message: null, errors: null },
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    startTransition(async () => {
      const state = await action(data);

      if (state?.success && onSuccess) {
        await onSuccess(state.message);
      }

      setFormState(state);
    });
  }

  return [formState, handleSubmit, isPending] as const;
}
