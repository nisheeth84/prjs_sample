package com.viettel.aio.config;

public enum AIOAttachmentType {
    CONTRACT_IMAGE("97"),
    PRODUCT_INFO_IMAGE("100"),
    CONTRACT_ATTACHMENT("101"),
    CATEGORY_PRODUCT_IMAGE("106"),
    AIO_ERROR_ATTACHMENT("111")
    ;

    public final String code;

    AIOAttachmentType(String code) {
        this.code = code;
    }
}
