"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import {
  Calculator,
  CheckCircle2,
  Circle,
  Truck,
  CarFront,
  RefreshCw,
  ArrowRight,
  DollarSign,
  Activity,
  FileText,
  ChevronDown,
  Download,
  Loader2,
  FileDown,
  Search,
  X,
} from "lucide-react";
// Removed static imports for jspdf/html-to-image to prevent SSR/Turbopack errors

const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d");
};

type Fee = {
  id: string;
  name: string;
  amount: number;
  isPercentage?: boolean;
  enabled: boolean;
  editable: boolean;
};

const defaultTrailerFees: Fee[] = [
  {
    id: "thue_truoc_ba",
    name: "Thuế trước bạ (2%)",
    amount: 2,
    isPercentage: true,
    enabled: true,
    editable: true,
  },
  {
    id: "phi_dich_vu",
    name: "Phí dịch vụ",
    amount: 3000000,
    enabled: true,
    editable: true,
  },
];

const defaultTruckFees: Fee[] = [
  {
    id: "thue_truoc_ba",
    name: "Thuế trước bạ (2%)",
    amount: 2,
    isPercentage: true,
    enabled: true,
    editable: true,
  },
  {
    id: "phi_nop_thue",
    name: "Chi phí đi nộp thuế và khai dịch vụ công",
    amount: 1000000,
    enabled: true,
    editable: true,
  },
  {
    id: "phi_ra_bien",
    name: "Chi phí ra biển và ra sổ đăng kiểm (không mang xe)",
    amount: 3500000,
    enabled: true,
    editable: true,
  },
  {
    id: "phi_dkkd",
    name: "Chi phí làm giấy phép ĐKKD vận tải",
    amount: 1000000,
    enabled: true,
    editable: true,
  },
  {
    id: "phu_hieu",
    name: "Lắp phù hiệu 7 năm",
    amount: 1100000,
    enabled: true,
    editable: true,
  },
  {
    id: "phi_duong_bo",
    name: "Phí đường bộ 1 năm",
    amount: 17160000,
    enabled: true,
    editable: true,
  },
];

export default function ROICalculatorPage() {
  const [activeTab, setActiveTab] = useState<"onroad" | "roi">("onroad");

  // Báo giá lăn bánh state
  const [vehicleType, setVehicleType] = useState<"truck" | "trailer">("truck");
  const [productPrice, setProductPrice] = useState<number>(0);
  const [fees, setFees] = useState<Fee[]>(defaultTruckFees);

  // ROI state
  const [revenue, setRevenue] = useState<number>(100000000);
  const [expense, setExpense] = useState<number>(40000000);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);

  // Data state
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [vehicleSearchTerm, setVehicleSearchTerm] = useState("");
  const [localInputs, setLocalInputs] = useState<Record<string, string>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const [exportingType, setExportingType] = useState<"image" | "pdf" | null>(
    null,
  );
  const [previewData, setPreviewData] = useState<string | null>(null);
  const [libs, setLibs] = useState<{ toJpeg?: any; jsPDF?: any } | null>(null);

  useEffect(() => {
    // Load libraries only on client to avoid SSR issues
    const loadLibs = async () => {
      try {
        const { toJpeg } = await import("html-to-image");
        const { jsPDF } = await import("jspdf");
        setLibs({ toJpeg, jsPDF });
      } catch (err) {
        console.error("Failed to load export libraries", err);
      }
    };
    loadLibs();
  }, []);

  const handleExport = async (type: "image" | "pdf") => {
    if (!printRef.current || !libs?.toJpeg) return;
    setExportingType(type);
    try {
      const imgData = await libs.toJpeg(printRef.current, {
        quality: 0.95,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });

      setPreviewData(imgData);
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  const downloadFinal = async () => {
    if (!previewData || !exportingType || !libs?.jsPDF) return;

    if (exportingType === "image") {
      const link = document.createElement("a");
      link.href = previewData;
      link.download = `Bao_Gia_Hatico_${new Date().getTime()}.jpg`;
      link.click();
    } else {
      const pdf = new libs.jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();

      const img = new Image();
      img.src = previewData;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const ratio = img.width / img.height;
      const finalImgHeight = pdfWidth / ratio;

      pdf.addImage(previewData, "JPEG", 0, 0, pdfWidth, finalImgHeight);
      pdf.save(`Bao_Gia_Hatico_${new Date().getTime()}.pdf`);
    }
    setPreviewData(null);
    setExportingType(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchVehicles() {
      setLoadingVehicles(true);
      const [trucksRes, trailersRes] = await Promise.all([
        supabase.from("commercial_vehicles").select("id, name, price"),
        supabase.from("trailers").select("id, name, regional_prices"),
      ]);

      const allVehicles: any[] = [];
      if (trucksRes.data) {
        trucksRes.data.forEach((t) =>
          allVehicles.push({
            id: `truck_${t.id}`,
            type: "truck",
            name: t.name,
            price: (t.price || 0) * 1000000,
          }),
        );
      }
      if (trailersRes.data) {
        trailersRes.data.forEach((t) => {
          let basePrice = 350000000;
          if (t.regional_prices) {
            const prices = Object.values(t.regional_prices);
            if (prices.length > 0) {
              const parsed = parseFloat(String(prices[0]));
              if (!isNaN(parsed)) basePrice = parsed * 1000000;
            }
          }
          allVehicles.push({
            id: `trailer_${t.id}`,
            type: "trailer",
            name: t.name,
            price: basePrice,
          });
        });
      }
      setVehicles(allVehicles);
      setLoadingVehicles(false);
    }
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (vehicleType === "truck") {
      setFees(defaultTruckFees);
      setProductPrice(0);
    } else {
      setFees(defaultTrailerFees);
      setProductPrice(0);
    }
    setSelectedVehicleId("");
  }, [vehicleType]);

  const toggleFee = (id: string) => {
    setFees(fees.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  };

  const updateFeeAmount = (id: string, value: string) => {
    const fee = fees.find((f) => f.id === id);
    if (!fee) return;

    if (fee.isPercentage) {
      const numValue = parseFloat(value.replace(/[^0-9.]/g, ""));
      if (!isNaN(numValue)) {
        setFees(
          fees.map((f) => (f.id === id ? { ...f, amount: numValue } : f)),
        );
      } else if (value === "") {
        setFees(fees.map((f) => (f.id === id ? { ...f, amount: 0 } : f)));
      }
    } else {
      // Đối với tiền tệ VNĐ, loại bỏ tất cả dấu chấm (thousand separators) trước khi parse
      const numValue = parseInt(value.replace(/[^0-9]/g, ""), 10);
      if (!isNaN(numValue)) {
        setFees(
          fees.map((f) => (f.id === id ? { ...f, amount: numValue } : f)),
        );
      } else if (value === "") {
        setFees(fees.map((f) => (f.id === id ? { ...f, amount: 0 } : f)));
      }
    }
  };

  const calculateFeeValue = (fee: Fee) => {
    if (fee.isPercentage) {
      return (productPrice * fee.amount) / 100;
    }
    return fee.amount;
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN").format(val);
  };

  const totalFees = fees
    .filter((f) => f.enabled)
    .reduce((sum, fee) => sum + calculateFeeValue(fee), 0);
  const totalOnRoadPrice = productPrice + totalFees;

  useEffect(() => {
    setTotalInvestment(totalOnRoadPrice);
  }, [totalOnRoadPrice]);

  const profit = revenue - expense;
  const monthsToBreakEven =
    profit > 0 ? Math.ceil(totalInvestment / profit) : 0;
  const yearsToBreakEven =
    monthsToBreakEven > 0 ? (monthsToBreakEven / 12).toFixed(1) : 0;

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 font-sans">
      {/* Header & Tabs Navigation */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Calculator className="w-8 h-8 text-accent" />
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">
            Tính Giá Lăn Bánh & ROI
          </h1>
        </div>
        <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">
          Công cụ dự toán & Phân tích hiệu quả đầu tư
        </p>

        <div className="flex justify-center items-center mt-6 gap-2 bg-slate-100 p-1 rounded-[8px] w-fit mx-auto border border-slate-200">
          <button
            onClick={() => setActiveTab("onroad")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[8px] text-xs font-black uppercase tracking-widest transition-colors ${
              activeTab === "onroad"
                ? "bg-accent text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <FileText className="w-4 h-4" />
            Báo Giá Lăn Bánh
          </button>
          <button
            onClick={() => setActiveTab("roi")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[8px] text-xs font-black uppercase tracking-widest transition-colors ${
              activeTab === "roi"
                ? "bg-accent text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            <Activity className="w-4 h-4" />
            Dự Toán Hiệu Quả
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="transition-all duration-300 ease-in-out">
        {activeTab === "onroad" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
            {/* Left Panel: Inputs & Fees */}
            <div className="lg:col-span-7 space-y-6">
              {/* Vehicle Selection Card */}
              <Card className="border border-slate-200 shadow-sm bg-white rounded-[8px] relative z-20">
                <div className="bg-slate-950 p-3 rounded-t-[7px]">
                  <h2 className="text-white font-black uppercase tracking-widest text-[11px] flex items-center gap-2">
                    <Truck className="w-4 h-4" /> 1. Chọn Loại Xe & Giá Trị
                  </h2>
                </div>
                <CardContent className="p-5">
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <button
                      onClick={() => setVehicleType("truck")}
                      className={`flex flex-col items-center justify-center p-4 rounded-[8px] border transition-colors ${
                        vehicleType === "truck"
                          ? "border-accent bg-accent/5 text-accent shadow-sm"
                          : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <Truck
                        className={`w-6 h-6 mb-2 ${vehicleType === "truck" ? "text-accent" : "text-slate-400"}`}
                      />
                      <span className="font-black uppercase tracking-widest text-xs">
                        Đầu Kéo
                      </span>
                    </button>
                    <button
                      onClick={() => setVehicleType("trailer")}
                      className={`flex flex-col items-center justify-center p-4 rounded-[8px] border transition-colors ${
                        vehicleType === "trailer"
                          ? "border-accent bg-accent/5 text-accent shadow-sm"
                          : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <CarFront
                        className={`w-6 h-6 mb-2 ${vehicleType === "trailer" ? "text-accent" : "text-slate-400"}`}
                      />
                      <span className="font-black uppercase tracking-widest text-xs">
                        Rơ Moóc
                      </span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                        Chọn nhanh sản phẩm có sẵn
                      </label>
                      <div className="relative" ref={dropdownRef}>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder={
                              loadingVehicles
                                ? "Đang tải dữ liệu..."
                                : "-- Tùy chỉnh giá trị / Nhập tay --"
                            }
                            disabled={loadingVehicles}
                            className="w-full border border-slate-200 rounded-[8px] p-3 bg-slate-50 hover:bg-slate-100 transition-colors focus:outline-none focus:bg-white focus:border-accent text-sm font-bold text-slate-900 pr-10 cursor-pointer"
                            value={
                              isDropdownOpen
                                ? vehicleSearchTerm
                                : selectedVehicleId
                                  ? vehicles.find(
                                      (v) => v.id === selectedVehicleId,
                                    )?.name || ""
                                  : ""
                            }
                            onFocus={() => {
                              setIsDropdownOpen(true);
                              setVehicleSearchTerm("");
                            }}
                            onChange={(e) => {
                              setVehicleSearchTerm(e.target.value);
                              if (!isDropdownOpen) setIsDropdownOpen(true);
                            }}
                          />
                          <div
                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          >
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                            />
                          </div>
                        </div>

                        {isDropdownOpen && !loadingVehicles && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-[8px] shadow-lg max-h-[300px] overflow-hidden flex flex-col">
                            <div className="overflow-y-auto custom-scrollbar flex-1">
                              <button
                                type="button"
                                className="w-full text-left px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-b border-slate-100 transition-colors flex items-center gap-2"
                                onClick={() => {
                                  setSelectedVehicleId("");
                                  setVehicleSearchTerm("");
                                  setIsDropdownOpen(false);
                                }}
                              >
                                <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                                  {!selectedVehicleId && (
                                    <div className="w-2 h-2 rounded-full bg-accent" />
                                  )}
                                </span>
                                -- Tùy chỉnh giá trị / Nhập tay --
                              </button>

                              {vehicles
                                .filter(
                                  (v) =>
                                    v.type === vehicleType &&
                                    normalizeText(v.name).includes(
                                      normalizeText(vehicleSearchTerm),
                                    ),
                                )
                                .map((v) => (
                                  <button
                                    key={v.id}
                                    type="button"
                                    className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors border-b border-slate-50 last:border-0 flex items-center gap-2 ${
                                      selectedVehicleId === v.id
                                        ? "bg-accent/5 text-accent"
                                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                                    onClick={() => {
                                      setSelectedVehicleId(v.id);
                                      setProductPrice(v.price);
                                      setVehicleSearchTerm("");
                                      setIsDropdownOpen(false);
                                    }}
                                  >
                                    <span
                                      className={`flex-shrink-0 w-4 h-4 rounded-full border ${selectedVehicleId === v.id ? "border-accent" : "border-slate-300"} flex items-center justify-center`}
                                    >
                                      {selectedVehicleId === v.id && (
                                        <div className="w-2 h-2 rounded-full bg-accent" />
                                      )}
                                    </span>
                                    <span
                                      className="truncate flex-1"
                                      title={`${v.name} (${formatCurrency(v.price)} đ)`}
                                    >
                                      {v.name}
                                    </span>
                                    <span className="text-xs font-black whitespace-nowrap opacity-60">
                                      {formatCurrency(v.price)} đ
                                    </span>
                                  </button>
                                ))}

                              {vehicles.filter(
                                (v) =>
                                  v.type === vehicleType &&
                                  normalizeText(v.name).includes(
                                    normalizeText(vehicleSearchTerm),
                                  ),
                              ).length === 0 && (
                                <div className="p-8 text-center">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Không tìm thấy kết quả
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-slate-100 pt-4">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                        Hoặc nhập Giá trị xuất hóa đơn (VNĐ)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <DollarSign className="w-4 h-4 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          value={
                            localInputs["productPrice"] !== undefined
                              ? localInputs["productPrice"]
                              : formatCurrency(productPrice)
                          }
                          onFocus={() =>
                            setLocalInputs((prev) => ({
                              ...prev,
                              productPrice: formatCurrency(productPrice),
                            }))
                          }
                          onBlur={() =>
                            setLocalInputs((prev) => {
                              const next = { ...prev };
                              delete next.productPrice;
                              return next;
                            })
                          }
                          onChange={(e) => {
                            setLocalInputs((prev) => ({
                              ...prev,
                              productPrice: e.target.value,
                            }));
                            const val = Number(
                              e.target.value.replace(/[^0-9]/g, ""),
                            );
                            setProductPrice(val);
                            setSelectedVehicleId("");
                          }}
                          className="w-full pl-10 border border-slate-200 rounded-[8px] p-3 bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-slate-900 font-bold text-lg transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fees Configuration Card */}
              <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden rounded-[8px]">
                <div className="bg-slate-900 p-3 flex justify-between items-center">
                  <h2 className="text-white font-black uppercase tracking-widest text-[11px] flex items-center gap-2">
                    <FileText className="w-4 h-4" /> 2. Tùy Chỉnh Phí Dịch Vụ
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setFees(
                        vehicleType === "truck"
                          ? defaultTruckFees
                          : defaultTrailerFees,
                      )
                    }
                    className="h-6 px-2 text-[10px] bg-white/10 hover:bg-white/20 text-white rounded-[4px] uppercase tracking-wider font-bold"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" /> Khôi phục
                  </Button>
                </div>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {fees.map((fee) => (
                      <div
                        key={fee.id}
                        className={`p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                          fee.enabled ? "bg-white" : "bg-slate-50 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => toggleFee(fee.id)}
                            className="flex-shrink-0 text-accent hover:text-accent/80 transition-colors"
                          >
                            {fee.enabled ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300" />
                            )}
                          </button>
                          <div className="flex flex-col">
                            <span
                              className={`text-sm font-bold ${fee.enabled ? "text-slate-800" : "text-slate-500"}`}
                            >
                              {fee.name}
                            </span>
                            {fee.isPercentage && (
                              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                                Tính theo %
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          {fee.enabled && (
                            <div className="relative flex-1 sm:w-36">
                              <input
                                type="text"
                                value={
                                  localInputs[fee.id] !== undefined
                                    ? localInputs[fee.id]
                                    : fee.isPercentage
                                      ? fee.amount
                                      : formatCurrency(fee.amount)
                                }
                                onFocus={() =>
                                  setLocalInputs((prev) => ({
                                    ...prev,
                                    [fee.id]: String(
                                      fee.isPercentage
                                        ? fee.amount
                                        : formatCurrency(fee.amount),
                                    ),
                                  }))
                                }
                                onBlur={() =>
                                  setLocalInputs((prev) => {
                                    const next = { ...prev };
                                    delete next[fee.id];
                                    return next;
                                  })
                                }
                                onChange={(e) => {
                                  setLocalInputs((prev) => ({
                                    ...prev,
                                    [fee.id]: e.target.value,
                                  }));
                                  updateFeeAmount(fee.id, e.target.value);
                                }}
                                disabled={!fee.editable}
                                className={`w-full text-right border ${
                                  fee.editable
                                    ? "border-slate-200 focus:border-accent bg-white"
                                    : "border-transparent bg-transparent"
                                } rounded-[6px] ${fee.isPercentage ? "pr-8 pl-2.5" : "px-2.5"} py-1.5 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-accent transition-colors`}
                              />
                              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
                                {fee.isPercentage ? "%" : ""}
                              </span>
                            </div>
                          )}
                          {!fee.enabled && (
                            <div className="text-slate-400 font-bold text-xs uppercase tracking-widest sm:w-36 text-right pr-2">
                              Bỏ qua
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel: Total Result */}
            <div className="lg:col-span-5">
              <div className="sticky top-6">
                <Card className="border border-slate-200 shadow-md overflow-hidden relative bg-white rounded-[8px]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-accent" />

                  <CardHeader className="pb-3 pt-6 bg-slate-50/50 border-b border-slate-100">
                    <CardTitle className="text-lg font-black text-slate-900 text-center uppercase tracking-widest">
                      Tổng Chi Phí Lăn Bánh
                    </CardTitle>
                    <p className="text-center text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-[0.2em]">
                      {vehicleType === "truck" ? "Xe Đầu Kéo" : "Sơ Mi Rơ Moóc"}
                    </p>
                  </CardHeader>

                  <CardContent className="p-5">
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center text-slate-600 pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Giá trị xe
                        </span>
                        <span className="font-black text-slate-800">
                          {formatCurrency(productPrice)} đ
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-slate-600 pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Tổng phí dịch vụ
                        </span>
                        <span className="font-black text-slate-800">
                          {formatCurrency(totalFees)} đ
                        </span>
                      </div>

                      <div className="pt-3 flex flex-col items-center bg-slate-50 rounded-[8px] p-4 border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-[0.2em]">
                          Thành tiền (Dự kiến)
                        </span>
                        <div className="text-3xl lg:text-4xl font-black text-accent tracking-tighter">
                          {formatCurrency(totalOnRoadPrice)}
                        </div>
                        <span className="text-slate-900 font-black text-xs uppercase tracking-widest mt-1">
                          VNĐ
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={() => setActiveTab("roi")}
                        className="w-full h-12 text-xs font-black uppercase tracking-widest bg-accent hover:bg-accent/90 text-white rounded-[8px] flex items-center justify-center gap-2 transition-all"
                      >
                        Chuyển Sang Tính ROI
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => handleExport("image")}
                          disabled={exportingType !== null}
                          variant="outline"
                          className="w-full h-10 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-700 hover:bg-slate-50 rounded-[8px] flex items-center justify-center gap-1.5 transition-all"
                        >
                          {exportingType === "image" ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                          Xuất Ảnh
                        </Button>
                        <Button
                          onClick={() => handleExport("pdf")}
                          disabled={exportingType !== null}
                          variant="outline"
                          className="w-full h-10 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-700 hover:bg-slate-50 rounded-[8px] flex items-center justify-center gap-1.5 transition-all"
                        >
                          {exportingType === "pdf" ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <FileDown className="w-3.5 h-3.5" />
                          )}
                          Xuất PDF
                        </Button>
                      </div>
                      <p className="text-center text-[10px] text-slate-400 font-medium px-2 leading-relaxed">
                        * Bảng tính mang tính tham khảo. Chi phí thực tế có thể
                        dao động nhẹ theo địa phương.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === "roi" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
            {/* Left Panel: ROI Inputs */}
            <div className="lg:col-span-7">
              <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden h-full rounded-[8px]">
                <div className="bg-slate-950 p-3">
                  <h2 className="text-white font-black uppercase tracking-widest text-[11px] flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Thông Số Kinh Doanh
                  </h2>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2 bg-slate-50 p-4 rounded-[8px] border border-slate-200">
                    <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest">
                      Vốn đầu tư ban đầu (VNĐ)
                    </label>
                    <p className="text-[10px] text-slate-500 mb-2 font-bold">
                      Lấy từ chi phí lăn bánh hoặc nhập tay
                    </p>
                    <input
                      type="text"
                      value={
                        localInputs["totalInvestment"] !== undefined
                          ? localInputs["totalInvestment"]
                          : formatCurrency(totalInvestment)
                      }
                      onFocus={() =>
                        setLocalInputs((prev) => ({
                          ...prev,
                          totalInvestment: formatCurrency(totalInvestment),
                        }))
                      }
                      onBlur={() =>
                        setLocalInputs((prev) => {
                          const next = { ...prev };
                          delete next.totalInvestment;
                          return next;
                        })
                      }
                      onChange={(e) => {
                        setLocalInputs((prev) => ({
                          ...prev,
                          totalInvestment: e.target.value,
                        }));
                        setTotalInvestment(
                          Number(e.target.value.replace(/[^0-9]/g, "")),
                        );
                      }}
                      className="w-full border border-slate-200 rounded-[8px] p-3 bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-slate-900 font-black text-xl transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest">
                      Doanh thu dự kiến / tháng (VNĐ)
                    </label>
                    <input
                      type="text"
                      value={
                        localInputs["revenue"] !== undefined
                          ? localInputs["revenue"]
                          : formatCurrency(revenue)
                      }
                      onFocus={() =>
                        setLocalInputs((prev) => ({
                          ...prev,
                          revenue: formatCurrency(revenue),
                        }))
                      }
                      onBlur={() =>
                        setLocalInputs((prev) => {
                          const next = { ...prev };
                          delete next.revenue;
                          return next;
                        })
                      }
                      onChange={(e) => {
                        setLocalInputs((prev) => ({
                          ...prev,
                          revenue: e.target.value,
                        }));
                        setRevenue(
                          Number(e.target.value.replace(/[^0-9]/g, "")),
                        );
                      }}
                      className="w-full border border-slate-200 rounded-[8px] p-3 bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-slate-900 font-bold text-lg transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest">
                      Chi phí vận hành / tháng (VNĐ)
                    </label>
                    <p className="text-[10px] text-slate-500 mb-2 font-bold">
                      Xăng dầu, bến bãi, lương, cầu đường...
                    </p>
                    <input
                      type="text"
                      value={
                        localInputs["expense"] !== undefined
                          ? localInputs["expense"]
                          : formatCurrency(expense)
                      }
                      onFocus={() =>
                        setLocalInputs((prev) => ({
                          ...prev,
                          expense: formatCurrency(expense),
                        }))
                      }
                      onBlur={() =>
                        setLocalInputs((prev) => {
                          const next = { ...prev };
                          delete next.expense;
                          return next;
                        })
                      }
                      onChange={(e) => {
                        setLocalInputs((prev) => ({
                          ...prev,
                          expense: e.target.value,
                        }));
                        setExpense(
                          Number(e.target.value.replace(/[^0-9]/g, "")),
                        );
                      }}
                      className="w-full border border-slate-200 rounded-[8px] p-3 bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-slate-900 font-bold text-lg transition-colors"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel: ROI Results */}
            <div className="lg:col-span-5">
              <div className="sticky top-6 space-y-4">
                {/* Profit Card */}
                <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden rounded-[8px]">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 bg-slate-100 text-slate-900 rounded-[8px] flex items-center justify-center mb-3 border border-slate-200">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <h3 className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-1">
                        Lợi nhuận gộp / tháng
                      </h3>
                      <div className="text-3xl font-black text-slate-900 mb-1 tracking-tighter">
                        {formatCurrency(profit)}
                      </div>
                      <span className="text-slate-400 font-black text-xs uppercase tracking-widest">
                        VNĐ
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Break Even Card */}
                <Card
                  className={`border shadow-sm overflow-hidden rounded-[8px] ${profit > 0 ? "bg-slate-950 border-slate-900" : "bg-red-50 border-red-100"}`}
                >
                  <div
                    className={`h-1 w-full ${profit > 0 ? "bg-accent" : "bg-red-500"}`}
                  />
                  <CardContent className="p-6">
                    {profit > 0 ? (
                      <div className="text-center">
                        <h3 className="text-slate-300 font-black uppercase tracking-widest text-[10px] mb-4">
                          Thời gian thu hồi vốn
                        </h3>
                        <div className="flex justify-center items-end gap-2 mb-3">
                          <div className="text-6xl font-black text-white leading-none tracking-tighter">
                            {monthsToBreakEven}
                          </div>
                          <div className="text-xs font-black text-slate-400 uppercase tracking-widest pb-1">
                            tháng
                          </div>
                        </div>
                        <div className="text-slate-400 font-bold text-xs mt-3 pt-3 border-t border-white/10 uppercase tracking-wider">
                          Tương đương{" "}
                          <span className="text-white">
                            ~{yearsToBreakEven} năm
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Activity className="w-12 h-12 text-red-400 mx-auto mb-3 opacity-50" />
                        <h3 className="text-sm font-black text-red-900 uppercase tracking-widest mb-2">
                          Chưa Thể Sinh Lời
                        </h3>
                        <p className="text-red-700/80 text-[11px] font-bold leading-relaxed">
                          Chi phí vận hành đang cao hơn doanh thu. Vui lòng điều
                          chỉnh thông số.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Button
                  onClick={() => setActiveTab("onroad")}
                  variant="outline"
                  className="w-full h-10 text-xs font-black uppercase tracking-widest text-slate-600 border-slate-300 hover:bg-slate-100 bg-white rounded-[8px]"
                >
                  <ArrowRight className="w-4 h-4 rotate-180 mr-2" />
                  Báo Giá Lăn Bánh
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Printable Component */}
      <div className="absolute left-[-9999px] top-[-9999px]">
        <div
          ref={printRef}
          className="w-[800px] bg-white p-10 font-sans"
          style={{ color: "#0f172a" }}
        >
          {/* Header */}
          <div
            className="flex justify-between items-start border-b-2 pb-6 mb-8"
            style={{ borderColor: "#162248" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white p-2 rounded-[12px] flex items-center justify-center border border-slate-100 shadow-sm">
                <img
                  src="/images/logo-sp.png"
                  alt="Hatico Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1
                  className="text-3xl font-black tracking-tighter uppercase leading-none"
                  style={{ color: "#162248" }}
                >
                  HATICO
                </h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
                  International Corporation
                </p>
              </div>
            </div>
            <div className="text-right max-w-[400px]">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">
                Công Ty Cổ Phần XNK Quốc Tế Hatico
              </h2>
              <p className="text-[10px] font-medium leading-relaxed text-slate-500">
                Số 77 liền kề 5B làng Việt Kiều Châu Âu, khu đô thị Mỗ Lao,
                Phường Mộ Lao, Quận Hà Đông, Hà Nội.
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">
                Nhà nhập khẩu, cung cấp thiết bị xây dựng, vận tải
              </p>
              <p className="text-xs font-medium mt-2">
                Hotline:{" "}
                <span className="font-bold" style={{ color: "#162248" }}>
                  0934 102 678
                </span>
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900">
              Báo Giá Lăn Bánh
            </h2>
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-4 mb-8 text-sm p-4 rounded-[8px] bg-slate-50 border border-slate-100">
            <div className="space-y-2">
              <p>
                <span className="font-bold w-24 inline-block text-slate-500 uppercase text-[10px] tracking-widest">
                  Ngày báo giá:
                </span>{" "}
                <span className="font-bold">
                  {new Date().toLocaleDateString("vi-VN")}
                </span>
              </p>
              <p>
                <span className="font-bold w-24 inline-block text-slate-500 uppercase text-[10px] tracking-widest">
                  Bộ phận:
                </span>{" "}
                <span className="font-bold">Kinh Doanh</span>
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <span className="font-bold w-24 inline-block text-slate-500 uppercase text-[10px] tracking-widest">
                  Khách hàng:
                </span>{" "}
                ............................................
              </p>
              <p>
                <span className="font-bold w-24 inline-block text-slate-500 uppercase text-[10px] tracking-widest">
                  Điện thoại:
                </span>{" "}
                ............................................
              </p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full border-collapse mb-8">
            <thead>
              <tr className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-widest">
                <th className="p-3 text-center w-12 border border-slate-800">
                  STT
                </th>
                <th className="p-3 text-left border border-slate-800">
                  Hạng mục
                </th>
                <th className="p-3 text-center w-20 border border-slate-800">
                  SL
                </th>
                <th className="p-3 text-right w-36 border border-slate-800">
                  Đơn giá (VNĐ)
                </th>
                <th className="p-3 text-right w-36 border border-slate-800">
                  Thành tiền (VNĐ)
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Product Row */}
              <tr
                className="font-bold"
                style={{ backgroundColor: "rgba(22, 34, 72, 0.05)" }}
              >
                <td
                  className="border border-slate-200 p-3 text-center"
                  style={{ color: "#162248" }}
                >
                  I
                </td>
                <td
                  className="border border-slate-200 p-3 uppercase"
                  style={{ color: "#162248" }}
                >
                  {selectedVehicleId
                    ? vehicles.find((v) => v.id === selectedVehicleId)?.name
                    : vehicleType === "truck"
                      ? "Đầu Kéo"
                      : "Rơ Moóc"}
                </td>
                <td
                  className="border border-slate-200 p-3 text-center"
                  style={{ color: "#162248" }}
                >
                  1
                </td>
                <td
                  className="border border-slate-200 p-3 text-right"
                  style={{ color: "#162248" }}
                >
                  {formatCurrency(productPrice)}
                </td>
                <td
                  className="border border-slate-200 p-3 text-right"
                  style={{ color: "#162248" }}
                >
                  {formatCurrency(productPrice)}
                </td>
              </tr>

              {/* Fee Rows */}
              {fees
                .filter((f) => f.enabled)
                .map((fee, idx) => (
                  <tr key={fee.id} className="text-sm font-medium">
                    <td className="border border-slate-200 p-3 text-center text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="border border-slate-200 p-3 text-slate-800">
                      {fee.name}
                    </td>
                    <td className="border border-slate-200 p-3 text-center text-slate-800">
                      1
                    </td>
                    <td className="border border-slate-200 p-3 text-right text-slate-800">
                      {formatCurrency(calculateFeeValue(fee))}
                    </td>
                    <td className="border border-slate-200 p-3 text-right text-slate-800">
                      {formatCurrency(calculateFeeValue(fee))}
                    </td>
                  </tr>
                ))}

              {/* Total Row */}
              <tr
                className="font-black text-lg"
                style={{ backgroundColor: "#f8fafc" }}
              >
                <td
                  colSpan={4}
                  className="border border-slate-200 p-4 text-right uppercase tracking-widest text-sm text-slate-700"
                >
                  Tổng cộng:
                </td>
                <td
                  className="border border-slate-200 p-4 text-right"
                  style={{ color: "#162248" }}
                >
                  {formatCurrency(totalOnRoadPrice)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Footer Note */}
          <div className="text-[10px] uppercase font-bold tracking-widest italic text-slate-400 mt-4 text-center">
            * Bảng tính mang tính chất tham khảo. Chi phí thực tế có thể dao
            động nhẹ theo địa phương.
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[16px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-950">
                    Xem trước bản báo giá
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Định dạng:{" "}
                    {exportingType === "pdf" ? "Tài liệu PDF" : "Hình ảnh JPEG"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPreviewData(null);
                  setExportingType(null);
                }}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Image Preview) */}
            <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-8 bg-slate-100/50 flex justify-center custom-scrollbar">
              <div className="shadow-2xl border border-slate-200 rounded-sm overflow-hidden bg-white h-fit">
                <img
                  src={previewData}
                  alt="Báo giá preview"
                  className="max-w-full h-auto block"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-white">
              <Button
                variant="outline"
                onClick={() => {
                  setPreviewData(null);
                  setExportingType(null);
                }}
                className="h-12 px-6 text-xs font-black uppercase tracking-widest border-slate-200 hover:bg-slate-50 text-slate-600 rounded-[8px]"
              >
                Hủy bỏ
              </Button>
              <Button
                onClick={downloadFinal}
                className="h-12 px-10 text-xs font-black uppercase tracking-widest bg-slate-950 text-white hover:bg-slate-800 shadow-xl transition-all border-none rounded-[8px] flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Tải về ngay
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
