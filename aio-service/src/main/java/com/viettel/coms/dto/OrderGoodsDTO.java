/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.OrderGoodsBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "ORDER_GOODSBO")
@JsonIgnoreProperties(ignoreUnknown = true)

public class OrderGoodsDTO extends ComsBaseFWDTO<OrderGoodsBO> {

    private java.lang.Long orderGoodsId;
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
    private java.lang.Double amount;
    private java.lang.Double totalPrice;

    @Override
    public OrderGoodsBO toModel() {
        OrderGoodsBO orderGoodsBO = new OrderGoodsBO();
        orderGoodsBO.setOrderGoodsId(this.orderGoodsId);
        orderGoodsBO.setOrderId(this.orderId);
        orderGoodsBO.setGoodsType(this.goodsType);
        orderGoodsBO.setGoodsTypeName(this.goodsTypeName);
        orderGoodsBO.setGoodsId(this.goodsId);
        orderGoodsBO.setGoodsCode(this.goodsCode);
        orderGoodsBO.setGoodsName(this.goodsName);
        orderGoodsBO.setGoodsIsSerial(this.goodsIsSerial);
        orderGoodsBO.setGoodsState(this.goodsState);
        orderGoodsBO.setGoodsStateName(this.goodsStateName);
        orderGoodsBO.setGoodsUnitName(this.goodsUnitName);
        orderGoodsBO.setGoodsUnitId(this.goodsUnitId);
        orderGoodsBO.setAmount(this.amount);
        orderGoodsBO.setTotalPrice(this.totalPrice);
        return orderGoodsBO;
    }

    @Override
    public Long getFWModelId() {
        return orderGoodsId;
    }

    @Override
    public String catchName() {
        return getOrderGoodsId().toString();
    }

    public java.lang.Long getOrderGoodsId() {
        return orderGoodsId;
    }

    public void setOrderGoodsId(java.lang.Long orderGoodsId) {
        this.orderGoodsId = orderGoodsId;
    }

    //    @Override
//     public Long getFWModelId() {
//        return orderId;
//    }
//   
//    @Override
//    public String catchName() {
//        return getOrderId().toString();
//    }
    public java.lang.Long getOrderId() {
        return orderId;
    }

    public void setOrderId(java.lang.Long orderId) {
        this.orderId = orderId;
    }

    public java.lang.String getGoodsType() {
        return goodsType;
    }

    public void setGoodsType(java.lang.String goodsType) {
        this.goodsType = goodsType;
    }

    public java.lang.String getGoodsTypeName() {
        return goodsTypeName;
    }

    public void setGoodsTypeName(java.lang.String goodsTypeName) {
        this.goodsTypeName = goodsTypeName;
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

    public java.lang.String getGoodsIsSerial() {
        return goodsIsSerial;
    }

    public void setGoodsIsSerial(java.lang.String goodsIsSerial) {
        this.goodsIsSerial = goodsIsSerial;
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

    public java.lang.String getGoodsUnitName() {
        return goodsUnitName;
    }

    public void setGoodsUnitName(java.lang.String goodsUnitName) {
        this.goodsUnitName = goodsUnitName;
    }

    public java.lang.Long getGoodsUnitId() {
        return goodsUnitId;
    }

    public void setGoodsUnitId(java.lang.Long goodsUnitId) {
        this.goodsUnitId = goodsUnitId;
    }

    public java.lang.Double getAmount() {
        return amount;
    }

    public void setAmount(java.lang.Double amount) {
        this.amount = amount;
    }

    public java.lang.Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(java.lang.Double totalPrice) {
        this.totalPrice = totalPrice;
    }

}
