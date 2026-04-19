import * as React from "react";
import { Header } from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Header sẽ float ở trên với sticky top-3 */}
      <Header />

      {/* 
        Phần nội dung chính. 
        Padding 12px (p-3) xung quanh theo nguyên tắc spacing 12px 
      */}
      <main className="flex-1 w-full p-3 flex flex-col pt-20">{children}</main>

      {/* Footer (nếu có) cũng tuân thủ spacing tương tự */}
      <footer className="w-full p-3 mt-auto">
        <div className="glass-panel w-full p-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Hatico. Premium Industrial
            Solutions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export { MainLayout };
