/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.ConstructionReturnDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "CONSTRUCTION_RETURN")
/**
 *
 * @author: chinhpxn20180620
 * @version: 1.0
 * @since: 1.0
 */
public class ConstructionReturnBO extends BaseFWModelImpl {

    private java.lang.Long constructionReturnId;
    private java.lang.Long constructionId;
    private java.lang.Long goodsId;
    private java.lang.Long workItemId;
    private java.lang.String goodsCode;
    private java.lang.String goodsName;
    private java.lang.String goodsUnitName;
    private java.lang.Long merEntityId;
    private java.lang.Double quantity;
    private java.lang.String serial;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "CONSTRUCTION_RETURN_SEQ")})
    @Column(name = "CONSTRUCTION_RETURN_ID", length = 10)
    public java.lang.Long getConstructionReturnId() {
        return constructionReturnId;
    }

    public void setConstructionReturnId(java.lang.Long constructionReturnId) {
        this.constructionReturnId = constructionReturnId;
    }

    @Column(name = "CONSTRUCTION_ID", length = 10)
    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    @Column(name = "GOODS_ID", length = 10)
    public java.lang.Long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(java.lang.Long goodsId) {
        this.goodsId = goodsId;
    }

    @Column(name = "WORK_ITEM_ID", length = 10)
    public java.lang.Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(java.lang.Long workItemId) {
        this.workItemId = workItemId;
    }

    @Column(name = "GOODS_CODE", length = 100)
    public java.lang.String getGoodsCode() {
        return goodsCode;
    }

    public void setGoodsCode(java.lang.String goodsCode) {
        this.goodsCode = goodsCode;
    }

    @Column(name = "GOODS_NAME", length = 500)
    public java.lang.String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(java.lang.String goodsName) {
        this.goodsName = goodsName;
    }

    @Column(name = "GOODS_UNIT_NAME", length = 100)
    public java.lang.String getGoodsUnitName() {
        return goodsUnitName;
    }

    public void setGoodsUnitName(java.lang.String goodsUnitName) {
        this.goodsUnitName = goodsUnitName;
    }

    @Column(name = "MER_ENTITY_ID", length = 10)
    public java.lang.Long getMerEntityId() {
        return merEntityId;
    }

    public void setMerEntityId(java.lang.Long merEntityId) {
        this.merEntityId = merEntityId;
    }

    @Column(name = "QUANTITY", length = 10)
    public java.lang.Double getQuantity() {
        return quantity;
    }

    public void setQuantity(java.lang.Double quantity) {
        this.quantity = quantity;
    }

    @Column(name = "SERIAL", length = 200)
    public java.lang.String getSerial() {
        return serial;
    }

    public void setSerial(java.lang.String serial) {
        this.serial = serial;
    }

    @Override
    public ConstructionReturnDTO toDTO() {
        ConstructionReturnDTO constructionReturnDTO = new ConstructionReturnDTO();
        // set cac gia tri
        constructionReturnDTO.setConstructionReturnId(this.constructionReturnId);
        constructionReturnDTO.setGoodsName(this.goodsName);
        constructionReturnDTO.setGoodsCode(this.goodsCode);
        constructionReturnDTO.setGoodsUnitName(this.goodsUnitName);
        constructionReturnDTO.setGoodsId(this.goodsId);
        constructionReturnDTO.setMerEntityId(this.merEntityId);
        constructionReturnDTO.setQuantity(this.quantity);
        constructionReturnDTO.setConstructionId(this.constructionId);
        constructionReturnDTO.setSerial(this.serial);
        constructionReturnDTO.setWorkItemId(this.workItemId);
        return constructionReturnDTO;
    }

}
