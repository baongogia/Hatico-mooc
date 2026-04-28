"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Search, RefreshCw, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Article } from "@/types/article";

export const ArticleList = () => {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  const [isEditing, setIsEditing] = React.useState(false);
  const [currentArticle, setCurrentArticle] = React.useState<Partial<Article>>({});

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("article")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching articles:", error);
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
      if (currentArticle.id) {
        // Update
        const { error } = await supabase
          .from("article")
          .update(currentArticle)
          .eq("id", currentArticle.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from("article")
          .insert([currentArticle]);
        if (error) throw error;
      }
      setIsEditing(false);
      setCurrentArticle({});
      fetchArticles();
    } catch (err) {
      console.error("Error saving article:", err);
      alert("Lỗi khi lưu bài viết.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
    try {
      const { error } = await supabase.from("article").delete().eq("id", id);
      if (error) throw error;
      fetchArticles();
    } catch (err) {
      console.error("Error deleting article:", err);
    }
  };

  const filteredArticles = articles.filter(a => 
    (a.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.type || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-primary shadow-sm border border-slate-200 animate-in fade-in">
        <h2 className="text-xl font-bold mb-6 text-slate-800">
          {currentArticle.id ? "Sửa bài viết" : "Thêm bài viết mới"}
        </h2>
        
        <div className="space-y-4 max-w-3xl">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Tiêu đề</label>
            <input 
              type="text" 
              className="w-full p-3 border border-slate-300 rounded-sm"
              value={currentArticle.title || ""}
              onChange={e => setCurrentArticle({...currentArticle, title: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Loại (Type)</label>
              <input 
                type="text" 
                className="w-full p-3 border border-slate-300 rounded-sm"
                value={currentArticle.type || ""}
                onChange={e => setCurrentArticle({...currentArticle, type: e.target.value})}
                placeholder="VD: Tin Tức, Khuyến Mãi..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tác giả (Owner)</label>
              <input 
                type="text" 
                className="w-full p-3 border border-slate-300 rounded-sm"
                value={currentArticle.owner || ""}
                onChange={e => setCurrentArticle({...currentArticle, owner: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Hình ảnh (URL)</label>
            <input 
              type="text" 
              className="w-full p-3 border border-slate-300 rounded-sm"
              value={currentArticle.image || ""}
              onChange={e => setCurrentArticle({...currentArticle, image: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nội dung (Description - Hỗ trợ HTML)</label>
            <textarea 
              rows={10}
              className="w-full p-3 border border-slate-300 rounded-sm"
              value={currentArticle.description || ""}
              onChange={e => setCurrentArticle({...currentArticle, description: e.target.value})}
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button onClick={handleSave} className="px-8">Lưu Bài Viết</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Hủy Bỏ</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in w-full h-full">
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-primary border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-sm text-sm font-semibold focus:outline-none focus:border-accent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest"
            onClick={fetchArticles}
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            Làm mới
          </Button>
          <Button
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest"
            onClick={() => {
              setCurrentArticle({});
              setIsEditing(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Thêm mới
          </Button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-primary overflow-hidden shadow-sm flex-1">
        <div className="overflow-x-auto h-full">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-900 text-white sticky top-0 z-10">
              <tr>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">ID</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Hình Ảnh</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Tiêu Đề</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Loại</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px]">Tác Giả</th>
                <th className="p-4 font-black uppercase tracking-widest text-[10px] text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Không tìm thấy bài viết nào.</td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-500">{article.id}</td>
                    <td className="p-4">
                      {article.image ? (
                        <div className="w-16 h-10 bg-slate-200 rounded-sm overflow-hidden">
                          <img src={article.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-10 bg-slate-100 rounded-sm border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">Trống</div>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-slate-800 max-w-[200px] truncate" title={article.title || ""}>
                      {article.title || "Chưa có tiêu đề"}
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded-sm text-[10px] font-black uppercase">
                        {article.type || "N/A"}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 text-xs">{article.owner || "N/A"}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-sm transition-colors"
                          onClick={() => {
                            setCurrentArticle(article);
                            setIsEditing(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-sm transition-colors"
                          onClick={() => handleDelete(article.id)}
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
    </div>
  );
};
