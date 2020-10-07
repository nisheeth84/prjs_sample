package com.viettel.aio.config;


public enum AIOObjectType {
    USER("Thông tin đăng nhập"),
    TRANSACTION("Thông tin giao dịch"),
    CONTRACT("Hợp đồng"),
    TOKEN("Mã thanh toán"),
    RESPONSE("Dữ liệu trả về"),
    DEPLOY("Điều phối"),
    GROUP_PRODUCT("Hạng mục"),
    PRICE_LIST("Gói giá"),
    PRODUCT("Sản phẩm"),
    ATTACH_IMAGE("Ảnh đính kèm"),
    GOODS("Hàng hóa"),
    ORDER_REQUEST("Yêu cầu đặt hàng"),
    ORDER_REQUEST_DETAIL("Chi tiết yêu cầu đặt hàng "),
    ORDER_BRANCH("Yêu cầu đặt hàng chi nhánh"),
    ORDER_BRANCH_DETAIL("Chi tiết yêu cầu đặt hàng chi nhánh"),
    ORDER_COMPANY("Yêu cầu đặt hàng công ty"),
    ORDER_COMPANY_DETAIL("Chi tiết yêu cầu đặt hàng công ty"),
    REGLECT("Phản ánh khách hàng"),
    REGLECT_DETAIL("Chi tiết phản ánh"),
    REQUEST_BHSC("Yêu cầu BHSC"),
    REQUEST_BHSC_DETAIL("Chi tiết yêu cầu BHSC"),
    PACKAGE_PROMOTION("Thông tin khuyến mãi"),
    ORDERS("Yêu cầu khảo sát"),
    CONFIG_SALARY("Tỉ lệ tính lương"),
    CATEGORY_PRODUCT("Danh mục"),
    GROUP_ERROR("Trường hợp lỗi"),
    CATEGORY_PRODUCT_PRICE("Dải giá tìm kiếm"),
    COMMON_ERROR("Lỗi thường gặp"),
    WO_GOODS("Yêu cầu hàng hóa"),
    WO_GOODS_DETAIL("Chi tiết yêu cầu hàng hóa");


    private final String name;

    AIOObjectType(String name) {
        this.name = name;
    }

    public String getName() {
        return ": " + name;
    }

    public String getNameNoColon() {
        return name;
    }
}
