import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // Đảm bảo đường dẫn này trỏ đúng vào file supabase.ts của bạn

export async function GET() {
  const dataToImport = [
    {
      name: "Sơ mi rơ moóc Ben",
      type: "mooc_ben",
      description:
        "Moóc ben tự đổ chất lượng cao, khung gầm siêu cứng, chuyên chở vật liệu xây dựng và san lấp.",
      image: null,
    },
    {
      name: "Sơ mi rơ moóc Mui",
      type: "mooc_mui",
      description:
        "Thiết kế khung bửng chắc chắn, đa dụng, phù hợp chở hàng rời, nông sản và hàng hóa tổng hợp.",
      image: null,
    },
    {
      name: "Sơ mi rơ moóc Sàn",
      type: "mooc_san",
      description:
        "Sàn phẳng chịu lực tối ưu, chuyên chở thép cuộn, thép ống và hàng hóa cồng kềnh tải trọng cao.",
      image: null,
    },
    {
      name: "Sơ mi rơ moóc Xương",
      type: "mooc_xuong",
      description:
        "Trọng lượng tối giản, thiết kế chuẩn xác, chuyên dụng để kéo container 20 feet và 40 feet an toàn.",
      image: null,
    },
    {
      name: "Sơ mi rơ moóc Lửng",
      type: "mooc_lung",
      description:
        "Kết cấu bửng lửng linh hoạt, dễ dàng bốc dỡ hàng hóa từ hai bên mạng sườn.",
      image: null,
    },
    {
      name: "Xe Téc / Xitec",
      type: "tec",
      description:
        "Bồn chứa chuyên dụng độ kín tuyệt đối, an toàn để chở xăng dầu, xi măng rời hoặc bụi thép.",
      image: null,
    },
    {
      name: "Moóc Siêu Trường Siêu Trọng",
      type: "mooc_sieu_truong",
      description:
        "Thiết kế đặc chủng, nhiều trục, sàn thấp, chuyên chở máy móc công trình và hàng hóa quá khổ quá tải.",
      image: null,
    },
  ];
  try {
    const { data, error } = await supabase
      .from("category")
      .insert(dataToImport);

    if (error) {
      console.error("Lỗi từ Supabase:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Đã import thành công ${dataToImport.length} sản phẩm vào Database!`,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Lỗi server" },
      { status: 500 },
    );
  }
}
