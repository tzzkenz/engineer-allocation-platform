export function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
        {label}
      </span>
      <div className="relative rounded-xl bg-secondary px-4 py-3 text-sm font-medium text-foreground">
        {value}
      </div>
    </div>
  );
}
