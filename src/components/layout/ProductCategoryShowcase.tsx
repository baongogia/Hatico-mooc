"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  Truck,
  Container,
  Layout,
  Layers,
  Archive,
  Fuel,
  Dna,
  ArrowRight,
  ShieldCheck,
  Wrench,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: number;
  name: string;
  type: string;
  description: string;
  image: string | null;
}

export function ProductCategoryShowcase() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("category")
        .select("*")
        .order("id", { ascending: true });

      if (data) {
        setCategories(data);
        if (data.length > 0) {
          setSelectedType(data[0].type);
        }
      }
      setLoading(false);
    }
    fetchCategories();
  }, []);

  const selectedCategory = categories.find((c) => c.type === selectedType);

  const getIcon = (type: string) => {
    switch (type) {
      case "mooc_ben":
        return <Truck className="w-5 h-5" />;
      case "mooc_mui":
        return <Archive className="w-5 h-5" />;
      case "mooc_san":
        return <Layout className="w-5 h-5" />;
      case "mooc_xuong":
        return <Container className="w-5 h-5" />;
      case "mooc_lung":
        return <Layers className="w-5 h-5" />;
      case "tec":
        return <Fuel className="w-5 h-5" />;
      case "mooc_sieu_truong":
        return <Dna className="w-5 h-5" />;
      default:
        return <Truck className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 py-12">
        <div className="w-full h-[700px] bg-slate-100 animate-pulse rounded-[12px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-accent rounded-full animate-spin"></div>
            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              Đang tải hệ sinh thái...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="relative w-full min-h-[700px] rounded-[16px] overflow-hidden bg-slate-950 flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-800 group">
        
        {/* Dynamic Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            {selectedCategory && (
              <motion.div
                key={selectedCategory.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full"
              >
                {selectedCategory.image ? (
                  <img
                    src={selectedCategory.image}
                    alt={selectedCategory.name}
                    className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                    <Truck className="w-32 h-32 text-slate-800 opacity-20" />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium Overlays */}
          {/* Deep gradient from left for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />
          {/* Subtle bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
          {/* Industrial texture overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col md:flex-row w-full h-full p-6 md:p-10 gap-10">
          
          {/* 1. Glassmorphism Sidebar */}
          <div className="w-full md:w-[320px] shrink-0 flex flex-col relative h-full">
            {/* Glass Background */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-[12px] border border-white/10 hidden md:block shadow-2xl" />
            
            <div className="relative z-20 p-6 flex flex-col h-full">
              <div className="mb-8">
                <h2 className="text-[10px] font-black text-accent tracking-[0.3em] uppercase mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Hệ Sinh Thái
                </h2>
                <h3 className="text-3xl font-black text-white tracking-tight leading-none drop-shadow-lg">
                  Sản Phẩm<br />Chủ Lực
                </h3>
              </div>

              <div className="flex flex-col gap-2 flex-1 overflow-y-auto no-scrollbar pb-4 pr-2">
                {categories.map((cat) => {
                  const isActive = selectedType === cat.type;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedType(cat.type)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-[8px] transition-all duration-500 group text-left relative overflow-hidden",
                        isActive
                          ? "bg-white/10 border-white/20 shadow-lg text-white"
                          : "bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
                      )}
                      style={{ borderWidth: "1px" }}
                    >
                      {/* Active Indicator Glow */}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent shadow-[0_0_15px_rgba(0,74,173,1)]" />
                      )}
                      
                      <div
                        className={cn(
                          "p-2.5 rounded-[6px] transition-all duration-500",
                          isActive
                            ? "bg-accent/20 text-accent"
                            : "bg-white/5 group-hover:bg-white/10"
                        )}
                      >
                        {getIcon(cat.type)}
                      </div>
                      
                      <span className={cn(
                        "font-bold text-sm tracking-tight transition-all duration-300 flex-1",
                        isActive ? "translate-x-1" : "group-hover:translate-x-1"
                      )}>
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Dynamic Details Area */}
          <div className="flex-1 flex flex-col justify-center py-10 md:py-0 md:pl-8">
            <AnimatePresence mode="wait">
              {selectedCategory && (
                <motion.div
                  key={selectedCategory.id}
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="max-w-2xl"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full mb-6 backdrop-blur-md shadow-lg">
                    <span className="text-[9px] font-black text-slate-200 uppercase tracking-[0.2em]">
                      {selectedCategory.type.replace("_", " ")}
                    </span>
                  </div>

                  <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter drop-shadow-2xl">
                    {selectedCategory.name}
                  </h1>

                  <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-10 font-medium drop-shadow-lg max-w-xl">
                    {selectedCategory.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mb-14">
                    <Link href={`/products/${selectedCategory.type.replace("_", "-")}`}>
                      <Button
                        size="lg"
                        className="bg-accent hover:bg-blue-700 text-white rounded-[6px] px-8 h-14 font-black tracking-widest text-xs uppercase shadow-[0_0_30px_rgba(0,74,173,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,74,173,0.6)]"
                      >
                        Khám Phá Chi Tiết
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>

                  {/* Technical Specs Glass Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-8">
                    {[
                      { icon: ShieldCheck, label: "Tiêu Chuẩn", value: "ISO 9001:2015" },
                      { icon: Settings, label: "Vật Liệu", value: "Thép T700" },
                      { icon: Wrench, label: "Bảo Hành", value: "24 Tháng" },
                    ].map((spec, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm text-slate-400">
                          <spec.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                            {spec.label}
                          </div>
                          <div className="text-sm font-black text-white">
                            {spec.value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
