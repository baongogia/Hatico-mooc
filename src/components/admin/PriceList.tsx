"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";
import { 
  Search, 
  RefreshCw, 
  FileText,
  DollarSign,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d");
};

export const PriceList = () => {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('trailers')
      .select('*')
      .order('id', { ascending: true });

    const allProducts: any[] = [];
    
    if (data) {
      data.forEach(t => allProducts.push({
        ...t,
        type: 'trailer',
        uniqueId: `trailer-${t.id}`
      }));
    }

    setProducts(allProducts);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      normalizeText(p.name || "").includes(normalizeText(searchTerm)) ||
      normalizeText(p.category || "").includes(normalizeText(searchTerm))
  );

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-500 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
           <h2 className="text-sm font-black uppercase text-slate-800 tracking-widest flex items-center gap-2">
             <div className="w-1 h-3 bg-accent" /> Bảng báo giá chi tiết
           </h2>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full h-12 pl-10 pr-3 bg-white border border-slate-200 rounded-none text-xs font-black uppercase tracking-widest focus:border-accent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            className="h-12 bg-slate-900 text-white hover:bg-black rounded-none px-6 font-black uppercase text-xs tracking-widest transition-all"
            onClick={fetchProducts}
            disabled={loading}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", loading ? 'animate-spin' : '')} />
            LÀM MỚI
          </Button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-primary shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-900 text-white border-b border-slate-800">
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] w-12 text-center border border-slate-800">STT</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] w-64 border border-slate-800">Sản phẩm & Hình ảnh</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-800">Thông số kỹ thuật</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] w-56 border border-slate-800">Giá chi nhánh</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] w-24 text-center border border-slate-800">Lương</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="p-8">
                       <div className="h-20 bg-slate-50 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => {
                  let imageUrl = product.image;
                  if (Array.isArray(product.images) && product.images.length > 0) {
                    imageUrl = product.images[0];
                  } else if (typeof product.images === 'string') {
                    try {
                      const parsed = JSON.parse(product.images);
                      if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0];
                    } catch (e) {
                      imageUrl = product.images; // fallback if it's just a simple string URL
                    }
                  }

                  let regionalPrices = product.regional_prices;
                  if (typeof regionalPrices === 'string') {
                    try {
                      regionalPrices = JSON.parse(regionalPrices);
                    } catch (e) {
                      regionalPrices = {};
                    }
                  }

                  return (
                  <tr key={product.uniqueId} className="hover:bg-slate-50/50 transition-all group">
                    <td className="p-6 text-xs font-black text-slate-300 text-center align-top border-r border-slate-50">{index + 1}</td>
                    <td className="p-6 align-top">
                      <div className="flex flex-col gap-4">
                        <div className="aspect-[16/9] bg-slate-100 rounded-[8px] overflow-hidden border border-slate-200 relative shadow-sm group-hover:shadow-md transition-all">
                           {imageUrl ? (
                             <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                           ) : (
                             <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                               <FileText className="w-6 h-6 opacity-20" />
                               <span className="text-[9px] font-bold uppercase tracking-widest">Chưa có ảnh</span>
                             </div>
                           )}
                        </div>
                        <span className="text-sm font-black text-slate-900 uppercase leading-tight tracking-tight">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-6 align-top">
                      <div className="flex flex-col gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                             <div className="w-1 h-3 bg-accent" />
                             <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Thông tin kỹ thuật</span>
                          </div>
                          <div className="grid grid-cols-1 gap-1.5 pl-3">
                            {[
                              { label: "Kích thước", value: product.dimensions },
                              { label: "Tổng tải", value: product.gross_weight ? `${product.gross_weight.toLocaleString()} kg` : null },
                              { label: "Tự trọng", value: product.curb_weight ? `${product.curb_weight.toLocaleString()} kg` : null },
                              { label: "Tải trọng CP", value: product.payload_capacity ? `${product.payload_capacity.toLocaleString()} kg` : null, highlight: true },
                              { label: "Thông số lốp", value: product.tire_specs },
                            ].map((spec, i) => spec.value && (
                              <div key={i} className="flex text-[11px]">
                                <span className="w-24 shrink-0 font-bold text-slate-400 uppercase tracking-tighter">{spec.label}</span>
                                <span className={cn("font-black tracking-tight", spec.highlight ? "text-accent" : "text-slate-700")}>
                                  {typeof spec.value === 'object' ? JSON.stringify(spec.value) : String(spec.value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 align-top">
                      <div className="flex flex-col gap-1.5">
                        {regionalPrices && Object.keys(regionalPrices).length > 0 ? (
                          Object.entries(regionalPrices).map(([region, price]) => (
                            <div key={region} className="group/price flex justify-between items-center p-2 rounded-[8px] bg-slate-50 border border-slate-100 hover:border-accent/30 hover:bg-white transition-all">
                               <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/price:bg-accent transition-colors" />
                                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{region}</span>
                               </div>
                               <div className="flex items-baseline gap-0.5">
                                 <span className="text-sm font-black text-blue-800 tracking-tighter">{price}</span>
                                 <span className="text-[9px] font-black text-blue-800 italic">TR</span>
                               </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 border-2 border-dashed border-slate-100 rounded-[8px] text-center">
                             <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Liên hệ báo giá</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-6 text-center align-top border-l border-slate-50">
                       <div className="inline-block">
                          <div className="w-14 h-14 bg-emerald-900 text-white rounded-[8px] flex flex-col items-center justify-center shadow-md transition-all hover:shadow-lg cursor-default border border-white/10">
                             <span className="text-[8px] font-black uppercase tracking-tighter opacity-70">Lương</span>
                             <span className="text-2xl font-black leading-none">{product.commission_internal || "---"}</span>
                          </div>
                       </div>
                    </td>
                  </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-16 text-center">
                    <p className="text-xs font-black uppercase text-slate-300 tracking-widest">Không có dữ liệu sản phẩm</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
