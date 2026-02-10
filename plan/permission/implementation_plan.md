# Role-Based Access Control & Admin Dashboard

Triển khai phân quyền admin/user với dashboard quản lý hồ sơ tuyển sinh.

## Design System

| Element | Value |
|---------|-------|
| **Style** | Dark Mode (OLED) |
| **Primary** | `#0F172A` |
| **Secondary** | `#1E293B` |
| **CTA/Success** | `#22C55E` (emerald) |
| **Background** | `#020617` |
| **Text** | `#F8FAFC` |
| **Fonts** | Fira Code (headings) / Fira Sans (body) |
| **Effects** | Minimal glow, smooth transitions (150-300ms) |

---

## Proposed Changes

### Backend

#### [NEW] API: Create Admin Account
`POST /api/auth/register-admin` - Tạo account Admin từ môi trường (`ADMIN_EMAIL`, `ADMIN_PASSWORD`)

#### [MODIFY] [application.controller.ts](file:///Users/ledat/Documents/Software/Vibe%20code/website-tuyển-sinh/backend/src/modules/application/application.controller.ts)
- Thêm `getApplicationStats()` cho thống kê

#### [MODIFY] [application.routes.ts](file:///Users/ledat/Documents/Software/Vibe%20code/website-tuyển-sinh/backend/src/modules/application/application.routes.ts)
- Route `GET /stats` (admin-only)

---

### Frontend - Admin Dashboard

#### [NEW] `app/admin/page.tsx`
Dashboard với thống kê và quick actions

#### [NEW] `app/admin/applications/page.tsx`
Bảng danh sách applications với filter/search

#### [NEW] `app/admin/applications/[id]/page.tsx`
Chi tiết + form approve/reject + đặt lịch hẹn

#### [NEW] `components/admin/*`
- `ApplicationTable.tsx`
- `StatusBadge.tsx`
- `AppointmentForm.tsx`

---

### Frontend - User Enhancements

#### [MODIFY] `applications/[id]/page.tsx`
Hiển thị lịch hẹn và reviewNotes

---

## Additional Features (8)

1. **Dashboard Analytics** - Biểu đồ trends
2. **Export CSV/Excel** - Export danh sách
3. **Bulk Actions** - Approve/Reject nhiều đơn
4. **Email Templates** - Customize nội dung email
5. **Notification Center** - Bell icon thông báo
6. **Audit Log** - Lịch sử thao tác admin
7. **Calendar View** - Xem appointments trên lịch
8. **Interview Notes** - Ghi chú kết quả phỏng vấn

---

## Verification Plan

1. Đăng nhập Admin (`ADMIN_EMAIL`) → Truy cập `/admin`
2. Xem danh sách applications → Filter theo status
3. Approve một đơn + đặt lịch hẹn → Kiểm tra email được gửi
4. User xem `/applications/[id]` → Thấy lịch hẹn
