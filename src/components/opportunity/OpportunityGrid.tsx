import React from "react";
import { Opportunity } from "@/types/opportunity";
import { OpportunityCard } from "./OpportunityCard";

interface OpportunityGridProps {
  opportunities: Opportunity[];
}

export function OpportunityGrid({ opportunities }: OpportunityGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
      {opportunities.map((opp) => (
        <OpportunityCard key={opp.id} opportunity={opp} />
      ))}
    </div>
  );
}
