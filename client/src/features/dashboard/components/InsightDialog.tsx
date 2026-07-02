import type { DashboardInsightsResponse } from "@/entities/dashboard/types/apiTypes";
import { cn } from "@/shared/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Calendar, Clock, Sparkles, User, X } from "lucide-react";

import { MarkdownRenderer } from "@features/chat/components/MarkdownRenderer";

import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import { Dialog, DialogClose, DialogOverlay, DialogPortal } from "@shared/components/ui/dialog";
import { ScrollArea } from "@shared/components/ui/scroll-area";
import { Separator } from "@shared/components/ui/separator";

interface InsightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insight: DashboardInsightsResponse;
  /** "latest" shows a "Latest" badge; "generated" shows a "New" badge */
  mode: "latest" | "generated";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function InsightDialog({ open, onOpenChange, insight, mode }: InsightDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="backdrop-blur-sm bg-black/40" />

        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "w-full max-w-7xl max-h-[90vh] flex flex-col",
            "bg-card rounded-3xl border border-border-strong shadow-2xl",
            "focus:outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "duration-200"
          )}
          aria-describedby="insight-body"
        >
          <DialogPrimitive.Title className="sr-only">Allocation Insights</DialogPrimitive.Title>

          {/* ── Header ──────────────────────────────────────────── */}
          <div className="flex items-start justify-between px-7 pt-6 pb-5 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="size-5 text-primary" />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground leading-6">
                    Allocation Insights
                  </h2>
                  <Badge
                    className={cn(
                      "rounded-full text-[10px] font-extrabold tracking-widest uppercase border-transparent px-2.5 py-0.5",
                      mode === "latest"
                        ? "bg-primary/10 text-primary hover:bg-primary/10"
                        : "bg-green-100 text-green-700 hover:bg-green-100"
                    )}
                  >
                    {mode === "latest" ? "Latest" : "New"}
                  </Badge>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {formatDate(insight.period_start)} – {formatDate(insight.period_end)}
                  </span>
                  <span className="w-px h-3 bg-border" />
                  <span className="flex items-center gap-1 capitalize">
                    <User className="size-3" />
                    {insight.generated_by}
                  </span>
                  <span className="w-px h-3 bg-border" />
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {formatDateTime(insight.created_at)}
                  </span>
                </div>
              </div>
            </div>

            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent shrink-0"
              >
                <X className="size-4" />
              </Button>
            </DialogClose>
          </div>

          {/* ── Body ────────────────────────────────────────────── */}
          <ScrollArea className="flex-1 min-h-0" id="insight-body">
            <div className="px-7 py-6">
              <MarkdownRenderer content={insight.summary_text} />
            </div>
          </ScrollArea>

          {/* ── Footer ──────────────────────────────────────────── */}
          <div className="shrink-0">
            <Separator />
            <div className="flex items-center justify-between px-7 py-4">
              <p className="text-xs text-muted-foreground">
                Insight #{insight.id} · Generated by {insight.generated_by}
              </p>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="h-9 px-5 rounded-xl border-border-strong text-sm"
                >
                  Close
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
