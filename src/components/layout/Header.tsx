"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { useContactModal } from "@/context/ContactContext";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [session, setSession] = React.useState<any>(null);
  const { openContactModal } = useContactModal();
  const pathname = usePathname();

  React.useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("category")
        .select("name, type")
        .order("id", { ascending: true });
      if (data) setCategories(data);
    }
    fetchCategories();

    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="fixed top-0 left-3 right-3 z-[100]">
      <div
        style={{
          backdropFilter: "blur(5px)",
        }}
        className="w-full flex h-16 items-center justify-between px-6 bg-white/90 rounded-bl-primary rounded-br-primary shadow-sm"
      >
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <img
              src="/images/Logo.png"
              alt="HATICO Logo"
              className="h-10 md:h-12 flex items-center justify-center mt-2 scale-[180%]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center h-full">
            {[
              { name: "Trang Chủ", href: "/" },
              { name: "Tin Tức", href: "/tin-tuc" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-bold uppercase tracking-widest transition-colors relative py-2",
                  pathname === item.href
                    ? "text-blue-900"
                    : "text-slate-500 hover:text-slate-900",
                )}
              >
                {item.name}
                {pathname === item.href && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-900 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}

            {/* Dropdown Sản Phẩm */}
            <div className="relative group h-full flex items-center">
              <button className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 py-4">
                Sản Phẩm
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60] pt-2">
                <div className="bg-white rounded-[12px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-2 flex flex-col gap-1 relative ring-1 ring-black/5">
                  {categories.map((cat) => (
                    <Link
                      key={cat.type}
                      href={`/products/${cat.type.replace("_", "-")}`}
                      className="p-3 hover:bg-slate-50 rounded-[8px] transition-colors text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-900"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="h-[1px] bg-slate-50 my-1" />
                  <Link
                    href="/products/phu-tung"
                    className="p-3 hover:bg-slate-50 rounded-[8px] transition-colors text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-900"
                  >
                    Phụ Tùng Chính Hãng
                  </Link>
                </div>
              </div>
            </div>

            {/* Dropdown Xe Tải Nặng */}
            <div className="relative group h-full flex items-center">
              <button className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 py-4">
                Xe Tải Nặng
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60] pt-2">
                <div className="bg-white rounded-[12px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-2 flex flex-col gap-1 relative ring-1 ring-black/5">
                  <Link
                    href="/xe-tai-nang/dau-keo"
                    className="p-3 hover:bg-slate-50 rounded-[8px] transition-colors text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-900"
                  >
                    Xe Đầu Kéo
                  </Link>
                  <Link
                    href="/xe-tai-nang/xe-ben"
                    className="p-3 hover:bg-slate-50 rounded-[8px] transition-colors text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-900"
                  >
                    Xe Ben
                  </Link>
                  <Link
                    href="/xe-tai-nang/xe-tron"
                    className="p-3 hover:bg-slate-50 rounded-[8px] transition-colors text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-900"
                  >
                    Xe Trộn Bê Tông
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Actions & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <Button
            variant="accent"
            className="hidden sm:inline-flex shadow-blue-900/20"
            onClick={() => openContactModal("quote")}
          >
            Nhận Báo Giá
          </Button>
          <button
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-primary"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Slider (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] md:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-white z-[101] md:hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <img src="/images/Logo.png" alt="Hatico Logo" className="h-8" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
                {/* Main Links */}
                <div className="flex flex-col gap-2">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "text-sm font-black uppercase tracking-[0.2em] p-4 rounded-[12px] transition-all",
                      pathname === "/" ? "bg-accent/10 text-accent" : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    Trang Chủ
                  </Link>
                  <Link
                    href="/tin-tuc"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "text-sm font-black uppercase tracking-[0.2em] p-4 rounded-[12px] transition-all",
                      pathname === "/tin-tuc" ? "bg-accent/10 text-accent" : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    Tin Tức
                  </Link>
                </div>

                {/* Sản Phẩm Section */}
                <div className="flex flex-col gap-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-4 border-l-2 border-accent">
                    Sản Phẩm (Trailer)
                  </div>
                  <div className="flex flex-col gap-1 pl-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.type}
                        href={`/products/${cat.type.replace("_", "-")}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-xs font-bold uppercase tracking-widest text-slate-600 p-4 hover:text-accent hover:bg-slate-50 rounded-[12px] transition-all flex items-center justify-between group"
                      >
                        {cat.name}
                        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Xe Tải Nặng Section */}
                <div className="flex flex-col gap-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-4 border-l-2 border-accent">
                    Xe Tải Nặng
                  </div>
                  <div className="flex flex-col gap-1 pl-2">
                    <Link
                      href="/xe-tai-nang/dau-keo"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-xs font-bold uppercase tracking-widest text-slate-600 p-4 hover:text-accent hover:bg-slate-50 rounded-[12px] transition-all flex items-center justify-between group"
                    >
                      Xe Đầu Kéo
                      <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                    <Link
                      href="/xe-tai-nang/xe-ben"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-xs font-bold uppercase tracking-widest text-slate-600 p-4 hover:text-accent hover:bg-slate-50 rounded-[12px] transition-all flex items-center justify-between group"
                    >
                      Xe Ben
                      <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                    <Link
                      href="/xe-tai-nang/xe-tron"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-xs font-bold uppercase tracking-widest text-slate-600 p-4 hover:text-accent hover:bg-slate-50 rounded-[12px] transition-all flex items-center justify-between group"
                    >
                      Xe Trộn Bê Tông
                      <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <Button
                  variant="accent"
                  className="w-full h-14 text-xs font-black uppercase tracking-widest rounded-[12px]"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openContactModal("quote");
                  }}
                >
                  Nhận Báo Giá
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export { Header };
