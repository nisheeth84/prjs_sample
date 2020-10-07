package com.viettel.aio.dto;

import org.codehaus.jackson.annotate.JsonProperty;

public class AIOMochaResponse extends AIOBaseDTO {

    private int error;
    private String desc;

    public int getError() {
        return error;
    }

    public void setError(int error) {
        this.error = error;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }
}
