"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, 
  Search, 
  Phone, 
  Calendar, 
  Tag, 
  FileText, 
  ArrowUpDown,
  MoreVertical,
  Trash2,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export const CustomerList = () => {
  const [customers, setCustomers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("customer")
      .select(`
        *,
        trailers (
          name
        )
      `)
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching customers:", error);
    } else {
      setCustomers(data || []);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm) ||
      (Array.isArray(c.trailers) ? c.trailers[0]?.name : c.trailers?.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.product_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-500 w-full">
      {/* Header Tools */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
           <h2 className="text-sm font-black uppercase text-slate-800 tracking-widest flex items-center gap-2">
             <div className="w-1 h-3 bg-accent" /> Cơ sở dữ liệu khách hàng
           </h2>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="QUICK SEARCH..."
              className="w-full h-12 pl-10 pr-3 bg-white border border-slate-200 rounded-none text-xs font-black uppercase tracking-widest focus:border-accent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            className="h-12 bg-slate-900 text-white hover:bg-black rounded-none px-6 font-black uppercase text-xs tracking-widest transition-all"
            onClick={fetchCustomers}
            disabled={loading}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", loading ? 'animate-spin' : '')} />
            SYNC
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-100 rounded-primary shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white border-b border-slate-800">
                <th className="p-3 text-[11px] font-black uppercase tracking-widest border border-slate-800">Họ và tên</th>
                <th className="p-3 text-[11px] font-black uppercase tracking-widest border border-slate-800">SĐT</th>
                <th className="p-3 text-[11px] font-black uppercase tracking-widest border border-slate-800">Sản phẩm</th>
                <th className="p-3 text-[11px] font-black uppercase tracking-widest border border-slate-800">Giá trị</th>
                <th className="p-3 text-[11px] font-black uppercase tracking-widest border border-slate-800">Yêu cầu</th>
                <th className="p-3 text-[11px] font-black uppercase tracking-widest border border-slate-800 text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="p-3">
                       <div className="h-4 bg-slate-50 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/50 transition-all font-bold">
                    <td className="p-3">
                       <span className="text-sm text-slate-900 uppercase tracking-tighter">{customer.name || "KHÁCH ẨN DANH"}</span>
                    </td>
                    <td className="p-3">
                        <a href={`tel:${customer.phone}`} className="text-xs text-accent tracking-widest font-black uppercase">
                          {customer.phone}
                        </a>
                    </td>
                    <td className="p-3">
                      <span className="text-xs text-slate-700 uppercase tracking-widest bg-slate-100 px-3 py-1 font-black">
                        {(Array.isArray(customer.trailers) ? customer.trailers[0]?.name : customer.trailers?.name) || customer.product_id || "CHUNG"}
                      </span>
                    </td>
                    <td className="p-3">
                       <span className="text-xs text-blue-700 uppercase tracking-widest font-black">
                         {customer.price ? `${customer.price.toLocaleString()}đ` : "---"}
                       </span>
                    </td>
                    <td className="p-3">
                      <p className="text-xs text-slate-500 line-clamp-1 truncate max-w-xs font-semibold">{customer.note || "---"}</p>
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-xs text-slate-400 uppercase tracking-widest font-black">
                        {customer.created_at ? new Date(customer.created_at).toLocaleDateString('vi-VN') : "---"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-16 text-center">
                    <p className="text-xs font-black uppercase text-slate-300 tracking-widest">Không có dữ liệu</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
