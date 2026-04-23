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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-50 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] opacity-50 translate-y-1/2 -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-primary shadow-2xl overflow-hidden border border-slate-100">
          <div className="p-8 pb-4 text-center relative border-b border-slate-50">
            <Link
              href="/"
              className="absolute top-4 left-4 inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-accent transition-all uppercase tracking-widest z-20 bg-white/50 backdrop-blur-sm p-2 rounded-sm"
            >
              <ArrowLeft className="w-3 h-3" /> Quay lại
            </Link>

            <div className="flex justify-center my-10 py-2">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 bg-accent/20 rounded-primary blur-2xl animate-pulse" />
                <img
                  src="/images/admin-logo.png"
                  alt="Hatico Logo"
                  className="w-full h-full object-contain relative z-10"
                />
              </div>
            </div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mt-10">
              Hệ Thống Quản Trị
            </h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              Vui lòng đăng nhập để tiếp tục quản lý
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-8 pt-4 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                <Mail className="w-3 h-3" /> Email Admin
              </label>
              <input
                type="email"
                required
                placeholder="admin@hatico.com.vn"
                className="w-full h-12 px-4 rounded-sm border border-slate-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                <Lock className="w-3 h-3" /> Mật khẩu
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full h-12 px-4 rounded-sm border border-slate-200 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-sm flex gap-2 items-center"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full h-14 bg-slate-900 border-none text-white font-black uppercase tracking-widest rounded-none shadow-xl shadow-slate-900/20"
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

          <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
              Hệ thống bảo mật nội bộ HATICO International.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
