# So sánh Vanilla JavaScript và React

Project gồm hai phiên bản của ứng dụng quản lý thư viện:

- `b1-vanillajs`: JavaScript thuần.
- `b2-reactjs`: React + TypeScript.

## Chức năng

Cả hai phiên bản đều có tìm kiếm, lọc thể loại, thêm/xóa sách, yêu thích, lưu `localStorage` và đổi giao diện sáng/tối.

## So sánh

| Vanilla JavaScript | React |
| --- | --- |
| Thao tác DOM trực tiếp bằng `document` | Render giao diện bằng JSX |
| Dữ liệu nằm trong biến và được cập nhật thủ công | Dữ liệu được quản lý bằng `state` |
| Phải tự tạo, xóa và render lại các phần tử HTML | React tự cập nhật giao diện khi state thay đổi |
| Event listener được đăng ký thủ công | Dùng `onClick`, `onChange`, `onSubmit` |
| Logic tập trung chủ yếu trong `main.js` | Chia thành `App`, `BookList`, `Form` và API |
| Phù hợp với trang nhỏ, ít trạng thái | Phù hợp với ứng dụng nhiều tương tác, dễ mở rộng |

## Kết luận

Vanilla JavaScript đơn giản và ít dependency hơn. React có cấu trúc rõ ràng hơn, giúp quản lý state và tái sử dụng component thuận tiện hơn khi ứng dụng phát triển.

## Chạy project

Trong thư mục của từng phiên bản:

```bash
npm install
npm run dev
```
