"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestPage() {
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      console.log("Fetching trailers from client...");
      const { data: trailers, error: err } = await supabase
        .from("trailers")
        .select("*");

      if (err) {
        setError(err);
      } else {
        setData(trailers);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <div className="p-8">Đang tải...</div>;
  if (error) return <div className="p-8 text-red-500">Lỗi: {JSON.stringify(error)}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test (Client Side)</h1>
      <p className="text-sm text-slate-500 mb-4">
        Bây giờ bạn có thể kiểm tra tab <b>Network</b> trong Developer Tools. 
        Tìm các request có tên <code>rest/v1/trailers?...</code>
      </p>
      <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[500px]">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
