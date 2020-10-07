package com.viettel.aio.config;

public enum AIOErrorType {
    CONTRACT_FINISHED("Hợp đồng đã nghiệm thu, không thể sửa!"),
    DETAIL_MISMATCH("Thông tin gói không khớp, hãy về màn hình chính thao tác lại!"),
    CONTRACT_HAS_DETAIL_COMPLETE("Hợp đồng có công việc đã hoàn thành, không thể chỉnh sửa!"),
    NOT_AUTHORIZE("Không có quyền"),
    ENCRYPT_ERROR("Lỗi mã hóa dữ liệu"),
    NOT_FOUND("Không tìm thấy"),
    SAVE_ERROR("Lưu thất bại"),
    TRANSACTION_FAILED("Giao dịch thất bại"),
    EMPTY_REQUEST("Không có dữ liệu gửi lên"),
    NOT_ENOUGH_INFO("Thiếu thông tin"),
    WRONG_TYPE("Sai loại giao dịch"),
    NOT_VALID("Nội dung không hợp lệ"),
    ALREADY_PAID("Hợp đồng đã thanh toán"),
    DUPLICATE("Đã tồn tại"),
    USER_NOT_LOGGED_IN("Không tìm thấy user đăng nhập!"),
    WRONG_STATUS("Sai trạng thái"),
    ACTION_FAILED("Thao tác thất bại"),
    SEND_SMS_EMAIL_ERROR("Gửi tin nhắn/ email thất bại"),
    GOODS_NOT_IN_STOCK("Hàng hóa không tồn tại trong kho xuất của người dùng"),
    INSUFFICIENT_GOODS_IN_STOCK("Số lượng hàng tồn kho không đủ, vui lòng kiểm tra lại hàng hóa trong kho"),
    NOT_FOUND_STOCKS_TRANS_DETAIL_EMPLOYEE("Hàng hóa không tồn tại trong kho xuất của người dùng"),
    NOT_FOUND_STOCKS_TRANS_EMPLOYEE("KHO NHÂN VIÊN KHÔNG TỒN TẠI"),
    NOT_ENOUGHT_GOODS_STOCKS_TRANS("Số lượng hàng tồn kho không đủ"),
    STOCK_PRICE_BELOW_SALE_PRICE("Giá bán nhỏ hơn giá vốn, không thể kết thúc HĐ!")
    ;

    public final String msg;

    AIOErrorType(String msg) {
        this.msg = msg;
    }
}
