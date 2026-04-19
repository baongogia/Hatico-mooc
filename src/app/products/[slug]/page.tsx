"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [categoryInfo, setCategoryInfo] = React.useState<any>(null);
  const [trailers, setTrailers] = React.useState<any[]>([]);
  const [selectedConfig, setSelectedConfig] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      // 1. Tìm thông tin Category
      // Ánh xạ slug sang type (ví dụ: romooc-ben -> mooc_ben)
      const typeQuery = slug.replace(/-/g, '_');
      
      const { data: catData } = await supabase
        .from("category")
        .select("*")
        .eq("type", typeQuery)
        .single();

      if (catData) {
        setCategoryInfo(catData);
      }

      // 2. Tìm danh sách cấu hình (trailers)
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

  if (!categoryInfo && !loading && trailers.length === 0) {
    return notFound();
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center text-sm font-medium text-slate-500 gap-2">
          <Link href="/" className="hover:text-blue-900 transition-colors">Trang Chủ</Link>
          <span>/</span>
          <span className="text-slate-400">Sản Phẩm</span>
          <span>/</span>
          <span className="text-blue-900 font-bold">{categoryInfo?.name || slug}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Side: Sidebar Selection & Image */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-800 px-2">Chọn Phiên Bản / Cấu Hình</h2>
            <div className="flex flex-col gap-3">
              {loading ? (
                <div className="p-4 border border-dashed border-slate-300 rounded-primary animate-pulse text-slate-400">Đang tải cấu hình...</div>
              ) : trailers.length > 0 ? (
                trailers.map((config) => (
                  <button
                    key={config.id}
                    onClick={() => setSelectedConfig(config)}
                    className={`text-left p-4 rounded-primary border-2 transition-all duration-200 ${
                      selectedConfig?.id === config.id
                        ? "border-blue-600 bg-blue-50/50 shadow-md"
                        : "border-slate-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <div className={`font-bold text-sm ${selectedConfig?.id === config.id ? "text-blue-900" : "text-slate-700"}`}>
                      {config.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-1">Tải trọng: {(config.payload_capacity / 1000).toFixed(1)} Tấn</div>
                  </button>
                ))
              ) : (
                <div className="p-6 bg-slate-100 rounded-primary text-slate-500 text-sm border border-slate-200">
                  Chưa có dữ liệu cấu hình cho loại này trên Supabase.
                </div>
              )}
            </div>

            {/* Support Box */}
            <div className="mt-6 p-6 bg-blue-900 rounded-primary text-white shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-800 rounded-full blur-2xl opacity-50 translate-x-1/2 -translate-y-1/2" />
               <h4 className="font-bold mb-2 relative z-10">Cần tư vấn riêng?</h4>
               <p className="text-blue-200 text-sm mb-4 relative z-10">Kỹ sư Hatico sẽ hỗ trợ bạn cấu hình moóc tối ưu nhất cho hàng hóa của bạn.</p>
               <Button variant="accent" className="w-full border-none shadow-blue-900/40">Gửi Yêu Cầu Tư Vấn</Button>
            </div>
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
                  <div className="bg-white rounded-primary border border-slate-200 shadow-sm overflow-hidden mb-8">
                     <div className="aspect-video bg-slate-100 flex items-center justify-center border-b border-slate-200 relative overflow-hidden">
                        {selectedConfig.image ? (
                           <img src={selectedConfig.image} alt={selectedConfig.name} className="w-full h-full object-cover" />
                        ) : (
                           <div className="flex flex-col items-center">
                              <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                              <span className="text-slate-400 text-sm mt-2">Hình ảnh đang cập nhật</span>
                           </div>
                        )}
                        <div className="absolute top-4 right-4 bg-blue-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                           Chính Hãng Hatico
                        </div>
                     </div>
                     <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                           <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                             {selectedConfig.name}
                           </h1>
                           <div className="flex flex-col items-end">
                              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tải Trọng</span>
                              <span className="text-2xl font-black text-blue-900 leading-none">{(selectedConfig.payload_capacity / 1000).toFixed(1)} Tấn</span>
                           </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                           <div className="p-4 bg-slate-50 rounded-sm border border-slate-100 flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-sm border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm font-bold text-xs">KT</div>
                              <div>
                                 <div className="text-[10px] uppercase font-bold text-slate-400">Kích thước</div>
                                 <div className="text-sm font-bold text-slate-800">{selectedConfig.dimensions}</div>
                              </div>
                           </div>
                           <div className="p-4 bg-slate-50 rounded-sm border border-slate-100 flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-sm border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm font-bold text-xs">TR</div>
                              <div>
                                 <div className="text-[10px] uppercase font-bold text-slate-400">Hệ thống trục</div>
                                 <div className="text-sm font-bold text-slate-800">{selectedConfig.axle_specs}</div>
                              </div>
                           </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-100">
                           <Button variant="accent" size="lg" className="flex-1 py-7 text-base font-bold shadow-xl shadow-blue-900/20">
                              Nhận Báo Giá Cấu Hình Này
                           </Button>
                           <Link href="/roi-calculator" className="flex-1">
                              <Button variant="outline" size="lg" className="w-full h-full bg-white border-slate-300 text-slate-700 hover:bg-slate-50 py-7">
                                 Tính Hiệu Quả Đầu Tư
                              </Button>
                           </Link>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50 border-b border-slate-200">
                           <CardTitle className="text-sm font-black uppercase text-slate-500 tracking-widest">Thông Số Trọng Lượng</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                           <table className="w-full text-xs">
                              <tbody>
                                 <tr className="border-b border-slate-100"><th className="p-4 text-left font-semibold text-slate-500 bg-slate-50/50">Tổng trọng lượng (GVWR)</th><td className="p-4 font-bold text-slate-800">{selectedConfig.gross_weight.toLocaleString()} kg</td></tr>
                                 <tr className="border-b border-slate-100"><th className="p-4 text-left font-semibold text-slate-500 bg-slate-50/50">Tự trọng (Curb)</th><td className="p-4 font-bold text-slate-800">{selectedConfig.curb_weight.toLocaleString()} kg</td></tr>
                                 <tr><th className="p-4 text-left font-semibold text-slate-500 bg-slate-50/50">Tải trọng cho phép</th><td className="p-4 font-bold text-blue-700">{selectedConfig.payload_capacity.toLocaleString()} kg</td></tr>
                              </tbody>
                           </table>
                        </CardContent>
                     </Card>

                     <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50 border-b border-slate-200">
                           <CardTitle className="text-sm font-black uppercase text-slate-500 tracking-widest">Hệ Thống Phụ Tùng</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                           <table className="w-full text-xs">
                              <tbody>
                                 <tr className="border-b border-slate-100"><th className="p-4 text-left font-semibold text-slate-500 bg-slate-50/50">Kích thước lốp</th><td className="p-4 font-bold text-slate-800">{selectedConfig.tire_specs}</td></tr>
                                 <tr className="border-b border-slate-100"><th className="p-4 text-left font-semibold text-slate-500 bg-slate-50/50">Chiều cao thành (nếu có)</th><td className="p-4 font-bold text-slate-800">{selectedConfig.side_height || "Không có"}</td></tr>
                                 <tr><th className="p-4 text-left font-semibold text-slate-500 bg-slate-50/50">Chiều dài cơ sở</th><td className="p-4 font-bold text-slate-800">{selectedConfig.wheelbase}</td></tr>
                              </tbody>
                           </table>
                        </CardContent>
                     </Card>
                  </div>
                </motion.div>
              ) : !loading && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-primary border-2 border-dashed border-slate-200 text-slate-400">
                  <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                  Vui lòng chọn một cấu hình để xem chi tiết
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
