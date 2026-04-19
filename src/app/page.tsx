"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import { ProductCategoryShowcase } from "@/components/ProductCategoryShowcase";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export default function Home() {
  return (
    <div className="flex flex-col gap-24 pb-24 w-full">
      {/* --- 1. HERO SECTION --- */}
      <section className="relative w-full min-h-[95vh] rounded-primary flex flex-col items-center justify-center overflow-hidden font-sans border border-blue-900/30 shadow-2xl bg-slate-950">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
          >
            <source src="/video/around.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Premium Cinematic Overlays - Brand Primary Blue Theme */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/80 via-blue-950/50 to-slate-950/95" />
        <div className="absolute inset-0 z-0 bg-blue-900/10 mix-blend-color" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background via-background/80 to-transparent z-0 pointer-events-none" />

        {/* Dynamic Light Leak Effects (Blue/Cyan) */}
        <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center mt-12 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 inline-flex items-center gap-3 border border-blue-500/30 bg-blue-500/10 backdrop-blur-md px-6 py-2 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.15)]"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            <span className="text-blue-200 font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs">
              Giải Pháp Vận Tải Hiện Đại
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col gap-4 mb-8"
          >
            <span className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tight text-white leading-[1.1] drop-shadow-2xl">
              SƠ MI RƠ MOÓC
            </span>
            <span className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-400 leading-tight">
              ĐỈNH CAO CHẤT LƯỢNG
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl font-light leading-relaxed mb-12"
          >
            Giải pháp vận tải tối ưu mang lại khả năng hòa vốn nhanh chóng.
            Thiết kế bền bỉ, an toàn và tối đa hóa lợi nhuận.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_rgba(37,99,235,0.6)] border-none text-base h-14 px-10 rounded-full transition-all duration-300"
            >
              Nhận Tư Vấn Ngay
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm h-14 px-10 rounded-full transition-all duration-300"
            >
              Khám Phá Sản Phẩm
            </Button>
          </motion.div>
        </div>

        {/* Subtle bottom info anchors pushed far down to the absolute corners */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-8 left-0 w-full justify-between items-end px-8 md:px-16 hidden md:flex z-20 pointer-events-none"
        >
          <div className="flex flex-col items-start gap-1">
            <span className="text-white/90 font-bold text-lg tracking-wide flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              T700
            </span>
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Thép Cường Độ Cao
            </span>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-white/90 font-bold text-lg tracking-wide flex items-center gap-2">
              10 Năm
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            </span>
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Độ Bền Ước Tính
            </span>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20 group"
          onClick={() =>
            window.scrollTo({
              top: window.innerHeight * 0.9,
              behavior: "smooth",
            })
          }
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-6 h-10 border border-white/20 group-hover:border-orange-500/50 rounded-full flex justify-center p-1.5 transition-colors bg-black/20 backdrop-blur-sm"
          >
            <div className="w-1 h-2 bg-white/50 group-hover:bg-orange-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* --- 2. TRUST INDICATORS --- */}
      <section className="w-full max-w-7xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-200"
        >
          {[
            { value: "15+", label: "Năm Kinh Nghiệm" },
            { value: "5,000+", label: "Moóc Đã Bàn Giao" },
            { value: "100%", label: "Linh Kiện Chính Hãng" },
            { value: "24/7", label: "Hỗ Trợ Kỹ Thuật" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="flex flex-col items-center justify-center p-4 text-center"
            >
              <div className="text-4xl md:text-5xl font-black text-blue-900 mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- 3. CORE ADVANTAGES (BENTO GRID) --- */}
      <section className="w-full max-w-7xl mx-auto px-6 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-12 md:text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Công Nghệ Định Hình Tương Lai
          </h2>
          <p className="text-lg text-slate-600">
            Những tiêu chuẩn kỹ thuật làm nên sự khác biệt của Hatico, đem lại
            độ bền vượt thời gian cho mỗi chuyến hàng.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px]">
          {/* Box 1 - Big (Span 2 cols) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="md:col-span-2 bg-blue-900 rounded-primary p-8 md:p-10 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute right-0 top-0 w-64 h-64 bg-blue-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />
            <div className="relative z-10 w-12 h-12 bg-white/10 rounded-sm flex items-center justify-center mb-6">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                ></path>
              </svg>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">
                Thép Cường Độ Cao T700
              </h3>
              <p className="text-blue-200">
                Sử dụng hoàn toàn bằng thép chuyên dụng siêu cường, giảm trọng
                lượng xác xe, tăng tải trọng hàng hóa mà không làm ảnh hưởng
                tính bền gan.
              </p>
            </div>
          </motion.div>

          {/* Box 2 - Small */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-slate-100 rounded-primary p-8 border border-slate-200 transition-colors hover:border-blue-300 flex flex-col justify-center"
          >
            <div className="w-12 h-12 bg-white rounded-sm border border-slate-200 flex items-center justify-center mb-4 text-blue-700 shadow-sm">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Robot Hàn Tự Động
            </h3>
            <p className="text-slate-600 text-sm">
              Cho mối hàn tinh xảo, đồng nhất và có khả năng chịu lực tác động
              vượt trội.
            </p>
          </motion.div>

          {/* Box 3 - Small */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="bg-slate-100 rounded-primary p-8 border border-slate-200 transition-colors hover:border-blue-300 flex flex-col justify-center"
          >
            <div className="w-12 h-12 bg-white rounded-sm border border-slate-200 flex items-center justify-center mb-4 text-blue-700 shadow-sm">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Sơn Tĩnh Điện 2 Lớp
            </h3>
            <p className="text-slate-600 text-sm">
              Lớp sơn lót tĩnh điện & lớp sơn phủ bám chặt, cam kết chống gỉ sét
              trong môi trường khắc nghiệt tới 10 năm.
            </p>
          </motion.div>

          {/* Box 4 - Big (Span 2 cols) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="md:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-primary p-8 md:p-10 flex flex-col justify-end relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <svg
                className="w-48 h-48 rotate-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1"
              >
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-slate-200 text-xs font-semibold rounded-sm mb-4 border border-white/20 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />{" "}
                Tối ưu ROI
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Giá Trị Thanh Khoản Lên Tới 70%
              </h3>
              <p className="text-slate-300 max-w-lg">
                Nhờ độ bền chứng thực qua năm tháng, moóc Hatico luôn giữ giá
                rất cao trên thị trường xe lướt, giảm thiểu rủi ro đầu tư dài
                hạn.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- 4. DYNAMIC PRODUCT SHOWCASE --- */}
      <ProductCategoryShowcase />

      {/* --- 4.5. ĐỐI TÁC YÊN TÂM --- */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12 border-y border-slate-200 bg-white/50">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-8"
        >
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Đồng Hành Cùng Các Doanh Nghiệp Hàng Đầu
          </h3>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-300"
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="w-32 h-12 bg-slate-200 rounded-sm flex items-center justify-center font-bold text-slate-500"
            >
              LOGO {i}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- 4.6. HÌNH ẢNH BÀN GIAO --- */}
      <section className="w-full max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-10 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Niềm Vui Chạm Ngõ
          </h2>
          <p className="text-lg text-slate-600">
            Hàng ngàn chuyến xe lăn bánh là hàng ngàn sự tin tưởng mà khách hàng
            trao gửi cho Hatico.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((idx) => (
            <motion.div
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="aspect-square bg-slate-100 rounded-primary overflow-hidden relative group border border-slate-200 cursor-pointer"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-slate-300 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/60 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <span className="text-white font-semibold flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ></path>
                  </svg>
                  Bàn Giao {idx}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- 4.7. ĐÁNH GIÁ KHÁCH HÀNG --- */}
      <section className="w-full max-w-7xl mx-auto px-6 py-6 pb-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              name: "Anh Hoàng",
              role: "Chủ xe tải đường dài",
              quote:
                "Từ ngày chuyển sang dùng Moóc Hatico, tôi hoàn toàn yên tâm. Xe chạy đầm, vỏ dày dặn chở quá tải vô tư mà không lo nứt gãy sườn.",
            },
            {
              name: "Chị Lan Anh",
              role: "GĐ Vận Tải Logistics",
              quote:
                "Dịch vụ sau bán hàng là điểm tôi ưng ý nhất. Mọi vấn đề kỹ thuật đều được đội ngũ Hatico hỗ trợ 24/7 cực kì nhanh chóng.",
            },
            {
              name: "Anh Tuấn Cường",
              role: "Doanh nghiệp VLXD",
              quote:
                "Moóc Ben của Hatico phải nói là 'nồi đồng cối đá'. Lên dốc nhả ben đất đá mượt mượt, ty ben rất khỏe, thu hồi vốn nhanh.",
            },
          ].map((fb, i) => (
            <motion.div key={i} variants={fadeInUp} className="h-full">
              <Card className="h-full bg-slate-50 border-slate-200 hover:shadow-md transition-shadow flex flex-col">
                <CardContent className="p-8 flex-1 flex flex-col">
                  <div className="flex text-yellow-500 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-700 italic mb-6 leading-relaxed flex-1">
                    "{fb.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-800">
                      {fb.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        {fb.name}
                      </div>
                      <div className="text-xs text-slate-500">{fb.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- 5. INTERACTIVE TOOL CALLOUTS --- */}
      <section className="w-full max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="bg-blue-50 rounded-primary border border-blue-100 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="p-1.5 bg-blue-100 rounded-sm">
                <svg
                  className="w-5 h-5 text-blue-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </span>
              <span className="font-semibold text-blue-900 tracking-wide text-sm uppercase">
                Công Cụ Độc Quyền
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Tính Toán Đầu Tư. Nắm Bắt Cơ Hội.
            </h2>
            <p className="text-slate-600">
              Sử dụng bộ công cụ theo dõi giá xăng dầu thời gian thực và mô
              phỏng hoàn vốn ROI để chủ động kiểm soát tài chính cho đội xe của
              bạn.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link href="/roi-calculator" className="w-full">
              <Button variant="accent" size="lg" className="w-full shadow-md">
                Tính ROI Ngay
              </Button>
            </Link>
            <Link href="/oil-prices" className="w-full">
              <Button variant="outline" size="lg" className="w-full bg-white">
                Xem Giá Xăng Dầu
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* --- 6. BOTTOM CTA --- */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-12 pb-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-blue-100/50 rounded-full flex items-center justify-center border-4 border-white shadow-sm mb-6">
            <svg
              className="w-8 h-8 text-blue-700"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Sẵn Sàng Nâng Tầm Đội Xe?
          </h2>
          <p className="text-lg text-slate-500 mb-10 max-w-2xl">
            Đội ngũ kỹ sư và chuyên viên tư vấn của Hatico luôn sẵn sàng khảo
            sát và hỗ trợ bạn cấu hình sản phẩm phù hợp nhất.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
            <input
              type="text"
              placeholder="Số điện thoại của bạn..."
              className="w-full p-4 rounded-primary border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900"
            />
            <Button
              variant="accent"
              size="lg"
              className="w-full sm:w-auto whitespace-nowrap px-8 py-4"
            >
              Gửi Yêu Cầu
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            * Chuyên viên sẽ liên hệ lại trong vòng 15 phút.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
