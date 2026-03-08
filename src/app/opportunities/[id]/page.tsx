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

export default async function OpportunityDetailsPage({ params }: PageProps) {
  const { id } = await params;
  
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
                <h4 className="text-xl font-bold text-slate-900 mb-6">Key Responsibilities</h4>
                <ul className="space-y-4 mb-10">
                  {[
                    "Collaborate with international teams to deliver high-impact results.",
                    "Engage in cross-cultural knowledge transfer and skill building.",
                    "Participate in designated professional development sessions.",
                    "Ensure all deliverables meet the expected AIESEC Global Talent standards."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                       <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                       <span className="text-slate-600 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
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
                { label: "Compensation", value: `${opportunity.paid ? "Paid" : "Unpaid"}${opportunity.stipend ? ` (${opportunity.stipend})` : ""}`, icon: "💰", color: "orange" }
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
              <Button className="w-full h-14 text-lg font-extrabold bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-500/20 active:translate-y-0.5">
                Apply Now
              </Button>
              <Button variant="outline" className="w-full h-12 border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:text-white font-bold">
                Get Guidance
              </Button>
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
