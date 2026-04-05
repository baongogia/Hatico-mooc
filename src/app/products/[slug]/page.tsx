"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/data/products";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const product = getProductBySlug(resolvedParams.slug);

  if (!product) {
    return notFound();
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center text-sm font-medium text-slate-500 gap-2">
          <Link href="/" className="hover:text-blue-600 transition-colors">Trang Chủ</Link>
          <span>/</span>
          <span className="text-slate-400">Sản Phẩm</span>
          <span>/</span>
          <span className="text-blue-800">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* --- Top Block: Hero & Quick Info --- */}
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          {/* Gallery Placeholder */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="w-full lg:w-3/5">
            <div className="aspect-4/3 bg-slate-200 rounded-primary border border-slate-300 flex flex-col items-center justify-center relative overflow-hidden group shadow-sm">
                <svg className="w-20 h-20 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <div className="mt-4 text-slate-500 font-medium">Hình Ảnh Sản Phẩm {product.name}</div>
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              {[1, 2, 3, 4].map(thumb => (
                 <div key={thumb} className="aspect-square bg-slate-200 rounded-sm border border-slate-300 hover:border-blue-500 cursor-pointer transition-colors" />
              ))}
            </div>
          </motion.div>

          {/* Product Summary */}
          <motion.div initial="hidden" animate="visible" variants={{ hidden: {opacity:0, x:20}, visible: {opacity:1, x:0, transition: {delay: 0.2}} }} className="w-full lg:w-2/5 flex flex-col">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">{product.name}</h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map(t => (
                <span key={t} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-sm border border-blue-100">{t}</span>
              ))}
            </div>

            <p className="text-slate-600 mb-8 leading-relaxed text-lg">
              {product.description}
            </p>

            <div className="bg-slate-100 p-6 rounded-primary border border-slate-200 mb-8">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Tóm Tắt Nhanh
              </h4>
              <ul className="space-y-3">
                <li className="flex justify-between items-center text-sm border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Tải trọng:</span>
                  <span className="font-bold text-slate-900">{product.specs.payload}</span>
                </li>
                <li className="flex justify-between items-center text-sm border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Kích thước:</span>
                  <span className="font-bold text-slate-900">{product.specs.dimension}</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Bảo hành:</span>
                  <span className="font-bold text-slate-900">Chính hãng Hatico</span>
                </li>
              </ul>
            </div>

            <div className="mt-auto flex flex-col sm:flex-row gap-4">
              <Button variant="accent" size="lg" className="w-full flex-1 text-base py-6 shadow-md">
                Nhận Báo Giá Ngay
              </Button>
              <Link href="/roi-calculator" className="w-full sm:w-auto">
                 <Button variant="outline" size="lg" className="w-full h-full bg-white text-base text-slate-700 border-slate-300">
                   Tính Hoàn Vốn
                 </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* --- Bottom Block: Specs & Features Tabs --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: T/S Table */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="lg:col-span-7">
            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden h-full">
              <CardHeader className="bg-slate-50 border-b border-slate-200 p-6">
                <CardTitle className="text-xl text-slate-800">Thông Số Kỹ Thuật Chi Tiết</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {[
                      { label: "Kích thước DxRxC", val: product.specs.dimension },
                      { label: "Tải trọng cho phép", val: product.specs.payload },
                      { label: "Khối lượng bản thân", val: product.specs.tareWeight },
                      { label: "Tổng tải trọng", val: product.specs.totalWeight },
                      { label: "Hệ thống trục", val: product.specs.axle },
                      { label: "Quy cách lốp", val: product.specs.tire },
                      { label: "Hệ thống treo", val: product.specs.suspension },
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                        <th className="py-4 px-6 text-sm font-semibold text-slate-500 w-1/3 bg-slate-50/30">{row.label}</th>
                        <td className="py-4 px-6 text-sm font-bold text-slate-800">{row.val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Features */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: {opacity:0, y:20}, visible: {opacity:1, y:0, transition: {delay: 0.2}} }} className="lg:col-span-5">
            <Card className="bg-blue-900 border-none text-white h-full overflow-hidden relative shadow-lg">
              <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-blue-800 rounded-full blur-3xl opacity-50" />
              <CardHeader className="p-8 pb-4 relative z-10">
                <CardTitle className="text-xl text-white flex items-center gap-3">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Đặc Điểm Vượt Trội
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 relative z-10">
                <ul className="space-y-6 mt-4">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="w-6 h-6 min-w-[24px] rounded-full bg-white/10 flex items-center justify-center mt-0.5 text-blue-200">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-blue-50 leading-relaxed text-sm flex-1">{feat}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
