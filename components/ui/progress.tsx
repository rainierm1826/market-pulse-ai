import * as React from "react";
import { cn } from "../../lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  label?: string;
}

export function Progress({ value, label, className, ...props }: ProgressProps) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {label && (
        <div className="flex items-center justify-between text-xs font-medium">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      )}
      <div className="h-3 w-full overflow-hidden rounded-sm border bg-muted">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
