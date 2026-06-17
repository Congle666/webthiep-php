# JunTech - Thuê Thiệp Cưới Online

## Tổng Quan Dự Án

JunTech là một website chuyên nghiệp cho dịch vụ **thuê thiệp cưới online**. Website giới thiệu các mẫu thiệp cưới đẹp, hiện đại và cho phép người dùng chọn thuê mẫu thiệp phù hợp. Thiệp cưới online là dạng thiệp kỹ thuật số (digital invitation) gửi qua link, người dùng thuê thiệp theo gói thời gian.

## Tech Stack

- **Framework**: Vite + React (TypeScript)
- **Styling**: Vanilla CSS (CSS Modules hoặc global CSS) — KHÔNG dùng TailwindCSS
- **Font**: Google Fonts — `Inter` (body) + `Playfair Display` (headings/tiêu đề thiệp)
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Charts**: Recharts (biểu đồ dashboard admin)
- **Backend**: PHP thuần (PDO) + MySQL (XAMPP) — thư mục `backend/`
- **Routing**: React Router v6
- **State Management**: React Context API (đơn giản, không cần Redux)
- **Deployment**: Static hosting (Vercel/Netlify)

## Design System & Style Guide

### Phong Cách Tham Chiếu

Lấy cảm hứng thiết kế từ **ChungĐôi.com** (xem 4 ảnh landing tham chiếu — desktop + mobile):

- **Light-first design**: Nền trắng/sáng là chủ đạo, xen kẽ vài **section nền đen** tạo nhịp (testimonial, đa ngôn ngữ, footer)
- **Màu nhấn hồng/magenta**: Hồng tươi `#e6017e`-ish làm CTA, badge, accent — trẻ trung, hiện đại
- **Typography rõ ràng**: Heading đậm, vài từ nhấn được tô màu hồng hoặc in nghiêng
- **Hero có phone mockup**: Heading + CTA bên trái, 2-3 mockup điện thoại hiển thị thiệp bên phải, ảnh nền mờ
- **Showcase carousel 3D**: Mẫu thiệp dạng carousel có chiều sâu, mũi tên prev/next
- **Card-based**: Nhiều section dạng grid card (cảm hứng cặp đôi, cẩm nang), bo góc, shadow nhẹ
- **Scroll-based animations**: Fade-in + slide-up mượt khi scroll

### Color Palette

```css
:root {
  /* === LIGHT MODE (DEFAULT) === */
  --bg-primary: #ffffff;          /* Nền chính - trắng */
  --bg-secondary: #faf7f8;        /* Nền phụ - hồng trắng rất nhẹ */
  --bg-tertiary: #f4eef0;         /* Nền card/section nhạt */
  --bg-dark: #111014;             /* Nền section tối (testimonial, đa ngôn ngữ, footer) */
  --bg-dark-2: #1a1820;           /* Nền card trên nền tối */

  --text-primary: #1a1620;        /* Chữ chính - gần đen */
  --text-secondary: #6b6470;      /* Chữ phụ - xám tím */
  --text-muted: #9a93a0;          /* Chữ mờ */
  --text-on-dark: #fafafa;        /* Chữ trên nền tối */
  --text-on-dark-muted: #a1a1aa;  /* Chữ phụ trên nền tối */

  --accent-primary: #e6017e;      /* Hồng magenta chính - CTA */
  --accent-secondary: #c0106e;    /* Hồng đậm (hover) */
  --accent-light: #ff4da6;        /* Hồng sáng */
  --accent-soft: #fde4f1;         /* Hồng pastel nền badge */
  --accent-glow: rgba(230, 1, 126, 0.15);

  --border-default: #ece7ea;      /* Border sáng */
  --border-dark: #2a2730;         /* Border trên nền tối */

  --gradient-pink: linear-gradient(135deg, #e6017e 0%, #ff4da6 100%);
  --gradient-hero: radial-gradient(ellipse at 70% 20%, rgba(230,1,126,0.06) 0%, transparent 55%);
}
```

> Lưu ý: Web landing dùng **light mode mặc định** (đảo ngược so với bản JunTech cũ). Trang **thiệp cưới sống** (`/thiep/:slug`) giữ phong cách **đỏ truyền thống** riêng, không theo palette này.

### Typography

```css
/* Heading hierarchy */
h1 { font-family: 'Playfair Display', serif; font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; }
h2 { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 600; line-height: 1.2; }
h3 { font-family: 'Inter', sans-serif; font-size: clamp(1.25rem, 2vw, 1.75rem); font-weight: 600; }
body { font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.6; color: var(--text-secondary); }
```

### Spacing System

```
4px | 8px | 12px | 16px | 24px | 32px | 48px | 64px | 96px | 128px | 192px
```

- Giữa các section lớn: `128px` - `192px`
- Padding container: `max-width: 1200px; padding: 0 24px;`
- Card padding: `32px` - `48px`

### Border & Radius

- Card radius: `16px`
- Button radius: `8px`
- Small elements: `6px`
- Full round (badge/tag): `9999px`

### Hiệu Ứng & Animation

```css
/* Glassmorphism cho cards */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-default);
}

/* Gold glow effect */
.gold-glow {
  box-shadow: 0 0 40px rgba(212, 168, 83, 0.1), 0 0 80px rgba(212, 168, 83, 0.05);
}

/* Subtle hover lift */
.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* Scroll reveal animation (dùng Framer Motion) */
/* Mỗi section khi scroll tới sẽ fade in + slide up nhẹ */
/* Duration: 0.6s - 0.8s, ease: easeOut */
```

## Cấu Trúc Thư Mục

```
web-thiep/
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── assets/              # Hình ảnh, icons tĩnh
│   │   └── images/
│   ├── components/          # Components dùng chung
│   │   ├── common/          # Button, Badge, Card, Input, Modal
│   │   ├── layout/          # Header, Footer, Container, Section
│   │   └── ui/              # Các UI phức tạp hơn
│   ├── features/            # Feature-based modules
│   │   ├── home/            # Trang chủ
│   │   ├── templates/       # Danh sách mẫu thiệp + chi tiết mẫu
│   │   ├── pricing/         # Bảng giá
│   │   └── contact/         # Liên hệ / Đặt thuê
│   ├── hooks/               # Custom hooks
│   ├── context/             # React Context (theme, etc.)
│   ├── styles/              # Global CSS
│   │   ├── globals.css
│   │   ├── reset.css
│   │   └── variables.css
│   ├── data/                # Mock data (mẫu thiệp, giá, FAQ...)
│   ├── utils/               # Helper functions
│   ├── App.tsx
│   └── main.tsx
├── Claude.md
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Các Trang & Sections

### 1. Trang Chủ (`/`)

#### Hero Section
- **Layout**: Full-width, chiều cao ~100vh
- Heading lớn: **"Thiệp Cưới Online. Đẳng Cấp Mới."** (hoặc tương tự)
- Subheading: Mô tả ngắn dịch vụ thuê thiệp cưới online
- 2 CTA buttons: "Xem Mẫu Thiệp" (primary, gold) + "Tìm Hiểu Thêm" (secondary, outline)
- **Hiệu ứng**: Background có subtle radial gradient gold glow ở center, text animate fade-in từ dưới lên
- Logo row các đối tác/khách hàng (nếu có) hoặc số liệu thống kê (500+ mẫu, 10k+ khách hàng...)

#### Features Section — "Tại Sao Chọn JunTech?"
- Grid 3 cột (responsive → 1 cột mobile)
- Mỗi feature card: icon + tiêu đề + mô tả ngắn
- Các feature gợi ý:
  - 🎨 **Thiết kế độc quyền** — Hàng trăm mẫu thiệp được thiết kế riêng
  - ⚡ **Giao diện nhanh chóng** — Chỉ cần vài phút để có thiệp cưới hoàn chỉnh
  - 📱 **Tương thích mọi thiết bị** — Hiển thị đẹp trên điện thoại, tablet, máy tính
  - 🔗 **Chia sẻ dễ dàng** — Gửi link thiệp qua Zalo, Messenger, SMS
  - 🎵 **Nhạc nền lãng mạn** — Tùy chỉnh nhạc nền cho thiệp
  - ✏️ **Cá nhân hóa nội dung** — Thay đổi tên, ngày, địa điểm dễ dàng

#### Showcase Section — "Mẫu Thiệp Nổi Bật"
- Hiển thị 4-6 mẫu thiệp đẹp nhất dạng **grid/carousel**
- Mỗi card thiệp:
  - Ảnh preview (thumbnail đẹp, tỷ lệ ~3:4 hoặc 9:16)
  - Tên mẫu thiệp
  - Tag phân loại (Sang trọng / Hiện đại / Cổ điển / Minimalist)
  - Badge "HOT" hoặc "MỚI" nếu cần
  - Hover effect: overlay nhẹ + nút "Xem Chi Tiết"
- CTA cuối section: "Xem Tất Cả Mẫu →"

#### How It Works Section — "Quy Trình 3 Bước"
- Layout ngang, 3 bước kết nối bằng line/arrow
  1. **Chọn Mẫu** — Duyệt và chọn mẫu thiệp yêu thích
  2. **Cá Nhân Hóa** — Điền thông tin cưới, chọn nhạc, ảnh
  3. **Chia Sẻ** — Nhận link thiệp và gửi đến quan khách
- Animation: Mỗi bước animate tuần tự khi scroll tới

#### Testimonials Section
- Carousel hoặc grid 3 cột
- Mỗi testimonial: avatar + tên + nội dung nhận xét + số sao
- Background: subtle gradient hoặc pattern nhẹ

#### CTA Section — "Sẵn Sàng Tạo Thiệp Cưới?"
- Full-width, nền gradient gold nhẹ
- Heading + subtext + CTA button lớn
- Effect: glow vàng nhẹ xung quanh

### 2. Trang Mẫu Thiệp (`/mau-thiep`)

- **Filter bar**: Lọc theo danh mục (Sang trọng, Hiện đại, Cổ điển, Minimalist, Floral, Vintage)
- **Grid mẫu thiệp**: 3 cột desktop, 2 cột tablet, 1 cột mobile
- Mỗi card giống Showcase nhưng đầy đủ hơn:
  - Ảnh preview lớn
  - Tên mẫu + phân loại
  - Giá thuê (từ xxx.000đ)
  - Rating sao
  - Nút "Xem Demo" + "Thuê Ngay"
- **Pagination** hoặc **infinite scroll**

### 3. Trang Chi Tiết Mẫu (`/mau-thiep/:slug`)

- Hero: Preview thiệp lớn (có thể dạng mockup điện thoại)
- Thông tin mẫu: tên, mô tả, danh mục, tính năng
- Gallery ảnh preview (nhiều slide/section của thiệp)
- **Demo trực tiếp**: Nút "Xem Demo Thiệp" mở tab/modal preview thiệp thật
- Bảng giá gói thuê cho mẫu này
- CTA: "Thuê Mẫu Này" → chuyển tới form đặt thuê
- Section "Mẫu Tương Tự" ở cuối

### 4. Trang Bảng Giá (`/bang-gia`)

- 3 gói giá dạng card ngang hàng:
  - **Gói Cơ Bản** — Giá thấp, tính năng cơ bản
  - **Gói Cao Cấp** (RECOMMENDED badge) — Giá vừa, đầy đủ tính năng
  - **Gói VIP** — Giá cao, tùy chỉnh cao cấp + hỗ trợ riêng
- Mỗi card: tên gói, giá, danh sách tính năng (✓/✗), CTA button
- Gói giữa (recommended) nổi bật hơn: border gold, scale lớn hơn nhẹ
- FAQ section ở dưới (accordion)

### 5. Trang Liên Hệ / Đặt Thuê (`/lien-he`)

- Form liên hệ: Họ tên, SĐT, Email, Mẫu thiệp quan tâm, Ghi chú
- Thông tin liên hệ: Zalo, Facebook, Email, Hotline
- Bản đồ (tùy chọn) hoặc hình minh họa

### 6. Trang Thiệp Cưới Sống (`/thiep/:slug`)

- Trang độc lập (không Header/Footer site), phong cách **đỏ truyền thống** (Song Phụng Đỏ): nền giấy kem, phượng đỏ, Song Hỷ.
- Cover gate "Mở thiệp" + tên khách qua `?khach=`, auto-scroll khi mở, nhạc nền.
- Sections: thông tin lễ (nhà trai/gái), tên cô dâu chú rể, thời gian (đón khách/khai tiệc), lịch tháng, countdown, bản đồ, QR mừng cưới (VietQR), RSVP, sổ lưu bút.
- Edit mode `?edit`: kéo-thả chỉnh vị trí họa tiết.

### 7. Admin Panel (`/admin`)

Trang quản trị độc lập (login gate, role=admin). Sidebar điều hướng:

- **Dashboard**: thẻ số liệu + **biểu đồ Recharts**: line doanh thu theo thời gian, bar đơn hàng theo tháng, pie phân bố mẫu theo danh mục.
- **Đơn hàng**: danh sách + xác nhận thanh toán tay.
- **Mẫu thiệp**: CRUD (thêm/sửa/ẩn).
- **Thiệp sống**: danh sách thiệp đã tạo + RSVP / sổ lưu bút từng thiệp.
- **Gói giá / Testimonials**: sửa giá; thêm/xóa đánh giá landing.
- **Người dùng**: danh sách khách + admin.
- **Cài đặt**: thông tin liên hệ (hotline, Zalo, email) — lưu DB bảng `settings`.

## ⚠️ Làm mẫu thiệp mới

**TRƯỚC KHI thêm/sửa mẫu thiệp hoặc layout, ĐỌC:** [`docs/HUONG-DAN-LAM-MAU-THIEP.md`](docs/HUONG-DAN-LAM-MAU-THIEP.md)
— gồm kiến trúc (Layout × Theme × Decoration), quy trình thêm mẫu/layout, và **các sai lầm đã gặp phải tránh** (ảnh tĩnh, toạ độ theo header, z-index chữ/ảnh, clamp kéo-thả, encoding utf8mb4...).

## Components Chính

### Layout Components

| Component | Mô tả |
|-----------|--------|
| `Header` | Fixed top, backdrop-blur, logo trái + nav giữa + CTA phải. Shrink khi scroll. Mobile: hamburger menu |
| `Footer` | Logo + mô tả ngắn, links (Mẫu thiệp, Bảng giá, Liên hệ), thông tin liên hệ, social icons, copyright |
| `Container` | Max-width 1200px, center, padding responsive |
| `Section` | Wrapper cho mỗi section lớn, padding 128px top/bottom |

### UI Components

| Component | Mô tả |
|-----------|--------|
| `Button` | Variants: `primary` (gold fill), `secondary` (outline), `ghost`. Sizes: `sm`, `md`, `lg` |
| `Badge` | Tag nhỏ: "HOT", "MỚI", "PHỔ BIẾN". Màu gold/green/blue |
| `TemplateCard` | Card hiển thị mẫu thiệp (image, name, category, price, CTA) |
| `PricingCard` | Card gói giá (name, price, features list, CTA) |
| `TestimonialCard` | Card nhận xét (avatar, name, quote, stars) |
| `StepCard` | Card bước quy trình (number, icon, title, description) |
| `FilterBar` | Bộ lọc danh mục thiệp (tabs hoặc dropdown) |
| `Modal` | Overlay modal cho preview thiệp, form nhanh |
| `ThemeToggle` | Nút chuyển dark/light mode (icon mặt trời/trăng) |
| `ScrollReveal` | Wrapper component animate fade-in khi element vào viewport |

## Mock Data

### Mẫu Thiệp (Templates)

```typescript
interface Template {
  id: string;
  slug: string;
  name: string;                  // "Hoa Hồng Vàng", "Minimalist White"...
  category: 'luxury' | 'modern' | 'classic' | 'minimalist' | 'floral' | 'vintage';
  description: string;
  thumbnail: string;             // URL ảnh preview
  gallery: string[];             // Nhiều ảnh preview
  demoUrl: string;               // Link demo thiệp
  features: string[];            // ["Nhạc nền", "RSVP", "Countdown"...]
  priceFrom: number;             // Giá từ (VNĐ)
  rating: number;                // 4.5
  reviewCount: number;
  isNew: boolean;
  isHot: boolean;
  createdAt: string;
}
```

### Gói Giá (Pricing)

```typescript
interface PricingPlan {
  id: string;
  name: string;                  // "Cơ Bản", "Cao Cấp", "VIP"
  price: number;                 // VNĐ
  duration: string;              // "3 tháng", "6 tháng", "1 năm"
  features: { text: string; included: boolean }[];
  isRecommended: boolean;
  ctaText: string;
}
```

### Tạo ít nhất 8-12 mẫu thiệp mock data với tên tiếng Việt, mô tả hấp dẫn.

## Responsive Design

| Breakpoint | Giá trị | Đặc điểm |
|-----------|---------|-----------|
| Mobile | `< 640px` | 1 cột, hamburger menu, font nhỏ hơn |
| Tablet | `640px - 1024px` | 2 cột grid, nav vẫn hiện hoặc collapse |
| Desktop | `> 1024px` | Layout đầy đủ, 3-4 cột grid |

## SEO & Meta

- **Title**: `JunTech — Thuê Thiệp Cưới Online | Mẫu Đẹp, Giá Tốt`
- **Description**: `Dịch vụ thuê thiệp cưới online chuyên nghiệp. Hàng trăm mẫu thiệp đẹp, gửi link nhanh chóng qua Zalo, Messenger. Giá chỉ từ 199k.`
- **Keywords**: `thiệp cưới online, thuê thiệp cưới, thiệp cưới điện tử, wedding invitation online`
- Mỗi trang có `<title>` và `<meta description>` riêng
- Sử dụng semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<article>`)
- Mỗi trang 1 `<h1>` duy nhất

## Dark Mode / Light Mode

- **Dark mode là mặc định** (theo design reference)
- Toggle ở Header (icon Sun/Moon)
- Lưu preference vào `localStorage`
- Sử dụng CSS custom properties (variables) để switch theme
- Transition mượt khi chuyển theme: `transition: background-color 0.3s ease, color 0.3s ease;`
- Áp dụng class `[data-theme="light"]` lên `<html>` element

## Animations & Interactions

### Scroll Animations (Framer Motion)
- **Fade In Up**: Mặc định cho hầu hết sections — `opacity: 0 → 1`, `translateY: 30px → 0`
- **Stagger Children**: Cards trong grid xuất hiện tuần tự, delay 0.1s mỗi item
- **Scale In**: Cho hero elements, badges
- **Duration**: 0.5s - 0.8s | **Ease**: `easeOut`

### Hover Effects
- **Cards**: `translateY(-4px)` + shadow tăng
- **Buttons**: Brightness tăng nhẹ + subtle scale
- **Links**: Underline animate từ trái qua phải
- **Images**: Subtle zoom `scale(1.03)` trong container `overflow: hidden`

### Micro-interactions
- Theme toggle: Icon rotate khi switch
- Mobile menu: Slide-in từ phải
- Filter tabs: Active tab có underline animate slide
- Scroll progress bar ở top (optional, màu gold)

## Quy Tắc Code

1. **Component nhỏ gọn**: Mỗi component tối đa ~150 dòng, tách nếu lớn hơn
2. **CSS Module hoặc file CSS riêng** cho mỗi component/feature
3. **Không dùng inline styles** trừ dynamic values
4. **Tên class theo BEM** hoặc feature-based (vd: `.hero__title`, `.template-card__image`)
5. **TypeScript strict**: Định nghĩa interface/type cho mọi props và data
6. **Accessibility**: Mọi interactive element có `aria-label`, ảnh có `alt`, focus states rõ ràng
7. **Semantic HTML**: Dùng đúng tag (`<button>` thay `<div onClick>`, `<nav>`, `<main>`...)
8. **Performance**: Lazy load images, code splitting routes

## Lưu Ý Quan Trọng

- ❌ **KHÔNG** dùng TailwindCSS
- ❌ **KHÔNG** dùng placeholder image (dùng tool generate_image để tạo ảnh thật)
- ❌ **KHÔNG** để design trông basic/đơn giản — phải premium, sang trọng
- ✅ **CÓ** dark mode mặc định, giống style Resend.com
- ✅ **CÓ** responsive hoàn chỉnh
- ✅ **CÓ** animation mượt mà, tinh tế
- ✅ **CÓ** typography hierarchy rõ ràng
- ✅ **CÓ** gold accent color xuyên suốt
- ✅ Ngôn ngữ giao diện: **Tiếng Việt**
- ✅ Đơn vị tiền: **VNĐ** (định dạng: xxx.000đ)
