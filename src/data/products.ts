export interface ProductSpec {
  dimension: string;
  tareWeight: string;
  payload: string;
  totalWeight: string;
  axle: string;
  tire: string;
  suspension: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  description: string;
  tags: string[];
  features: string[];
  specs: ProductSpec;
}

export const products: Product[] = [
  {
    id: "p1",
    slug: "romooc-ben",
    name: "Sơ Mi Rơ Moóc Ben Hatico",
    shortDesc: "Vua tải trọng, trút đổ đất đá nhanh gọn an toàn với hệ thống ben Hyva siêu khỏe.",
    description: "Sơ mi rơ moóc Ben Hatico được thiết kế đặc chủng cho hoạt động vận tải khắc nghiệt nhất như san lấp mặt bằng, hầm mỏ, chở vật liệu. Áp dụng thiết kế thùng vát hình chữ U giúp giảm tối đa sự bám dính đất đá, rút ngắn thời gian nhả hàng.",
    tags: ["Chuyên đất đá", "Thùng U", "Ben Hyva FC"],
    features: [
      "Thép cường lực T700 siêu cứng chống mài mòn và va đập móp méo.",
      "Hệ thống ty ben thủy lực Hyva FC214 mạ crom siêu bền.",
      "Gân gia cường dọc thân thùng đem lại độ chịu tải động cao.",
      "Thiết kế trọng tâm thấp giúp xe ôm cua đầm chắc và không lật khi nâng ben."
    ],
    specs: {
      dimension: "9,250 x 2,500 x 3,365 mm",
      tareWeight: "8,500 kg",
      payload: "31,000 kg",
      totalWeight: "39,500 kg",
      axle: "FUWA 13 Tấn",
      tire: "11.00R20 / 12.00R20",
      suspension: "Nhíp lá cường độ cao (10 lá)",
    }
  },
  {
    id: "p2",
    slug: "romooc-xuong",
    name: "Sơ Mi Rơ Moóc Xương (Cổ Cò)",
    shortDesc: "Đa năng, tối ưu để rước container chuẩn quốc tế, bền bỉ qua năm tháng.",
    description: "Dòng sơ mi rơ moóc Xương 40 feet (hoặc 45/48 feet) được cấu tạo từ khung dầm chữ I liền khối chắc chắn, đáp ứng chở container an toàn và di chuyển mượt mà trên mọi trục đường cao tốc lẫn đường tỉnh.",
    tags: ["Chở Container", "Linh hoạt", "Dầm đúc chữ I"],
    features: [
      "Cấu trúc xương đôi, dầm I thép nguyên khối hạn chế tối đa mối hàn.",
      "Cụm hệ thống phanh WABCO nhập khẩu cao cấp an toàn tuyệt đối.",
      "Chốt kéo JOST 50#. Chân chống JOST 28 tấn 2 tốc độ.",
      "Sơn hai lớp Epoxy chống ăn mòn hiệu quả do hơi muối hoặc cảng biển."
    ],
    specs: {
      dimension: "12,400 x 2,500 x 1,530 mm",
      tareWeight: "5,800 kg",
      payload: "33,200 kg",
      totalWeight: "39,000 kg",
      axle: "FUWA 13 Tấn x 3 Trục",
      tire: "12R22.5 Nankang / ChaoYang",
      suspension: "Hệ thống treo phụ thuộc nhíp lá",
    }
  },
  {
    id: "p3",
    slug: "romooc-san",
    name: "Sơ Mi Rơ Moóc Sàn (Phẳng)",
    shortDesc: "Chở khối lượng khổng lồ. Linh hoạt mặt sàn phẳng thép gân lá liễu nhám.",
    description: "Được sinh ra để chở các loại hàng rời, sắt thép cuộn, bao xi măng hoặc cấu kiện gỗ siêu cường. Mặt sàn sử dụng tấm thép chống trượt tăng độ ma sát bám hàng, cho phép chằng buộc dễ dàng và chịu tĩnh tải vượt mong đợi.",
    tags: ["Chở gỗ sắt thép", "Mặt sàn nhám", "Sàn đôi gia cường"],
    features: [
      "Sàn thép nhám 3.5mm chống trượt bám dính tốt vào hàng hóa.",
      "Dầm chính thép nguyên bản T980 đàn hồi, nói không với võng xệ.",
      "Xung quanh sàn là các khóa container và móc chằng dây cực kỳ chắc chắn.",
      "Bộ mâm thép và trục Fuwa thế hệ mới giảm sinh nhiệt phanh."
    ],
    specs: {
      dimension: "12,400 x 2,500 x 1,530 mm",
      tareWeight: "7,400 kg",
      payload: "32,600 kg",
      totalWeight: "40,000 kg",
      axle: "FUWA 13 Tấn",
      tire: "11.00R20",
      suspension: "Treo lá nhíp đúc (12 lá)",
    }
  }
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export const getFeaturedProducts = (): Product[] => {
  return products;
};
