"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { motion } from "framer-motion";

const mockOilPrices = [
  { id: 1, name: "Xăng RON 95-V", price: "24,500 VNĐ", change: "+250", trend: "up" },
  { id: 2, name: "Xăng RON 95-III", price: "23,800 VNĐ", change: "+200", trend: "up" },
  { id: 3, name: "Xăng E5 RON 92-II", price: "22,500 VNĐ", change: "+150", trend: "up" },
  { id: 4, name: "Dầu Điêzen 0.05S-II", price: "20,800 VNĐ", change: "-100", trend: "down" },
];

export default function OilPricesPage() {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-tight mb-3">
          Giá Xăng Dầu Hôm Nay
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Cập nhật liên tục để bạn chủ động tính toán chi phí vận hành cho dàn xe sơ mi rơ moóc.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockOilPrices.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:border-blue-200 transition-colors cursor-default group">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-blue-700">{item.price}</span>
                    <span className="text-sm text-slate-500">/ lít</span>
                  </div>
                </div>
                <div className={`flex flex-col items-end ${item.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                  <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-sm">
                    {item.trend === 'up' ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                    )}
                    <span className="font-semibold text-sm">{item.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 text-center text-sm text-slate-400">
        * Dữ liệu mang tính chất tham khảo (Mock Data).
      </div>
    </div>
  );
}
