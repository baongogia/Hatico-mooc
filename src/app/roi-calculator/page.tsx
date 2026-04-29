"use client";

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const ROICalculatorContent = dynamic(
  () => import('./ROICalculatorContent'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100">
           <Loader2 className="w-6 h-6 text-slate-900 animate-spin" />
        </div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Đang khởi tạo hệ thống tính toán...</p>
      </div>
    )
  }
);

export default function Page() {
  return <ROICalculatorContent />;
}
