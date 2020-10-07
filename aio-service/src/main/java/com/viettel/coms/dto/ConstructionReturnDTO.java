/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.ConstructionReturnBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author chinhpxn20180620
 */
@XmlRootElement(name = "CONSTRUCTION_RETURNBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ConstructionReturnDTO extends ComsBaseFWDTO<ConstructionReturnBO> {

    private java.lang.Long constructionReturnId;
    private java.lang.Long constructionId;
    private java.lang.Long goodsId;
    private java.lang.Long workItemId;
    private java.lang.String goodsCode;
    private java.lang.String goodsName;
    private java.lang.String goodsUnitName;
    private java.lang.Long merEntityId;
    private java.lang.Double quantity;
    private java.lang.Double slConLai;
    private java.lang.String serial;

    public java.lang.Double getSlConLai() {
        return slConLai;
    }

    public void setSlConLai(java.lang.Double slConLai) {
        this.slConLai = slConLai;
    }

    public java.lang.Long getConstructionReturnId() {
        return constructionReturnId;
    }

    public void setConstructionReturnId(java.lang.Long constructionReturnId) {
        this.constructionReturnId = constructionReturnId;
    }

    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    public java.lang.Long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(java.lang.Long goodsId) {
        this.goodsId = goodsId;
    }

    public java.lang.Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(java.lang.Long workItemId) {
        this.workItemId = workItemId;
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

    public java.lang.String getGoodsUnitName() {
        return goodsUnitName;
    }

    public void setGoodsUnitName(java.lang.String goodsUnitName) {
        this.goodsUnitName = goodsUnitName;
    }

    public java.lang.Long getMerEntityId() {
        return merEntityId;
    }

    public void setMerEntityId(java.lang.Long merEntityId) {
        this.merEntityId = merEntityId;
    }

    public java.lang.Double getQuantity() {
        return quantity;
    }

    public void setQuantity(java.lang.Double quantity) {
        this.quantity = quantity;
    }

    public java.lang.String getSerial() {
        return serial;
    }

    public void setSerial(java.lang.String serial) {
        this.serial = serial;
    }

    @Override
    public String catchName() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Long getFWModelId() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public ConstructionReturnBO toModel() {
        ConstructionReturnBO constructionReturnBO = new ConstructionReturnBO();
        constructionReturnBO.setConstructionReturnId(this.constructionReturnId);
        constructionReturnBO.setGoodsName(this.goodsName);
        constructionReturnBO.setGoodsCode(this.goodsCode);
        constructionReturnBO.setGoodsUnitName(this.goodsUnitName);
        constructionReturnBO.setGoodsId(this.goodsId);
        constructionReturnBO.setMerEntityId(this.merEntityId);
        constructionReturnBO.setQuantity(this.quantity);
        constructionReturnBO.setConstructionId(this.constructionId);
        constructionReturnBO.setSerial(this.serial);
        constructionReturnBO.setWorkItemId(this.workItemId);
        return constructionReturnBO;
    }

}
