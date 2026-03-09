import { NextRequest, NextResponse } from "next/server";
import { dummyOpportunities } from "@/data/opportunities";
import { Opportunity, OpportunityResponse } from "@/types/opportunity";

const PAGE_SIZE = 9;

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

function includesInsensitive(value: string, query: string): boolean {
  return value.toLowerCase().includes(query.toLowerCase());
}

function durationToMonths(duration: string): number {
  const numeric = duration.replace(/[^\d]/g, "");
  return numeric ? Number.parseInt(numeric, 10) : Number.MAX_SAFE_INTEGER;
}

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const q = searchParams.get("q")?.trim() ?? "";
  const category = searchParams.get("category")?.trim() ?? "";
  const country = searchParams.get("country")?.trim() ?? "";
  const remoteType = searchParams.get("remoteType")?.trim().toLowerCase() ?? "";
  const paid = searchParams.get("paid")?.trim().toLowerCase() ?? "";
  const duration = searchParams.get("duration")?.trim().toLowerCase() ?? "";
  const sortBy = searchParams.get("sortBy")?.trim() ?? "latest";

  const pageParam = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const currentPage = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  let data = (dummyOpportunities as LegacyOpportunity[]).map(toApiOpportunity);

  if (q) {
    data = data.filter((item) => {
      return (
        includesInsensitive(item.title, q) ||
        includesInsensitive(item.company, q) ||
        includesInsensitive(item.category, q) ||
        includesInsensitive(item.country, q) ||
        item.tags.some((tag) => includesInsensitive(tag, q))
      );
    });
  }

  if (category) {
    data = data.filter((item) => item.category.toLowerCase() === category.toLowerCase());
  }

  if (country) {
    data = data.filter((item) => item.country.toLowerCase() === country.toLowerCase());
  }

  if (remoteType) {
    data = data.filter((item) => {
      const resolved = item.remoteOpportunity === "true" ? "remote" : "onsite";
      return resolved === remoteType;
    });
  }

  if (paid) {
    const isPaid = paid === "paid" || paid === "true";
    const isUnpaid = paid === "unpaid" || paid === "false";

    if (isPaid || isUnpaid) {
      data = data.filter((item) => item.paid === isPaid);
    }
  }

  if (duration) {
    data = data.filter((item) => item.duration.toLowerCase() === duration);
  }

  if (sortBy === "title-asc") {
    data.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "duration") {
    data.sort((a, b) => durationToMonths(a.duration) - durationToMonths(b.duration));
  } else if (sortBy === "paid-first") {
    data.sort((a, b) => Number(b.paid) - Number(a.paid));
  } else {
    data.sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateB - dateA;
    });
  }

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const start = (currentPage - 1) * PAGE_SIZE;
  const pagedData = data.slice(start, start + PAGE_SIZE);

  const response: OpportunityResponse = {
    data: pagedData,
    paging: {
      currentPage,
      totalPages,
      totalItems,
    },
  };

  return NextResponse.json(response);
}
