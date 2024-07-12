export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mt-16 flex flex-col items-center justify-center px-4">
      <div className="w-96 rounded-md border p-6">{children}</div>
    </div>
  );
}
