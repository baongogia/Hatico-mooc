"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full text-center p-3">
      {/* 
        Hero Section - Premium Industrial Minimalism 
        Tập trung chính vào thông điệp và chuẩn bị chỗ cho Model 3D/Hình ảnh
      */}
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto space-y-6 z-10"
      >
        <span className="text-accent font-semibold tracking-widest uppercase text-sm">
          Thiết bị siêu trọng - Hiệu suất siêu tối đa
        </span>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
          HÒA VỐN TRONG <span className="text-transparent bg-clip-text bg-linear-to-r from-accent to-orange-500">18 THÁNG</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light">
          Cỗ máy kiếm tiền đắt giá và đáng tin cậy. Đầu tư thông minh cho doanh nghiệp vận tải của bạn với dòng sơ mi rơ moóc tiên tiến nhất.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
          <Button variant="accent" size="lg" className="w-full sm:w-auto text-base font-semibold">
            Tính ROI Ngay
          </Button>
          <Button variant="glass" size="lg" className="w-full sm:w-auto text-base">
            Xem Chi Tiết Kỹ Thuật
          </Button>
        </div>
      </motion.div>

      {/* 
        Giả lập khu vực Model 3D / Xe Sơ mi rơ moóc.
        Sử dụng framer-motion trượt từ dưới lên, mượt mà.
      */}
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        className="mt-16 w-full max-w-6xl relative h-[400px] md:h-[600px] rounded-primary glass-panel flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent z-10" />
        {/* Vùng này sau này sẽ là thẻ <Canvas> của react-three-fiber hoặc hình ảnh render chất lượng cao */}
        <div className="z-20 text-slate-500 flex flex-col items-center">
          <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="tracking-widest uppercase text-sm font-medium">Khu vực hiển thị 3D GSAP/Fiber</span>
        </div>
      </motion.div>
    </div>
  );
}
