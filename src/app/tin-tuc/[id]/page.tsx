"use client";

import React, { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Article } from "@/types/article";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Calendar, User, Share2, ArrowLeft, Clock, Bookmark, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const FallbackImage = ({ src, title, className }: { src: string | null, title: string | null, className?: string }) => {
  const [error, setError] = React.useState(false);

  if (!src || error) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center text-slate-400 bg-slate-100", className)}>
        <LayoutGrid className="w-12 h-12 opacity-20" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title || ""}
      onError={() => setError(true)}
      className={cn("w-full h-full object-cover", className)}
    />
  );
};

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("article")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setArticle(data);

        // Fetch related articles (limit 3)
        const { data: related } = await supabase
          .from("article")
          .select("*")
          .neq("id", id)
          .limit(3);
        setRelatedArticles(related || []);

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-slate-950">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-accent/10 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="w-full min-h-screen pt-32 pb-12 flex flex-col justify-center items-center bg-slate-950 text-white">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
          <Bookmark className="w-10 h-10 text-slate-500" />
        </div>
        <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">Bài viết không tồn tại</h2>
        <p className="text-slate-400 mb-8">Có vẻ như bài viết này đã bị gỡ bỏ hoặc đường dẫn không chính xác.</p>
        <Link href="/tin-tuc">
          <Button variant="accent" size="lg" className="rounded-sm font-black uppercase tracking-widest text-xs h-12 px-8">
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white font-sans selection:bg-accent/30 selection:text-slate-900 pb-32">
      {/* 1. HERO HEADER SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-950 border-b border-white/5">
        <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_rgba(0,74,173,0.3)_0%,_transparent_50%)]" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        </div>

        <div className="container max-w-5xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/tin-tuc" className="group inline-flex items-center text-xs font-black uppercase tracking-[0.2em] text-slate-300 hover:text-white mb-10 transition-all">
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center mr-3 group-hover:bg-accent group-hover:border-accent transition-all">
                <ArrowLeft className="w-3.5 h-3.5" />
              </div>
              Quay lại tin tức
            </Link>
          </motion.div>

          <div className="max-w-4xl">
            {article.type && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <span className="bg-white/5 border border-white/10 text-slate-200 text-[10px] font-black px-4 py-1.5 rounded-sm uppercase tracking-widest backdrop-blur-sm">
                        {article.type}
                    </span>
                </motion.div>
            )}

            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-8 tracking-tighter"
            >
              {article.title}
            </motion.h1>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="flex flex-wrap items-center gap-8 py-8 border-t border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-black text-sm">
                  {(article.owner || "H").charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest opacity-80">Tác giả</span>
                    <span className="text-sm font-bold text-white">{article.owner || "Hatico Team"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest opacity-70">Ngày đăng</span>
                    <span className="text-sm font-bold text-slate-200">
                        {article.created_at ? new Date(article.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }) : '28/04/2026'}
                    </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest opacity-70">Thời gian đọc</span>
                    <span className="text-sm font-bold text-slate-200">5 Phút</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      {/* 2. MAIN CONTENT AREA */}
      <div className="container max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="flex flex-col lg:flex-row gap-16">
            
            <div className="w-full lg:w-[65%]">
                {article.image && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="w-full aspect-video rounded-sm overflow-hidden mb-10 shadow-2xl border border-slate-200 bg-slate-100"
                >
                    <FallbackImage
                        src={article.image}
                        title={article.title}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
                )}

                <motion.article
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="prose prose-lg md:prose-xl prose-slate max-w-none break-words
                        prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-950
                        prose-p:text-slate-600 prose-p:leading-snug prose-p:text-lg prose-p:mb-4
                        prose-strong:text-slate-950 prose-strong:font-black
                        prose-blockquote:border-l-accent prose-blockquote:bg-slate-50 prose-blockquote:p-8 prose-blockquote:not-italic prose-blockquote:text-slate-700
                        prose-img:rounded-sm prose-img:shadow-2xl
                        prose-a:text-accent prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                        prose-li:text-slate-600 prose-li:mb-2"
                >
                    <div 
                        className="rich-content"
                        dangerouslySetInnerHTML={{ 
                            __html: article.content || (article.description ? `<p>${article.description.replace(/\n/g, '<br/>')}</p>` : '<p className="text-slate-400 italic">Nội dung đang được cập nhật...</p>') 
                        }} 
                    />
                </motion.article>

                <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Chia sẻ bài viết</span>
                        <div className="flex gap-2">
                            {[1, 2, 3].map((i) => (
                                <button key={i} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-950 hover:text-white transition-all text-slate-400">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Column */}
            <div className="w-full lg:w-[35%] lg:pt-24">
                <div className="sticky top-32 space-y-12">
                    <div>
                        <h3 className="text-[10px] font-black uppercase text-slate-950 tracking-[0.3em] mb-8 flex items-center gap-3">
                            <div className="w-4 h-[1px] bg-accent" /> Tin tức liên quan
                        </h3>

                        <div className="space-y-6">
                            {relatedArticles.map((rel) => (
                                <Link key={rel.id} href={`/tin-tuc/${rel.id}`} className="group block">
                                    <div className="flex gap-5 items-start">
                                        <div className="w-20 h-20 shrink-0 rounded-none overflow-hidden bg-slate-100 border border-slate-200">
                                            <FallbackImage src={rel.image} title={rel.title} className="group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">{rel.type || "Tin tức"}</span>
                                            <h4 className="text-sm font-black text-slate-900 line-clamp-2 leading-tight group-hover:text-accent transition-colors">
                                                {rel.title}
                                            </h4>
                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                                {rel.created_at ? new Date(rel.created_at).toLocaleDateString('vi-VN') : '28/04'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 bg-slate-950 relative overflow-hidden group shadow-2xl rounded-sm">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black text-white mb-4 leading-none uppercase tracking-tighter">Bản tin công nghiệp</h3>
                            <p className="text-[10px] text-slate-300 mb-8 font-bold uppercase tracking-widest">Đăng ký nhận tin từ Hatico</p>
                            <input 
                                type="email" 
                                placeholder="Email của bạn..." 
                                className="w-full bg-white/5 border border-white/10 rounded-none p-4 text-xs text-white mb-4 focus:outline-none focus:border-accent transition-colors font-bold"
                            />
                            <Button variant="accent" className="w-full font-black uppercase text-[10px] tracking-[0.2em] h-14 rounded-none">
                                Đăng ký ngay
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
      
      <style jsx global>{`
        .rich-content h1, .rich-content h2, .rich-content h3 { margin-top: 2rem; margin-bottom: 1rem; line-height: 1.2; }
        .rich-content p { margin-bottom: 1rem; line-height: 1.6; }
        .rich-content img { margin: 1.5rem 0; width: 100%; height: auto; }
        .rich-content ul, .rich-content ol { margin-bottom: 1rem; padding-left: 1.5rem; }
        .rich-content li { margin-bottom: 0.35rem; line-height: 1.6; }
      `}</style>
    </div>
  );
}
