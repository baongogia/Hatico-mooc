// Xuất các kiểu dữ liệu dùng định nghĩa chung cho toàn dự án
export interface MainNavItem {
  title: string;
  href: string;
  disabled?: boolean;
}

export interface SidebarNavItem {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: string;
}

export interface SiteNavItem extends MainNavItem {}
