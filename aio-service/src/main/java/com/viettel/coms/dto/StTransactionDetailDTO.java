package com.viettel.coms.dto;

public class StTransactionDetailDTO extends StTransactionDTO {
    private String goodCode;
    private Long stockTransDetailId;
    //	private String goodName;
//	private String goodUnitName;
//	private Double amountReal;
    private String detailGoodName;
    private String detailGoodCode;
    private Double detailQuantity;
    private String detailSerial;
    private String detailCntContractCode;
    private String detailStockName;
    private String detailPartNumber;
    private String detailMerManufacturer;
    private String detailProducingCountryName;

    public String getGoodCode() {
        return goodCode;
    }

    public void setGoodCode(String goodCode) {
        this.goodCode = goodCode;
    }

    public Long getStockTransDetailId() {
        return stockTransDetailId;
    }

    public void setStockTransDetailId(Long stockTransDetailId) {
        this.stockTransDetailId = stockTransDetailId;
    }

    public String getDetailGoodName() {
        return detailGoodName;
    }

    public void setDetailGoodName(String detailGoodName) {
        this.detailGoodName = detailGoodName;
    }

    public String getDetailGoodCode() {
        return detailGoodCode;
    }

    public void setDetailGoodCode(String detailGoodCode) {
        this.detailGoodCode = detailGoodCode;
    }

    public Double getDetailQuantity() {
        return detailQuantity;
    }

    public void setDetailQuantity(Double detailQuantity) {
        this.detailQuantity = detailQuantity;
    }

    public String getDetailSerial() {
        return detailSerial;
    }

    public void setDetailSerial(String detailSerial) {
        this.detailSerial = detailSerial;
    }

    public String getDetailCntContractCode() {
        return detailCntContractCode;
    }

    public void setDetailCntContractCode(String detailCntContractCode) {
        this.detailCntContractCode = detailCntContractCode;
    }

    public String getDetailStockName() {
        return detailStockName;
    }

    public void setDetailStockName(String detailStockName) {
        this.detailStockName = detailStockName;
    }

    public String getDetailPartNumber() {
        return detailPartNumber;
    }

    public void setDetailPartNumber(String detailPartNumber) {
        this.detailPartNumber = detailPartNumber;
    }

    public String getDetailMerManufacturer() {
        return detailMerManufacturer;
    }

    public void setDetailMerManufacturer(String detailMerManufacturer) {
        this.detailMerManufacturer = detailMerManufacturer;
    }

    public String getDetailProducingCountryName() {
        return detailProducingCountryName;
    }

    public void setDetailProducingCountryName(String detailProducingCountryName) {
        this.detailProducingCountryName = detailProducingCountryName;
    }

}
