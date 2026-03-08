import React from "react";
import { Card } from "@/components/ui/Card";

export function SkeletonCard() {
  return (
    <Card className="flex h-full flex-col p-6 shadow-sm border-slate-200/50 bg-slate-50/30">
      <div className="flex animate-pulse items-start justify-between gap-4 mt-1">
        <div className="w-full">
          <div className="mb-3 h-7 w-3/4 rounded-lg bg-slate-200/80"></div>
          <div className="h-5 w-1/2 rounded-md bg-slate-200/80"></div>
        </div>
        <div className="h-6 w-16 shrink-0 rounded-full bg-slate-200/80"></div>
      </div>

      <div className="mt-4 flex animate-pulse flex-wrap items-center gap-x-4 gap-y-2">
        <div className="h-4 w-20 rounded-md bg-slate-200"></div>
        <div className="h-4 w-16 rounded-md bg-slate-200"></div>
        <div className="h-4 w-16 rounded-md bg-slate-200"></div>
      </div>

      <div className="mt-4 flex-1 animate-pulse space-y-2">
        <div className="h-3 w-full rounded-md bg-slate-200"></div>
        <div className="h-3 w-full rounded-md bg-slate-200"></div>
        <div className="h-3 w-2/3 rounded-md bg-slate-200"></div>
      </div>

      <div className="mt-5 flex animate-pulse flex-wrap gap-2">
        <div className="h-6 w-20 rounded-full bg-slate-200"></div>
        <div className="h-6 w-24 rounded-full bg-slate-200"></div>
      </div>

      <div className="mt-6 pt-5 animate-pulse border-t border-slate-100">
        <div className="h-11 w-full rounded-xl bg-slate-200"></div>
      </div>
    </Card>
  );
}
