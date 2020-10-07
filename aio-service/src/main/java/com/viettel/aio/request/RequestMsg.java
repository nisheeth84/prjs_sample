package com.viettel.aio.request;

import org.codehaus.jackson.map.annotate.JsonSerialize;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class RequestMsg<T> {
    public String getServiceCode() {
        return serviceCode;
    }

    public void setServiceCode(String serviceCode) {
        this.serviceCode = serviceCode;
    }



    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    private String serviceCode;
    private T data;
}
