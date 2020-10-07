package com.viettel.asset.dto;

public class ResultInfo {

    public static final String RESULT_OK = "OK";
    public static final String RESULT_NOK = "NOK";
    public static final String RESULT_NOK1 = "NOK1";
    public static final String RESULT_NOK2 = "NOK2";
    public static final String RESULT_NOK3 = "NOK3";


    private String status;
    private String message;


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


}
