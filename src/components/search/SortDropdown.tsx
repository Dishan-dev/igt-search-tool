"use client";

import React from "react";

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-500 whitespace-nowrap">Sort by:</span>
      <select
        className="rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-sm font-medium text-slate-700 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="latest">Latest</option>
        <option value="title-asc">Title A-Z</option>
        <option value="duration">Duration</option>
        <option value="paid-first">Paid first</option>
      </select>
    </div>
  );
}
