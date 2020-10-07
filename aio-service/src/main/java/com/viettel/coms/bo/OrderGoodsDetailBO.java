/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.OrderGoodsDetailDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "ORDER_GOODS_DETAIL")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class OrderGoodsDetailBO extends BaseFWModelImpl {

    private java.lang.Long merEntityId;
    private java.lang.Double quantity;
    private java.lang.String goodsState;
    private java.lang.Long orderGoodsDetailId;
    private java.lang.String serial;
    private java.lang.Double price;
    private java.lang.Long orderGoodsId;
    private java.lang.Long orderId;

    //@Id
//@GeneratedValue(generator = "sequence")
//    @GenericGenerator(name = "sequence", strategy = "sequence",
//            parameters = {
//                @Parameter(name = "sequence", value = "ORDER_GOODS_DETAIL_SEQ")
//            }
//    )
    @Column(name = "MER_ENTITY_ID", length = 22)
    public java.lang.Long getMerEntityId() {
        return merEntityId;
    }

    public void setMerEntityId(java.lang.Long merEntityId) {
        this.merEntityId = merEntityId;
    }

    @Column(name = "QUANTITY", length = 22)
    public java.lang.Double getQuantity() {
        return quantity;
    }

    public void setQuantity(java.lang.Double quantity) {
        this.quantity = quantity;
    }

    @Column(name = "GOODS_STATE", length = 2)
    public java.lang.String getGoodsState() {
        return goodsState;
    }

    public void setGoodsState(java.lang.String goodsState) {
        this.goodsState = goodsState;
    }

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "ORDER_GOODS_DETAIL_SEQ")})
    @Column(name = "ORDER_GOODS_DETAIL_ID", length = 22)
    public java.lang.Long getOrderGoodsDetailId() {
        return orderGoodsDetailId;
    }

    public void setOrderGoodsDetailId(java.lang.Long orderGoodsDetailId) {
        this.orderGoodsDetailId = orderGoodsDetailId;
    }

    @Column(name = "SERIAL", length = 200)
    public java.lang.String getSerial() {
        return serial;
    }

    public void setSerial(java.lang.String serial) {
        this.serial = serial;
    }

    @Column(name = "PRICE", length = 22)
    public java.lang.Double getPrice() {
        return price;
    }

    public void setPrice(java.lang.Double price) {
        this.price = price;
    }

    //@Id
//@GeneratedValue(generator = "sequence")
//    @GenericGenerator(name = "sequence", strategy = "sequence",
//            parameters = {
//                @Parameter(name = "sequence", value = "ORDER_GOODS_DETAIL_SEQ")
//            }
//    )
    @Column(name = "ORDER_GOODS_ID", length = 22)
    public java.lang.Long getOrderGoodsId() {
        return orderGoodsId;
    }

    public void setOrderGoodsId(java.lang.Long orderGoodsId) {
        this.orderGoodsId = orderGoodsId;
    }

    //@Id
//@GeneratedValue(generator = "sequence")
//    @GenericGenerator(name = "sequence", strategy = "sequence",
//            parameters = {
//                @Parameter(name = "sequence", value = "ORDER_GOODS_DETAIL_SEQ")
//            }
//    )
    @Column(name = "ORDER_ID", length = 22)
    public java.lang.Long getOrderId() {
        return orderId;
    }

    public void setOrderId(java.lang.Long orderId) {
        this.orderId = orderId;
    }

    @Override
    public OrderGoodsDetailDTO toDTO() {
        OrderGoodsDetailDTO orderGoodsDetailDTO = new OrderGoodsDetailDTO();
        // set cac gia tri
        orderGoodsDetailDTO.setMerEntityId(this.merEntityId);
        orderGoodsDetailDTO.setQuantity(this.quantity);
        orderGoodsDetailDTO.setGoodsState(this.goodsState);
        orderGoodsDetailDTO.setOrderGoodsDetailId(this.orderGoodsDetailId);
        orderGoodsDetailDTO.setSerial(this.serial);
        orderGoodsDetailDTO.setPrice(this.price);
        orderGoodsDetailDTO.setOrderGoodsId(this.orderGoodsId);
        orderGoodsDetailDTO.setOrderId(this.orderId);
        return orderGoodsDetailDTO;
    }
}
