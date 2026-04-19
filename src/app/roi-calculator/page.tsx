"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ROICalculatorPage() {
  const [cost, setCost] = useState<number>(500000000);
  const [revenue, setRevenue] = useState<number>(100000000);
  const [expense, setExpense] = useState<number>(40000000);

  const profit = revenue - expense;
  const monthsToBreakEven = profit > 0 ? Math.ceil(cost / profit) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 tracking-tight mb-3">
          Tính Lợi Nhuận ROI
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Công cụ dự toán thời gian thu hồi vốn đầu tư sơ mi rơ moóc dựa trên biến động thị trường.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">Thông Số Đầu Vào</CardTitle>
            <CardDescription>Nhập chi tiết các con số để hệ thống tính toán</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Giá trị xe (VNĐ)</label>
              <input 
                type="number" 
                value={cost} 
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-primary p-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Doanh thu dự kiến/tháng (VNĐ)</label>
              <input 
                type="number" 
                value={revenue} 
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-primary p-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Chi phí vận hành/tháng (VNĐ)</label>
              <input 
                type="number" 
                value={expense} 
                onChange={(e) => setExpense(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-primary p-3 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <CardTitle className="text-xl text-blue-900">Kết Quả Dự Toán</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-sm">
              <div className="text-sm font-medium text-slate-500 mb-1">Lợi nhuận gộp / tháng</div>
              <div className="text-3xl font-black text-slate-800">
                {new Intl.NumberFormat('vi-VN').format(profit)} <span className="text-lg text-slate-500 font-normal">VNĐ</span>
              </div>
            </div>

            <div className="bg-blue-900 p-6 rounded-sm shadow-lg shadow-blue-950/20 text-white text-center">
              <div className="text-sm font-medium mb-2 opacity-90">Thời gian thu hồi vốn:</div>
              <div className="text-5xl font-black mb-2 animate-pulse">
                {monthsToBreakEven > 0 ? `${monthsToBreakEven} Tháng` : "---"}
              </div>
              <div className="text-xs opacity-80">(Dựa trên số liệu trung bình)</div>
            </div>

            <Button variant="accent" className="w-full py-4 mt-2">
              Lưu Kết Quả & Nhận Báo Giá
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
