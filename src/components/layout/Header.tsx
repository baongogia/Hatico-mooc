import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";

const Header = () => {
  return (
    <header className="sticky top-3 z-50 w-full px-3">
      {/* 
        Container cho Glassmorphism navbar 
        Theo quy tắc: cách viền 12px (p-3), bo góc 8px
      */}
      <div className="glass-panel w-full flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl uppercase tracking-wider text-slate-100">
              {siteConfig.name}
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/products"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Cơ khí / Máy móc
            </Link>
            <Link
              href="/roi-calculator"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Công cụ ROI
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Liên hệ
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:inline-flex">
            Đăng nhập
          </Button>
          <Button variant="accent">
            Nhận báo giá
          </Button>
        </div>
      </div>
    </header>
  );
};

export { Header };
