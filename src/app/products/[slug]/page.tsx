"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";
import {
  X,
  Truck,
  Maximize,
  Layers,
  ShieldCheck,
  ChevronRight,
  Info,
  CreditCard,
  ZoomIn,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const [categoryInfo, setCategoryInfo] = React.useState<any>(null);
  const [trailers, setTrailers] = React.useState<any[]>([]);
  const [selectedConfig, setSelectedConfig] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = React.useState(false);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

  const [allCategories, setAllCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function fetchData() {
      // 1. Tìm thông tin Category hiện tại
      const typeQuery = slug.replace(/-/g, "_");

      const { data: catData } = await supabase
        .from("category")
        .select("*")
        .eq("type", typeQuery)
        .single();

      if (catData) {
        setCategoryInfo(catData);
      }

      // 2. Tìm tất cả danh mục để làm 'Liên Quan'
      const { data: allCats } = await supabase.from("category").select("*");
      if (allCats) {
        setAllCategories(allCats.filter((c) => c.type !== typeQuery));
      }

      // 3. Tìm danh sách cấu hình (trailers)
      const { data: trailerData } = await supabase
        .from("trailers")
        .select("*")
        .eq("category", typeQuery);

      if (trailerData && trailerData.length > 0) {
        setTrailers(trailerData);
        setSelectedConfig(trailerData[0]);
      }
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  // Reset image index when config changes
  React.useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedConfig]);

  // Handle keyboard navigation for lightbox
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, selectedConfig]);

  if (!categoryInfo && !loading && trailers.length === 0) {
    return notFound();
  }

  const nextImage = () => {
    if (!selectedConfig?.images) return;
    setActiveImageIndex((prev) => (prev + 1) % selectedConfig.images.length);
  };

  const prevImage = () => {
    if (!selectedConfig?.images) return;
    setActiveImageIndex(
      (prev) =>
        (prev - 1 + selectedConfig.images.length) %
        selectedConfig.images.length,
    );
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center text-[11px] font-bold uppercase tracking-widest text-slate-400 gap-3">
          <Link href="/" className="hover:text-accent transition-colors">
            Trang Chủ
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-accent cursor-default">Sản Phẩm</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 font-black">
            {categoryInfo?.name || slug}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side: Sidebar Selection & Advertisement Banner */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between mb-2 px-2">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                  Cấu Hình
                </h2>
                <div className="h-[1px] flex-1 bg-slate-100 ml-4"></div>
              </div>
              {loading ? (
                <div className="p-4 border border-dashed border-slate-200 rounded-[8px] animate-pulse text-slate-400 text-center text-xs">
                  Đang tải...
                </div>
              ) : trailers.length > 0 ? (
                trailers.map((config) => (
                  <button
                    key={config.id}
                    onClick={() => setSelectedConfig(config)}
                    className={`group relative text-left p-4 rounded-[8px] transition-all duration-300 flex items-center gap-4 ${
                      selectedConfig?.id === config.id
                        ? "bg-white shadow-xl shadow-slate-200/50 translate-x-1"
                        : "hover:bg-slate-100/50"
                    }`}
                  >
                    {selectedConfig?.id === config.id && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute left-0 top-3 bottom-3 w-1 bg-accent rounded-[8px]"
                      />
                    )}
                    <div className="flex-1">
                      <div
                        className={`text-[13px] font-black uppercase tracking-tight transition-colors ${selectedConfig?.id === config.id ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"}`}
                      >
                        {config.name}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1.5 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-[8px] bg-slate-200"></span>
                        Tải trọng:{" "}
                        <span
                          className={
                            selectedConfig?.id === config.id
                              ? "text-accent"
                              : "text-slate-500"
                          }
                        >
                          {(config.payload_capacity / 1000).toFixed(1)} Tấn
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-all ${selectedConfig?.id === config.id ? "text-accent opacity-100 translate-x-0" : "text-slate-300 opacity-0 -translate-x-2"}`}
                    />
                  </button>
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
              className="mt-6 rounded-[8px] overflow-hidden relative aspect-[3/4] group shadow-xl shadow-slate-200"
            >
              <img
                src="/images/IMG_9052.JPG"
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
                  <div className="bg-white rounded-[8px] shadow-sm border border-slate-100 overflow-hidden mb-6">
                    <div className="w-full bg-white p-2 relative overflow-hidden group/gallery">
                      {selectedConfig.images &&
                      selectedConfig.images.length > 0 ? (
                        <div className="flex flex-col md:flex-row gap-2 h-auto md:h-[450px]">
                          {/* Main Display Image */}
                          <div
                            className={cn(
                              "relative overflow-hidden group cursor-zoom-in rounded-[8px] bg-slate-50 border border-slate-100 shadow-sm flex-1",
                            )}
                            onClick={() => setIsLightboxOpen(true)}
                          >
                            <AnimatePresence mode="wait">
                              <motion.img
                                key={activeImageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                src={selectedConfig.images[activeImageIndex]}
                                alt={selectedConfig.name}
                                className="w-full h-full object-cover"
                              />
                            </AnimatePresence>

                            {/* Overlay Controls */}
                            <div className="absolute inset-0 bg-black/0 group-hover/gallery:bg-black/10 transition-colors pointer-events-none" />

                            {selectedConfig.images.length > 1 && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage();
                                  }}
                                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-slate-900/40 backdrop-blur-md rounded-full text-white opacity-0 group-hover/gallery:opacity-100 hover:bg-slate-900/60 transition-all z-20 border border-white/10"
                                >
                                  <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage();
                                  }}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-slate-900/40 backdrop-blur-md rounded-full text-white opacity-0 group-hover/gallery:opacity-100 hover:bg-slate-900/60 transition-all z-20 border border-white/10"
                                >
                                  <ChevronRight className="w-6 h-6" />
                                </button>
                              </>
                            )}

                            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ZoomIn className="w-3.5 h-3.5 text-white" />
                              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                Xem ảnh lớn
                              </span>
                            </div>
                          </div>

                          {/* Thumbnail Column */}
                          {selectedConfig.images.length > 1 && (
                            <div className="flex flex-row md:flex-col gap-2 w-full md:w-32 h-24 md:h-full">
                              {selectedConfig.images
                                .slice(0, 4)
                                .map((img: string, idx: number) => (
                                  <button
                                    key={idx}
                                    onClick={() => setActiveImageIndex(idx)}
                                    className={cn(
                                      "relative flex-1 overflow-hidden rounded-[8px] transition-all duration-300 border-2",
                                      activeImageIndex === idx
                                        ? "border-accent ring-2 ring-accent/10"
                                        : "border-transparent opacity-60 hover:opacity-100",
                                    )}
                                  >
                                    <img
                                      src={img}
                                      alt={`${selectedConfig.name} ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                    {idx === 3 &&
                                      selectedConfig.images.length > 4 && (
                                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center">
                                          <span className="text-white font-black text-sm">
                                            +{selectedConfig.images.length - 4}
                                          </span>
                                        </div>
                                      )}
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="aspect-video flex flex-col items-center justify-center">
                          <Truck className="w-12 h-12 text-slate-200 mb-2" />
                          <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            Đang cập nhật hình ảnh
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 lg:p-8">
                      <div className="flex flex-col md:flex-row justify-between items-center mb-3 gap-4 border-b border-slate-50 pb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-8 h-[2px] bg-accent"></span>
                            <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">
                              Hatico romooc
                            </span>
                          </div>
                          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight uppercase max-w-xl">
                            {selectedConfig.name}
                          </h1>
                        </div>
                        <div className="flex flex-col items-end justify-center bg-white shadow-sm px-8 py-4 border border-slate-100 rounded-[8px] group hover:shadow-xl hover:border-accent/20 transition-all duration-500 min-w-[200px]">
                          <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2 flex items-center gap-2">
                            <Info className="w-3.5 h-3.5 text-accent/50" /> Tải
                            Trọng Cho Phép
                          </span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-slate-900 leading-none group-hover:text-accent transition-colors">
                              {(selectedConfig.payload_capacity / 1000).toFixed(
                                1,
                              )}
                            </span>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                              Tấn
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="p-5 bg-slate-50/50 rounded-[8px] border border-slate-100 flex items-center gap-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:border-transparent group">
                          <div className="w-10 h-10 bg-white rounded-[8px] flex items-center justify-center text-slate-400 shadow-sm transition-all duration-300 group-hover:bg-accent group-hover:text-white">
                            <Maximize className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[9px] uppercase font-black text-slate-400 tracking-widest mb-0.5">
                              Kích thước (LxWxH)
                            </div>
                            <div className="text-sm font-bold text-slate-900 tracking-tight">
                              {selectedConfig.dimensions}
                            </div>
                          </div>
                        </div>
                        <div className="p-5 bg-slate-50/50 rounded-[8px] border border-slate-100 flex items-center gap-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:border-transparent group">
                          <div className="w-10 h-10 bg-white rounded-[8px] flex items-center justify-center text-slate-400 shadow-sm transition-all duration-300 group-hover:bg-accent group-hover:text-white">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[9px] uppercase font-black text-slate-400 tracking-widest mb-0.5">
                              Cấu hình trục
                            </div>
                            <div className="text-sm font-bold text-slate-900 tracking-tight">
                              {selectedConfig.axle_specs}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button
                          variant="accent"
                          size="lg"
                          className="w-full h-14 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-accent/10 rounded-[8px]"
                          onClick={() => setIsQuoteModalOpen(true)}
                        >
                          Nhận Báo Giá Ngay
                        </Button>
                        <Link href="/roi-calculator" className="w-full">
                          <Button
                            variant="outline"
                            size="lg"
                            className="w-full h-14 bg-white border-slate-100 text-slate-900 hover:bg-slate-50 font-black uppercase text-[10px] tracking-[0.2em] rounded-[8px]"
                          >
                            Tính Hiệu Quả ROI
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-slate-100 shadow-sm rounded-[8px] overflow-hidden transition-all hover:shadow-lg duration-500">
                      <CardHeader className="bg-slate-50/80 border-b border-slate-100/50 py-4">
                        <CardTitle className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent rounded-[8px]"></div>
                          Thông Số Trọng Lượng
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <table className="w-full text-xs">
                          <tbody className="divide-y divide-slate-50">
                            <tr>
                              <th className="p-4 text-left font-bold text-slate-400 bg-slate-50/20 uppercase text-[8px] tracking-wider w-1/2">
                                Tổng trọng (GVWR)
                              </th>
                              <td className="p-4 font-black text-slate-900 tracking-tight text-right">
                                {selectedConfig.gross_weight.toLocaleString()}{" "}
                                KG
                              </td>
                            </tr>
                            <tr>
                              <th className="p-4 text-left font-bold text-slate-400 bg-slate-50/20 uppercase text-[8px] tracking-wider w-1/2">
                                Tự trọng (Curb)
                              </th>
                              <td className="p-4 font-black text-slate-900 tracking-tight text-right">
                                {selectedConfig.curb_weight.toLocaleString()} KG
                              </td>
                            </tr>
                            <tr className="bg-accent/[0.02]">
                              <th className="p-4 text-left font-bold text-accent uppercase text-[8px] tracking-wider w-1/2">
                                Tải trọng CC
                              </th>
                              <td className="p-4 font-black text-accent tracking-tight text-right text-sm">
                                {selectedConfig.payload_capacity.toLocaleString()}{" "}
                                KG
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-100 shadow-sm rounded-[8px] overflow-hidden transition-all hover:shadow-lg duration-500">
                      <CardHeader className="bg-slate-50/80 border-b border-slate-100/50 py-4">
                        <CardTitle className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-accent rounded-[8px]"></div>
                          Hệ Thống Phụ Tùng
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <table className="w-full text-xs">
                          <tbody className="divide-y divide-slate-50">
                            <tr>
                              <th className="p-4 text-left font-bold text-slate-400 bg-slate-50/20 uppercase text-[8px] tracking-wider w-1/2">
                                Thông số lốp
                              </th>
                              <td className="p-4 font-black text-slate-900 tracking-tight text-right">
                                {selectedConfig.tire_specs}
                              </td>
                            </tr>
                            <tr>
                              <th className="p-4 text-left font-bold text-slate-400 bg-slate-50/20 uppercase text-[8px] tracking-wider w-1/2">
                                Chiều cao thành
                              </th>
                              <td className="p-4 font-black text-slate-900 tracking-tight text-right">
                                {selectedConfig.side_height || "TIÊU CHUẨN"}
                              </td>
                            </tr>
                            <tr>
                              <th className="p-4 text-left font-bold text-slate-400 bg-slate-50/20 uppercase text-[8px] tracking-wider w-1/2">
                                Chiều dài cơ sở
                              </th>
                              <td className="p-4 font-black text-slate-900 tracking-tight text-right">
                                {selectedConfig.wheelbase}
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
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[8px] border-2 border-dashed border-slate-200 text-slate-400">
                    <svg
                      className="w-12 h-12 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                    </svg>
                    Vui lòng chọn một cấu hình để xem chi tiết
                  </div>
                )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* --- Lightbox / Fullscreen Preview Modal --- */}
      <AnimatePresence>
        {isLightboxOpen && selectedConfig?.images && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - Top Right */}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-6 right-6 p-4 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all z-[130] group"
              >
                <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Modern Edge Navigation Paddles */}
              {selectedConfig.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-0 top-0 bottom-0 w-24 md:w-40 flex items-center justify-center group z-[120]"
                    aria-label="Previous image"
                  >
                    <div className="p-6 rounded-full bg-transparent group-hover:bg-white/5 text-white/20 group-hover:text-white group-hover:scale-110 transition-all duration-500">
                      <ChevronLeft className="w-16 h-16 stroke-[1px]" />
                    </div>
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-0 top-0 bottom-0 w-24 md:w-40 flex items-center justify-center group z-[120]"
                    aria-label="Next image"
                  >
                    <div className="p-6 rounded-full bg-transparent group-hover:bg-white/5 text-white/20 group-hover:text-white group-hover:scale-110 transition-all duration-500">
                      <ChevronRight className="w-16 h-16 stroke-[1px]" />
                    </div>
                  </button>
                </>
              )}

              {/* Large Image Display */}
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden py-12">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    src={selectedConfig.images[activeImageIndex]}
                    alt="Fullscreen Preview"
                    className="max-w-full max-h-full object-contain shadow-[0_0_80px_rgba(0,0,0,0.6)] rounded-[8px]"
                  />
                </AnimatePresence>
              </div>

              {/* Minimal Thumbnail Strip */}
              {selectedConfig.images.length > 1 && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 p-3 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 max-w-[95vw] overflow-x-auto scrollbar-hide z-[130]">
                  {selectedConfig.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={cn(
                        "w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 duration-500",
                        activeImageIndex === idx
                          ? "border-accent scale-110 shadow-[0_0_20px_rgba(0,74,173,0.4)]"
                          : "border-transparent opacity-30 hover:opacity-100 hover:scale-105",
                      )}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Related Products Section (Using real Category Data) --- */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-[2px] bg-accent"></span>
              <span className="text-[9px] font-black text-accent uppercase tracking-[0.3em]">
                Our Ecosystem
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
              Giải Pháp Vận Tải Khác
            </h2>
          </div>
          <Link
            href="/"
            className="group flex items-center gap-3 text-[9px] font-black text-slate-400 hover:text-accent transition-colors uppercase tracking-[0.2em] pb-1.5 border-b border-slate-100 hover:border-accent"
          >
            Tất cả danh mục{" "}
            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {allCategories.slice(0, 4).map((cat) => (
            <Link
              key={cat.id}
              href={`/products/${cat.type.replace("_", "-")}`}
              className="group"
            >
              <div className="bg-white rounded-[8px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 border border-slate-50 h-full flex flex-col">
                <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <Truck className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-all duration-500 flex items-center justify-center">
                    <div className="px-5 py-2.5 bg-white text-slate-900 font-black text-[8px] uppercase tracking-[0.3em] shadow-2xl scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 rounded-[8px]">
                      Khám Phá
                    </div>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[8px] font-black text-accent uppercase tracking-widest mb-1">
                      Industrial Series
                    </div>
                    <h3 className="font-black text-slate-900 uppercase text-[12px] tracking-tight group-hover:text-accent transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

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
              className="relative w-full max-w-lg bg-white rounded-[8px] shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase">
                    Nhận Báo Giá
                  </h3>
                  <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">
                    {selectedConfig?.name || categoryInfo?.name}
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
                  productId={selectedConfig?.id || slug}
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
