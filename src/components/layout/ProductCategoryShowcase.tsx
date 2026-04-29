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
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("category")
        .select("*")
        .order("id", { ascending: true });

      if (data) {
        setCategories(data);
      }
      setLoading(false);
    }
    fetchCategories();
  }, []);

  // 4. Auto-play Progress Bar Logic (5 seconds)
  React.useEffect(() => {
    if (categories.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % categories.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [categories.length, activeIndex]);

  const selectedCategory = categories[activeIndex];

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
      <div className="w-full h-[800px] bg-slate-950 animate-pulse flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-800 border-t-accent rounded-full animate-spin"></div>
          <span className="text-slate-600 font-bold uppercase tracking-widest text-xs">
            Đang tải hệ sinh thái...
          </span>
        </div>
      </div>
    );
  }

  if (!selectedCategory) return null;

  const bgText = selectedCategory.type.replace("mooc_", "").replace("tec", "xi tec").toUpperCase();

  return (
    // 1. Phá vỡ "Cái Hộp" (Full-bleed Layout)
    <section className="w-full bg-slate-950 relative overflow-hidden min-h-[800px] flex items-center border-y border-slate-900">
      
      {/* 3. Hiệu ứng Chuyển Cảnh Cinematic cho Background Image */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {selectedCategory.image ? (
              <img
                src={selectedCategory.image}
                alt={selectedCategory.name}
                className="w-full h-full object-cover mix-blend-luminosity opacity-50"
              />
            ) : (
              <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                <Truck className="w-32 h-32 text-slate-800 opacity-20" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 2. Tách Nền & Chữ Khổng Lồ (Oversized Typography) */}
        {/* Nằm đè lên trên ảnh một chút, tạo chiều sâu 3 lớp */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${selectedCategory.id}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden mix-blend-overlay"
          >
            <span className="text-[25vw] font-black text-white opacity-10 whitespace-nowrap select-none leading-none -translate-y-10">
              {bgText}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Deep gradient từ trái sang để dễ đọc chữ */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 z-10" />
      </div>

      {/* Container nội dung bị giới hạn độ rộng để Sidebar dính sát viền trái */}
      <div className="w-full max-w-7xl mx-auto px-6 relative z-20 flex flex-col md:flex-row h-full py-20 gap-12">
        
        {/* Cột Sidebar */}
        <div className="w-full md:w-[320px] shrink-0 flex flex-col relative">
          <div className="mb-12">
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] flex flex-col">
              <span 
                className="text-transparent opacity-40 select-none"
                style={{ WebkitTextStroke: "1px white" }}
              >
                Sản Phẩm
              </span>
              <span className="text-white drop-shadow-[0_0_30px_rgba(0,74,173,0.8)] -mt-2">
                Chủ Lực
              </span>
            </h3>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            {categories.map((cat, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-[8px] transition-all duration-300 group text-left relative overflow-hidden",
                    isActive
                      ? "bg-white/10 text-white shadow-lg backdrop-blur-md"
                      : "bg-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "p-2.5 rounded-[6px] transition-all duration-300",
                      isActive
                        ? "bg-accent/30 text-white shadow-[0_0_15px_rgba(0,74,173,0.5)]"
                        : "bg-white/10 text-slate-300 group-hover:bg-white/20 group-hover:text-white"
                    )}
                  >
                    {getIcon(cat.type)}
                  </div>
                  
                  {/* Name */}
                  <span className={cn(
                    "font-bold text-sm tracking-tight transition-all duration-300 flex-1",
                    isActive ? "translate-x-1 text-white" : "text-slate-400 group-hover:text-slate-200 group-hover:translate-x-1"
                  )}>
                    {cat.name}
                  </span>

                  {/* 4. Thanh Tiến Trình (Progress Bar) */}
                  {isActive && (
                    <motion.div
                      key={`progress-${activeIndex}`}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="absolute bottom-0 left-0 h-[2px] bg-accent"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Nội Dung Chi Tiết Bên Phải */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full mb-6 backdrop-blur-md">
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
                    className="bg-accent hover:bg-blue-700 text-white rounded-[6px] px-8 h-14 font-black tracking-widest text-xs uppercase shadow-[0_0_30px_rgba(0,74,173,0.4)] transition-all duration-300"
                  >
                    Khám Phá Chi Tiết
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Thông số kỹ thuật - Staggered Slide up (Delay 0.1s cho mỗi cái) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-8">
                {[
                  { icon: ShieldCheck, label: "Tiêu Chuẩn", value: "ISO 9001:2015" },
                  { icon: Settings, label: "Vật Liệu", value: "Thép T700" },
                  { icon: Wrench, label: "Bảo Hành", value: "24 Tháng" },
                ].map((spec, i) => (
                  <motion.div 
                    key={`${selectedCategory.id}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm text-slate-300">
                      <spec.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        {spec.label}
                      </div>
                      <div className="text-sm font-black text-white">
                        {spec.value}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
