"use client";

import React, { useState, useEffect, Suspense, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";

import { SearchBar } from "@/components/search/SearchBar";
import { FilterSidebar, FiltersState } from "@/components/search/FilterSidebar";
import { FilterChips } from "@/components/search/FilterChips";
import { SortDropdown } from "@/components/search/SortDropdown";
import { OpportunityGrid } from "@/components/opportunity/OpportunityGrid";
import { SkeletonCard } from "@/components/opportunity/SkeletonCard";
import { EmptyState } from "@/components/opportunity/EmptyState";
import { useOpportunities } from "@/hooks/useOpportunities";
import { FetchOpportunitiesParams } from "@/types/opportunity";
import { useDebounce } from "@/hooks/useDebounce";
import { rankOpportunities } from "@/lib/searchRanking";
import { Opportunity } from "@/types/opportunity";

function OpportunitiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // 1. Read Truth from URL Parameters
  const qStr = searchParams.get("q") || "";
  const categoryStr = searchParams.get("category") || "";
  const countryStr = searchParams.get("country") || "";
  const remoteTypeStr = searchParams.get("remoteType") || "";
  const paidStr = searchParams.get("paid") || "";
  const durationStr = searchParams.get("duration") || "";
  const sortByStr = searchParams.get("sortBy") || "latest";
  const programmeStr = (searchParams.get("programme") || "all").toLowerCase();

  const filters: FiltersState = {
    category: categoryStr,
    country: countryStr,
    remoteType: remoteTypeStr,
    paid: paidStr,
    duration: durationStr,
  };

  // 2. Manage Debounced Input State
  const [localSearch, setLocalSearch] = useState(qStr);
  const debouncedSearch = useDebounce(localSearch, 400);

  // Helper to construct and push URL updates safely
  const updateUrlParams = useCallback(
    (updates: Record<string, string | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      
      Object.entries(updates).forEach(([key, value]) => {
        if (!value) {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      });

      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${pathname}${query}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  // Sync debounce string upward to the URL (only if changed explicitly)
  useEffect(() => {
    if (debouncedSearch !== qStr) {
      updateUrlParams({ q: debouncedSearch, page: "1" });
    }
  }, [debouncedSearch, qStr, updateUrlParams]);

  // Synchronize browser history / URL updates back down into the visible input
  useEffect(() => {
    setLocalSearch(qStr);
  }, [qStr]);

  // 3. User Interaction Handlers (Manipulating the URL)
  const handleFilterChange = (key: keyof FiltersState, value: string) => {
    updateUrlParams({ [key]: value, page: "1" });
  };

  const handleRemoveFilter = (key: keyof FiltersState) => {
    updateUrlParams({ [key]: null, page: "1" });
  };

  const handleClearFilters = () => {
    updateUrlParams({
      q: null,
      category: null,
      country: null,
      remoteType: null,
      paid: null,
      duration: null,
      page: "1",
    });
    setLocalSearch("");
  };

  const handleSortChange = (value: string) => {
    updateUrlParams({ sortBy: value });
  };

  const handleProgrammeChange = (value: "all" | "gta" | "gte") => {
    updateUrlParams({ programme: value === "all" ? null : value, page: "1" });
  };

  const matchesProgramme = (opportunity: Opportunity, selectedProgramme: string): boolean => {
    if (selectedProgramme === "all") return true;

    const category = (opportunity.category || "").toLowerCase().trim();
    const programmeNames = (opportunity.programmes || [])
      .map((programme) => (programme.shortName || "").toLowerCase().trim())
      .filter(Boolean);
    const combined = [
      category,
      ...programmeNames,
      (opportunity.title || "").toLowerCase(),
      (opportunity.description || "").toLowerCase(),
    ].join(" ");

    if (selectedProgramme === "gta") {
      return combined.includes("igta") || combined.includes("gta");
    }

    if (selectedProgramme === "gte") {
      return combined.includes("igte") || combined.includes("gte");
    }

    return true;
  };

  // 4. Extract Hook via the Read Parameters
  const fetchParams: FetchOpportunitiesParams = {
    q: qStr,
    category: categoryStr,
    country: countryStr,
    remoteType: remoteTypeStr,
    paid: paidStr,
    duration: durationStr,
    sortBy: sortByStr,
    page: 1,
    limit: 1000,
  };

  const fallbackParams: FetchOpportunitiesParams = {
    q: "",
    category: categoryStr,
    country: countryStr,
    remoteType: remoteTypeStr,
    paid: paidStr,
    duration: durationStr,
    sortBy: sortByStr,
    page: 1,
    limit: 1000,
  };

  const { data: opportunities, loading, error } = useOpportunities(fetchParams);
  const { data: fallbackOpportunities } = useOpportunities(fallbackParams);
  const rankedOpportunities = useMemo(
    () => rankOpportunities(opportunities, qStr),
    [opportunities, qStr]
  );
  const filteredRankedOpportunities = useMemo(
    () => rankedOpportunities.filter((opp) => matchesProgramme(opp, programmeStr)),
    [rankedOpportunities, programmeStr]
  );
  const fallbackRankedOpportunities = useMemo(
    () =>
      rankOpportunities(fallbackOpportunities, qStr)
        .filter((opp) => matchesProgramme(opp, programmeStr))
        .slice(0, 12),
    [fallbackOpportunities, qStr, programmeStr]
  );
  const showFallbackRecommendations =
    !loading &&
    !error &&
    qStr.trim().length > 0 &&
    filteredRankedOpportunities.length === 0 &&
    fallbackRankedOpportunities.length > 0;

  const handleSearchSubmit = () => {
    updateUrlParams({ q: localSearch, page: "1" });
  };

  return (
    <PageContainer>
      {/* Hero Card Section */}
      <div className="relative mb-12 overflow-hidden rounded-4xl bg-slate-900 shadow-2xl">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 via-transparent to-purple-600/20" />
        <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
             <div className="flex items-center gap-3 mb-6">
                <Link href="/" className="group flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-bold uppercase tracking-widest transition-all hover:bg-white/10 hover:text-white">
                   <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                   </svg>
                   Home
                </Link>
                <div className="h-4 w-px bg-white/10" />
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-blue-300 text-xs font-bold uppercase tracking-widest">
                   <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                   Global Talent Directory
                </div>
             </div>
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                Explore <span className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Opportunities</span>
             </h1>
             <p className="text-lg text-white/60 font-medium">
               Discover premium Global Talent internships across the world.<br className="hidden md:block" /> 
                Refine your search to find the perfect match for your career goals.
             </p>
          </div>
          <div className="hidden lg:block">
            <div className="h-32 w-32 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center rotate-12">
               <svg className="w-16 h-16 text-blue-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
               </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row items-start">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden w-full">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-between px-6 py-4 bg-white border-slate-200 rounded-2xl shadow-sm"
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          >
            <span className="flex items-center gap-2 font-bold text-slate-700">
               <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
               </svg>
               {isMobileFiltersOpen ? "Hide Filters" : "Show Filters"}
            </span>
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
               {Object.values(filters).filter(Boolean).length} Active
            </span>
          </Button>
        </div>

        {/* Left Sidebar */}
        <aside className={`${isMobileFiltersOpen ? 'block' : 'hidden'} lg:block w-full lg:w-72 shrink-0 lg:sticky lg:top-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm shadow-slate-200/50`}>
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </aside>

        {/* Right Main Content */}
        <main className="flex-1 space-y-8">
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm shadow-slate-200/50">
              <SearchBar value={localSearch} onChange={setLocalSearch} onSearch={handleSearchSubmit} />
            </div>
            
            <FilterChips filters={filters} onRemoveFilter={handleRemoveFilter} />

            <div className="flex items-center gap-2 px-2">
              {([
                { key: "all", label: "All" },
                { key: "gte", label: "GTe" },
                { key: "gta", label: "GTa" },
              ] as const).map((programme) => {
                const isActive = programmeStr === programme.key;
                return (
                  <button
                    key={programme.key}
                    onClick={() => handleProgrammeChange(programme.key)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                      isActive
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {programme.label}
                  </button>
                );
              })}
            </div>
            
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-semibold text-slate-500">
                {loading ? "Refreshing..." : "Showing curated opportunities"}
              </span>
              <div className="flex items-center gap-3">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sort By</span>
                 <SortDropdown value={sortByStr} onChange={handleSortChange} />
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-4xl border border-red-200 bg-red-50 p-8 text-center text-red-600 shadow-sm ring-1 ring-red-100">
              <p className="font-bold text-lg">{error}</p>
              <p className="text-sm mt-1 opacity-80">We encountered an issue fetching the directory. Please try refreshing.</p>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
               {[1, 2, 3, 4, 5, 6].map((i) => (
                 <SkeletonCard key={i} />
               ))}
            </div>
          ) : filteredRankedOpportunities.length > 0 ? (
            <div className="pb-16">
              <OpportunityGrid opportunities={filteredRankedOpportunities} />
            </div>
          ) : showFallbackRecommendations ? (
            <div className="pb-16 space-y-6">
              <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                No exact matches for your search. Showing best-fit opportunities instead.
              </div>
              <OpportunityGrid opportunities={fallbackRankedOpportunities} />
            </div>
          ) : (
            <div className="bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 py-20">
               <EmptyState onClearFilters={handleClearFilters} />
            </div>
          )}
        </main>
      </div>
    </PageContainer>
  );
}

// 5. Wrap the implementation using Suspense to prevent SSR bailout errors
export default function OpportunitiesPage() {
  return (
    <Suspense 
      fallback={
        <PageContainer>
           <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-400 gap-4">
             <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-purple-500" />
             <p className="font-medium text-slate-500">Loading search layout...</p>
           </div>
        </PageContainer>
      }
    >
      <OpportunitiesContent />
    </Suspense>
  );
}
