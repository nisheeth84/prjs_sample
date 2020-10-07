/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.SynStockTransDetailSerialDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "SYN_STOCK_TRANS_DETAIL_SERIAL")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class SynStockTransDetailSerialBO extends BaseFWModelImpl {

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

    @Column(name = "SYN_STOCK_TRANS_DETAIL_SER_ID", length = 22)
    public java.lang.Long getSynStockTransDetailSerId() {
        return synStockTransDetailSerId;
    }

    public void setSynStockTransDetailSerId(java.lang.Long synStockTransDetailSerId) {
        this.synStockTransDetailSerId = synStockTransDetailSerId;
    }

    @Column(name = "MER_ENTITY_ID", length = 22)
    public java.lang.Long getMerEntityId() {
        return merEntityId;
    }

    public void setMerEntityId(java.lang.Long merEntityId) {
        this.merEntityId = merEntityId;
    }

    @Column(name = "SERIAL", length = 100)
    public java.lang.String getSerial() {
        return serial;
    }

    public void setSerial(java.lang.String serial) {
        this.serial = serial;
    }

    @Column(name = "GOODS_ID", length = 22)
    public java.lang.Long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(java.lang.Long goodsId) {
        this.goodsId = goodsId;
    }

    @Column(name = "GOODS_CODE", length = 100)
    public java.lang.String getGoodsCode() {
        return goodsCode;
    }

    public void setGoodsCode(java.lang.String goodsCode) {
        this.goodsCode = goodsCode;
    }

    @Column(name = "GOODS_NAME", length = 400)
    public java.lang.String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(java.lang.String goodsName) {
        this.goodsName = goodsName;
    }

    @Column(name = "GOODS_STATE", length = 2)
    public java.lang.String getGoodsState() {
        return goodsState;
    }

    public void setGoodsState(java.lang.String goodsState) {
        this.goodsState = goodsState;
    }

    @Column(name = "GOODS_STATE_NAME", length = 200)
    public java.lang.String getGoodsStateName() {
        return goodsStateName;
    }

    public void setGoodsStateName(java.lang.String goodsStateName) {
        this.goodsStateName = goodsStateName;
    }

    @Column(name = "UNIT_PRICE", length = 22)
    public java.lang.Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(java.lang.Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    @Column(name = "SYN_STOCK_TRANS_ID", length = 22)
    public java.lang.Long getSynStockTransId() {
        return synStockTransId;
    }

    public void setSynStockTransId(java.lang.Long synStockTransId) {
        this.synStockTransId = synStockTransId;
    }

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "SYN_STOCK_TRANS_DETAIL_SERIAL_SEQ")})
    @Column(name = "SYN_STOCK_TRANS_DETAIL_ID", length = 22)
    public java.lang.Long getSynStockTransDetailId() {
        return synStockTransDetailId;
    }

    public void setSynStockTransDetailId(java.lang.Long synStockTransDetailId) {
        this.synStockTransDetailId = synStockTransDetailId;
    }

    @Column(name = "CONSTRUCTION_CODE", length = 100)
    public java.lang.String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(java.lang.String constructionCode) {
        this.constructionCode = constructionCode;
    }

    @Override
    public SynStockTransDetailSerialDTO toDTO() {
        SynStockTransDetailSerialDTO synStockTransDetailSerialDTO = new SynStockTransDetailSerialDTO();
        // set cac gia tri
        synStockTransDetailSerialDTO.setSynStockTransDetailSerId(this.synStockTransDetailSerId);
        synStockTransDetailSerialDTO.setMerEntityId(this.merEntityId);
        synStockTransDetailSerialDTO.setSerial(this.serial);
        synStockTransDetailSerialDTO.setGoodsId(this.goodsId);
        synStockTransDetailSerialDTO.setGoodsCode(this.goodsCode);
        synStockTransDetailSerialDTO.setGoodsName(this.goodsName);
        synStockTransDetailSerialDTO.setGoodsState(this.goodsState);
        synStockTransDetailSerialDTO.setGoodsStateName(this.goodsStateName);
        synStockTransDetailSerialDTO.setUnitPrice(this.unitPrice);
        synStockTransDetailSerialDTO.setSynStockTransId(this.synStockTransId);
        synStockTransDetailSerialDTO.setSynStockTransDetailId(this.synStockTransDetailId);
        synStockTransDetailSerialDTO.setConstructionCode(this.constructionCode);
        return synStockTransDetailSerialDTO;
    }
}
