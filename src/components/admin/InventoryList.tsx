"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";
import { Search, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Agency {
  id: number;
  name: string;
  ano_name: string;
}

interface Trailer {
  name: string;
  category: string;
  ano_name?: string;
}

interface InventoryItem {
  id: number;
  name: string;
  agency: string | number;
  value: number;
  agency_info?: { id: number; name: string; ano_name: string };
}

export const InventoryList = () => {
  const [agencies, setAgencies] = React.useState<Agency[]>([]);
  const [inventory, setInventory] = React.useState<InventoryItem[]>([]);
  const [productTypes, setProductTypes] = React.useState<
    { name: string; ano_name?: string }[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    // Fetch agencies and inventory with joined agency name
    const [agenciesRes, inventoryRes, trailersRes] = await Promise.all([
      supabase.from("agency").select("*").order("id", { ascending: true }),
      supabase.from("inventory").select("*").order("id", { ascending: true }),
      supabase
        .from("trailers")
        .select("name, category, ano_name")
        .order("category", { ascending: true })
        .order("name", { ascending: true }),
    ]);

    if (agenciesRes.error)
      console.error("Error fetching agencies:", agenciesRes.error);
    if (inventoryRes.error)
      console.error("Error fetching inventory:", inventoryRes.error);
    if (trailersRes.error)
      console.error("Error fetching trailers:", trailersRes.error);

    const agenciesData = agenciesRes.data || [];
    // Manually link agency info to inventory items
    const inventoryData = (inventoryRes.data || []).map((item) => ({
      ...item,
      agency_info: agenciesData.find(
        (a) => String(a.id) === String(item.agency),
      ),
    })) as InventoryItem[];

    setAgencies(agenciesData);
    setInventory(inventoryData);

    // Combine product types and maintain the sort order from trailers
    const trailers = (trailersRes.data as Trailer[]) || [];
    const trailerNames = trailers.map((t) => t.name);
    const inventoryNames = (inventoryRes.data || []).map((i) => i.name);

    // Merge while preserving trailer order for known products
    const allNames = Array.from(new Set([...trailerNames, ...inventoryNames]));

    // Map names to their info (especially ano_name)
    const productInfoMap = new Map<
      string,
      { name: string; ano_name?: string }
    >();
    trailers.forEach((t) =>
      productInfoMap.set(t.name, {
        name: t.name,
        ano_name: t.ano_name,
      }),
    );
    inventoryData.forEach((i) => {
      if (!productInfoMap.has(i.name)) {
        productInfoMap.set(i.name, { name: i.name });
      }
    });

    // Final sorting: known trailers first (by their category/name order), then any unknown inventory items
    const sortedTypes = allNames
      .sort((a, b) => {
        const indexA = trailerNames.indexOf(a);
        const indexB = trailerNames.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
      })
      .map((name) => productInfoMap.get(name)!);

    setProductTypes(sortedTypes);

    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // Product types are now managed via state in fetchData

  const handleUpdateValue = async (
    name: string,
    agencyId: number,
    newValue: string,
  ) => {
    const numValue = parseInt(newValue) || 0;

    // Find existing record using the agency ID
    const existing = inventory.find(
      (i) => i.name === name && String(i.agency) === String(agencyId),
    );

    setSaving(`${name}-${agencyId}`);

    if (existing) {
      const { error } = await supabase
        .from("inventory")
        .update({ value: numValue })
        .eq("id", existing.id);

      if (error) console.error("Update error:", error);
    } else {
      const { error } = await supabase.from("inventory").insert([
        {
          name,
          agency: agencyId,
          value: numValue,
        },
      ]);

      if (error) console.error("Insert error:", error);
    }

    // Refresh local state silently
    await fetchData(true);
    setSaving(null);
  };

  const getStockValue = (name: string, agencyId: number) => {
    return (
      inventory.find(
        (i) => i.name === name && String(i.agency) === String(agencyId),
      )?.value || ""
    );
  };

  const calculateRowTotal = (name: string) => {
    return agencies.reduce((acc, agency) => {
      const val = getStockValue(name, agency.id);
      return acc + (val ? parseInt(String(val)) : 0);
    }, 0);
  };

  const calculateColTotal = (agencyId: number) => {
    return productTypes.reduce((acc, type) => {
      const val = getStockValue(type.name, agencyId);
      return acc + (val ? parseInt(String(val)) : 0);
    }, 0);
  };

  const grandTotal = productTypes.reduce(
    (acc, type) => acc + calculateRowTotal(type.name),
    0,
  );

  const filteredProductTypes = productTypes.filter((t) => {
    const nameToSearch = t.ano_name || t.name || "";
    return nameToSearch.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-500 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h2 className="text-sm font-black uppercase text-slate-800 tracking-widest flex items-center gap-2">
            <div className="w-1 h-3 bg-accent" /> Kiểm soát hàng tồn kho
            (Real-time)
          </h2>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm dòng xe..."
              className="w-full h-12 pl-10 pr-3 bg-white border border-slate-200 rounded-none text-xs font-black uppercase tracking-widest focus:border-accent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            className="h-12 bg-slate-900 text-white hover:bg-black rounded-none px-6 font-black uppercase text-xs tracking-widest transition-all"
            onClick={() => fetchData()}
            disabled={loading}
          >
            <RefreshCw
              className={cn("w-4 h-4 mr-2", loading ? "animate-spin" : "")}
            />
            SYNC
          </Button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-primary shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border-spacing-0">
            <thead>
              <tr className="bg-slate-900 text-white border-b border-slate-800">
                <th className="p-3 text-[10px] font-black uppercase tracking-widest border border-slate-800 min-w-[200px] sticky left-0 z-20 bg-slate-950">
                  Dòng xe / Chi nhánh
                </th>
                {agencies.map((agency) => (
                  <th
                    key={agency.id}
                    className="p-3 text-[10px] font-black uppercase tracking-widest border border-slate-800 text-center min-w-[100px]"
                  >
                    {agency.ano_name || agency.name}
                  </th>
                ))}
                <th className="p-3 text-[10px] font-black uppercase tracking-widest border border-slate-800 text-center sticky right-0 z-20 bg-slate-950">
                  Tổng cộng
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td
                      colSpan={agencies.length + 2}
                      className="p-8 animate-pulse bg-slate-50 border border-slate-100"
                    ></td>
                  </tr>
                ))
              ) : filteredProductTypes.length > 0 ? (
                filteredProductTypes.map((type) => (
                  <tr
                    key={type.name}
                    className="hover:bg-slate-50/50 transition-all group font-bold"
                  >
                    <td className="p-3 text-[11px] text-slate-800 uppercase tracking-tight border border-slate-100 sticky left-0 z-10 bg-white group-hover:bg-slate-50 transition-colors">
                      {type.ano_name || type.name}
                    </td>
                    {agencies.map((agency) => {
                      const id = `${type.name}-${agency.id}`;
                      const isSaving = saving === id;
                      const currentValue = getStockValue(type.name, agency.id);

                      return (
                        <td
                          key={agency.id}
                          className="p-0 border border-slate-100 relative"
                        >
                          <input
                            type="text"
                            key={`${type.name}-${agency.id}-${currentValue}`}
                            defaultValue={currentValue}
                            onBlur={(e) => {
                              if (e.target.value !== String(currentValue)) {
                                handleUpdateValue(
                                  type.name,
                                  agency.id,
                                  e.target.value,
                                );
                              }
                            }}
                            className={cn(
                              "w-full h-10 bg-transparent text-center text-xs font-black outline-none focus:bg-white focus:ring-2 focus:ring-accent transition-all",
                              isSaving && "opacity-30 pointer-events-none",
                            )}
                          />
                          {isSaving && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Loader2 className="w-4 h-4 text-accent animate-spin" />
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-3 text-center text-xs font-black text-slate-900 border border-slate-100 bg-slate-50 sticky right-0 z-10">
                      {calculateRowTotal(type.name)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={agencies.length + 2}
                    className="p-16 text-center border border-slate-100"
                  >
                    <p className="text-xs font-black uppercase text-slate-300 tracking-widest">
                      Không có dữ liệu tồn kho
                    </p>
                  </td>
                </tr>
              )}
              {/* Grand Total Row */}
              {!loading && (
                <tr className="bg-slate-900 text-white font-black">
                  <td className="p-3 text-[10px] uppercase tracking-widest border border-slate-800 sticky left-0 z-20 bg-slate-900">
                    Tổng cộng chi nhánh
                  </td>
                  {agencies.map((agency) => (
                    <td
                      key={agency.id}
                      className="p-3 text-center text-xs border border-slate-800"
                    >
                      {calculateColTotal(agency.id)}
                    </td>
                  ))}
                  <td className="p-3 text-center text-sm border border-slate-800 bg-accent sticky right-0 z-20">
                    {grandTotal}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 p-4 bg-blue-50 border border-blue-100 rounded-sm">
        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
        <p className="text-[10px] font-black uppercase text-blue-900 tracking-widest">
          Dữ liệu được lưu tự động ngay khi bạn nhập giá trị và nhấn ra ngoài ô.
        </p>
      </div>
    </div>
  );
};
