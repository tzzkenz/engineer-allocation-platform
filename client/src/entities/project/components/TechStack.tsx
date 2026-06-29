interface TechStackTagProps {
  tech: string;
}

export function TechStackTag({ tech }: TechStackTagProps) {
  return (
    <span className="inline-flex items-center bg-background px-2 py-1 rounded  text-xs font-bold leading-3">
      {tech}
    </span>
  );
}
