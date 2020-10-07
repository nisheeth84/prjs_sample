package com.viettel.aio.config;

public enum ErrorCodeVTP {
    OK("00"),
    NOT_OK("01"),
    WRONG_CHECKSUM("02"),
    EXCEPTION("03");

    public final String code;

    ErrorCodeVTP(String code) {
        this.code = code;
    }
}
