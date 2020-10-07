/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.SynStockTransDetailSerialBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "SYN_STOCK_TRANS_DETAIL_SERIALBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class SynStockTransDetailSerialDTO extends ComsBaseFWDTO<SynStockTransDetailSerialBO> {

    private java.lang.Long synStockTransDetailSerId;
    private java.lang.Long merEntityId;
    private java.lang.String serial;
    private java.lang.Long goodsId;
    private java.lang.String goodsCode;
    private java.lang.String goodsName;
    private java.lang.String goodsState;
    private java.lang.String goodsStateName;
    private java.lang.Double unitPrice;
    private java.lang.Long synStockTransId;
    private java.lang.Long synStockTransDetailId;
    private java.lang.String constructionCode;
    private java.lang.Long typeExport;
    private java.lang.Long idDetail;
    private java.lang.String partNumber;
    private java.lang.String nameCountry;
    private java.lang.String nameMan;
    private java.lang.String contractCode;

    public java.lang.String getContractCode() {
        return contractCode;
    }

    public void setContractCode(java.lang.String contractCode) {
        this.contractCode = contractCode;
    }

    public java.lang.String getPartNumber() {
        return partNumber;
    }

    public void setPartNumber(java.lang.String partNumber) {
        this.partNumber = partNumber;
    }

    public java.lang.String getNameCountry() {
        return nameCountry;
    }

    public void setNameCountry(java.lang.String nameCountry) {
        this.nameCountry = nameCountry;
    }

    public java.lang.String getNameMan() {
        return nameMan;
    }

    public void setNameMan(java.lang.String nameMan) {
        this.nameMan = nameMan;
    }

    public java.lang.Long getTypeExport() {
        return typeExport;
    }

    public void setTypeExport(java.lang.Long typeExport) {
        this.typeExport = typeExport;
    }

    public java.lang.Long getIdDetail() {
        return idDetail;
    }

    public void setIdDetail(java.lang.Long idDetail) {
        this.idDetail = idDetail;
    }

    @Override
    public SynStockTransDetailSerialBO toModel() {
        SynStockTransDetailSerialBO synStockTransDetailSerialBO = new SynStockTransDetailSerialBO();
        synStockTransDetailSerialBO.setSynStockTransDetailSerId(this.synStockTransDetailSerId);
        synStockTransDetailSerialBO.setMerEntityId(this.merEntityId);
        synStockTransDetailSerialBO.setSerial(this.serial);
        synStockTransDetailSerialBO.setGoodsId(this.goodsId);
        synStockTransDetailSerialBO.setGoodsCode(this.goodsCode);
        synStockTransDetailSerialBO.setGoodsName(this.goodsName);
        synStockTransDetailSerialBO.setGoodsState(this.goodsState);
        synStockTransDetailSerialBO.setGoodsStateName(this.goodsStateName);
        synStockTransDetailSerialBO.setUnitPrice(this.unitPrice);
        synStockTransDetailSerialBO.setSynStockTransId(this.synStockTransId);
        synStockTransDetailSerialBO.setSynStockTransDetailId(this.synStockTransDetailId);
        synStockTransDetailSerialBO.setConstructionCode(this.constructionCode);
        return synStockTransDetailSerialBO;
    }

    public java.lang.Long getSynStockTransDetailSerId() {
        return synStockTransDetailSerId;
    }

    public void setSynStockTransDetailSerId(java.lang.Long synStockTransDetailSerId) {
        this.synStockTransDetailSerId = synStockTransDetailSerId;
    }

    public java.lang.Long getMerEntityId() {
        return merEntityId;
    }

    public void setMerEntityId(java.lang.Long merEntityId) {
        this.merEntityId = merEntityId;
    }

    public java.lang.String getSerial() {
        return serial;
    }

    public void setSerial(java.lang.String serial) {
        this.serial = serial;
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

    public java.lang.String getGoodsState() {
        return goodsState;
    }

    public void setGoodsState(java.lang.String goodsState) {
        this.goodsState = goodsState;
    }

    public java.lang.String getGoodsStateName() {
        return goodsStateName;
    }

    public void setGoodsStateName(java.lang.String goodsStateName) {
        this.goodsStateName = goodsStateName;
    }

    public java.lang.Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(java.lang.Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public java.lang.Long getSynStockTransId() {
        return synStockTransId;
    }

    public void setSynStockTransId(java.lang.Long synStockTransId) {
        this.synStockTransId = synStockTransId;
    }

    @Override
    public Long getFWModelId() {
        return synStockTransDetailId;
    }

    @Override
    public String catchName() {
        return getSynStockTransDetailId().toString();
    }

    public java.lang.Long getSynStockTransDetailId() {
        return synStockTransDetailId;
    }

    public void setSynStockTransDetailId(java.lang.Long synStockTransDetailId) {
        this.synStockTransDetailId = synStockTransDetailId;
    }

    public java.lang.String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(java.lang.String constructionCode) {
        this.constructionCode = constructionCode;
    }

}
