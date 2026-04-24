"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Lock, Mail, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Email hoặc mật khẩu không chính xác.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Image Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/IMG_8511.jpg" 
          alt="Background" 
          className="w-full h-full object-cover opacity-50 grayscale-[0.2]" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 to-slate-900/80" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-primary shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden border border-white/20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          
          <div className="p-8 pb-4 text-center relative border-b border-white/10">
            <Link
              href="/"
              className="absolute top-4 left-4 inline-flex items-center gap-2 text-[10px] font-black text-white/50 hover:text-white transition-all uppercase tracking-widest z-20 bg-white/10 backdrop-blur-sm p-2 rounded-sm border border-white/10"
            >
              <ArrowLeft className="w-3 h-3" /> Quay lại
            </Link>

            <div className="flex justify-center -mb-4">
              <div className="relative w-full h-40 px-0">
                <img
                  src="/images/Logo.png"
                  alt="Hatico Logo"
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight -mt-2">
              Hệ Thống Quản Trị
            </h1>
            <p className="text-sm text-white/60 mt-2 font-medium">
              Vui lòng đăng nhập để tiếp tục quản lý
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-8 pt-6 flex flex-col gap-6 relative">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-white/70 tracking-widest flex items-center gap-2">
                <Mail className="w-3 h-3" /> Email Admin
              </label>
              <input
                type="email"
                required
                placeholder="admin@hatico.com.vn"
                className="w-full h-12 px-4 rounded-sm bg-white/5 border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/20 outline-none transition-all text-sm font-medium text-white placeholder:text-white/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-white/70 tracking-widest flex items-center gap-2">
                <Lock className="w-3 h-3" /> Mật khẩu
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full h-12 px-4 rounded-sm bg-white/5 border border-white/10 focus:border-white/30 focus:ring-1 focus:ring-white/20 outline-none transition-all text-sm font-medium text-white placeholder:text-white/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/30 text-red-200 text-xs rounded-sm flex gap-2 items-center backdrop-blur-md"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full h-14 bg-white text-slate-900 hover:bg-slate-100 font-black uppercase tracking-widest rounded-none shadow-xl shadow-black/20 mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Đang Đăng Nhập...
                </>
              ) : (
                "Đăng Nhập Ngay"
              )}
            </Button>
          </form>

          <div className="p-6 bg-white/5 border-t border-white/10 text-center relative">
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest italic">
              Hệ thống bảo mật nội bộ HATICO International.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
