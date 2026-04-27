"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface QuoteRequestFormProps {
  productId?: string;
  productPrice?: number;
  onSuccess?: () => void;
}

export const QuoteRequestForm = ({ productId, productPrice, onSuccess }: QuoteRequestFormProps) => {
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    note: "",
  });
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone) {
      setErrorMessage("Vui lòng nhập số điện thoại");
      return;
    }

    setStatus("loading");
    try {
      const { error } = await supabase.from("customer").insert([
        {
          name: formData.name,
          phone: formData.phone,
          note: formData.note,
          product_id: productId,
          price: productPrice,
        },
      ]);

      if (error) throw error;

      setStatus("success");
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      setStatus("error");
      setErrorMessage(error.message || "Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  if (status === "success") {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Gửi yêu cầu thành công!</h3>
        <p className="text-slate-500 mt-2">Hatico sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-2">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Họ & Tên</label>
        <input
          id="name"
          type="text"
          placeholder="Nhập tên của bạn"
          className="w-full h-11 px-4 rounded-primary border border-slate-100 bg-slate-50 focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none transition-all text-sm font-medium"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Số Điện Thoại *</label>
        <input
          id="phone"
          type="tel"
          required
          placeholder="09xx xxx xxx"
          className="w-full h-11 px-4 rounded-primary border border-slate-100 bg-slate-50 focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none transition-all text-sm font-medium"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="note" className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] px-1">Ghi chú thêm</label>
        <textarea
          id="note"
          rows={3}
          placeholder="Bạn cần tư vấn thêm về điều gì?"
          className="w-full p-4 rounded-primary border border-slate-100 bg-slate-50 focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none transition-all text-sm font-medium resize-none"
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
        />
      </div>

      {status === "error" && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-[11px] rounded-primary flex gap-2 items-center">
          <AlertCircle className="w-3.5 h-3.5" />
          {errorMessage}
        </div>
      )}

      <Button 
        type="submit" 
        variant="accent"
        size="lg" 
        className="w-full h-12 text-[10px] font-black uppercase tracking-[0.2em] rounded-primary shadow-xl shadow-accent/10 mt-1"
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Đang Xử Lý...
          </>
        ) : (
          "Gửi Yêu Cầu Báo Giá"
        )}
      </Button>

      <p className="text-[10px] text-slate-400 italic text-center">
        * Thông tin của bạn được bảo mật tuyệt đối theo chính sách của Hatico.
      </p>
    </form>
  );
};
