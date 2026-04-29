"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Phone, User, MessageSquare, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useContactModal } from "@/context/ContactContext";
import { cn } from "@/lib/utils";

export const ContactModal = () => {
  const { isOpen, type, closeContactModal } = useContactModal();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        closeContactModal();
      }, 3000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeContactModal}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-sm shadow-2xl overflow-hidden border border-slate-200"
        >
          {/* Header */}
          <div className="relative h-32 bg-slate-950 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-transparent" />
            
            <button 
              onClick={closeContactModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative z-10 text-center">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">
                {type === 'quote' ? 'Nhận Báo Giá Chi Tiết' : 'Tư Vấn Chuyên Sâu'}
              </h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                Hatico - Đồng hành cùng mọi cung đường
              </p>
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 text-center"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Gửi yêu cầu thành công!</h3>
                  <p className="text-slate-500 text-sm">Chuyên viên của Hatico sẽ liên hệ lại với bạn trong vòng 15 phút.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1.5 block">Họ và tên</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          required
                          type="text" 
                          placeholder="Nguyễn Văn A"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm font-bold"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1.5 block">Số điện thoại</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          required
                          type="tel" 
                          placeholder="09xx xxx xxx"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm font-bold"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1.5 block">Lời nhắn (Tùy chọn)</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                        <textarea 
                          rows={3}
                          placeholder="Tôi muốn tư vấn về Moóc Ben..."
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm font-bold resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading}
                    variant="accent" 
                    className="w-full h-14 font-black uppercase tracking-widest text-xs"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        Gửi Yêu Cầu <Send className="w-4 h-4" />
                      </span>
                    )}
                  </Button>

                  <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-[0.1em]">
                    Cam kết bảo mật thông tin khách hàng tuyệt đối
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
