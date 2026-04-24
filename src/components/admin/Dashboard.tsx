"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, 
  Package, 
  Truck, 
  Tag, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { cn } from "@/lib/utils";

export const Dashboard = () => {
  const [stats, setStats] = React.useState({
    totalCustomers: 0,
    totalInventory: 0,
    totalVehicles: 0,
    totalQuotations: 0,
    customerGrowth: [] as any[],
    inventoryByAgency: [] as any[],
    categoryDistribution: [] as any[],
    recentCustomers: [] as any[]
  });
  const [loading, setLoading] = React.useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [
        customersRes, 
        inventoryRes, 
        vehiclesRes, 
        trailersRes,
        agenciesRes
      ] = await Promise.all([
        supabase.from("customer").select("*", { count: "exact" }).order("created_at", { ascending: true }),
        supabase.from("inventory").select("*"),
        supabase.from("commercial_vehicles").select("*", { count: "exact" }),
        supabase.from("trailers").select("*", { count: "exact" }),
        supabase.from("agency").select("*")
      ]);

      // 1. Process Stats
      const totalInventory = (inventoryRes.data || []).reduce((acc, curr) => acc + (curr.value || 0), 0);
      
      // 2. Process Customer Growth (by month)
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const growthData = months.map(m => ({ name: m, total: 0 }));
      
      (customersRes.data || []).forEach(c => {
        const date = new Date(c.created_at);
        growthData[date.getMonth()].total += 1;
      });

      // 3. Process Inventory by Agency
      const agencyData = (agenciesRes.data || []).map(a => {
        const agencyStock = (inventoryRes.data || [])
          .filter(i => String(i.agency) === String(a.id))
          .reduce((acc, curr) => acc + (curr.value || 0), 0);
        return { name: a.name, value: agencyStock };
      }).filter(a => a.value > 0);

      // 4. Process Category Distribution
      const categories: Record<string, number> = {};
      (trailersRes.data || []).forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + 1;
      });
      const pieData = Object.entries(categories).map(([name, value]) => ({ 
        name: name === 'mooc_ben' ? 'Ben' : name === 'mooc_mui' ? 'Mui' : name === 'mooc_san' ? 'Sàn' : name === 'mooc_xuong' ? 'Xương' : name, 
        value 
      }));

      setStats({
        totalCustomers: customersRes.count || 0,
        totalInventory,
        totalVehicles: vehiclesRes.count || 0,
        totalQuotations: trailersRes.count || 0,
        customerGrowth: growthData.slice(0, new Date().getMonth() + 1),
        inventoryByAgency: agencyData,
        categoryDistribution: pieData,
        recentCustomers: (customersRes.data || []).slice(-5).reverse()
      });
    } catch (err) {
      console.error("Dashboard error:", err);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  const COLORS = ['#162248', '#2563eb', '#6366f1', '#8b5cf6', '#a855f7'];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-white border border-slate-100 rounded-primary" />
        ))}
        <div className="md:col-span-2 lg:col-span-3 h-80 bg-white border border-slate-100 rounded-primary" />
        <div className="h-80 bg-white border border-slate-100 rounded-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-700 w-full pb-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Tổng khách hàng", value: stats.totalCustomers, icon: <Users />, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Tổng hàng tồn", value: stats.totalInventory, icon: <Package />, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Xe thương mại", value: stats.totalVehicles, icon: <Truck />, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Mẫu sản phẩm", value: stats.totalQuotations, icon: <Tag />, color: "text-slate-900", bg: "bg-slate-100" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-5 rounded-primary border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-2 rounded-sm", item.bg, item.color)}>
                {React.cloneElement(item.icon as React.ReactElement, { size: 20, strokeWidth: 2.5 })}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp size={10} /> +12%
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{item.label}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{item.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Growth Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-primary border border-slate-100 shadow-sm flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xs font-black uppercase text-slate-900 tracking-[0.2em] flex items-center gap-2">
                <Activity size={14} className="text-accent" /> Tăng trưởng khách hàng
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Dữ liệu thực tế theo thời gian đăng ký</p>
            </div>
            <div className="flex bg-slate-50 p-1 rounded-sm gap-1">
              <button className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-sm bg-white shadow-sm">Tháng</button>
              <button className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-sm text-slate-400 hover:text-slate-600 transition-all">Năm</button>
            </div>
          </div>
          <div className="flex-1 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.customerGrowth}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#162248" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#162248" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '10px',
                    fontWeight: 900,
                    textTransform: 'uppercase'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#162248" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-slate-900 p-6 rounded-primary shadow-xl flex flex-col h-[400px]">
          <h3 className="text-xs font-black uppercase text-white tracking-[0.2em] mb-8 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" /> Danh mục sản phẩm
          </h3>
          <div className="flex-1 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryDistribution}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={500}
                  animationDuration={1500}
                >
                  {stats.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white">{stats.totalQuotations}</span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Mẫu xe</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {stats.categoryDistribution.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-[9px] font-black text-slate-400 uppercase truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Inventory Bar Chart */}
        <div className="bg-white p-6 rounded-primary border border-slate-100 shadow-sm flex flex-col h-[350px]">
          <h3 className="text-xs font-black uppercase text-slate-900 tracking-[0.2em] mb-8">Tồn kho theo chi nhánh</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.inventoryByAgency}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#162248" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-primary border border-slate-100 shadow-sm flex flex-col h-[350px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black uppercase text-slate-900 tracking-[0.2em]">Hoạt động gần đây</h3>
            <button className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Xem tất cả</button>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="space-y-4">
              {stats.recentCustomers.map((customer, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-sm border border-slate-50 hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-black">
                      {customer.name?.charAt(0) || "K"}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{customer.name || "Khách ẩn danh"}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{customer.product_id || "Chung"}</p>
                    <p className="text-[9px] text-slate-300 font-bold uppercase mt-0.5">
                      {new Date(customer.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              ))}
              {stats.recentCustomers.length === 0 && (
                <div className="h-40 flex items-center justify-center">
                   <p className="text-xs font-black text-slate-300 uppercase tracking-widest italic">Chưa có hoạt động mới</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
