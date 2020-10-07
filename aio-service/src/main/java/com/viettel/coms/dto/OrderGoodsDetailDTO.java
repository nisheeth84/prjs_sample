/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.OrderGoodsDetailBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "ORDER_GOODS_DETAILBO")
@JsonIgnoreProperties(ignoreUnknown = true)

public class OrderGoodsDetailDTO extends ComsBaseFWDTO<OrderGoodsDetailBO> {

    private java.lang.Long merEntityId;
    private java.lang.Double quantity;
    private java.lang.String goodsState;
    private java.lang.Long orderGoodsDetailId;
    private java.lang.String serial;
    private java.lang.Double price;
    private java.lang.Long orderGoodsId;
    private java.lang.Long orderId;

    @Override
    public OrderGoodsDetailBO toModel() {
        OrderGoodsDetailBO orderGoodsDetailBO = new OrderGoodsDetailBO();
        orderGoodsDetailBO.setMerEntityId(this.merEntityId);
        orderGoodsDetailBO.setQuantity(this.quantity);
        orderGoodsDetailBO.setGoodsState(this.goodsState);
        orderGoodsDetailBO.setOrderGoodsDetailId(this.orderGoodsDetailId);
        orderGoodsDetailBO.setSerial(this.serial);
        orderGoodsDetailBO.setPrice(this.price);
        orderGoodsDetailBO.setOrderGoodsId(this.orderGoodsId);
        orderGoodsDetailBO.setOrderId(this.orderId);
        return orderGoodsDetailBO;
    }

    //    @Override
//     public Long getFWModelId() {
//        return merEntityId;
//    }
//   
//    @Override
//    public String catchName() {
//        return getMerEntityId().toString();
//    }
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

    public java.lang.String getGoodsState() {
        return goodsState;
    }

    public void setGoodsState(java.lang.String goodsState) {
        this.goodsState = goodsState;
    }

    //    @Override
//     public Long getFWModelId() {
//        return orderGoodsDetailId;
//    }
//   
//    @Override
//    public String catchName() {
//        return getOrderGoodsDetailId().toString();
//    }
    public java.lang.Long getOrderGoodsDetailId() {
        return orderGoodsDetailId;
    }

    public void setOrderGoodsDetailId(java.lang.Long orderGoodsDetailId) {
        this.orderGoodsDetailId = orderGoodsDetailId;
    }

    public java.lang.String getSerial() {
        return serial;
    }

    public void setSerial(java.lang.String serial) {
        this.serial = serial;
    }

    public java.lang.Double getPrice() {
        return price;
    }

    public void setPrice(java.lang.Double price) {
        this.price = price;
    }

    //    @Override
//     public Long getFWModelId() {
//        return orderGoodsId;
//    }
//   
//    @Override
//    public String catchName() {
//        return getOrderGoodsId().toString();
//    }
    public java.lang.Long getOrderGoodsId() {
        return orderGoodsId;
    }

    public void setOrderGoodsId(java.lang.Long orderGoodsId) {
        this.orderGoodsId = orderGoodsId;
    }

    @Override
    public Long getFWModelId() {
        return orderId;
    }

    @Override
    public String catchName() {
        return getOrderId().toString();
    }

    public java.lang.Long getOrderId() {
        return orderId;
    }

    public void setOrderId(java.lang.Long orderId) {
        this.orderId = orderId;
    }

}
