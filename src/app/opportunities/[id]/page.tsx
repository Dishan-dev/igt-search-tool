import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchOpportunityById, fetchOpportunities } from "@/lib/api";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { OpportunityGrid } from "@/components/opportunity/OpportunityGrid";

interface PageProps {
  params: Promise<{ id: string }>;
}

type DetailSectionCard = {
  key: string;
  title: string;
  emoji: string;
  items: string[];
  palette: string;
};

function renderBulletList(items: string[]) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex items-start gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
          <span className="text-slate-600 font-medium">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function OpportunityDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const guidanceWhatsappUrl = "https://wa.me/94706022582";
  
  // Use the API helper to fetch data
  const opportunity = await fetchOpportunityById(id);

  // Trigger 404 if not found
  if (!opportunity) {
    notFound();
  }

  // Use the API helper to fetch similar opportunities
  const similarParams = { category: opportunity.category };
  const similarResponse = await fetchOpportunities(similarParams);
  const similarOpportunities = similarResponse.data
    .filter((opp) => opp.id !== opportunity.id)
    .slice(0, 3);
  const expaOpportunityUrl = `https://aiesec.org/opportunity/global-teacher/${opportunity.id}`;

  const roleDetails = (opportunity.roleDetails && opportunity.roleDetails.length > 0)
    ? opportunity.roleDetails
    : (opportunity.learningPoints || []);
  const processDetails = (opportunity.processDetails && opportunity.processDetails.length > 0)
    ? opportunity.processDetails
    : (opportunity.selectionProcess ? [opportunity.selectionProcess] : []);
  const eligibilityDetails = opportunity.eligibilityDetails || [];
  const logisticsDetails = opportunity.logisticsDetails || [];
  const visaDetails = opportunity.visaDetails || [];
  const salaryAmount = typeof opportunity.salary === "number" ? opportunity.salary : null;
  const salaryCurrency =
    opportunity.feeAndHealthInsurance?.currency || opportunity.opportunityCost?.currency || "USD";
  const salaryPeriod = (opportunity.salaryPeriodicity || "").replace(/^per\s+/i, "").trim();
  const salaryDisplay = salaryAmount !== null && salaryAmount > 0
    ? `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(salaryAmount)} ${salaryCurrency}${salaryPeriod ? ` / ${salaryPeriod}` : ""}`
    : "Not specified";

  const detailCards: DetailSectionCard[] = [
    {
      key: "role",
      title: "Role Details",
      emoji: "🎯",
      items: roleDetails,
      palette: "from-cyan-50 to-blue-50 border-cyan-200",
    },
    {
      key: "process",
      title: "Selection Process",
      emoji: "🧭",
      items: processDetails,
      palette: "from-violet-50 to-indigo-50 border-violet-200",
    },
    {
      key: "eligibility",
      title: "Eligibility",
      emoji: "✅",
      items: eligibilityDetails,
      palette: "from-emerald-50 to-lime-50 border-emerald-200",
    },
    {
      key: "logistics",
      title: "Logistics",
      emoji: "📦",
      items: logisticsDetails,
      palette: "from-amber-50 to-orange-50 border-amber-200",
    },
    {
      key: "visa",
      title: "Visa Details",
      emoji: "🛂",
      items: visaDetails,
      palette: "from-pink-50 to-rose-50 border-pink-200",
    },
  ].filter((card) => card.items.length > 0);

  return (
    <PageContainer>
      {/* Hero Section */}
      <div className="relative mb-12 rounded-[2rem] overflow-hidden bg-slate-900 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />
        <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-3xl">
             <div className="flex items-center gap-3 mb-6">
                <Link href="/opportunities" className="group flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-bold uppercase tracking-widest transition-all hover:bg-white/10 hover:text-white">
                   <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                   </svg>
                   Directory
                </Link>
                <div className="h-4 w-px bg-white/10" />
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-blue-300 text-xs font-bold uppercase tracking-widest">
                   <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                   {opportunity.category}
                </div>
             </div>
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 leading-[1.1]">
                {opportunity.title}
             </h1>
             <p className="text-xl text-white/70 font-semibold mb-2">
                {opportunity.company}
             </p>
             <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/50">
                <span className="flex items-center gap-1.5">
                   <span className="text-xs">🟢</span> {opportunity.status?.replace("_", " ") || "Open"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                   📍 {opportunity.city}, {opportunity.country}
                </span>
             </div>
          </div>
          <div className="hidden lg:block shrink-0">
             <div className="h-40 w-40 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center -rotate-6 shadow-2xl">
                <span className="text-6xl">🏢</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 items-start">
        {/* Main Content Area (Left: 2 columns wide) */}
        <div className="lg:col-span-2 space-y-12">
          {/* Detailed Content */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm shadow-slate-200/50">
             <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-sm italic">i</span>
                About the Role
             </h3>
             <div className="prose prose-slate max-w-none text-slate-600">
                <p className="text-lg leading-relaxed whitespace-pre-wrap mb-8 font-medium italic text-slate-500">
                  {opportunity.description}
                </p>
                <div className="h-px bg-slate-100 mb-8" />

                {detailCards.length > 0 && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 not-prose">
                    {detailCards.map((card) => (
                      <div
                        key={card.key}
                        className={`rounded-3xl border p-6 bg-gradient-to-br ${card.palette} shadow-sm`}
                      >
                        <div className="mb-4 flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-xl shadow-sm">
                            {card.emoji}
                          </span>
                          <h4 className="text-lg font-extrabold text-slate-900">{card.title}</h4>
                        </div>
                        {renderBulletList(card.items)}
                      </div>
                    ))}
                  </div>
                )}
             </div>

             {opportunity.tags && opportunity.tags.length > 0 && (
               <div className="pt-8 border-t border-slate-100">
                 <h4 className="text-lg font-bold text-slate-900 mb-4">Professional Skills</h4>
                 <div className="flex flex-wrap gap-2.5">
                   {opportunity.tags.map(tag => (
                     <Badge key={tag} variant="secondary" className="px-4 py-2 rounded-xl border border-slate-100 bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider">
                       {tag}
                     </Badge>
                   ))}
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* Info Card Area (Right) */}
        <div className="lg:col-span-1 space-y-8 lg:sticky lg:top-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors" />
            
            <h3 className="text-xl font-bold text-white mb-8 border-b border-white/10 pb-4">
              Logistics & Details
            </h3>
            
            <div className="space-y-6">
              {[
                { label: "Location", value: `${opportunity.city}, ${opportunity.country}`, icon: "📍", color: "blue" },
                { label: "Duration", value: opportunity.duration, icon: "⏳", color: "emerald" },
                { label: "Work Type", value: opportunity.remoteType, icon: "💼", color: "purple" },
                { label: "Start Date", value: opportunity.startDate ? new Date(opportunity.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "Flexible", icon: "📅", color: "pink" },
                  { label: "SALARY", value: salaryDisplay, icon: "💳", color: "orange" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 group/item">
                  <div className="mt-0.5 h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg transition-transform group-hover/item:scale-110">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-white font-bold leading-tight">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-3">
              <a
                href={expaOpportunityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full h-14 text-lg font-extrabold bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-500/20 active:translate-y-0.5">
                  Apply Now
                </Button>
              </a>
              <a
                href={guidanceWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  variant="outline"
                  className="w-full h-12 border-emerald-500! bg-emerald-500! text-white! hover:border-emerald-400! hover:bg-emerald-400! shadow-lg shadow-emerald-500/25"
                >
                  <span className="inline-flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-4 w-4 fill-current"
                    >
                      <path d="M20.52 3.48A11.82 11.82 0 0 0 12.07 0C5.5 0 .15 5.35.15 11.92c0 2.1.55 4.15 1.6 5.95L0 24l6.31-1.66a11.9 11.9 0 0 0 5.76 1.47h.01c6.57 0 11.92-5.35 11.92-11.92 0-3.18-1.24-6.17-3.48-8.41Zm-8.45 18.3h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.75.98 1-3.66-.24-.38a9.85 9.85 0 0 1-1.52-5.24C2.15 6.4 6.58 1.97 12.07 1.97c2.64 0 5.13 1.03 7 2.9a9.8 9.8 0 0 1 2.9 7c0 5.5-4.43 9.91-9.9 9.91Zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.8-1.68-2.1-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.23-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.8.37-.27.3-1.03 1-1.03 2.43s1.05 2.8 1.2 3c.15.2 2.06 3.14 4.99 4.4.7.3 1.25.49 1.68.63.7.22 1.34.19 1.85.12.56-.08 1.76-.72 2.01-1.41.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
                    </svg>
                    Get Guidance
                  </span>
                </Button>
              </a>
            </div>
          </div>
          
          <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50">
             <p className="text-xs text-blue-700 font-bold leading-relaxed">
                Need help with your application? Reach out to our team at AIESEC Colombo South for personalized internship coaching.
             </p>
          </div>
        </div>
      </div>

      {/* Similar Opportunities Section */}
      {similarOpportunities.length > 0 && (
        <div className="mt-24 pt-16 border-t border-slate-200">
          <SectionHeading className="mb-10 text-3xl font-extrabold text-slate-900">Similar Placements</SectionHeading>
          <OpportunityGrid opportunities={similarOpportunities} />
        </div>
      )}
    </PageContainer>
  );
}
