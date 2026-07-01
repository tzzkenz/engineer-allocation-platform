import { Card, CardContent } from "@shared/components/ui/card";

function SkillBar({ label, pct }: { label: string; pct: number }) {
  const low = pct < 60;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        <span className={`text-xs font-bold ${low ? "text-destructive" : "text-foreground"}`}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${low ? "bg-destructive" : "bg-primary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

type SkillCoverageProps = {
  skills: { label: string; pct: number; tag: string; tagPct: number }[];
};
export function SkillCoverage({ skills }: SkillCoverageProps) {
  return (
    <Card className="rounded-2xl p-6 flex flex-col gap-5">
      <h3 className="text-base font-semibold text-foreground">Skill Coverage</h3>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        {skills.map((s) => (
          <>
            <SkillBar key={s.label} label={s.label} pct={s.pct} />
            <SkillBar key={s.tag} label={s.tag} pct={s.tagPct} />
          </>
        ))}
      </CardContent>
    </Card>
  );
}
