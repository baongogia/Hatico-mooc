"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { useContactModal } from "@/context/ContactContext";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
        className="w-full flex h-16 items-center justify-between px-6 bg-white/90 rounded-bl-primary rounded-br-primary"
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
                    : "text-slate-500 hover:text-slate-900"
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
                <svg
                  className="w-3.5 h-3.5 transition-transform group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
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

            {/* Dropdown Xe Thương Mại */}
            <div className="relative group h-full flex items-center">
              <button className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 py-4">
                Xe Tải Nặng
                <svg
                  className="w-3.5 h-3.5 transition-transform group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
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
            onClick={() => openContactModal('quote')}
          >
            Nhận Báo Giá
          </Button>
          <button
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[calc(100%+8px)] left-3 right-3 bg-white rounded-primary border border-slate-200 shadow-xl p-4 flex flex-col gap-4 z-50">
          <Link
            href="/"
            className={cn(
              "text-xs font-black uppercase tracking-[0.2em] p-3 rounded-[8px] transition-all",
              pathname === "/" ? "bg-blue-50 text-blue-900" : "text-slate-600 hover:bg-slate-50"
            )}
          >
            Trang Chủ
          </Link>
          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 py-1">
              Sản Phẩm
            </div>
            <div className="flex flex-col gap-1 pl-3 border-l-2 border-slate-100">
              {categories.map((cat) => (
                <Link
                  key={cat.type}
                  href={`/products/${cat.type.replace("_", "-")}`}
                  className="text-xs font-bold uppercase tracking-widest text-slate-600 p-3 hover:text-blue-900 hover:bg-slate-50 rounded-[8px]"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 py-1">
              Xe Tải Nặng
            </div>
            <div className="flex flex-col gap-1 pl-3 border-l-2 border-slate-100">
              <Link
                href="/xe-tai-nang/dau-keo"
                className="text-xs font-bold uppercase tracking-widest text-slate-600 p-3 hover:text-blue-900 hover:bg-slate-50 rounded-[8px]"
              >
                Xe Đầu Kéo
              </Link>
              <Link
                href="/xe-tai-nang/xe-ben"
                className="text-xs font-bold uppercase tracking-widest text-slate-600 p-3 hover:text-blue-900 hover:bg-slate-50 rounded-[8px]"
              >
                Xe Ben
              </Link>
              <Link
                href="/xe-tai-nang/xe-tron"
                className="text-xs font-bold uppercase tracking-widest text-slate-600 p-3 hover:text-blue-900 hover:bg-slate-50 rounded-[8px]"
              >
                Xe Trộn Bê Tông
              </Link>
            </div>
          </div>

          <Link
            href="/tin-tuc"
            className={cn(
              "text-xs font-black uppercase tracking-[0.2em] p-3 rounded-[8px] transition-all",
              pathname === "/tin-tuc" ? "bg-blue-50 text-blue-900" : "text-slate-600 hover:bg-slate-50"
            )}
          >
            Tin Tức
          </Link>
          <hr className="my-2 border-slate-100" />
          <Button 
            variant="accent" 
            className="w-full justify-center" 
            onClick={() => {
              setIsMobileMenuOpen(false);
              openContactModal('quote');
            }}
          >
            Nhận Báo Giá
          </Button>
        </div>
      )}
    </header>
  );
};

export { Header };
