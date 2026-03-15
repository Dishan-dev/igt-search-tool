import React from "react";
import Link from "next/link";
import { Opportunity } from "@/types/opportunity";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const salaryAmount = typeof opportunity.salary === "number" ? opportunity.salary : null;
  const salaryCurrency =
    opportunity.feeAndHealthInsurance?.currency || opportunity.opportunityCost?.currency || "USD";
  const salaryPeriod = (opportunity.salaryPeriodicity || "").replace(/^per\s+/i, "").trim();
  const salaryDisplay =
    salaryAmount !== null && salaryAmount > 0
      ? `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(salaryAmount)} ${salaryCurrency}${salaryPeriod ? ` / ${salaryPeriod}` : ""}`
      : "Not specified";

  return (
    <Card className="group flex h-full flex-col p-6 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-500 relative overflow-hidden">
      {/* Decorative top border gradient that activates on hover */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-start justify-between gap-4 mt-1">
        <div>
          <h3 className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
            {opportunity.title}
          </h3>
          <p className="mt-1 font-medium text-slate-600 line-clamp-1">
            {opportunity.company}
          </p>
        </div>
        <Badge variant="secondary" className="shrink-0 bg-orange-50 text-orange-700 border border-orange-100">
          {`SALARY: ${salaryDisplay}`}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
        <div className="flex items-center gap-1.5">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-1">{opportunity.city}, {opportunity.country}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{opportunity.duration}</span>
        </div>
        <div className="flex items-center gap-1.5">
           <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
           </svg>
           <span className="capitalize">{opportunity.remoteType}</span>
        </div>
      </div>

      <p className="mt-4 flex-1 text-sm text-slate-600 line-clamp-3">
        {opportunity.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-normal">
          {opportunity.category}
        </Badge>
      </div>

      <div className="mt-6 space-y-2 border-t border-slate-100 pt-5">
        <Link href={`/opportunities/${opportunity.id}`} className="block w-full">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
}
