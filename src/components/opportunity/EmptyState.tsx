import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center py-20 text-center shadow-sm border-dashed border-2 border-slate-200 bg-slate-50/50">
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 p-6 mb-6">
        <svg
          className="h-12 w-12 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-bold text-slate-900">
        No opportunities found
      </h3>
      <p className="mb-6 max-w-sm text-slate-500">
        We couldn&apos;t find any opportunities matching your current filters. Try
        adjusting your search or clearing filters.
      </p>
      <Button variant="outline" onClick={onClearFilters}>
        Clear all filters
      </Button>
    </Card>
  );
}
