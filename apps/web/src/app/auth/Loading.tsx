export function Loading() {
  return (
    <div className="xs:px-4 mt-16 flex flex-col items-center justify-center">
      <div className="flex w-full max-w-md items-center justify-center border px-3 py-6 sm:rounded-md sm:p-6">
        <div className="size-16 animate-spin rounded-full border-y-2 border-primary" />
      </div>
    </div>
  );
}
