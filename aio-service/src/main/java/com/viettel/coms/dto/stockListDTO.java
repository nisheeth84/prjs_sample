package com.viettel.coms.dto;

public class stockListDTO extends SynStockTransDetailDTO {
    private String serial;
    private Double unitPrice;
    private Long synType;
    private Double total1;
    private Long stt;

    public Long getStt() {
        return stt;
    }

    public void setStt(Long stt) {
        this.stt = stt;
    }

    public void setTotal1(Double total1) {
        this.total1 = total1;
    }

    public Double getTotal1() {
        return total1;
    }

    public void setTotal(Double total1) {
        this.total1 = total1;
    }

    public Long getSynType() {
        return synType;
    }

    public void setSynType(Long synType) {
        this.synType = synType;
    }

    public String getSerial() {
        return serial;
    }

    public void setSerial(String serial) {
        this.serial = serial;
    }

    public Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }

}
