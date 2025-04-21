# Sử dụng

## Cài đặt Nodejs version 20 ( Nếu đã có thì bỏ qua )
> Kiểm tra phiên bản Nodejs đang áp dụng

`node --version`

> Tải các gói thư viện cần thiết

`npm ci`

> Chạy dự án ở chế độ phát triển ( dành cho lập trình viên )

`npm run dev`

> Đóng gói dự án phục vụ cho môi trường chính thức (môi trường sản xuất)

`npm run build`


# Tổ chức mã nguồn

## router
> Cấu hình đường dẫn truy cập các trang

`src/router/index.js`

## views
> Chứa các tệp vue chứa nội dung hiển thị các trang

`src/views/*`

## services
> Thiết lập xử lý các yêu cầu gửi đến máy chủ qua API

`src/services/*`

## stores
> Quản lý trạng thái ứng dụng FE

`src/stores/template.js`

## layouts, components
> Chứa các bộ khung và các thành phần giao diện tái sử dụng

`src/layouts/*`

`src/components/*`