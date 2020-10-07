/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.ConstructionMerchandiseDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "CONSTRUCTION_MERCHANDISE")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class ConstructionMerchandiseBO extends BaseFWModelImpl {

    private java.lang.Long constructionMerchandiseId;
    private java.lang.String goodsName;
    private java.lang.String goodsCode;
    private java.lang.String goodsUnitName;
    private java.lang.String type;
    private java.lang.Long goodsId;
    private java.lang.Long merEntityId;
    private java.lang.Double quantity;
    private java.lang.Double remainCount;
    private java.lang.Long constructionId;
    private java.lang.String goodsIsSerial;
    private java.lang.String serial;
    private java.lang.Long workItemId;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "CONSTRUCTION_MERCHANDISE_SEQ")})
    @Column(name = "CONSTRUCTION_MERCHANDISE_ID", length = 22)
    public java.lang.Long getConstructionMerchandiseId() {
        return constructionMerchandiseId;
    }

    public void setConstructionMerchandiseId(java.lang.Long constructionMerchandiseId) {
        this.constructionMerchandiseId = constructionMerchandiseId;
    }

    @Column(name = "GOODS_NAME", length = 1000)
    public java.lang.String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(java.lang.String goodsName) {
        this.goodsName = goodsName;
    }

    @Column(name = "GOODS_CODE", length = 200)
    public java.lang.String getGoodsCode() {
        return goodsCode;
    }

    public void setGoodsCode(java.lang.String goodsCode) {
        this.goodsCode = goodsCode;
    }

    @Column(name = "GOODS_IS_SERIAL", length = 2)
    public java.lang.String getGoodsIsSerial() {
        return goodsIsSerial;
    }

    public void setGoodsIsSerial(java.lang.String goodsIsSerial) {
        this.goodsIsSerial = goodsIsSerial;
    }

    @Column(name = "GOODS_UNIT_NAME", length = 200)
    public java.lang.String getGoodsUnitName() {
        return goodsUnitName;
    }

    public void setGoodsUnitName(java.lang.String goodsUnitName) {
        this.goodsUnitName = goodsUnitName;
    }

    @Column(name = "TYPE", length = 4)
    public java.lang.String getType() {
        return type;
    }

    public void setType(java.lang.String type) {
        this.type = type;
    }

    @Column(name = "GOODS_ID", length = 22)
    public java.lang.Long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(java.lang.Long goodsId) {
        this.goodsId = goodsId;
    }

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

    @Column(name = "REMAIN_COUNT", length = 22)
    public java.lang.Double getRemainCount() {
        return remainCount;
    }

    public void setRemainCount(java.lang.Double remainCount) {
        this.remainCount = remainCount;
    }

    @Column(name = "CONSTRUCTION_ID", length = 22)
    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    @Column(name = "SERIAL", length = 500)
    public java.lang.String getSerial() {
        return serial;
    }

    public void setSerial(java.lang.String serial) {
        this.serial = serial;
    }

    @Column(name = "WORK_ITEM_ID", length = 22)

    public java.lang.Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(java.lang.Long workItemId) {
        this.workItemId = workItemId;
    }

    @Override
    public ConstructionMerchandiseDTO toDTO() {
        ConstructionMerchandiseDTO constructionMerchandiseDTO = new ConstructionMerchandiseDTO();
        // set cac gia tri
        constructionMerchandiseDTO.setConstructionMerchandiseId(this.constructionMerchandiseId);
        constructionMerchandiseDTO.setGoodsName(this.goodsName);
        constructionMerchandiseDTO.setGoodsCode(this.goodsCode);
        constructionMerchandiseDTO.setGoodsUnitName(this.goodsUnitName);
        constructionMerchandiseDTO.setType(this.type);
        constructionMerchandiseDTO.setGoodsId(this.goodsId);
        constructionMerchandiseDTO.setMerEntityId(this.merEntityId);
        constructionMerchandiseDTO.setQuantity(this.quantity);
        constructionMerchandiseDTO.setRemainCount(this.remainCount);
        constructionMerchandiseDTO.setConstructionId(this.constructionId);
        constructionMerchandiseDTO.setGoodsIsSerial(this.goodsIsSerial);
        constructionMerchandiseDTO.setSerial(this.serial);
        constructionMerchandiseDTO.setWorkItemId(this.workItemId);
        return constructionMerchandiseDTO;
    }
}
