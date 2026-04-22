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

  const [allCategories, setAllCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function fetchData() {
      // 1. Tìm thông tin Category hiện tại
      const typeQuery = slug.replace(/-/g, '_');
      
      const { data: catData } = await supabase
        .from("category")
        .select("*")
        .eq("type", typeQuery)
        .single();

      if (catData) {
        setCategoryInfo(catData);
      }

      // 2. Tìm tất cả danh mục để làm 'Liên Quan'
      const { data: allCats } = await supabase
        .from("category")
        .select("*");
      if (allCats) {
        setAllCategories(allCats.filter(c => c.type !== typeQuery));
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

  if (!categoryInfo && !loading && trailers.length === 0) {
    return notFound();
  }

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
          
          {/* Left Side: Sidebar Selection & Advertisement Banner */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-800 px-2 tracking-tight">Cấu Hình Sẵn Có</h2>
            <div className="flex flex-col gap-3">
              {loading ? (
                <div className="p-4 border border-dashed border-slate-300 rounded-primary animate-pulse text-slate-400">Đang tải cấu hình...</div>
              ) : trailers.length > 0 ? (
                trailers.map((config) => (
                  <button
                    key={config.id}
                    onClick={() => setSelectedConfig(config)}
                    className={`text-left p-5 rounded-primary border-2 transition-all duration-300 ${
                      selectedConfig?.id === config.id
                        ? "border-accent bg-blue-50/50 shadow-lg scale-[1.02]"
                        : "border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`font-black text-sm uppercase tracking-wide ${selectedConfig?.id === config.id ? "text-accent" : "text-slate-700"}`}>
                      {config.name}
                    </div>
                    <div className="text-[11px] font-bold text-slate-400 mt-2 flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 rounded-full">TẢI TRỌNG</span>
                      <span className="text-slate-600">{(config.payload_capacity / 1000).toFixed(1)} TẤN</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-6 bg-slate-100 rounded-primary text-slate-500 text-sm border border-slate-200">
                  Chưa có dữ liệu cấu hình.
                </div>
              )}
            </div>

            {/* Sidebar Promo Banner (Phát triển theo yêu cầu: Hình ảnh nằm bên phải/sidebar) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mt-6 rounded-primary overflow-hidden shadow-2xl relative aspect-[3/4] group"
            >
              <img 
                src="https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?q=80&w=1000&auto=format&fit=crop" 
                alt="Hatico Promotion" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 flex flex-col gap-3">
                <div className="px-3 py-1 bg-accent inline-block self-start text-[10px] font-black uppercase tracking-widest text-white rounded-none">
                  Ưu Đãi Đặc Biệt
                </div>
                <h4 className="text-xl font-black text-white leading-tight uppercase">
                  Tối Ưu Hoá Lợi Nhuận <br />Vận Tải Cùng Hatico
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Hỗ trợ trả góp lên tới 80% với lãi suất ưu đãi nhất thị trường.
                </p>
                <Button size="sm" className="bg-white text-slate-950 hover:bg-slate-100 font-black rounded-none mt-2">
                  XEM CHI TIẾT
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
                        <div className="absolute top-4 right-4 bg-accent text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-none shadow-lg">
                           Chính Hãng Hatico
                        </div>
                     </div>
                     <div className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                           <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                             {selectedConfig.name}
                           </h1>
                           <div className="flex flex-col items-end justify-center bg-slate-50 px-6 py-3 border border-slate-100 rounded-sm">
                              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Tải Trọng Cho Phép</span>
                              <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black text-accent leading-none">{(selectedConfig.payload_capacity / 1000).toFixed(1)}</span>
                                <span className="text-sm font-black text-accent uppercase">Tấn</span>
                              </div>
                           </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                           <div className="p-4 bg-slate-50 rounded-sm border border-slate-100 flex items-center gap-4 group hover:bg-white hover:shadow-md transition-all">
                              <div className="w-10 h-10 bg-white rounded-none border border-slate-200 flex items-center justify-center text-accent shadow-sm font-black text-xs group-hover:bg-accent group-hover:text-white transition-colors">KT</div>
                              <div>
                                 <div className="text-[10px] uppercase font-bold text-slate-400">Kích thước (LxWxH)</div>
                                 <div className="text-sm font-bold text-slate-900">{selectedConfig.dimensions}</div>
                              </div>
                           </div>
                           <div className="p-4 bg-slate-50 rounded-sm border border-slate-100 flex items-center gap-4 group hover:bg-white hover:shadow-md transition-all">
                              <div className="w-10 h-10 bg-white rounded-none border border-slate-200 flex items-center justify-center text-accent shadow-sm font-black text-xs group-hover:bg-accent group-hover:text-white transition-colors">TR</div>
                              <div>
                                 <div className="text-[10px] uppercase font-bold text-slate-400">Cấu hình trục</div>
                                 <div className="text-sm font-bold text-slate-900">{selectedConfig.axle_specs}</div>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <Button size="lg" className="w-full h-16 text-sm font-black uppercase tracking-widest shadow-xl shadow-accent/20 rounded-none">
                              Nhận Báo Giá Ngay
                           </Button>
                           <Link href="/roi-calculator" className="w-full">
                              <Button variant="outline" size="lg" className="w-full h-16 bg-white border-slate-200 text-slate-800 hover:bg-slate-50 font-black uppercase text-sm tracking-widest rounded-none">
                                 Tính Hiệu Quả ROI
                              </Button>
                           </Link>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <Card className="border-slate-200 shadow-sm rounded-primary overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
                           <CardTitle className="text-xs font-black uppercase text-slate-500 tracking-[0.2em]">Thông Số Trọng Lượng</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                           <table className="w-full text-xs">
                              <tbody>
                                 <tr className="border-b border-slate-100"><th className="p-4 text-left font-bold text-slate-500 bg-slate-50/30 uppercase text-[10px]">Tổng trọng (GVWR)</th><td className="p-4 font-black text-slate-800 tracking-tight">{selectedConfig.gross_weight.toLocaleString()} KG</td></tr>
                                 <tr className="border-b border-slate-100"><th className="p-4 text-left font-bold text-slate-500 bg-slate-50/30 uppercase text-[10px]">Tự trọng (Curb)</th><td className="p-4 font-black text-slate-800 tracking-tight">{selectedConfig.curb_weight.toLocaleString()} KG</td></tr>
                                 <tr><th className="p-4 text-left font-bold text-slate-500 bg-slate-50/30 uppercase text-[10px]">Tải trọng CC</th><td className="p-4 font-black text-accent tracking-tight">{selectedConfig.payload_capacity.toLocaleString()} KG</td></tr>
                              </tbody>
                           </table>
                        </CardContent>
                     </Card>

                     <Card className="border-slate-200 shadow-sm rounded-primary overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
                           <CardTitle className="text-xs font-black uppercase text-slate-500 tracking-[0.2em]">Hệ Thống Phụ Tùng</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                           <table className="w-full text-xs">
                              <tbody>
                                 <tr className="border-b border-slate-100"><th className="p-4 text-left font-bold text-slate-500 bg-slate-50/30 uppercase text-[10px]">Thông số lốp</th><td className="p-4 font-black text-slate-800 tracking-tight">{selectedConfig.tire_specs}</td></tr>
                                 <tr className="border-b border-slate-100"><th className="p-4 text-left font-bold text-slate-500 bg-slate-50/30 uppercase text-[10px]">Chiều cao thành</th><td className="p-4 font-black text-slate-800 tracking-tight">{selectedConfig.side_height || "TIÊU CHUẨN"}</td></tr>
                                 <tr><th className="p-4 text-left font-bold text-slate-500 bg-slate-50/30 uppercase text-[10px]">Chiều dài cơ sở</th><td className="p-4 font-black text-slate-800 tracking-tight">{selectedConfig.wheelbase}</td></tr>
                              </tbody>
                           </table>
                        </CardContent>
                     </Card>
                  </div>
                </motion.div>
              ) : !loading && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-primary border-2 border-dashed border-slate-200 text-slate-400">
                  <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                  Vui lòng chọn một cấu hình để xem chi tiết
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* --- Related Products Section (Using real Category Data) --- */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Sản phẩm cùng hệ thống</h2>
            <p className="text-sm text-slate-500 mt-1">Các giải pháp vận tải cao cấp khác từ thương hiệu Hatico</p>
          </div>
          <Link href="/" className="text-xs font-black text-accent hover:text-blue-900 flex items-center gap-2 uppercase tracking-widest pb-1 border-b-2 border-accent transition-all">
            Xem tất cả danh mục <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allCategories.slice(0, 4).map((cat) => (
            <Link key={cat.id} href={`/products/${cat.type.replace('_', '-')}`} className="group">
              <Card className="border-slate-100 hover:border-accent hover:shadow-2xl transition-all duration-500 rounded-primary overflow-hidden h-full flex flex-col">
                <div className="aspect-[16/10] bg-slate-50 flex items-center justify-center relative overflow-hidden">
                  {cat.image ? (
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                       <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="px-5 py-2 bg-white text-slate-950 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl">Xem Chi Tiết</span>
                  </div>
                </div>
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight mb-2 group-hover:text-accent transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
                      Bản vẽ kỹ thuật & Thông số tiêu chuẩn
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
