"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Article } from "@/types/article";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, User, ArrowRight, Search, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

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

const NewsCardImage = ({ src, title, className }: { src: string | null, title: string | null, className?: string }) => {
  const [error, setError] = React.useState(false);

  if (!src || error) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center text-slate-400 bg-slate-100", className)}>
        <LayoutGrid className="w-10 h-10 opacity-20" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title || ""}
      onError={() => setError(true)}
      className={cn("w-full h-full object-cover group-hover:scale-105 transition-transform duration-700", className)}
    />
  );
};

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("article")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (err) {
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Tất cả", ...new Set(articles.map(a => a.type).filter(Boolean) as string[])];
  
  const filteredArticles = activeCategory === "Tất cả" 
    ? articles 
    : articles.filter(a => a.type === activeCategory);

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
            <span className="text-slate-400 font-black uppercase tracking-[0.4em] text-[9px] mb-4 block opacity-80">Hatico Media Center</span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-none">
              TIN TỨC <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-slate-400">&</span> SỰ KIỆN
            </h1>
            <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-xl">
              Cập nhật những chuyển động mới nhất của ngành vận tải, công nghệ rơ moóc 
              và các cột mốc quan trọng của Hatico trên hành trình nâng tầm logistics Việt.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. FILTERS & TOOLS */}
      <section className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 py-4">
        <div className="container max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                            "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                            activeCategory === cat 
                                ? "bg-slate-900 text-white shadow-lg" 
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            
            <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm bài viết..." 
                        className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-full text-xs font-bold focus:bg-white focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                    />
                </div>
            </div>
        </div>
      </section>

      {/* 3. ARTICLES GRID */}
      <section className="py-20 container max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 gap-6">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-accent rounded-full animate-spin"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Đang tải bản tin...</span>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy bài viết</h3>
            <p className="text-slate-500">Thử chọn một danh mục khác hoặc tìm kiếm từ khóa khác.</p>
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {filteredArticles.map((article) => (
              <motion.div
                key={article.id}
                variants={fadeInUp}
                className="group h-full"
              >
                <Link href={`/tin-tuc/${article.id}`}>
                    <Card className="h-full bg-white border-transparent hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col rounded-sm">
                        <div className="relative w-full aspect-square overflow-hidden bg-slate-200 shrink-0">
                            <NewsCardImage src={article.image} title={article.title} />
                            
                            {/* Overlay info */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="absolute top-2.5 left-2.5 flex gap-2">
                                <span className="bg-slate-900/80 backdrop-blur-md text-white text-[7px] font-black px-2 py-1 rounded-sm uppercase tracking-widest border border-white/10">
                                    {article.type || "Tin tức"}
                                </span>
                            </div>
                        </div>

                        <CardContent className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                                        {article.created_at ? new Date(article.created_at).toLocaleDateString('vi-VN') : '28/04'}
                                    </div>
                                    <div className="w-0.5 h-0.5 bg-slate-200 rounded-full" />
                                    <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[100px]">
                                        {article.owner || "Hatico"}
                                    </div>
                                </div>
                                
                                <h3 className="font-black text-slate-900 mb-2 leading-tight group-hover:text-accent transition-colors tracking-tight text-sm line-clamp-2">
                                    {article.title}
                                </h3>
                                
                                <p className="text-slate-500 text-[10px] leading-normal line-clamp-2 mb-4">
                                    {article.description?.replace(/<[^>]*>/g, '') || "Đang cập nhật..."}
                                </p>
                            </div>
                            
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[8px] font-black uppercase text-slate-900 tracking-[0.2em] group-hover:translate-x-0.5 transition-transform duration-300 inline-flex items-center gap-1.5">
                                    Đọc ngay <ArrowRight className="w-2 h-2 text-accent" />
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* 4. NEWSLETTER CTA */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
        <div className="container max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase tracking-tighter">Đăng ký bản tin công nghiệp</h2>
                <p className="text-slate-300 mb-10 max-w-xl mx-auto font-medium">Đừng bỏ lỡ các thông tin quan trọng về kỹ thuật và biến động thị trường vận tải nặng.</p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input 
                        type="email" 
                        placeholder="Nhập địa chỉ email của bạn..." 
                        className="flex-1 bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-white focus:outline-none focus:border-accent transition-all"
                    />
                    <Button variant="accent" className="font-black uppercase tracking-widest text-[10px] px-8 h-14">Tham gia</Button>
                </div>
            </motion.div>
        </div>
      </section>
    </div>
  );
}
