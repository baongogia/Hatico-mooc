import * as React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Share2,
  Play,
  Camera,
  Link2,
  ArrowUpRight,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 text-slate-300 py-16 px-6 md:px-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight uppercase mb-4">
                CÔNG TY CỔ PHẦN XNK QUỐC TẾ HATICO
              </h3>
              <p className="text-sm leading-relaxed text-slate-400 max-w-xl">
                Chúng tôi phân phối các sản phẩm xe Howo, sơ mi rơ moóc chuyên
                dụng trên toàn quốc. Với uy tín và chất lượng đã được khẳng định
                qua hàng ngàn chuyến xe lăn bánh, Hatico cam kết mang đến giải
                pháp vận tải tối ưu nhất cho doanh nghiệp.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-start group">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <div className="text-sm">
                  <span className="font-bold text-slate-200 block uppercase text-[10px]">
                    Trụ sở chính:
                  </span>
                  Tầng 5 tòa nhà số 430 Cầu Am, Vạn Phúc, Quận Hà Đông, TP. Hà
                  Nội.
                </div>
              </div>

              <div className="flex gap-3 items-start group">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <div className="text-sm">
                  <span className="font-bold text-slate-200 block uppercase text-[10px]">
                    Tổng kho:
                  </span>
                  95 Vũ Đức Thận, Việt Hưng, Long Biên, Hà Nội.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="flex gap-3 items-start group">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-1 group-hover:text-accent transition-colors" />
                  <div className="text-[13px]">
                    <span className="font-bold text-slate-400 block text-[9px] uppercase">
                      CN Miền Trung:
                    </span>
                    Km15+450 đường Tránh Vinh, xã Hưng Đạo, huyện Hưng Nguyên,
                    Nghệ An.
                  </div>
                </div>
                <div className="flex gap-3 items-start group">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-1 group-hover:text-accent transition-colors" />
                  <div className="text-[13px]">
                    <span className="font-bold text-slate-400 block text-[9px] uppercase">
                      CN Hoàng Mai:
                    </span>
                    Đường 36 – Hoàng Mai – Nghệ An.
                  </div>
                </div>
                <div className="flex gap-3 items-start group">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-1 group-hover:text-accent transition-colors" />
                  <div className="text-[13px]">
                    <span className="font-bold text-slate-400 block text-[9px] uppercase">
                      CN Quảng Trị:
                    </span>
                    Km4/500 đường Điện Biên Phủ, TP. Đông Hà, tỉnh Quảng Trị.
                  </div>
                </div>
                <div className="flex gap-3 items-start group">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-1 group-hover:text-accent transition-colors" />
                  <div className="text-[13px]">
                    <span className="font-bold text-slate-400 block text-[9px] uppercase">
                      CN Tây Nguyên:
                    </span>
                    Đường 10 tháng 3, phường Buôn Ma Thuột, Đắk Lắc.
                  </div>
                </div>
                <div className="flex gap-3 items-start group">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-1 group-hover:text-accent transition-colors" />
                  <div className="text-[13px]">
                    <span className="font-bold text-slate-400 block text-[9px] uppercase">
                      CN Đồng Nai:
                    </span>
                    Võ Nguyên Giáp, Biên Hoà, Đồng Nai.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links / Contact */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">
              LIÊN HỆ
            </h3>
            <div className="flex flex-col gap-4">
              <a
                href="tel:0988372222"
                className="flex items-center gap-3 text-sm hover:text-white transition-colors group"
              >
                <div className="p-2 bg-slate-900 rounded-sm group-hover:bg-accent transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                0988 37 2222
              </a>
              <a
                href="mailto:hainguyen.hatico@gmail.com"
                className="flex items-center gap-3 text-sm hover:text-white transition-colors group"
              >
                <div className="p-2 bg-slate-900 rounded-sm group-hover:bg-accent transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                hainguyen.hatico@gmail.com
              </a>
              <a
                href="https://www.mooc-hatico.com.vn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm hover:text-white transition-colors group"
              >
                <div className="p-2 bg-slate-900 rounded-sm group-hover:bg-accent transition-colors">
                  <Globe className="w-4 h-4" />
                </div>
                www.mooc-hatico.com.vn
              </a>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                Mạng lưới phân phối
              </h4>
              <p className="text-[10px] text-slate-500 leading-relaxed uppercase">
                Lạng sơn, Yên bái, Điện biên, Sơn La, Hoà Bình, Lai Châu, Hà
                Giang, Cao Bằng, Bắc Kạn, Tuyên Quang, Thái Nguyên, Phú Thọ, Bắc
                Giang, Quảng Ninh, Bắc Ninh, Hà Nam, Hà Nội... và 63 tỉnh thành
                trên toàn quốc.
              </p>
            </div>
          </div>

          {/* Connect */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">
              KẾT NỐI VỚI CHÚNG TÔI
            </h3>

            <Link
              href="https://www.facebook.com/C%C3%B4ng-Ty-C%E1%BB%95-Ph%E1%BB%91-XNK-Qu%E1%BB%91c-T%E1%BB%91-HATICO-107775845210064"
              target="_blank"
              className="group p-4 bg-slate-900 border border-slate-800 rounded-sm hover:border-accent/50 transition-all duration-300 flex items-start gap-4"
            >
              <div className="p-2 bg-blue-600 rounded-sm text-white">
                <Share2 className="w-5 h-5" />
              </div>
              <div className="flex-1 overflow-hidden">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">
                  Theo dõi trên Facebook
                </span>
                <span className="text-xs text-slate-300 truncate block group-hover:text-white transition-colors">
                  fb.com/HATICO.International
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>

            <div className="flex gap-3">
              {[
                { icon: Link2, color: "hover:bg-sky-500" },
                { icon: Play, color: "hover:bg-red-600" },
                { icon: Camera, color: "hover:bg-pink-600" },
              ].map((social, i) => (
                <button
                  key={i}
                  className={`w-10 h-10 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-sm transition-all duration-300 ${social.color} hover:text-white hover:-translate-y-1`}
                >
                  <social.icon className="w-5 h-5" />
                </button>
              ))}
            </div>

            <div className="h-[1px] bg-slate-800 w-full my-2" />

            <p className="text-[11px] text-slate-500 italic">
              "Chuyên cung cấp các dòng Sơ mi rơ moóc khung mui, moóc ben, moóc
              xương, moóc sàn và xe titec uy tín hàng đầu Việt Nam."
            </p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 uppercase tracking-widest font-medium">
          <p>© {new Date().getFullYear()} HATICO. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <Link href="/login" className="hover:text-white transition-colors">
              Dành cho nhân viên
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
