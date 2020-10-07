/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.viettel.coms.bo.DmpnOrderBO;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "DMPN_ORDERBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class DmpnOrderDTO extends ComsBaseFWDTO<DmpnOrderBO> {

    private java.lang.Long dmpnOrderId;
    private java.lang.Long sysGroupId;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.Long goodsId;
    private java.lang.String goodsCode;
    private java.lang.String goodsName;
    private java.lang.Double quantity;
    private java.lang.String unitName;
    private java.lang.Long catUnitId;
    private java.lang.String description;
    private java.lang.Long detailMonthPlanId;
    private java.util.Date createdDate;
    private java.lang.Long createdUserId;
    private java.lang.Long createdGroupId;
    private java.util.Date updatedDate;
    private java.lang.Long updatedUserId;
    private java.lang.Long updatedGroupId;
    private String errorFilePath;
    private String unitCode;

    @Override
    public DmpnOrderBO toModel() {
        DmpnOrderBO dmpnOrderBO = new DmpnOrderBO();
        dmpnOrderBO.setDmpnOrderId(this.dmpnOrderId);
        dmpnOrderBO.setSysGroupId(this.sysGroupId);
        dmpnOrderBO.setMonth(this.month);
        dmpnOrderBO.setYear(this.year);
        dmpnOrderBO.setGoodsId(this.goodsId);
        dmpnOrderBO.setGoodsCode(this.goodsCode);
        dmpnOrderBO.setGoodsName(this.goodsName);
        dmpnOrderBO.setQuantity(this.quantity);
        dmpnOrderBO.setUnitName(this.unitName);
        dmpnOrderBO.setCatUnitId(this.catUnitId);
        dmpnOrderBO.setDescription(this.description);
        dmpnOrderBO.setDetailMonthPlanId(this.detailMonthPlanId);
        dmpnOrderBO.setCreatedDate(this.createdDate);
        dmpnOrderBO.setCreatedUserId(this.createdUserId);
        dmpnOrderBO.setCreatedGroupId(this.createdGroupId);
        dmpnOrderBO.setUpdatedDate(this.updatedDate);
        dmpnOrderBO.setUpdatedUserId(this.updatedUserId);
        dmpnOrderBO.setUpdatedGroupId(this.updatedGroupId);
        return dmpnOrderBO;
    }

    public String getUnitCode() {
        return unitCode;
    }

    public void setUnitCode(String unitCode) {
        this.unitCode = unitCode;
    }

    public String getErrorFilePath() {
        return errorFilePath;
    }

    public void setErrorFilePath(String errorFilePath) {
        this.errorFilePath = errorFilePath;
    }

    @Override
    public Long getFWModelId() {
        return dmpnOrderId;
    }

    @Override
    public String catchName() {
        return getDmpnOrderId().toString();
    }

    public java.lang.Long getDmpnOrderId() {
        return dmpnOrderId;
    }

    public void setDmpnOrderId(java.lang.Long dmpnOrderId) {
        this.dmpnOrderId = dmpnOrderId;
    }

    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public java.lang.Long getMonth() {
        return month;
    }

    public void setMonth(java.lang.Long month) {
        this.month = month;
    }

    public java.lang.Long getYear() {
        return year;
    }

    public void setYear(java.lang.Long year) {
        this.year = year;
    }

    public java.lang.Long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(java.lang.Long goodsId) {
        this.goodsId = goodsId;
    }

    public java.lang.String getGoodsCode() {
        return goodsCode;
    }

    public void setGoodsCode(java.lang.String goodsCode) {
        this.goodsCode = goodsCode;
    }

    public java.lang.String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(java.lang.String goodsName) {
        this.goodsName = goodsName;
    }

    public java.lang.Double getQuantity() {
        return quantity;
    }

    public void setQuantity(java.lang.Double quantity) {
        this.quantity = quantity;
    }

    public java.lang.String getUnitName() {
        return unitName;
    }

    public void setUnitName(java.lang.String unitName) {
        this.unitName = unitName;
    }

    public java.lang.Long getCatUnitId() {
        return catUnitId;
    }

    public void setCatUnitId(java.lang.Long catUnitId) {
        this.catUnitId = catUnitId;
    }

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    public java.lang.Long getDetailMonthPlanId() {
        return detailMonthPlanId;
    }

    public void setDetailMonthPlanId(java.lang.Long detailMonthPlanId) {
        this.detailMonthPlanId = detailMonthPlanId;
    }

    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    public java.lang.Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(java.lang.Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    public java.lang.Long getCreatedGroupId() {
        return createdGroupId;
    }

    public void setCreatedGroupId(java.lang.Long createdGroupId) {
        this.createdGroupId = createdGroupId;
    }

    public java.util.Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(java.util.Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public java.lang.Long getUpdatedUserId() {
        return updatedUserId;
    }

    public void setUpdatedUserId(java.lang.Long updatedUserId) {
        this.updatedUserId = updatedUserId;
    }

    public java.lang.Long getUpdatedGroupId() {
        return updatedGroupId;
    }

    public void setUpdatedGroupId(java.lang.Long updatedGroupId) {
        this.updatedGroupId = updatedGroupId;
    }

}
