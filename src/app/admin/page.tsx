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
  ClipboardList
} from "lucide-react";
import { CustomerList } from "@/components/admin/CustomerList";
import { PriceList } from "@/components/admin/PriceList";
import { InventoryList } from "@/components/admin/InventoryList";
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
              <div className="w-10 h-10 relative group">
                <img
                  src="/images/Logo.png"
                  alt="Logo"
                  className="w-full h-full object-contain relative z-10 rounded-sm"
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
            <div className="w-10 h-10">
              <img
                src="/images/admin-logo.png"
                alt="Logo"
                className="w-full h-full object-contain rounded-sm"
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
            onClick={() => setActiveTab("quotations")}
            className={cn(
              "flex items-center gap-4 p-4 rounded-sm transition-all duration-300 group",
              activeTab === "quotations" ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'hover:bg-white/5 text-slate-400'
            )}
          >
            <Tag className={cn("w-5 h-5 shrink-0 transition-transform", activeTab === "quotations" && "scale-110")} />
            {isSidebarOpen && <span className="text-xs font-black uppercase tracking-widest">Báo giá</span>}
          </button>

          <button 
            onClick={() => setActiveTab("inventory")}
            className={cn(
              "flex items-center gap-4 p-4 rounded-sm transition-all duration-300 group",
              activeTab === "inventory" ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'hover:bg-white/5 text-slate-400'
            )}
          >
            <Package className={cn("w-5 h-5 shrink-0 transition-transform", activeTab === "inventory" && "scale-110")} />
            {isSidebarOpen && <span className="text-xs font-black uppercase tracking-widest">Hàng tồn kho</span>}
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
                {activeTab === "customers" ? "Quản lý khách hàng" : 
                 activeTab === "quotations" ? "Báo giá chi tiết" :
                 activeTab === "inventory" ? "Kiểm soát tồn kho" : "Thống kê hệ thống"}
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
          ) : activeTab === "quotations" ? (
            <div className="w-full">
               <PriceList />
            </div>
          ) : activeTab === "inventory" ? (
            <div className="w-full">
               <InventoryList />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full">
              {[
                {
                  label: "YÊU CẦU MỚI",
                  value: "24",
                  color: "from-blue-500 to-indigo-600",
                  icon: <Bell className="w-6 h-6" />,
                },
                {
                  label: "TỔNG LIÊN HỆ",
                  value: "1,2k",
                  color: "from-slate-800 to-slate-900",
                  icon: <Users className="w-6 h-6" />,
                },
                {
                  label: "TỶ LỆ CHỐT",
                  value: "68%",
                  color: "from-emerald-500 to-teal-600",
                  icon: <LayoutDashboard className="w-6 h-6" />,
                },
                {
                  label: "DOANH THU",
                  value: "8.5B",
                  color: "from-accent to-blue-900",
                  icon: <Tag className="w-6 h-6" />,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="relative bg-white p-4 rounded-primary border border-slate-100 shadow-sm overflow-hidden group"
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-none flex items-center justify-center text-white bg-gradient-to-br mb-4 shadow-md transition-transform group-hover:scale-110",
                      stat.color,
                    )}
                  >
                    {stat.icon}
                  </div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">
                    {stat.value}
                  </p>
                </div>
              ))}

              {/* Modern Grid/Chart Section */}
              <div className="lg:col-span-3 xl:col-span-4 bg-white p-4 rounded-primary border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm font-black uppercase text-slate-900 tracking-widest">
                    Hiệu suất vận hành
                  </h3>
                  <div className="flex bg-slate-100 p-1 rounded-sm gap-1">
                    {["Hằng ngày", "Hằng tháng"].map((t) => (
                      <button
                        key={t}
                        className="px-4 py-2 text-xs font-black uppercase tracking-widest rounded-sm hover:bg-white transition-all"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-64 w-full flex items-end gap-2 px-1">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-slate-100 hover:bg-accent rounded-none transition-all duration-300"
                      style={{ height: `${Math.random() * 70 + 30}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
