import { cn } from "@/shared/lib/utils";
import { AlertCircle } from "lucide-react";

import { Button } from "../ui/button";

type ErrorDisplayProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
};

const ErrorDisplay = ({
  title = "Something went wrong",
  description = "We couldn't load the requested data.",
  onRetry,
  className,
}: ErrorDisplayProps) => {
  return (
    <div
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-lg border p-8 text-center",
        className
      )}
    >
      <AlertCircle className="h-10 w-10 text-destructive" />

      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {onRetry && <Button onClick={onRetry}>Try Again</Button>}
    </div>
  );
};

export default ErrorDisplay;
