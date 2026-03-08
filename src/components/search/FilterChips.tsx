"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { FiltersState } from "./FilterSidebar";

interface FilterChipsProps {
  filters: FiltersState;
  onRemoveFilter: (key: keyof FiltersState) => void;
}

export function FilterChips({ filters, onRemoveFilter }: FilterChipsProps) {
  const activeFilters = Object.entries(filters).filter(([, value]) => Boolean(value));

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-3">
      {activeFilters.map(([key, value]) => (
        <Badge
          key={key}
          variant="secondary"
          className="flex items-center gap-1.5 pl-3 pr-2"
        >
          <span>{value}</span>
          <button
            onClick={() => onRemoveFilter(key as keyof FiltersState)}
            className="ml-1 rounded-full p-0.5 hover:bg-purple-200 focus:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label={`Remove filter ${value}`}
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </Badge>
      ))}
    </div>
  );
}
