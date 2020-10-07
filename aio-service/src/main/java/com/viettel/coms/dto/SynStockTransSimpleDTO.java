package com.viettel.coms.dto;

public class SynStockTransSimpleDTO extends SynStockTransDetailDTO {

    private Double amountPX; // SL trong phiếu xuất
    private Double amountNT; // SL nghiệm thu
    private Double amountDTH; // SL đã thu hồi
    private Double amountDYCTH;// SL đã y/c thu hồi"
    private Long constructionId;
    private Long merentityId;
    private Double consQuantity;

    public Double getConsQuantity() {
        return consQuantity;
    }

    public void setConsQuantity(Double consQuantity) {
        this.consQuantity = consQuantity;
    }

    public Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(Long constructionId) {
        this.constructionId = constructionId;
    }

    public Long getMerentityId() {
        return merentityId;
    }

    public void setMerentityId(Long merentityId) {
        this.merentityId = merentityId;
    }

    public String getSerial() {
        return serial;
    }

    public void setSerial(String serial) {
        this.serial = serial;
    }

    private String serial;

    public Double getAmountPX() {
        return amountPX;
    }

    public void setAmountPX(Double amountPX) {
        this.amountPX = amountPX;
    }

    public Double getAmountNT() {
        return amountNT;
    }

    public void setAmountNT(Double amountNT) {
        this.amountNT = amountNT;
    }

    public Double getAmountDTH() {
        return amountDTH;
    }

    public void setAmountDTH(Double amountDTH) {
        this.amountDTH = amountDTH;
    }

    public Double getAmountDYCTH() {
        return amountDYCTH;
    }

    public void setAmountDYCTH(Double amountDYCTH) {
        this.amountDYCTH = amountDYCTH;
    }

}
