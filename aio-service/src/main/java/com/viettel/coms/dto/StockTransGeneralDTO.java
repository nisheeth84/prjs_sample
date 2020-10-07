/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import java.util.Date;

public class StockTransGeneralDTO extends SynStockTransDetailDTO {

    private Double assetQuantity;
    private Double consQuantity;
    private Double remainQuantity;
    private Double amountReal;
    private Long merEntityId;
    private String serial;
    private Long constructionMerchadiseId;
    private java.lang.Double unitPrice;
    private Double numberXuat;
    private Double numberThuhoi;
    private Double numberSuDung;
    private Long employ;
    private Long constructionId;
    private Double quantity;
    private Double conMerquantity;
    private Double slcl;
    private Date realIeTransDate;
    private Long detailSerial;

    public Double getAmountReal() {
        return amountReal;
    }

    public void setAmountReal(Double amountReal) {
        this.amountReal = amountReal;
    }

    public String getSerial() {
        return serial;
    }

    public void setSerial(String serial) {
        this.serial = serial;
    }

    public java.lang.Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(java.lang.Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Double getAssetQuantity() {
        return assetQuantity;
    }

    public void setAssetQuantity(Double assetQuantity) {
        this.assetQuantity = assetQuantity;
    }

    public Double getConsQuantity() {
        return consQuantity;
    }

    public void setConsQuantity(Double consQuantity) {
        this.consQuantity = consQuantity;
    }

    public Double getRemainQuantity() {
        return remainQuantity;
    }

    public void setRemainQuantity(Double remainQuantity) {
        this.remainQuantity = remainQuantity;
    }

    public Long getMerEntityId() {
        return merEntityId;
    }

    public void setMerEntityId(Long merEntityId) {
        this.merEntityId = merEntityId;
    }

    public Long getConstructionMerchadiseId() {
        return constructionMerchadiseId;
    }

    public void setConstructionMerchadiseId(Long constructionMerchadiseId) {
        this.constructionMerchadiseId = constructionMerchadiseId;
    }

    public Double getNumberXuat() {
        return numberXuat;
    }

    public void setNumberXuat(Double numberXuat) {
        this.numberXuat = numberXuat;
    }

    public Double getNumberThuhoi() {
        return numberThuhoi;
    }

    public void setNumberThuhoi(Double numberThuhoi) {
        this.numberThuhoi = numberThuhoi;
    }

    public Long getEmploy() {
        return employ;
    }

    public void setEmploy(Long employ) {
        this.employ = employ;
    }

    public Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(Long constructionId) {
        this.constructionId = constructionId;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getConMerquantity() {
        return conMerquantity;
    }

    public void setConMerquantity(Double conMerquantity) {
        this.conMerquantity = conMerquantity;
    }

    public Double getSlcl() {
        return slcl;
    }

    public void setSlcl(Double slcl) {
        this.slcl = slcl;
    }

    public Double getNumberSuDung() {
        return numberSuDung;
    }

    public void setNumberSuDung(Double numberSuDung) {
        this.numberSuDung = numberSuDung;
    }

    public Date getRealIeTransDate() {
        return realIeTransDate;
    }

    public void setRealIeTransDate(Date realIeTransDate) {
        this.realIeTransDate = realIeTransDate;
    }

    public Long getDetailSerial() {
        return detailSerial;
    }

    public void setDetailSerial(Long detailSerial) {
        this.detailSerial = detailSerial;
    }

}
