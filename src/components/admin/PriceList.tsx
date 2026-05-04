"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";
import { Search, ChevronDown, Filter, MoreVertical, RefreshCw, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export const PriceList = () => {
  const [loading, setLoading] = React.useState(true);
  const [trailers, setTrailers] = React.useState<any[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  const fetchPriceList = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("trailers")
      .select("*")
      .order("id", { ascending: true });
    
    if (data) setTrailers(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchPriceList();
  }, []);

  const filteredTrailers = trailers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-3 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 bg-white border border-slate-100 rounded-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-700 w-full pb-6">
       {/* Header Controls */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-primary border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm mẫu xe, hãng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-sm text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                />
             </div>
             <button className="p-2 bg-slate-50 border border-slate-100 rounded-sm hover:bg-slate-100 transition-all">
                <Filter className="w-4 h-4 text-slate-500" />
             </button>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
             <button 
               onClick={fetchPriceList}
               className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-sm hover:bg-slate-100 transition-all text-[10px] font-black uppercase tracking-widest text-slate-600"
             >
                <RefreshCw className="w-3 h-3" /> Làm mới
             </button>
             <button className="px-4 py-2 bg-slate-900 text-white rounded-sm hover:bg-slate-800 transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/20">
                Xuất File PDF
             </button>
          </div>
       </div>

       {/* Grid of Price Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTrailers.map((trailer) => (
            <div key={trailer.id} className="bg-white rounded-primary border border-slate-100 shadow-sm hover:shadow-xl hover:border-accent/20 transition-all duration-500 overflow-hidden flex flex-col group">
               {/* Trailer Header */}
               <div className="p-5 border-b border-slate-50 bg-slate-50/30">
                  <div className="flex justify-between items-start mb-3">
                     <span className="text-[9px] font-black text-white bg-slate-900 px-2 py-0.5 rounded-full uppercase tracking-widest">
                        {trailer.brand}
                     </span>
                     <button className="p-1 hover:bg-white rounded-full transition-all">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                     </button>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter leading-tight mb-1 group-hover:text-accent transition-colors">
                     {trailer.name}
                  </h3>
                  <div className="flex items-center gap-2">
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Layers className="w-3 h-3" /> {trailer.category}
                     </span>
                  </div>
               </div>

               {/* Specs Grid */}
               <div className="p-5 grid grid-cols-2 gap-4 border-b border-slate-50">
                  <div>
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Tải trọng</p>
                     <p className="text-xs font-black text-slate-900 uppercase">{trailer.payload_capacity?.toLocaleString()} KG</p>
                  </div>
                  <div>
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Kích thước</p>
                     <p className="text-[10px] font-black text-slate-900 uppercase truncate">{trailer.dimensions}</p>
                  </div>
               </div>

               {/* Pricing Section */}
               <div className="p-5 bg-white flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-1">
                     <div className="w-1 h-3 bg-accent rounded-full" />
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Giá niêm yết theo khu vực</span>
                  </div>
                  
                  <div className="space-y-2">
                     {trailer.regional_prices && typeof trailer.regional_prices === 'object' ? (
                        (() => {
                           const regionalPrices = trailer.regional_prices as Record<string, any>;
                           return Object.entries(regionalPrices).map(([region, price]) => (
                             <div key={region} className="group/price flex justify-between items-center p-2 rounded-[8px] bg-slate-50 border border-slate-100 hover:border-accent/30 hover:bg-white transition-all">
                                <div className="flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/price:bg-accent transition-colors" />
                                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{region}</span>
                                </div>
                                <div className="flex items-baseline gap-0.5">
                                  <span className="text-sm font-black text-blue-800 tracking-tighter">{String(price)}</span>
                                  <span className="text-[9px] font-black text-blue-800 italic">TR</span>
                                </div>
                             </div>
                           ));
                        })()
                     ) : (
                       <div className="p-4 border-2 border-dashed border-slate-100 rounded-[8px] text-center">
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Liên hệ báo giá</span>
                       </div>
                     )}
                  </div>
               </div>

               {/* Quick Actions */}
               <div className="p-4 bg-slate-50 flex gap-2">
                  <button className="flex-1 py-2 bg-white border border-slate-200 text-slate-900 rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Sửa Giá</button>
                  <button className="flex-1 py-2 bg-accent text-white rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-accent/90 transition-all">Chi tiết</button>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};
