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

  branchId?: number;
  branchName?: string;
  hostLcId?: number;
  location?: string;
  programmes?: Array<{
    id: number;
    shortName: string;
  }>;
  learningPoints?: string[];
  selectionProcess?: string;
  roleDetails?: string[];
  processDetails?: string[];
  eligibilityDetails?: string[];
  logisticsDetails?: string[];
  visaDetails?: string[];
  logistics?: {
    accommodationProvided?: string;
    accommodationCovered?: string;
    computerProvided?: string;
    foodProvided?: string;
    foodCovered?: string;
    transportationProvided?: string;
    transportationCovered?: string;
  };
  specifics?: {
    salary?: number;
    salaryPeriodicity?: string;
    computer?: string;
    expectedWorkSchedule?: string;
  };
  opportunityCost?: {
    programmeFee?: number | null;
    projectFee?: number | null;
    total?: number | null;
    currency?: string | null;
    country?: string | null;
    healthInsuranceLink?: string | null;
  } | null;
  feeAndHealthInsurance?: {
    programmeFee?: number | null;
    projectFee?: number | null;
    total?: number | null;
    currency?: string | null;
    country?: string | null;
    healthInsuranceLink?: string | null;
  } | null;
  imageUrl?: string;
  assignedPersonName?: string | null;
  assignedPersonWhatsapp?: string | null;
  assignedPersonWhatsappUrl?: string | null;

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
  limit?: number;
  remote?: boolean;
  status?: string;
  category?: string;
  country?: string;
  remoteType?: string;
  paid?: string | boolean;
  duration?: string;
  sortBy?: string;
}
