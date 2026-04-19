"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("category")
        .select("name, type")
        .order("id", { ascending: true });
      if (data) setCategories(data);
    }
    fetchCategories();
  }, []);

  return (
    <header className="sticky top-3 z-50 w-full px-3">
      <div className="glass-panel w-full flex h-16 items-center justify-between px-6 bg-white/90">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-black text-2xl tracking-tighter text-accent uppercase">
              HATICO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 items-center">
            <Link
              href="/"
              className="text-sm font-semibold text-slate-700 hover:text-accent transition-colors"
            >
              Trang Chủ
            </Link>

            {/* Dropdown Sản Phẩm */}
            <div className="relative group py-4">
              <button className="text-sm font-semibold text-slate-700 hover:text-accent transition-colors flex items-center gap-1">
                Sản Phẩm
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-0 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-primary border border-slate-200 shadow-xl p-3 flex flex-col gap-2 relative">
                  {/* bridge gap */}
                  <div className="absolute -top-4 left-0 w-full h-4"></div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.type}
                      href={`/products/${cat.type.replace('_', '-')}`}
                      className="p-3 hover:bg-slate-50 rounded-sm transition-colors text-sm font-medium text-slate-800"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <div className="h-[1px] bg-slate-100 my-1" />
                  <Link
                    href="/products/phu-tung"
                    className="p-3 hover:bg-slate-50 rounded-sm transition-colors text-sm font-medium text-slate-800"
                  >
                    Phụ Tùng Chính Hãng
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/oil-prices"
              className="text-sm font-semibold text-slate-700 hover:text-accent transition-colors"
            >
              Giá Xăng Dầu
            </Link>
            <Link
              href="/roi-calculator"
              className="text-sm font-semibold text-slate-700 hover:text-accent transition-colors"
            >
              Tính Lợi Nhuận ROI
            </Link>
          </nav>
        </div>

        {/* Actions & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden lg:inline-flex">
            Đăng Nhập
          </Button>
          <Button
            variant="accent"
            className="hidden sm:inline-flex shadow-blue-900/20"
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
            className="text-sm font-semibold text-slate-800 p-2 hover:bg-slate-50 rounded-sm"
          >
            Trang Chủ
          </Link>
          <div className="flex flex-col">
            <div className="text-sm font-semibold text-slate-800 p-2">
              Sản Phẩm
            </div>
            <div className="pl-4 flex flex-col gap-1 border-l-2 border-slate-100 ml-2">
              {categories.map((cat) => (
                <Link
                  key={cat.type}
                  href={`/products/${cat.type.replace('_', '-')}`}
                  className="text-sm text-slate-600 p-2 hover:text-blue-700 hover:bg-slate-50 rounded-sm"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <Link
            href="/oil-prices"
            className="text-sm font-semibold text-slate-800 p-2 hover:bg-slate-50 rounded-sm"
          >
            Giá Xăng Dầu Hôm Nay
          </Link>
          <Link
            href="/roi-calculator"
            className="text-sm font-semibold text-slate-800 p-2 hover:bg-slate-50 rounded-sm"
          >
            Tính Lợi Nhuận ROI
          </Link>
          <hr className="my-2 border-slate-100" />
          <Button variant="accent" className="w-full justify-center">
            Nhận Báo Giá
          </Button>
        </div>
      )}
    </header>
  );
};

export { Header };
