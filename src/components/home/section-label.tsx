export function SectionLabel({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-neutral-700 sm:text-sm">
      <span className="h-2 w-2 bg-[#ff3b1f]" />
      {children}
    </p>
  );
}
