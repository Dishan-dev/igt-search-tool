import { NextRequest, NextResponse } from "next/server";
import { dummyOpportunities } from "@/data/opportunities";
import { Opportunity } from "@/types/opportunity";

type LegacyOpportunity = {
  id: string;
  title: string;
  company: string;
  country: string;
  city: string;
  duration: string;
  category: string;
  remoteType: string;
  paid: boolean;
  stipend?: string;
  tags: string[];
  description: string;
  startDate: string | null;
};

function parseSalary(stipend?: string): { salary: number | null; salaryPeriodicity: string | null } {
  if (!stipend) {
    return { salary: null, salaryPeriodicity: null };
  }

  const numeric = stipend.replace(/[^\d]/g, "");
  const salary = numeric ? Number.parseInt(numeric, 10) : null;

  let salaryPeriodicity: string | null = null;
  if (/\/mo|month/i.test(stipend)) salaryPeriodicity = "per month";

  return { salary, salaryPeriodicity };
}

function toApiOpportunity(item: LegacyOpportunity): Opportunity {
  const { salary, salaryPeriodicity } = parseSalary(item.stipend);

  return {
    id: item.id,
    title: item.title,
    company: item.company,
    country: item.country,
    city: item.city,
    duration: item.duration,
    category: item.category,
    remoteOpportunity: item.remoteType.toLowerCase() === "remote" ? "true" : "false",
    paid: item.paid,
    salary,
    salaryPeriodicity,
    tags: item.tags,
    description: item.description,
    startDate: item.startDate,
    status: "open",
    applicantsCount: 0,
    hostLc: "AIESEC Colombo South",
  };
}

export function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return context.params.then(({ id }) => {
    const found = (dummyOpportunities as LegacyOpportunity[]).find((item) => item.id === id);

    if (!found) {
      return NextResponse.json({ message: "Opportunity not found" }, { status: 404 });
    }

    return NextResponse.json(toApiOpportunity(found));
  });
}
