"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { Plus, Search, RefreshCw, Trash2, Edit, Save, X, Globe, User, Tag, Image as ImageIcon, Type, Layout, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Article } from "@/types/article";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { 
    ssr: false,
    loading: () => <div className="h-64 bg-slate-100 animate-pulse rounded-primary" />
});
import "react-quill-new/dist/quill.snow.css";

// Helper to generate slug
const generateSlug = (text: string) => {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/([^0-9a-z-\s])/g, "")
        .replace(/(\s+)/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
};

export const ArticleList = () => {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  const [isEditing, setIsEditing] = React.useState(false);
  const [currentArticle, setCurrentArticle] = React.useState<Partial<Article>>({});
  
  // Notification Modal State
  const [notification, setNotification] = React.useState<{
    isOpen: boolean;
    type: 'error' | 'confirm';
    title?: string;
    message: string;
    onConfirm?: () => void;
  }>({ isOpen: false, type: 'error', message: '' });

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("article")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching articles:", error);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Lỗi tải dữ liệu',
        message: 'Không thể tải danh sách bài viết. Mã lỗi: ' + error.message
      });
    } else {
      setArticles(data || []);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchArticles();
  }, []);

  const handleSave = async () => {
    try {
      const finalArticle = {
        ...currentArticle,
        slug: currentArticle.slug || (currentArticle.title ? generateSlug(currentArticle.title) : null)
      };

      if (finalArticle.id) {
        const { error } = await supabase
          .from("article")
          .update(finalArticle)
          .eq("id", finalArticle.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("article")
          .insert([finalArticle]);
        if (error) throw error;
      }
      setIsEditing(false);
      setCurrentArticle({});
      fetchArticles();
    } catch (err) {
      console.error("Error saving article:", err);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Lỗi lưu bài viết',
        message: "Đã có lỗi xảy ra trong quá trình lưu. Vui lòng thử lại sau."
      });
    }
  };

  const handleDeleteArticle = (id: number) => {
    setNotification({
      isOpen: true,
      type: 'confirm',
      title: 'Xác nhận xóa bài viết',
      message: 'Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống và không thể truy cập lại.',
      onConfirm: async () => {
        try {
          const { error } = await supabase.from("article").delete().eq("id", id);
          if (error) throw error;
          setNotification(prev => ({ ...prev, isOpen: false }));
          fetchArticles();
        } catch (err) {
          console.error("Error deleting article:", err);
          setNotification({
            isOpen: true,
            type: 'error',
            title: 'Lỗi xóa dữ liệu',
            message: "Đã có lỗi xảy ra khi xóa bài viết. Vui lòng thử lại."
          });
        }
      }
    });
  };

  const filteredArticles = articles.filter(a => 
    (a.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.type || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  if (isEditing) {
    return (
      <div className="bg-white p-0 rounded-primary shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-4 duration-500 overflow-hidden flex flex-col h-full max-h-[90vh]">
        {/* Editor Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 flex items-center justify-center rounded-primary">
                    <Edit className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-950 uppercase tracking-tighter">
                    {currentArticle.id ? "Hiệu chỉnh nội dung" : "Khởi tạo bài viết"}
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hatico Media Portal • Rich Text Editor</p>
                </div>
            </div>
            <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsEditing(false)} className="gap-2 rounded-primary border-slate-200 h-12 px-6 text-xs font-bold hover:bg-slate-50 transition-all">
                    <X className="w-4 h-4" /> Hủy bỏ
                </Button>
                <Button onClick={handleSave} className="gap-2 rounded-primary bg-slate-950 text-white hover:bg-slate-800 h-12 px-10 text-xs font-black uppercase tracking-widest shadow-xl transition-all border-none">
                    <Save className="w-4 h-4" /> Lưu bài viết
                </Button>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30 no-scrollbar">
            <div className="max-w-6xl mx-auto space-y-10">
                
                {/* Visual Block 1: Identification */}
                <div className="bg-white p-8 border border-slate-200 shadow-sm space-y-8 rounded-primary">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Title Field */}
                        <div className="lg:col-span-8 flex flex-col">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                                <Type className="w-3 h-3" /> Tiêu đề bài viết
                            </label>
                            <input 
                                type="text" 
                                className="w-full h-16 px-6 bg-slate-50 border-2 border-transparent border-b-slate-200 focus:border-accent focus:bg-white transition-all outline-none text-xl font-black tracking-tight placeholder:text-slate-200 rounded-primary"
                                value={currentArticle.title || ""}
                                onChange={e => {
                                    const title = e.target.value;
                                    setCurrentArticle({...currentArticle, title, slug: generateSlug(title)});
                                }}
                                placeholder="Nhập tiêu đề đầy đủ và thu hút..."
                            />
                        </div>

                        {/* Category Field */}
                        <div className="lg:col-span-4 flex flex-col">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                                <Tag className="w-3 h-3" /> Phân loại
                            </label>
                            <input 
                                type="text" 
                                className="w-full h-16 px-6 bg-slate-50 border-2 border-transparent border-b-slate-200 focus:border-accent focus:bg-white transition-all outline-none text-xs font-black uppercase tracking-widest rounded-primary"
                                value={currentArticle.type || ""}
                                onChange={e => setCurrentArticle({...currentArticle, type: e.target.value})}
                                placeholder="TIN TỨC / SỰ KIỆN"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Slug Field */}
                        <div className="flex flex-col">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                                <Globe className="w-3 h-3" /> Đường dẫn SEO
                            </label>
                            <input 
                                type="text" 
                                className="w-full h-12 px-4 bg-white border border-slate-200 text-xs font-bold text-slate-500 focus:border-accent outline-none rounded-primary"
                                value={currentArticle.slug || ""}
                                onChange={e => setCurrentArticle({...currentArticle, slug: e.target.value})}
                            />
                        </div>

                        {/* Author Field */}
                        <div className="flex flex-col">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                                <User className="w-3 h-3" /> Tác giả
                            </label>
                            <input 
                                type="text" 
                                className="w-full h-12 px-4 bg-white border border-slate-200 text-xs font-bold focus:border-accent outline-none rounded-primary"
                                value={currentArticle.owner || ""}
                                onChange={e => setCurrentArticle({...currentArticle, owner: e.target.value})}
                            />
                        </div>

                        {/* Image URL Field */}
                        <div className="flex flex-col">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                                <ImageIcon className="w-3 h-3" /> Ảnh đại diện (URL)
                            </label>
                            <input 
                                type="text" 
                                className="w-full h-12 px-4 bg-white border border-slate-200 text-[10px] font-mono focus:border-accent outline-none rounded-primary"
                                value={currentArticle.image || ""}
                                onChange={e => setCurrentArticle({...currentArticle, image: e.target.value})}
                                placeholder="https://image-url.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Visual Block 2: Summary */}
                <div className="bg-white p-8 border border-slate-200 shadow-sm rounded-primary">
                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                        <Layout className="w-3 h-3" /> Mô tả tóm tắt (Description)
                    </label>
                    <textarea 
                        rows={4}
                        className="w-full p-6 bg-slate-50 border border-slate-200 focus:bg-white focus:border-accent transition-all outline-none text-sm font-medium leading-relaxed rounded-primary"
                        value={currentArticle.description || ""}
                        onChange={e => setCurrentArticle({...currentArticle, description: e.target.value})}
                        placeholder="Viết một đoạn tóm tắt ngắn để thu hút người đọc khi hiển thị ở danh sách..."
                    />
                </div>

                {/* Visual Block 3: Rich Content */}
                <div className="bg-white border border-slate-200 shadow-sm mb-20 overflow-hidden rounded-primary">
                    <div className="px-8 py-4 bg-slate-900 flex items-center justify-between">
                        <label className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Nội dung chi tiết bài viết</label>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                    </div>
                    <div className="quill-wrapper">
                        <ReactQuill 
                            theme="snow"
                            value={currentArticle.content || ""}
                            onChange={content => setCurrentArticle({...currentArticle, content})}
                            modules={quillModules}
                            className="text-base"
                        />
                    </div>
                </div>
            </div>
        </div>
        
        <style jsx global>{`
            .quill-wrapper .ql-toolbar.ql-snow { 
                border: none !important; 
                border-bottom: 1px solid #e2e8f0 !important; 
                background: #f8fafc; 
                padding: 15px 32px !important; 
                position: sticky;
                top: 0;
                z-index: 20;
            }
            .quill-wrapper .ql-container.ql-snow { 
                border: none !important; 
                font-family: inherit; 
                font-size: 17px; 
            }
            .quill-wrapper .ql-editor { 
                min-height: 500px; 
                padding: 48px 64px !important; 
                line-height: 1.6; 
                color: #1e293b;
            }
            .quill-wrapper .ql-editor h1 { font-weight: 900; font-size: 2.5em; margin-bottom: 1rem; letter-spacing: -0.05em; line-height: 1.2; }
            .quill-wrapper .ql-editor h2 { font-weight: 800; font-size: 1.8em; margin-top: 1.5rem; margin-bottom: 0.75rem; letter-spacing: -0.03em; line-height: 1.2; }
            .quill-wrapper .ql-editor p { margin-bottom: 1rem; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in w-full h-full p-2">
      {/* List Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 border border-slate-200 shadow-sm rounded-primary">
        <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-accent rounded-full" />
            <div>
                <h1 className="text-xl font-black text-slate-950 uppercase tracking-tighter leading-none">Quản lý tin tức</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tổng cộng {articles.length} bài viết hiện có</p>
            </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tiêu đề hoặc loại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 h-12 border border-slate-200 bg-slate-50 focus:bg-white focus:border-accent outline-none text-xs font-bold transition-all rounded-primary"
                />
            </div>
            <Button
                variant="outline"
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest h-12 px-6 border-slate-200 hover:bg-slate-50 rounded-primary"
                onClick={fetchArticles}
            >
                <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
                Làm mới
            </Button>
            <Button
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-slate-950 text-white hover:bg-slate-800 h-12 px-8 shadow-xl transition-all border-none rounded-primary"
                onClick={() => {
                  setCurrentArticle({ content: "", type: "TIN TỨC", owner: "Ban biên tập Hatico" });
                  setIsEditing(true);
                }}
            >
                <Plus className="w-4 h-4" />
                Viết bài mới
            </Button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white border border-slate-200 overflow-hidden shadow-sm flex-1 rounded-primary">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-900 text-white sticky top-0 z-10">
              <tr>
                <th className="p-5 font-black uppercase tracking-widest text-[9px] border-r border-white/5">ID</th>
                <th className="p-5 font-black uppercase tracking-widest text-[9px] border-r border-white/5 text-center">Preview</th>
                <th className="p-5 font-black uppercase tracking-widest text-[9px] border-r border-white/5">Nội dung & Đường dẫn</th>
                <th className="p-5 font-black uppercase tracking-widest text-[9px] border-r border-white/5">Phân loại</th>
                <th className="p-5 font-black uppercase tracking-widest text-[9px] border-r border-white/5">Tác giả</th>
                <th className="p-5 font-black uppercase tracking-widest text-[9px] text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-32 text-center">
                    <div className="inline-block w-10 h-10 border-4 border-slate-100 border-t-accent rounded-full animate-spin" />
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-32 text-center">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-300">Không có dữ liệu hiển thị</p>
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-5 font-mono text-[10px] text-slate-400 border-r border-slate-50">#0{article.id}</td>
                    <td className="p-5 border-r border-slate-50">
                      <div className="w-20 h-12 mx-auto bg-slate-100 border border-slate-200 overflow-hidden relative group-hover:shadow-md transition-shadow rounded-sm">
                        {article.image ? (
                            <img src={article.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-slate-300">MISSING</div>
                        )}
                      </div>
                    </td>
                    <td className="p-5 border-r border-slate-50">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-black text-slate-950 tracking-tight text-sm line-clamp-1 group-hover:text-accent transition-colors">{article.title || "Chưa có tiêu đề"}</span>
                        <div className="flex items-center gap-2">
                            <Globe className="w-3 h-3 text-slate-300" />
                            <span className="text-[10px] text-slate-400 font-bold tracking-tight truncate max-w-[300px]">{article.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 border-r border-slate-50">
                      <span className="inline-block px-3 py-1 bg-slate-950 text-white text-[8px] font-black uppercase tracking-widest rounded-primary">
                        {article.type || "N/A"}
                      </span>
                    </td>
                    <td className="p-5 text-slate-600 font-bold text-[10px] uppercase tracking-widest border-r border-slate-50">{article.owner || "N/A"}</td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="w-9 h-9 flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-950 hover:text-white transition-all shadow-sm rounded-primary"
                          onClick={() => {
                            setCurrentArticle(article);
                            setIsEditing(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-sm rounded-primary"
                          onClick={() => handleDeleteArticle(article.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Unified Notification Modal */}
      <AnimatePresence>
        {notification.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNotification(prev => ({ ...prev, isOpen: false }))}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-primary shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mb-6",
                  notification.type === 'error' ? "bg-red-50" : "bg-orange-50"
                )}>
                  {notification.type === 'error' ? (
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  ) : (
                    <Info className="w-8 h-8 text-orange-500" />
                  )}
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">
                  {notification.title || "Thông báo"}
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                  {notification.message}
                </p>
                <div className="flex gap-3 w-full">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-primary border-slate-200 text-xs font-bold hover:bg-slate-50"
                    onClick={() => setNotification(prev => ({ ...prev, isOpen: false }))}
                  >
                    {notification.type === 'confirm' ? "Hủy bỏ" : "Đóng"}
                  </Button>
                  {notification.type === 'confirm' && notification.onConfirm && (
                    <Button
                      className="flex-1 h-12 rounded-primary bg-red-600 text-white hover:bg-red-700 text-xs font-black uppercase tracking-widest shadow-lg shadow-red-200 border-none"
                      onClick={notification.onConfirm}
                    >
                      Xác nhận
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
