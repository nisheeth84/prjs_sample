/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.SynStockTransDetailDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "SYN_STOCK_TRANS_DETAIL")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class SynStockTransDetailBO extends BaseFWModelImpl {

    private java.lang.Long synStockTransDetailId;
    private java.lang.Long orderId;
    private java.lang.String goodsType;
    private java.lang.String goodsTypeName;
    private java.lang.Long goodsId;
    private java.lang.String goodsCode;
    private java.lang.String goodsName;
    private java.lang.String goodsIsSerial;
    private java.lang.String goodsState;
    private java.lang.String goodsStateName;
    private java.lang.String goodsUnitName;
    private java.lang.Long goodsUnitId;
    private java.lang.Double amountOrder;
    private java.lang.Double amountReal;
    private java.lang.Double totalPrice;
    private java.lang.Long stockTransId;
    private java.lang.Double amount;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "SYN_STOCK_TRANS_DETAIL_SEQ")})
    @Column(name = "SYN_STOCK_TRANS_DETAIL_ID", length = 22)
    public java.lang.Long getSynStockTransDetailId() {
        return synStockTransDetailId;
    }

    public void setSynStockTransDetailId(java.lang.Long synStockTransDetailId) {
        this.synStockTransDetailId = synStockTransDetailId;
    }

    @Column(name = "ORDER_ID", length = 22)
    public java.lang.Long getOrderId() {
        return orderId;
    }

    public void setOrderId(java.lang.Long orderId) {
        this.orderId = orderId;
    }

    @Column(name = "GOODS_TYPE", length = 100)
    public java.lang.String getGoodsType() {
        return goodsType;
    }

    public void setGoodsType(java.lang.String goodsType) {
        this.goodsType = goodsType;
    }

    @Column(name = "GOODS_TYPE_NAME", length = 200)
    public java.lang.String getGoodsTypeName() {
        return goodsTypeName;
    }

    public void setGoodsTypeName(java.lang.String goodsTypeName) {
        this.goodsTypeName = goodsTypeName;
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

    @Column(name = "GOODS_IS_SERIAL", length = 2)
    public java.lang.String getGoodsIsSerial() {
        return goodsIsSerial;
    }

    public void setGoodsIsSerial(java.lang.String goodsIsSerial) {
        this.goodsIsSerial = goodsIsSerial;
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

    @Column(name = "GOODS_UNIT_NAME", length = 200)
    public java.lang.String getGoodsUnitName() {
        return goodsUnitName;
    }

    public void setGoodsUnitName(java.lang.String goodsUnitName) {
        this.goodsUnitName = goodsUnitName;
    }

    @Column(name = "GOODS_UNIT_ID", length = 22)
    public java.lang.Long getGoodsUnitId() {
        return goodsUnitId;
    }

    public void setGoodsUnitId(java.lang.Long goodsUnitId) {
        this.goodsUnitId = goodsUnitId;
    }

    @Column(name = "AMOUNT_ORDER", length = 22)
    public java.lang.Double getAmountOrder() {
        return amountOrder;
    }

    public void setAmountOrder(java.lang.Double amountOrder) {
        this.amountOrder = amountOrder;
    }

    @Column(name = "AMOUNT_REAL", length = 22)
    public java.lang.Double getAmountReal() {
        return amountReal;
    }

    public void setAmountReal(java.lang.Double amountReal) {
        this.amountReal = amountReal;
    }

    @Column(name = "TOTAL_PRICE", length = 22)
    public java.lang.Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(java.lang.Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    @Column(name = "STOCK_TRANS_ID", length = 22)
    public java.lang.Long getStockTransId() {
        return stockTransId;
    }

    public void setStockTransId(java.lang.Long stockTransId) {
        this.stockTransId = stockTransId;
    }

    @Column(name = "AMOUNT", length = 22)
    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    @Override
    public SynStockTransDetailDTO toDTO() {
        SynStockTransDetailDTO synStockTransDetailDTO = new SynStockTransDetailDTO();
        // set cac gia tri
        synStockTransDetailDTO.setSynStockTransDetailId(this.synStockTransDetailId);
        synStockTransDetailDTO.setOrderId(this.orderId);
        synStockTransDetailDTO.setGoodsType(this.goodsType);
        synStockTransDetailDTO.setGoodsTypeName(this.goodsTypeName);
        synStockTransDetailDTO.setGoodsId(this.goodsId);
        synStockTransDetailDTO.setGoodsCode(this.goodsCode);
        synStockTransDetailDTO.setGoodsName(this.goodsName);
        synStockTransDetailDTO.setGoodsIsSerial(this.goodsIsSerial);
        synStockTransDetailDTO.setGoodsState(this.goodsState);
        synStockTransDetailDTO.setGoodsStateName(this.goodsStateName);
        synStockTransDetailDTO.setGoodsUnitName(this.goodsUnitName);
        synStockTransDetailDTO.setGoodsUnitId(this.goodsUnitId);
        synStockTransDetailDTO.setAmountOrder(this.amountOrder);
        synStockTransDetailDTO.setAmountReal(this.amountReal);
        synStockTransDetailDTO.setTotalPrice(this.totalPrice);
        synStockTransDetailDTO.setStockTransId(this.stockTransId);
        synStockTransDetailDTO.setAmount(this.amount);
        return synStockTransDetailDTO;
    }
}
