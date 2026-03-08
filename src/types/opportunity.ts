export interface Opportunity {
  id: string;
  title: string;
  company: string;
  country: string;
  city: string;
  duration: string;
  category: string;
  remoteOpportunity: string;
  paid: boolean;
  salary: number | null;
  salaryPeriodicity: string | null;
  tags: string[];
  description: string;
  startDate: string | null;
  status: string;
  applicantsCount: number;
  hostLc: string;

  // Computed fields added by normalizer for UI compatibility
  remoteType?: string;
  stipend?: string;
}

export interface Paging {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface OpportunityResponse {
  data: Opportunity[];
  paging: Paging;
}

export interface FetchOpportunitiesParams {
  q?: string;
  page?: number;
  category?: string;
  country?: string;
  remoteType?: string;
  paid?: string;
  duration?: string;
  sortBy?: string;
}
