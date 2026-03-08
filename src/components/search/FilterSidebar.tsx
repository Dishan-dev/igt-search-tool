"use client";

import React from "react";
import { Card } from "@/components/ui/Card";

export interface FiltersState {
  category: string;
  country: string;
  remoteType: string;
  paid: string;
  duration: string;
}

interface FilterSidebarProps {
  filters: FiltersState;
  onFilterChange: (key: keyof FiltersState, value: string) => void;
  onClearFilters: () => void;
}

const CATEGORIES = ["All", "Marketing", "Tech", "Business Development", "UI/UX", "HR", "Operations", "Finance", "Product"];
const COUNTRIES = ["All", "Japan", "Germany", "United Arab Emirates", "Singapore", "United States", "United Kingdom", "Canada", "Australia", "Netherlands", "Spain", "Hong Kong"];
const REMOTE_TYPES = ["All", "remote", "hybrid", "onsite"];
const PAID_OPTIONS = ["All", "Paid", "Unpaid"];
const DURATIONS = ["All", "2 months", "3 months", "4 months", "6 months"];

export function FilterSidebar({ filters, onFilterChange, onClearFilters }: FilterSidebarProps) {
  const renderSelect = (label: string, key: keyof FiltersState, options: string[]) => (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <select
        className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-800 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        value={filters[key]}
        onChange={(e) => onFilterChange(key, e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt === "All" ? "" : opt}>
            {opt === "All" ? `All ${label}` : opt}
          </option>
        ))}
      </select>
    </div>
  );

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <Card className="p-5">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Filters</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs font-semibold text-purple-600 hover:text-purple-700"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-5">
        {renderSelect("Category", "category", CATEGORIES)}
        {renderSelect("Country", "country", COUNTRIES)}
        {renderSelect("Work Type", "remoteType", REMOTE_TYPES)}
        {renderSelect("Compensation", "paid", PAID_OPTIONS)}
        {renderSelect("Duration", "duration", DURATIONS)}
      </div>
    </Card>
  );
}
