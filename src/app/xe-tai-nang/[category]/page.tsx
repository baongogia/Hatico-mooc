"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useContactModal } from "@/context/ContactContext";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import {
  ChevronRight,
  ShieldCheck,
  Zap,
  Cog,
  Truck,
  Maximize,
  Layers,
  Info,
  CreditCard,
  X,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface CommercialVehicle {
  id: number;
  name: string;
  category: string;
  brand: string;
  cabin: string;
  images?: string[];
  drive_config?: string;
  engine_brand?: string;
  engine_model?: string;
  horsepower?: number;
  axle_type?: string;
  gear_ratio?: string;
  other_config?: string;
  price?: number;
}

const categoryMap: Record<string, string> = {
  dau_keo: "Xe Đầu Kéo",
  xe_ben: "Xe Ben",
  xe_tron: "Xe Trộn Bê Tông",
};

export default function CommercialVehiclesCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: rawCategory } = React.use(params);
  const dbCategory = rawCategory.replace("-", "_");

  const [vehicles, setVehicles] = React.useState<CommercialVehicle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedConfig, setSelectedConfig] = React.useState<CommercialVehicle | null>(null);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = React.useState(false);
  const [activeGroup, setActiveGroup] = React.useState<string | null>(null);

  // Redirect if invalid category
  if (!categoryMap[dbCategory]) {
    return notFound();
  }

  React.useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedConfig]);

  React.useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("commercial_vehicles")
        .select("*")
        .eq("category", dbCategory)
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching vehicles:", error);
      } else if (data && data.length > 0) {
        setVehicles(data);
        
        // Compute default group and select first item
        const firstItem = data[0];
        const defaultGroup = `${firstItem.brand} ${firstItem.cabin}`;
        setActiveGroup(defaultGroup);
        setSelectedConfig(firstItem);
      }
      setLoading(false);
    };

    fetchVehicles();
  }, [dbCategory]);

  // Group vehicles by Brand + Cabin
  const groupedVehicles = React.useMemo(() => {
    const groups: Record<string, CommercialVehicle[]> = {};
    vehicles.forEach(v => {
      const groupName = `${v.brand || "Khác"} ${v.cabin || ""}`.trim();
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(v);
    });
    return groups;
  }, [vehicles]);

  const pageTitle = categoryMap[dbCategory];

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center text-[11px] font-bold uppercase tracking-widest text-slate-400 gap-3">
          <Link href="/" className="hover:text-accent transition-colors">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-accent cursor-default">Xe Tải Nặng</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 font-black">
            {pageTitle}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 mt-16">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Side: Sidebar Selection Grouped by Base Model */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between mb-2 px-2">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                  Chọn Phiên Bản
                </h2>
                <div className="h-[1px] flex-1 bg-slate-100 ml-4"></div>
              </div>
              
              {loading ? (
                <div className="p-4 border border-dashed border-slate-200 rounded-[8px] animate-pulse text-slate-400 text-center text-xs">
                  Đang tải...
                </div>
              ) : Object.keys(groupedVehicles).length > 0 ? (
                Object.entries(groupedVehicles).map(([groupName, groupVehicles]) => (
                  <div key={groupName} className="mb-2 bg-white rounded-[12px] border border-slate-100 overflow-hidden shadow-sm">
                    {/* Accordion Header */}
                    <button
                      onClick={() => setActiveGroup(activeGroup === groupName ? null : groupName)}
                      className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-accent">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-tight text-slate-900">
                          {groupName}
                        </span>
                      </div>
                      <ChevronDown className={cn(
                        "w-4 h-4 text-slate-400 transition-transform duration-300",
                        activeGroup === groupName ? "rotate-180" : ""
                      )} />
                    </button>
                    
                    {/* Accordion Content (Configurations) */}
                    <AnimatePresence initial={false}>
                      {activeGroup === groupName && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-2 bg-white flex flex-col gap-1 border-t border-slate-100">
                            {groupVehicles.map(config => (
                              <button
                                key={config.id}
                                onClick={() => setSelectedConfig(config)}
                                className={cn(
                                  "group relative text-left p-3 rounded-[8px] transition-all duration-300 flex items-center gap-3",
                                  selectedConfig?.id === config.id
                                    ? "bg-slate-50 shadow-inner"
                                    : "hover:bg-slate-50/50"
                                )}
                              >
                                {selectedConfig?.id === config.id && (
                                  <motion.div
                                    layoutId="active-indicator"
                                    className="absolute left-0 top-2 bottom-2 w-1 bg-accent rounded-[8px]"
                                  />
                                )}
                                <div className="flex-1 pl-2">
                                  <div className={cn(
                                    "text-[11px] font-black uppercase tracking-tight transition-colors line-clamp-1",
                                    selectedConfig?.id === config.id ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"
                                  )}>
                                    {config.name}
                                  </div>
                                  <div className="text-[9px] font-bold text-slate-400 mt-1 flex items-center gap-1.5 uppercase tracking-wider">
                                    <Zap className="w-3 h-3 text-amber-500" />
                                    {config.horsepower ? `${config.horsepower} HP` : "Đang cập nhật"} 
                                    <span className="w-1 h-1 rounded-full bg-slate-300 mx-1"></span>
                                    {config.drive_config || ""}
                                  </div>
                                </div>
                                <ChevronRight
                                  className={cn(
                                    "w-3 h-3 transition-all",
                                    selectedConfig?.id === config.id ? "text-accent opacity-100 translate-x-0" : "text-slate-300 opacity-0 -translate-x-2"
                                  )}
                                />
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              ) : (
                <div className="p-6 bg-white rounded-[8px] text-slate-400 text-[11px] font-bold uppercase tracking-widest text-center border border-slate-100">
                  Chưa có dữ liệu
                </div>
              )}
            </div>

            {/* Sidebar Promo Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6 rounded-[12px] overflow-hidden relative aspect-[3/4] group shadow-xl shadow-slate-200"
            >
              <img
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2940&auto=format&fit=crop"
                alt="Hatico Promotion"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-[1px] bg-white/50"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">
                    Premium Offer
                  </span>
                </div>
                <h4 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter">
                  Giải Pháp Vận Tải <br />
                  <span className="text-accent">Vượt Trội</span>
                </h4>
                <div className="flex items-center gap-3 text-white/70 text-[10px] font-bold uppercase tracking-wider">
                  <CreditCard className="w-4 h-4 text-accent" />
                  Hỗ trợ trả góp 80%
                </div>
                <Button
                  variant="accent"
                  size="sm"
                  className="w-full py-5 text-[10px] tracking-[0.2em] font-black rounded-[8px]"
                  onClick={() => setIsQuoteModalOpen(true)}
                >
                  NHẬN TƯ VẤN NGAY
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Details & Specs */}
          <div className="w-full lg:w-2/3">
            <AnimatePresence mode="wait">
              {selectedConfig ? (
                <motion.div
                  key={selectedConfig.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white rounded-[12px] shadow-sm border border-slate-100 overflow-hidden mb-6">
                    <div className="w-full bg-white p-4 relative overflow-hidden group/gallery">
                      {selectedConfig.images && selectedConfig.images.length > 0 ? (
                        <div className="flex flex-col gap-4">
                          <div className="relative overflow-hidden rounded-[8px] bg-slate-50 border border-slate-100 shadow-sm h-[300px] md:h-[450px]">
                            <AnimatePresence mode="wait">
                              <motion.img
                                key={activeImageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                src={selectedConfig.images[activeImageIndex]}
                                alt={selectedConfig.name}
                                className="w-full h-full object-cover"
                              />
                            </AnimatePresence>
                          </div>
                          
                          {/* Thumbnails */}
                          {selectedConfig.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                              {selectedConfig.images.map((img, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setActiveImageIndex(idx)}
                                  className={cn(
                                    "relative w-20 h-20 rounded-[4px] overflow-hidden border-2 transition-all flex-shrink-0",
                                    activeImageIndex === idx ? "border-accent shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                                  )}
                                >
                                  <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-[300px] md:h-[450px] bg-slate-50 rounded-[8px] border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
                          {/* Fallback Image Based on Category */}
                          <div className="absolute inset-0 opacity-20">
                            <img 
                              src={
                                dbCategory === 'dau_keo' ? "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80" : 
                                dbCategory === 'xe_ben' ? "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80" : 
                                "https://images.unsplash.com/photo-1586864387967-b021eb4eabb7?q=80"
                              } 
                              alt="Fallback" 
                              className="w-full h-full object-cover grayscale mix-blend-multiply"
                            />
                          </div>
                          <Truck className="w-16 h-16 text-slate-300 mb-4 relative z-10" />
                          <span className="text-slate-400 text-xs font-black uppercase tracking-widest relative z-10">
                            Đang cập nhật hình ảnh chi tiết
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 lg:p-8">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-4 border-b border-slate-50 pb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-8 h-[2px] bg-accent"></span>
                            <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">
                              {selectedConfig.brand} Commercial
                            </span>
                          </div>
                          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight uppercase max-w-xl">
                            {selectedConfig.name}
                          </h1>
                        </div>
                        <div className="flex flex-col items-end justify-center bg-white shadow-sm px-8 py-4 border border-slate-100 rounded-[12px] group hover:shadow-xl hover:border-accent/20 transition-all duration-500 min-w-[180px]">
                          <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest mb-2 flex items-center gap-2">
                            <Zap className="w-3 h-3 text-amber-500" /> Công suất
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-slate-900 leading-none group-hover:text-accent transition-colors">
                              {selectedConfig.horsepower || "---"}
                            </span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              HP
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                        <div className="p-5 bg-slate-50/50 rounded-[12px] border border-slate-100 flex items-center gap-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:border-transparent group">
                          <div className="w-10 h-10 bg-white rounded-[8px] flex items-center justify-center text-slate-400 shadow-sm transition-all duration-300 group-hover:bg-accent group-hover:text-white">
                            <Cog className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[9px] uppercase font-black text-slate-400 tracking-widest mb-0.5">
                              Loại Cabin
                            </div>
                            <div className="text-sm font-bold text-slate-900 tracking-tight">
                              {selectedConfig.cabin || "Tiêu chuẩn"}
                            </div>
                          </div>
                        </div>
                        <div className="p-5 bg-slate-50/50 rounded-[12px] border border-slate-100 flex items-center gap-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:border-transparent group">
                          <div className="w-10 h-10 bg-white rounded-[8px] flex items-center justify-center text-slate-400 shadow-sm transition-all duration-300 group-hover:bg-accent group-hover:text-white">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[9px] uppercase font-black text-slate-400 tracking-widest mb-0.5">
                              Cấu hình cầu
                            </div>
                            <div className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                              {selectedConfig.axle_type || "Đang cập nhật"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <Button
                          variant="accent"
                          size="lg"
                          className="w-full h-14 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-accent/10 rounded-[12px]"
                          onClick={() => setIsQuoteModalOpen(true)}
                        >
                          Nhận Báo Giá Ngay
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-slate-100 shadow-sm rounded-[12px] overflow-hidden transition-all hover:shadow-lg duration-500">
                      <CardHeader className="bg-slate-50/80 border-b border-slate-100/50 py-4">
                        <CardTitle className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent rounded-[8px]"></div>
                          Động cơ & Truyền động
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <table className="w-full text-xs">
                          <tbody className="divide-y divide-slate-50">
                            <tr>
                              <th className="p-4 text-left font-bold text-slate-400 bg-slate-50/20 uppercase text-[8px] tracking-wider w-1/2">
                                Hãng động cơ
                              </th>
                              <td className="p-4 font-black text-slate-900 tracking-tight text-right">
                                {selectedConfig.engine_brand || "Đang cập nhật"}
                              </td>
                            </tr>
                            <tr>
                              <th className="p-4 text-left font-bold text-slate-400 bg-slate-50/20 uppercase text-[8px] tracking-wider w-1/2">
                                Model động cơ
                              </th>
                              <td className="p-4 font-black text-slate-900 tracking-tight text-right">
                                {selectedConfig.engine_model || "Đang cập nhật"}
                              </td>
                            </tr>
                            <tr>
                              <th className="p-4 text-left font-bold text-slate-400 bg-slate-50/20 uppercase text-[8px] tracking-wider w-1/2">
                                Tỉ số truyền
                              </th>
                              <td className="p-4 font-black text-slate-900 tracking-tight text-right">
                                {selectedConfig.gear_ratio || "Đang cập nhật"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-100 shadow-sm rounded-[12px] overflow-hidden transition-all hover:shadow-lg duration-500">
                      <CardHeader className="bg-slate-50/80 border-b border-slate-100/50 py-4">
                        <CardTitle className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent rounded-[8px]"></div>
                          Cấu hình bổ sung
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <table className="w-full text-xs">
                          <tbody className="divide-y divide-slate-50">
                            <tr>
                              <th className="p-4 text-left font-bold text-slate-400 bg-slate-50/20 uppercase text-[8px] tracking-wider w-1/2">
                                Công thức bánh xe
                              </th>
                              <td className="p-4 font-black text-slate-900 tracking-tight text-right">
                                {selectedConfig.drive_config || "Đang cập nhật"}
                              </td>
                            </tr>
                            <tr>
                              <th className="p-4 text-left font-bold text-slate-400 bg-slate-50/20 uppercase text-[8px] tracking-wider w-1/2">
                                Loại cầu
                              </th>
                              <td className="p-4 font-black text-slate-900 tracking-tight text-right">
                                {selectedConfig.axle_type || "Đang cập nhật"}
                              </td>
                            </tr>
                            <tr>
                              <th className="p-4 text-left font-bold text-slate-400 bg-slate-50/20 uppercase text-[8px] tracking-wider w-1/2">
                                Cấu hình khác
                              </th>
                              <td className="p-4 font-black text-slate-900 tracking-tight text-right text-[10px]">
                                {selectedConfig.other_config || "Không có"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ) : (
                !loading && (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[12px] border-2 border-dashed border-slate-200 text-slate-400">
                    <Truck className="w-12 h-12 mb-4 text-slate-300" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Vui lòng chọn một phiên bản để xem chi tiết
                    </span>
                  </div>
                )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* --- Quote Request Modal --- */}
      <AnimatePresence>
        {isQuoteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[12px] shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase">
                    Nhận Báo Giá
                  </h3>
                  <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">
                    {selectedConfig?.name}
                  </p>
                </div>
                <button
                  onClick={() => setIsQuoteModalOpen(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6">
                <QuoteRequestForm
                  productId={selectedConfig?.id.toString() || dbCategory}
                  productPrice={selectedConfig?.price}
                  onSuccess={() => setIsQuoteModalOpen(false)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
