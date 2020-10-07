package com.viettel.aio.config;

public enum AIOSaleChannel {
    VCC("VCC"),
    VTPOST("VTP");

    public final String code;

    private AIOSaleChannel(String code) {
        this.code = code;
    }
}
