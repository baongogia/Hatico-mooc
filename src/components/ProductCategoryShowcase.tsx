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
  ChevronRight
} from "lucide-react";

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
      case "mooc_ben": return <Truck className="w-5 h-5" />;
      case "mooc_mui": return <Archive className="w-5 h-5" />;
      case "mooc_san": return <Layout className="w-5 h-5" />;
      case "mooc_xuong": return <Container className="w-5 h-5" />;
      case "mooc_lung": return <Layers className="w-5 h-5" />;
      case "tec": return <Fuel className="w-5 h-5" />;
      case "mooc_sieu_truong": return <Dna className="w-5 h-5" />;
      default: return <Truck className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[600px] bg-slate-100 animate-pulse rounded-3xl flex items-center justify-center">
        <span className="text-slate-400 font-medium">Đang tải danh mục sản phẩm...</span>
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8 min-h-[600px]">
        {/* Left Sidebar - Category Tabs */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-2">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Dòng Sản Phẩm</h2>
            <p className="text-sm text-slate-500 mt-1">Khám phá các giải pháp vận tải tối ưu</p>
          </div>
          
          <div className="flex flex-col gap-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedType(cat.type)}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                  selectedType === cat.type
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 translate-x-2"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl transition-colors ${
                    selectedType === cat.type ? "bg-white/20" : "bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600"
                  }`}>
                    {getIcon(cat.type)}
                  </div>
                  <span className="font-bold text-sm tracking-tight">{cat.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  selectedType === cat.type ? "translate-x-1" : "opacity-0 group-hover:opacity-100"
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Content - Dynamic Banner */}
        <div className="flex-1 relative overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl border border-slate-800">
          <AnimatePresence mode="wait">
            {selectedCategory && (
              <motion.div
                key={selectedCategory.type}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex flex-col md:flex-row"
              >
                {/* Background Decor */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
                  <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-600/10 rounded-full blur-[80px]" />
                </div>

                <div className="relative z-10 w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
                  >
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-blue-300 uppercase tracking-[0.2em]">
                      {selectedCategory.type.replace('_', ' ')}
                    </span>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight"
                  >
                    {selectedCategory.name}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-400 text-lg leading-relaxed mb-10 max-w-md"
                  >
                    {selectedCategory.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Link href={`/products/${selectedCategory.type.replace('_', '-')}`}>
                      <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100 rounded-full px-8 h-14 font-bold border-none shadow-xl shadow-white/5">
                        Khám Phá Ngay
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>

                {/* Image Placeholder Area */}
                <div className="relative z-10 hidden md:flex flex-1 items-center justify-center p-8">
                  <motion.div
                    initial={{ opacity: 0, x: 50, rotate: 2 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                    className="relative w-full aspect-square max-w-md rounded-3xl overflow-hidden shadow-2xl"
                  >
                    {selectedCategory.image ? (
                      <img 
                        src={selectedCategory.image} 
                        alt={selectedCategory.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center border border-white/5">
                        <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-white/10">
                          {React.cloneElement(getIcon(selectedCategory.type) as React.ReactElement, { className: "w-16 h-16 text-blue-400" })}
                        </div>
                        <span className="text-slate-500 font-medium text-sm">Product Visualization coming soon</span>
                        
                        {/* Shimmering scanline effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/5 to-transparent h-1/2 w-full animate-scan" style={{ animation: 'scan 4s linear infinite' }} />
                      </div>
                    )}

                    {/* Quality Badges */}
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tiêu Chuẩn</span>
                        <span className="text-xs text-white font-bold">ISO 9001:2015</span>
                      </div>
                      <div className="h-8 w-[1px] bg-white/20" />
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vật Liệu</span>
                        <span className="text-xs text-white font-bold">Thép T700 Siêu Cường</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  );
}
