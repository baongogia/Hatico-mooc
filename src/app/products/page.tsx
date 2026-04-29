"use client";

import * as React from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Truck, ArrowRight, LayoutGrid, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useContactModal } from "@/context/ContactContext";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function ProductsPage() {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { openContactModal } = useContactModal();

  React.useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("category")
        .select("*")
        .order("id", { ascending: true });
      if (data) setCategories(data);
      setLoading(false);
    }
    fetchCategories();
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col">
      {/* 1. MODERN HERO SECTION */}
      <section className="relative pt-32 pb-20 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_rgba(0,74,173,0.2)_0%,_transparent_50%)]" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
        </div>
        
        <div className="container max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="text-slate-400 font-black uppercase tracking-[0.4em] text-[9px] mb-4 block opacity-80">Hatico Solutions</span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-none">
              DANH MỤC <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-slate-400">SẢN PHẨM</span>
            </h1>
            <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-xl">
              Khám phá hệ sinh thái rơ moóc và xe chuyên dụng đỉnh cao. 
              Mỗi sản phẩm là một cam kết về độ bền, tải trọng và hiệu quả kinh tế vượt trội.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. BREADCRUMBS */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-16 z-30">
        <div className="container max-w-7xl mx-auto px-6 py-4 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 gap-3">
          <Link href="/" className="hover:text-accent transition-colors">Trang Chủ</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900">Sản Phẩm</span>
        </div>
      </div>

      {/* 3. CATEGORIES GRID */}
      <section className="py-20 container max-w-7xl mx-auto px-6 flex-1">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 gap-6">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-accent rounded-full animate-spin"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Đang tải danh mục...</span>
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                variants={fadeInUp}
                className="group h-full"
              >
                <Link href={`/products/${cat.type.replace('_', '-')}`}>
                    <Card className="h-full bg-white border-transparent hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col rounded-[8px]">
                        <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-200 shrink-0">
                            {cat.images && cat.images.length > 0 ? (
                              <img
                                src={cat.images[0]}
                                alt={cat.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <Truck className="w-16 h-16 opacity-20" />
                              </div>
                            )}
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="absolute top-4 left-4">
                                <span className="bg-slate-900/80 backdrop-blur-md text-white text-[8px] font-black px-3 py-1 rounded-[8px] uppercase tracking-widest border border-white/10">
                                    Industrial Series
                                </span>
                            </div>
                        </div>

                        <CardContent className="p-8 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-accent transition-colors tracking-tighter uppercase">
                                    {cat.name}
                                </h3>
                                
                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-8">
                                    Giải pháp vận tải chuyên dụng tối ưu cho nhu cầu doanh nghiệp. 
                                    Được thiết kế bằng thép cường độ cao, đảm bảo tải trọng tối đa và vận hành bền bỉ.
                                </p>
                            </div>
                            
                            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase text-slate-900 tracking-[0.2em] group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center gap-2">
                                    Khám phá cấu hình <ArrowRight className="w-3 h-3 text-accent" />
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
              </motion.div>
            ))}

            {/* Special Category: Phụ tùng */}
            <motion.div
              variants={fadeInUp}
              className="group h-full"
            >
              <Link href="/products/phu-tung">
                  <Card className="h-full bg-slate-900 border-transparent hover:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col rounded-[8px] relative">
                      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
                      
                      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-800 shrink-0 flex items-center justify-center">
                          <LayoutGrid className="w-20 h-20 text-slate-700 group-hover:scale-110 transition-transform duration-1000" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                      </div>

                      <CardContent className="p-8 flex-1 flex flex-col justify-between relative z-10">
                          <div>
                              <h3 className="text-2xl font-black text-white mb-4 leading-tight group-hover:text-blue-400 transition-colors tracking-tighter uppercase">
                                  Phụ Tùng Chính Hãng
                              </h3>
                              
                              <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-8">
                                  Cung cấp đầy đủ linh kiện, phụ tùng thay thế chính hãng Hatico. 
                                  Đảm bảo xe luôn trong tình trạng vận hành tốt nhất và an toàn tuyệt đối.
                              </p>
                          </div>
                          
                          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase text-white tracking-[0.2em] group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center gap-2">
                                  Xem danh mục <ArrowRight className="w-3 h-3 text-blue-400" />
                              </span>
                          </div>
                      </CardContent>
                  </Card>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* 4. FOOTER CALL TO ACTION */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="container max-w-4xl mx-auto px-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-3xl md:text-4xl font-black text-slate-950 mb-6 uppercase tracking-tighter">Bạn cần cấu hình xe riêng biệt?</h2>
                <p className="text-slate-600 mb-10 max-w-xl mx-auto font-medium">Hatico nhận sản xuất và lắp ráp rơ moóc theo thông số kỹ thuật đặc thù của khách hàng.</p>
                <div className="flex justify-center">
                    <Button 
                      variant="accent" 
                      className="font-black uppercase tracking-widest text-xs px-10 h-14"
                      onClick={() => openContactModal('consult')}
                    >
                      Liên hệ kỹ sư tư vấn
                    </Button>
                </div>
            </motion.div>
        </div>
      </section>
    </div>
  );
}
