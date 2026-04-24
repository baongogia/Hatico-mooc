"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";
import { 
  Search, 
  RefreshCw, 
  Truck,
  Settings2,
  Cpu,
  BarChart3,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface CommercialVehicle {
  id: number;
  name: string;
  category: string;
  brand: string;
  cabin: string;
  drive_config: string;
  engine_brand: string;
  engine_model: string;
  horsepower: number;
  axle_type: string;
  gear_ratio: string;
  other_config: string;
  price: number;
  commission: number;
}

export const CommercialVehicleList = () => {
  const [vehicles, setVehicles] = React.useState<CommercialVehicle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  const fetchVehicles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("commercial_vehicles")
      .select("*")
      .order("brand", { ascending: true })
      .order("category", { ascending: true });

    if (error) {
      console.error("Error fetching commercial vehicles:", error);
    } else {
      setVehicles(data || []);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.engine_model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Grouping logic for row spans
  const rowSpans = React.useMemo(() => {
    const brandSpans: Record<number, number> = {};
    const categorySpans: Record<number, number> = {};

    filteredVehicles.forEach((v, index) => {
      // Brand spans
      if (index === 0 || v.brand !== filteredVehicles[index - 1].brand) {
        let span = 1;
        for (let i = index + 1; i < filteredVehicles.length; i++) {
          if (filteredVehicles[i].brand === v.brand) span++;
          else break;
        }
        brandSpans[index] = span;
      }

      // Category spans (nested within brand)
      if (index === 0 || 
          v.category !== filteredVehicles[index - 1].category || 
          v.brand !== filteredVehicles[index - 1].brand) {
        let span = 1;
        for (let i = index + 1; i < filteredVehicles.length; i++) {
          if (filteredVehicles[i].category === v.category && filteredVehicles[i].brand === v.brand) span++;
          else break;
        }
        categorySpans[index] = span;
      }
    });

    return { brandSpans, categorySpans };
  }, [filteredVehicles]);

  const categoryMap: Record<string, string> = {
    "dau_keo": "Đầu kéo",
    "xe_ben": "Xe ben",
    "xe_tron": "Xe trộn",
  };

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-500 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
           <h2 className="text-sm font-black uppercase text-slate-800 tracking-widest flex items-center gap-2">
             <div className="w-1 h-3 bg-accent" /> Báo giá xe thương mại
           </h2>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm xe, động cơ, thương hiệu..."
              className="w-full h-12 pl-10 pr-3 bg-white border border-slate-200 rounded-none text-xs font-black uppercase tracking-widest focus:border-accent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            className="h-12 bg-slate-900 text-white hover:bg-black rounded-none px-6 font-black uppercase text-xs tracking-widest transition-all"
            onClick={fetchVehicles}
            disabled={loading}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", loading ? 'animate-spin' : '')} />
            LÀM MỚI
          </Button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-primary shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-slate-900 text-white border-b border-slate-800">
                <th className="p-3 text-[10px] font-black uppercase tracking-widest border border-slate-800 bg-slate-950 sticky left-0 z-20 w-32">NCC</th>
                <th className="p-3 text-[10px] font-black uppercase tracking-widest border border-slate-800 w-32 text-center">Dòng xe</th>
                <th className="p-3 text-[10px] font-black uppercase tracking-widest border border-slate-800 w-48">Tên gọi / Cấu hình</th>
                <th className="p-3 text-[10px] font-black uppercase tracking-widest border border-slate-800 w-24 text-center">Cabin</th>
                <th className="p-3 text-[10px] font-black uppercase tracking-widest border border-slate-800 w-24 text-center">Cấu hình</th>
                <th className="p-3 text-[10px] font-black uppercase tracking-widest border border-slate-800 w-32 text-center">Động cơ</th>
                <th className="p-3 text-[10px] font-black uppercase tracking-widest border border-slate-800 w-20 text-center">Mã lực</th>
                <th className="p-3 text-[10px] font-black uppercase tracking-widest border border-slate-800 w-28 text-center">Loại cầu</th>
                <th className="p-3 text-[10px] font-black uppercase tracking-widest border border-slate-800 w-28 text-center">Tỷ số truyền</th>
                <th className="p-3 text-[10px] font-black uppercase tracking-widest border border-slate-800 w-32">Cấu hình khác</th>
                <th className="p-3 text-[10px] font-black uppercase tracking-widest border border-slate-800 w-32 text-right">Giá bán (TR)</th>
                <th className="p-3 text-[10px] font-black uppercase tracking-widest border border-slate-800 w-32 text-center bg-accent">Lương (TR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={12} className="p-6">
                       <div className="h-10 bg-slate-50 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle, index) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50/50 transition-all group border-b border-slate-100">
                    {/* Brand / NCC column - Merged */}
                    {rowSpans.brandSpans[index] && (
                      <td 
                        rowSpan={rowSpans.brandSpans[index]} 
                        className="p-3 text-[11px] font-black text-slate-900 uppercase border border-slate-100 sticky left-0 z-10 bg-white align-top text-center"
                      >
                        <div className="sticky top-20">
                          {vehicle.brand}
                        </div>
                      </td>
                    )}

                    {/* Category column - Merged */}
                    {rowSpans.categorySpans[index] && (
                      <td 
                        rowSpan={rowSpans.categorySpans[index]} 
                        className="p-3 text-[11px] font-black text-slate-700 uppercase border border-slate-100 bg-slate-50/50 align-top text-center"
                      >
                        <div className="sticky top-20">
                          {categoryMap[vehicle.category] || vehicle.category}
                        </div>
                      </td>
                    )}

                    <td className="p-3 text-[11px] font-bold text-slate-700 uppercase border border-slate-100">
                      {vehicle.name}
                    </td>
                    <td className="p-3 text-[11px] font-black text-slate-900 text-center border border-slate-100 bg-slate-50/10">
                      {vehicle.cabin || "---"}
                    </td>
                    <td className="p-3 text-[11px] font-black text-slate-600 text-center border border-slate-100">
                      {vehicle.drive_config || "---"}
                    </td>
                    <td className="p-3 text-[11px] font-bold text-slate-700 border border-slate-100">
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] text-slate-400 font-black tracking-widest">{vehicle.engine_brand}</span>
                        <span className="font-black text-blue-900">{vehicle.engine_model}</span>
                      </div>
                    </td>
                    <td className="p-3 text-[11px] font-black text-slate-900 text-center border border-slate-100 bg-slate-50/10">
                      {vehicle.horsepower ? `${vehicle.horsepower} HP` : "---"}
                    </td>
                    <td className="p-3 text-[11px] font-bold text-slate-700 text-center border border-slate-100">
                      {vehicle.axle_type || "---"}
                    </td>
                    <td className="p-3 text-[11px] font-black text-blue-800 text-center border border-slate-100 bg-blue-50/10">
                      {vehicle.gear_ratio || "---"}
                    </td>
                    <td className="p-3 text-[10px] font-bold text-slate-500 italic border border-slate-100">
                      {vehicle.other_config || "---"}
                    </td>
                    <td className="p-3 text-right border border-slate-100 font-black">
                      <span className="text-sm text-slate-900 tracking-tighter">{vehicle.price?.toLocaleString()}</span>
                    </td>
                    <td className="p-3 text-center border border-slate-100 bg-accent/5">
                      <div className="inline-flex items-center justify-center bg-accent text-white px-3 py-1 rounded-sm shadow-sm">
                        <span className="text-xs font-black">{vehicle.commission}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="p-16 text-center">
                    <p className="text-xs font-black uppercase text-slate-300 tracking-widest">Không có dữ liệu xe thương mại</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mt-2 p-4 bg-slate-900 rounded-sm border border-slate-800 shadow-xl">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-black uppercase text-white tracking-[0.2em]">Hệ thống phân tích kỹ thuật</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Bảng giá được cập nhật theo cấu hình động cơ và hệ thống truyền động thực tế.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-sm text-center min-w-[100px]">
             <p className="text-[8px] font-black text-slate-500 uppercase">Tổng số mẫu</p>
             <p className="text-sm font-black text-white">{filteredVehicles.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
