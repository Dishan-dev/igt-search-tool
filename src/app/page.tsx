"use client";

import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { fetchOpportunities } from "@/lib/api";
import { Opportunity } from "@/types/opportunity";
import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { useRouter } from "next/navigation";
import { getOpportunityImage } from "@/lib/opportunityImage";

export default function Home() {
  const router = useRouter();
  const chips = ["Marketing", "Tech", "Remote", "Paid", "Asia", "3–6 months"];
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const loadOpportunities = async (query?: string) => {
    setIsLoading(true);
    try {
      const response = await fetchOpportunities({ q: query, page: 1 });
      setOpportunities(response.data);
    } catch (error) {
      console.error("Failed to fetch opportunities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

  const handleTagClick = (tag: string) => {
    const newTag = selectedTag === tag ? null : tag;
    setSelectedTag(newTag);
    const q = (newTag || searchQuery || "").trim();
    const target = q ? `/opportunities?q=${encodeURIComponent(q)}&page=1` : "/opportunities?page=1";
    router.push(target);
  };

  const handleSearch = () => {
    const q = (searchQuery || selectedTag || "").trim();
    const target = q ? `/opportunities?q=${encodeURIComponent(q)}&page=1` : "/opportunities?page=1";
    router.push(target);
  };

  const floatingOpps = [...opportunities, ...opportunities];

  return (
    <section className="relative min-h-screen flex items-center overflow-y-auto bg-gradient-to-r from-[#172e6d] to-[#461169] py-20 lg:py-0">
      {/* Background Image */}
      <Image
        src="/hero-bg.jpeg"
        alt="AIESEC team members"
        fill
        priority
        className="object-cover object-bottom opacity-40 shrink-0"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30 pointer-events-none" />

      {/* Content Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 w-full items-center">
          
          {/* Left Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 text-sm text-white/90"
            >
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="font-semibold">AIESEC Colombo South</span>
              <span className="text-white/50">·</span>
              <span>Global Talent</span>
            </motion.div>

            {/* Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6"
            >
              Find Your<br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Global Internship</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-white/70 max-w-lg mb-10 leading-relaxed font-medium"
            >
              Explore IGT opportunities worldwide<br className="hidden sm:block" />
              with support from AIESEC in Colombo South.
            </motion.p>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-stretch gap-3 sm:flex-row rounded-2xl bg-white/95 backdrop-blur-xl border border-white/20 p-2 max-w-xl mb-6 shadow-2xl shadow-black/40"
            >
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <Input
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="h-12 border-0 bg-transparent text-slate-900 placeholder:text-slate-400 pl-11 focus:ring-0 shadow-none"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleSearch}
                  className="h-12 px-6 text-base font-bold whitespace-nowrap bg-blue-600 hover:bg-blue-500"
                >
                  Search
                </Button>
                <Link href="/opportunities">
                  <Button variant="outline" className="h-12 px-4 text-sm font-semibold border-slate-200 text-slate-600 hover:bg-slate-50 whitespace-nowrap">
                    More Opps
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Filter Chips */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2 mb-10"
            >
              {chips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleTagClick(chip)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                    selectedTag === chip 
                    ? "bg-blue-600 border-blue-400 text-white" 
                    : "border-white/10 bg-white/5 text-white/60 hover:bg-white/15 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {chip}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Floating Cards Container */}
          <div className="hidden lg:block relative h-[700px] w-full overflow-hidden mask-fade-edges py-8">
            <div className="flex flex-col gap-6 animate-float-down hover:[animation-play-state:paused] shrink-0">
              {isLoading ? (
                <div className="flex flex-col gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-full aspect-[4/3] rounded-3xl bg-white/5 animate-pulse border border-white/10" />
                  ))}
                </div>
              ) : opportunities.length > 0 ? (
                floatingOpps.map((opp, index) => (
                  <motion.div
                    key={`${opp.id}-${index}`}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedOpp(opp)}
                    className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer shrink-0"
                  >
                    {/* Card Image */}
                    <div className="absolute inset-0 bg-slate-800">
                       <Image
                          src={getOpportunityImage(opp)}
                          alt={opp.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                       />
                    </div>

                    {/* Glass Overlay */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-all group-hover:bg-black/20 group-hover:backdrop-blur-none" />

                    {/* Text Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">{opp.category}</p>
                          <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-blue-300 transition-colors line-clamp-2">{opp.title}</h3>
                          <p className="text-sm text-white/70 font-medium flex items-center gap-2">
                             <span className="inline-block w-4 h-4 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[10px]">🏢</span>
                             {opp.company} • 📍 {opp.country}
                          </p>
                        </div>
                        <div className="rounded-full bg-white/10 backdrop-blur-md p-3 border border-white/20 group-hover:bg-blue-600 transition-colors shrink-0">
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/40 gap-4">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-lg font-medium">No results found</p>
                  <Button variant="outline" className="text-slate-400 hover:text-white border-white/10 hover:bg-white/5" onClick={() => { setSelectedTag(null); setSearchQuery(""); loadOpportunities(); }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Opportunity Detail Modal */}
      <Modal isOpen={!!selectedOpp} onClose={() => setSelectedOpp(null)}>
        {selectedOpp && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-blue-400 text-sm font-bold uppercase tracking-widest">{selectedOpp.category}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">{selectedOpp.title}</h2>
              <p className="text-xl text-white/60 font-medium">{selectedOpp.company} • {selectedOpp.city}, {selectedOpp.country}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <p className="text-xs text-white/40 uppercase font-bold mb-1">Duration</p>
                <p className="text-white font-semibold">{selectedOpp.duration}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <p className="text-xs text-white/40 uppercase font-bold mb-1">Type</p>
                <p className="text-white font-semibold">{selectedOpp.remoteType}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <p className="text-xs text-white/40 uppercase font-bold mb-1">Stipend</p>
                <p className="text-white font-semibold">{selectedOpp.stipend || "Unpaid"}</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <p className="text-xs text-white/40 uppercase font-bold mb-1">Start Date</p>
                <p className="text-white font-semibold">{selectedOpp.startDate || "Flexible"}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-lg font-bold text-white">About the Opportunity</h4>
              <p className="text-white/70 leading-relaxed overflow-y-auto max-h-48 scrollbar-hide">{selectedOpp.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedOpp.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-full text-xs font-semibold">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="pt-4 flex gap-4">
              <Link href="/opportunities" className="flex-1">
                 <Button className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-500">
                    Apply Now
                 </Button>
              </Link>
              <Button variant="outline" className="h-12 border-white/10 text-white hover:bg-white/5" onClick={() => setSelectedOpp(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <style jsx global>{`
        .mask-fade-edges {
          mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
