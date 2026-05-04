"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";
import { Search, RefreshCw, Upload, Save, CheckSquare, Square, FileJson, Plus, Edit, Trash2, X, AlertTriangle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface DataCustomer {
  id: number;
  name: string;
  relation: string;
  source: string;
  phone: string;
  product: string;
  price: string;
  finance: string;
  information: string;
  owner: string;
  contacted?: boolean;
}

export const DataCustomerList = () => {
  const [customers, setCustomers] = React.useState<DataCustomer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);
  const [jsonInput, setJsonInput] = React.useState("");
  const [importing, setImporting] = React.useState(false);
  
  // CRUD State
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [currentCustomer, setCurrentCustomer] = React.useState<Partial<DataCustomer>>({});
  const [isSaving, setIsSaving] = React.useState(false);

  // Notification Modal State
  const [notification, setNotification] = React.useState<{
    isOpen: boolean;
    type: 'error' | 'confirm';
    title?: string;
    message: string;
    onConfirm?: () => void;
  }>({ isOpen: false, type: 'error', message: '' });

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("data_customer")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching data_customer:", error);
    } else {
      setCustomers(data || []);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleContacted = async (customer: DataCustomer) => {
    const newValue = !customer.contacted;
    
    // Update local state immediately for snappy UI
    setCustomers((prev) =>
      prev.map((c) => (c.id === customer.id ? { ...c, contacted: newValue } : c))
    );

    // Update DB
    try {
      const { error } = await supabase
        .from("data_customer")
        .update({ contacted: newValue })
        .eq("id", customer.id);
      
      if (error) {
        // If error, it might be because the 'contacted' column doesn't exist yet
        console.error("Error updating contacted status. Please ensure 'contacted' (boolean) column exists in data_customer table.", error);
        // Revert local state
        setCustomers((prev) =>
          prev.map((c) => (c.id === customer.id ? { ...c, contacted: !newValue } : c))
        );
        setNotification({
          isOpen: true,
          type: 'error',
          title: 'Lỗi cập nhật',
          message: "Lỗi khi cập nhật trạng thái. Vui lòng kiểm tra xem cột 'contacted' (boolean) đã được tạo trong bảng data_customer chưa."
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImportJson = async () => {
    try {
      setImporting(true);
      const parsedData = JSON.parse(jsonInput);
      const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      
      // Filter out id to let DB auto-increment, unless explicitly needed
      const cleanData = dataArray.map(item => {
        const { id, ...rest } = item;
        return rest;
      });

      const { error } = await supabase.from("data_customer").insert(cleanData);
      
      if (error) throw error;
      
      setIsImportModalOpen(false);
      setJsonInput("");
      fetchCustomers();
    } catch (err) {
      console.error("Import error:", err);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Lỗi Import JSON',
        message: "Vui lòng kiểm tra lại định dạng dữ liệu JSON của bạn."
      });
    } finally {
      setImporting(false);
    }
  };

  const handleSaveCustomer = async () => {
    try {
      setIsSaving(true);
      if (currentCustomer.id) {
        const { error } = await supabase
          .from("data_customer")
          .update(currentCustomer)
          .eq("id", currentCustomer.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("data_customer")
          .insert([currentCustomer]);
        if (error) throw error;
      }
      setIsFormModalOpen(false);
      setCurrentCustomer({});
      fetchCustomers();
    } catch (err) {
      console.error("Save error:", err);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Lỗi lưu dữ liệu',
        message: "Đã có lỗi xảy ra trong quá trình lưu. Vui lòng thử lại sau."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    setNotification({
      isOpen: true,
      type: 'confirm',
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa khách hàng này? Dữ liệu sẽ bị xóa vĩnh viễn.',
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from("data_customer")
            .delete()
            .eq("id", id);
          if (error) throw error;
          setNotification(prev => ({ ...prev, isOpen: false }));
          fetchCustomers();
        } catch (err) {
          console.error("Delete error:", err);
          setNotification({
            isOpen: true,
            type: 'error',
            title: 'Lỗi xóa dữ liệu',
            message: "Đã có lỗi xảy ra khi xóa. Vui lòng thử lại."
          });
        }
      }
    });
  };

  const filteredCustomers = customers.filter(
    (c) =>
      (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.product || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in w-full h-full p-2">
      {/* List Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 border border-slate-200 shadow-sm rounded-primary">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-accent rounded-full" />
          <div>
            <h1 className="text-xl font-black text-slate-950 uppercase tracking-tighter leading-none">
              Dữ liệu khách hàng
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Khách hàng đã liên hệ/quan tâm
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              type="text"
              placeholder="Tìm kiếm tên, sđt, sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 h-12 border border-slate-200 bg-slate-50 focus:bg-white focus:border-accent outline-none text-xs font-bold transition-all rounded-primary"
            />
          </div>
          <Button
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-slate-950 text-white hover:bg-slate-800 h-12 px-6 shadow-xl transition-all border-none rounded-primary"
            onClick={() => {
              setCurrentCustomer({ contacted: false });
              setIsFormModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Thêm mới
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest h-12 px-4 border-slate-200 hover:bg-slate-50 rounded-primary"
            onClick={() => setIsImportModalOpen(true)}
          >
            <FileJson className="w-3.5 h-3.5" />
            Import JSON
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest h-12 px-4 border-slate-200 hover:bg-slate-50 rounded-primary"
            onClick={fetchCustomers}
          >
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-slate-200 overflow-hidden shadow-sm flex-1 rounded-primary">
        <div className="overflow-x-auto h-full max-h-[calc(100vh-250px)]">
          <table className="w-full text-left text-sm border-collapse relative">
            <thead className="bg-slate-900 text-white sticky top-0 z-10">
              <tr>
                <th className="p-4 font-black uppercase tracking-widest text-[9px] border-r border-white/5 w-12 text-center">LH</th>
                <th className="p-4 font-black uppercase tracking-widest text-[9px] border-r border-white/5">Tên KH</th>
                <th className="p-4 font-black uppercase tracking-widest text-[9px] border-r border-white/5">Mối quan hệ</th>
                <th className="p-4 font-black uppercase tracking-widest text-[9px] border-r border-white/5">Nguồn</th>
                <th className="p-4 font-black uppercase tracking-widest text-[9px] border-r border-white/5">Số điện thoại</th>
                <th className="p-4 font-black uppercase tracking-widest text-[9px] border-r border-white/5">Sản phẩm</th>
                <th className="p-4 font-black uppercase tracking-widest text-[9px] border-r border-white/5">Giá</th>
                <th className="p-4 font-black uppercase tracking-widest text-[9px] border-r border-white/5">Tài chính</th>
                <th className="p-4 font-black uppercase tracking-widest text-[9px] border-r border-white/5">Thông tin thêm</th>
                <th className="p-4 font-black uppercase tracking-widest text-[9px] border-r border-white/5">Phụ trách</th>
                <th className="p-4 font-black uppercase tracking-widest text-[9px] text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={11} className="p-20 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-slate-100 border-t-accent rounded-full animate-spin" />
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-20 text-center">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-300">
                      Không có dữ liệu
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className={cn(
                      "transition-colors group",
                      customer.contacted
                        ? "bg-orange-50 hover:bg-orange-100"
                        : "hover:bg-slate-50/80"
                    )}
                  >
                    <td className="p-4 text-center border-r border-slate-50">
                      <button
                        onClick={() => handleToggleContacted(customer)}
                        className={cn(
                          "w-6 h-6 flex items-center justify-center rounded-md transition-all shadow-sm border",
                          customer.contacted
                            ? "bg-orange-500 border-orange-600 text-white shadow-orange-500/20"
                            : "bg-white border-slate-200 text-slate-300 hover:border-slate-300"
                        )}
                      >
                        {customer.contacted ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4 opacity-0 group-hover:opacity-50" />
                        )}
                      </button>
                    </td>
                    <td className="p-4 font-bold text-slate-900 border-r border-slate-50 min-w-[150px]">
                      {customer.name || "-"}
                    </td>
                    <td className="p-4 text-slate-600 text-[11px] border-r border-slate-50">
                      {customer.relation || "-"}
                    </td>
                    <td className="p-4 text-slate-600 text-[11px] border-r border-slate-50">
                      {customer.source || "-"}
                    </td>
                    <td className="p-4 text-slate-900 font-mono text-[11px] font-bold border-r border-slate-50">
                      {customer.phone || "-"}
                    </td>
                    <td className="p-4 text-slate-600 text-[11px] border-r border-slate-50 min-w-[150px]">
                      {customer.product || "-"}
                    </td>
                    <td className="p-4 text-slate-900 font-bold text-[11px] border-r border-slate-50">
                      {customer.price || "-"}
                    </td>
                    <td className="p-4 text-slate-600 text-[11px] border-r border-slate-50">
                      {customer.finance || "-"}
                    </td>
                    <td className="p-4 text-slate-500 text-[11px] border-r border-slate-50 max-w-[200px] truncate" title={customer.information}>
                      {customer.information || "-"}
                    </td>
                    <td className="p-4 text-slate-900 font-bold text-[10px] uppercase tracking-widest border-r border-slate-50">
                      {customer.owner || "-"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-950 hover:text-white transition-all shadow-sm rounded-md"
                          onClick={() => {
                            setCurrentCustomer(customer);
                            setIsFormModalOpen(true);
                          }}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-sm rounded-md"
                          onClick={() => handleDeleteCustomer(customer.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import JSON Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setIsImportModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-primary shadow-2xl overflow-hidden border border-slate-200 p-6 flex flex-col">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">
              Import Dữ Liệu JSON
            </h3>
            <p className="text-xs font-medium text-slate-500 mb-6">
              Dán mảng JSON chứa danh sách khách hàng. Các trường hỗ trợ: name, relation, source, phone, product, price, finance, information, owner.
            </p>
            <textarea
              className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-primary text-xs font-mono text-slate-700 focus:bg-white focus:border-accent outline-none transition-all mb-6"
              placeholder={'[\n  {\n    "name": "Nguyễn Văn A",\n    "phone": "0988123456",\n    "product": "Sơ mi rơ moóc xương"\n  }\n]'}
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                className="h-10 rounded-primary border-slate-200 text-xs font-bold"
                onClick={() => setIsImportModalOpen(false)}
              >
                Hủy
              </Button>
              <Button
                className="h-10 rounded-primary bg-slate-950 text-white hover:bg-slate-800 text-xs font-black uppercase tracking-widest border-none"
                onClick={handleImportJson}
                disabled={!jsonInput.trim() || importing}
              >
                {importing ? "Đang xử lý..." : "Nhập dữ liệu"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Add/Edit Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setIsFormModalOpen(false)}
          />
          <div className="relative w-full max-w-4xl bg-white rounded-primary shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                {currentCustomer.id ? "Hiệu chỉnh thông tin KH" : "Thêm mới khách hàng"}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên khách hàng</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 bg-white border border-slate-200 focus:border-accent outline-none rounded-primary text-sm font-bold"
                    value={currentCustomer.name || ""}
                    onChange={e => setCurrentCustomer({...currentCustomer, name: e.target.value})}
                  />
                </div>
                {/* Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số điện thoại</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 bg-white border border-slate-200 focus:border-accent outline-none rounded-primary text-sm font-bold font-mono"
                    value={currentCustomer.phone || ""}
                    onChange={e => setCurrentCustomer({...currentCustomer, phone: e.target.value})}
                  />
                </div>
                {/* Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sản phẩm quan tâm</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 bg-white border border-slate-200 focus:border-accent outline-none rounded-primary text-sm font-medium"
                    value={currentCustomer.product || ""}
                    onChange={e => setCurrentCustomer({...currentCustomer, product: e.target.value})}
                  />
                </div>
                {/* Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Báo giá / Mức giá</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 bg-white border border-slate-200 focus:border-accent outline-none rounded-primary text-sm font-bold"
                    value={currentCustomer.price || ""}
                    onChange={e => setCurrentCustomer({...currentCustomer, price: e.target.value})}
                  />
                </div>
                {/* Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mối quan hệ</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 bg-white border border-slate-200 focus:border-accent outline-none rounded-primary text-sm font-medium"
                    value={currentCustomer.relation || ""}
                    onChange={e => setCurrentCustomer({...currentCustomer, relation: e.target.value})}
                  />
                </div>
                {/* Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nguồn khách</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 bg-white border border-slate-200 focus:border-accent outline-none rounded-primary text-sm font-medium"
                    value={currentCustomer.source || ""}
                    onChange={e => setCurrentCustomer({...currentCustomer, source: e.target.value})}
                  />
                </div>
                {/* Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tài chính</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 bg-white border border-slate-200 focus:border-accent outline-none rounded-primary text-sm font-medium"
                    value={currentCustomer.finance || ""}
                    onChange={e => setCurrentCustomer({...currentCustomer, finance: e.target.value})}
                  />
                </div>
                {/* Field */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Người phụ trách</label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 bg-white border border-slate-200 focus:border-accent outline-none rounded-primary text-sm font-bold"
                    value={currentCustomer.owner || ""}
                    onChange={e => setCurrentCustomer({...currentCustomer, owner: e.target.value})}
                  />
                </div>
                {/* Full Width Field */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thông tin chi tiết (Information)</label>
                  <textarea
                    rows={4}
                    className="w-full p-4 bg-white border border-slate-200 focus:border-accent outline-none rounded-primary text-sm font-medium resize-none"
                    value={currentCustomer.information || ""}
                    onChange={e => setCurrentCustomer({...currentCustomer, information: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3 justify-end bg-white">
              <Button
                variant="outline"
                className="h-12 rounded-primary border-slate-200 text-xs font-bold px-6"
                onClick={() => setIsFormModalOpen(false)}
              >
                Hủy bỏ
              </Button>
              <Button
                className="h-12 rounded-primary bg-slate-950 text-white hover:bg-slate-800 text-xs font-black uppercase tracking-widest border-none px-8 shadow-xl"
                onClick={handleSaveCustomer}
                disabled={isSaving}
              >
                {isSaving ? "Đang lưu..." : "Lưu dữ liệu"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Unified Notification Modal */}
      <AnimatePresence>
        {notification.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNotification(prev => ({ ...prev, isOpen: false }))}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-primary shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mb-6",
                  notification.type === 'error' ? "bg-red-50" : "bg-orange-50"
                )}>
                  {notification.type === 'error' ? (
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  ) : (
                    <Info className="w-8 h-8 text-orange-500" />
                  )}
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">
                  {notification.title || "Thông báo"}
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                  {notification.message}
                </p>
                <div className="flex gap-3 w-full">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-primary border-slate-200 text-xs font-bold hover:bg-slate-50"
                    onClick={() => setNotification(prev => ({ ...prev, isOpen: false }))}
                  >
                    {notification.type === 'confirm' ? "Hủy bỏ" : "Đóng"}
                  </Button>
                  {notification.type === 'confirm' && notification.onConfirm && (
                    <Button
                      className="flex-1 h-12 rounded-primary bg-red-600 text-white hover:bg-red-700 text-xs font-black uppercase tracking-widest shadow-lg shadow-red-200 border-none"
                      onClick={notification.onConfirm}
                    >
                      Xác nhận
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
