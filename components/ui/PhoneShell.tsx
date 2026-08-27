export function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-bg">
      <div className="relative mx-4 mt-1 mb-[60px] w-full max-w-[414px] overflow-hidden rounded-phone bg-surface shadow-phone">
        {children}
      </div>
    </div>
  );
}
