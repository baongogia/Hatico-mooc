"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Users,
  LayoutDashboard,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Tag,
  Package,
  ClipboardList,
  Truck,
  Calculator,
  Database,
} from "lucide-react";
import { CustomerList } from "@/components/admin/CustomerList";
import { DataCustomerList } from "@/components/admin/DataCustomerList";
import { PriceList } from "@/components/admin/PriceList";
import { InventoryList } from "@/components/admin/InventoryList";
import { CommercialVehicleList } from "@/components/admin/CommercialVehicleList";
import { Dashboard } from "@/components/admin/Dashboard";
import { ArticleList } from "@/components/admin/ArticleList";
import ROICalculatorPage from "@/app/roi-calculator/page";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("customers");

  // Load tab from localStorage on mount
  React.useEffect(() => {
    const savedTab = localStorage.getItem("adminActiveTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  // Save tab to localStorage when it changes
  React.useEffect(() => {
    localStorage.setItem("adminActiveTab", activeTab);
  }, [activeTab]);

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setSession(session);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) router.push("/login");
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="h-screen bg-slate-100 flex p-3 gap-3 overflow-hidden">
      {/* Sidebar - Modern Floating Card */}
      <aside
        className={cn(
          "bg-slate-950 text-white transition-all duration-500 flex flex-col shadow-2xl rounded-primary overflow-hidden border border-white/5",
          isSidebarOpen ? "w-72" : "w-20",
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative bg-white p-1.5 rounded-[8px] shadow-sm">
                <img
                  src="/images/logo-sp.png"
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black uppercase tracking-tighter text-xl">
                  Hatico
                </span>
                <span className="text-[10px] font-white uppercase tracking-[0.2em] font-bold">
                  Admin Portal
                </span>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-white p-1.5 rounded-[8px] shadow-sm">
              <img
                src="/images/logo-sp.png"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-sm transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar-dark">
          <div className="px-2 mb-2">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
              Menu chính
            </p>
          </div>

          <button
            onClick={() => setActiveTab("dashboard")}
            className={cn(
              "flex items-center gap-4 p-4 rounded-sm transition-all duration-300 group",
              activeTab === "dashboard"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "hover:bg-white/5 text-slate-400",
            )}
          >
            <LayoutDashboard
              className={cn(
                "w-5 h-5 shrink-0 transition-transform",
                activeTab === "dashboard" && "scale-110",
              )}
            />
            {isSidebarOpen && (
              <span className="text-xs font-black uppercase tracking-widest">
                Tổng quan
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("customers")}
            className={cn(
              "flex items-center gap-4 p-4 rounded-sm transition-all duration-300 group",
              activeTab === "customers"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "hover:bg-white/5 text-slate-400",
            )}
          >
            <Users
              className={cn(
                "w-5 h-5 shrink-0 transition-transform",
                activeTab === "customers" && "scale-110",
              )}
            />
            {isSidebarOpen && (
              <span className="text-xs font-black uppercase tracking-widest">
                Khách hàng
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("data_customer")}
            className={cn(
              "flex items-center gap-4 p-4 rounded-sm transition-all duration-300 group",
              activeTab === "data_customer"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "hover:bg-white/5 text-slate-400",
            )}
          >
            <Database
              className={cn(
                "w-5 h-5 shrink-0 transition-transform",
                activeTab === "data_customer" && "scale-110",
              )}
            />
            {isSidebarOpen && (
              <span className="text-xs font-black uppercase tracking-widest">
                Dữ liệu KH
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("quotations")}
            className={cn(
              "flex items-center gap-4 p-4 rounded-sm transition-all duration-300 group",
              activeTab === "quotations"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "hover:bg-white/5 text-slate-400",
            )}
          >
            <Tag
              className={cn(
                "w-5 h-5 shrink-0 transition-transform",
                activeTab === "quotations" && "scale-110",
              )}
            />
            {isSidebarOpen && (
              <span className="text-xs font-black uppercase tracking-widest">
                Báo giá
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("inventory")}
            className={cn(
              "flex items-center gap-4 p-4 rounded-sm transition-all duration-300 group",
              activeTab === "inventory"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "hover:bg-white/5 text-slate-400",
            )}
          >
            <Package
              className={cn(
                "w-5 h-5 shrink-0 transition-transform",
                activeTab === "inventory" && "scale-110",
              )}
            />
            {isSidebarOpen && (
              <span className="text-xs font-black uppercase tracking-widest">
                Hàng tồn kho
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("articles")}
            className={cn(
              "flex items-center gap-4 p-4 rounded-sm transition-all duration-300 group",
              activeTab === "articles"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "hover:bg-white/5 text-slate-400",
            )}
          >
            <ClipboardList
              className={cn(
                "w-5 h-5 shrink-0 transition-transform",
                activeTab === "articles" && "scale-110",
              )}
            />
            {isSidebarOpen && (
              <span className="text-xs font-black uppercase tracking-widest">
                Tin Tức (SEO)
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("commercial")}
            className={cn(
              "flex items-center gap-4 p-4 rounded-sm transition-all duration-300 group",
              activeTab === "commercial"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "hover:bg-white/5 text-slate-400",
            )}
          >
            <Truck
              className={cn(
                "w-5 h-5 shrink-0 transition-transform",
                activeTab === "commercial" && "scale-110",
              )}
            />
            {isSidebarOpen && (
              <span className="text-xs font-black uppercase tracking-widest">
                Xe thương mại
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("roi_calculator")}
            className={cn(
              "flex items-center gap-4 p-4 rounded-sm transition-all duration-300 group",
              activeTab === "roi_calculator"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "hover:bg-white/5 text-slate-400",
            )}
          >
            <Calculator
              className={cn(
                "w-5 h-5 shrink-0 transition-transform",
                activeTab === "roi_calculator" && "scale-110",
              )}
            />
            {isSidebarOpen && (
              <span className="text-xs font-black uppercase tracking-widest">
                Tính Giá & ROI
              </span>
            )}
          </button>

          <div className="mt-auto px-2 pt-6 border-t border-white/10 flex flex-col gap-4">
            {isSidebarOpen && (
              <div className="bg-white/5 p-4 rounded-sm border border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Tài khoản
                </p>
                <p className="text-xs font-black mt-1 text-slate-200 truncate">
                  {session.user.email}
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 p-4 w-full rounded-sm hover:bg-red-500/20 text-red-400 transition-all font-black uppercase tracking-widest text-[10px]"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span>Đăng xuất hệ thống</span>}
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area - Modern Floating Card */}
      <main className="flex-1 flex flex-col bg-white rounded-primary shadow-xl border border-slate-200 overflow-hidden">
        {/* Internal Content Header */}
        <header className="p-3 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-accent rounded-full" />
              <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                {activeTab === "customers"
                  ? "Quản lý khách hàng"
                  : activeTab === "data_customer"
                    ? "Dữ liệu khách hàng"
                    : activeTab === "quotations"
                      ? "Báo giá chi tiết"
                      : activeTab === "inventory"
                        ? "Kiểm soát tồn kho"
                        : activeTab === "commercial"
                          ? "Bảng giá xe thương mại"
                          : activeTab === "articles"
                            ? "Quản lý Tin tức & Bài viết"
                            : activeTab === "roi_calculator"
                              ? "Tính Giá Lăn Bánh & ROI"
                              : "Thống kê hệ thống"}
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 ml-4">
              Hatico Portal • Live Information
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
                Administrator
              </span>
            </div>
            <button className="relative p-2 bg-slate-50 hover:bg-slate-100 rounded-sm transition-all border border-slate-200">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-3 w-full custom-scrollbar">
          {activeTab === "customers" ? (
            <div className="w-full">
              <CustomerList />
            </div>
          ) : activeTab === "data_customer" ? (
            <div className="w-full h-full">
              <DataCustomerList />
            </div>
          ) : activeTab === "quotations" ? (
            <div className="w-full">
              <PriceList />
            </div>
          ) : activeTab === "inventory" ? (
            <div className="w-full">
              <InventoryList />
            </div>
          ) : activeTab === "commercial" ? (
            <div className="w-full">
              <CommercialVehicleList />
            </div>
          ) : activeTab === "articles" ? (
            <div className="w-full h-full">
              <ArticleList />
            </div>
          ) : activeTab === "roi_calculator" ? (
            <div className="w-full h-full bg-slate-50/50 rounded-lg overflow-y-auto">
              <ROICalculatorPage />
            </div>
          ) : (
            <div className="w-full h-full">
              <Dashboard />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
