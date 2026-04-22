"use client";

import * as React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin") || pathname.startsWith("/login");

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Header sẽ float ở trên với sticky top-3 - Ẩn trên trang admin */}
      {!isAdminPage && <Header />}

      {/* 
        Phần nội dung chính. 
        Padding 12px (p-3) xung quanh theo nguyên tắc spacing 12px 
      */}
      <main className={cn(
        "flex-1 w-full flex flex-col",
        !isAdminPage ? "p-3 pt-20" : "p-0"
      )}>
        {children}
      </main>

      {/* Footer (nếu có) - Ẩn trên trang admin */}
      {!isAdminPage && (
        <footer className="w-full p-3 mt-auto">
          <div className="rounded-primary overflow-hidden shadow-2xl border border-slate-900">
            <Footer />
          </div>
        </footer>
      )}
    </div>
  );
};

export { MainLayout };
