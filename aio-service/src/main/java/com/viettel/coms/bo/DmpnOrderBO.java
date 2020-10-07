/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.DmpnOrderDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "DMPN_ORDER")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class DmpnOrderBO extends BaseFWModelImpl {

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

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "DMPN_ORDER_SEQ")})
    @Column(name = "DMPN_ORDER_ID", length = 22)
    public java.lang.Long getDmpnOrderId() {
        return dmpnOrderId;
    }

    public void setDmpnOrderId(java.lang.Long dmpnOrderId) {
        this.dmpnOrderId = dmpnOrderId;
    }

    @Column(name = "SYS_GROUP_ID", length = 22)
    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    @Column(name = "MONTH", length = 22)
    public java.lang.Long getMonth() {
        return month;
    }

    public void setMonth(java.lang.Long month) {
        this.month = month;
    }

    @Column(name = "YEAR", length = 22)
    public java.lang.Long getYear() {
        return year;
    }

    public void setYear(java.lang.Long year) {
        this.year = year;
    }

    @Column(name = "GOODS_ID", length = 22)
    public java.lang.Long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(java.lang.Long goodsId) {
        this.goodsId = goodsId;
    }

    @Column(name = "GOODS_CODE", length = 200)
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

    @Column(name = "QUANTITY", length = 22)
    public java.lang.Double getQuantity() {
        return quantity;
    }

    public void setQuantity(java.lang.Double quantity) {
        this.quantity = quantity;
    }

    @Column(name = "UNIT_NAME", length = 400)
    public java.lang.String getUnitName() {
        return unitName;
    }

    public void setUnitName(java.lang.String unitName) {
        this.unitName = unitName;
    }

    @Column(name = "CAT_UNIT_ID", length = 40)
    public java.lang.Long getCatUnitId() {
        return catUnitId;
    }

    public void setCatUnitId(java.lang.Long catUnitId) {
        this.catUnitId = catUnitId;
    }

    @Column(name = "DESCRIPTION", length = 2000)
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @Column(name = "DETAIL_MONTH_PLAN_ID", length = 22)
    public java.lang.Long getDetailMonthPlanId() {
        return detailMonthPlanId;
    }

    public void setDetailMonthPlanId(java.lang.Long detailMonthPlanId) {
        this.detailMonthPlanId = detailMonthPlanId;
    }

    @Column(name = "CREATED_DATE", length = 7)
    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    @Column(name = "CREATED_USER_ID", length = 22)
    public java.lang.Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(java.lang.Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    @Column(name = "CREATED_GROUP_ID", length = 22)
    public java.lang.Long getCreatedGroupId() {
        return createdGroupId;
    }

    public void setCreatedGroupId(java.lang.Long createdGroupId) {
        this.createdGroupId = createdGroupId;
    }

    @Column(name = "UPDATED_DATE", length = 7)
    public java.util.Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(java.util.Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    @Column(name = "UPDATED_USER_ID", length = 22)
    public java.lang.Long getUpdatedUserId() {
        return updatedUserId;
    }

    public void setUpdatedUserId(java.lang.Long updatedUserId) {
        this.updatedUserId = updatedUserId;
    }

    @Column(name = "UPDATED_GROUP_ID", length = 22)
    public java.lang.Long getUpdatedGroupId() {
        return updatedGroupId;
    }

    public void setUpdatedGroupId(java.lang.Long updatedGroupId) {
        this.updatedGroupId = updatedGroupId;
    }

    @Override
    public DmpnOrderDTO toDTO() {
        DmpnOrderDTO dmpnOrderDTO = new DmpnOrderDTO();
        // set cac gia tri
        dmpnOrderDTO.setDmpnOrderId(this.dmpnOrderId);
        dmpnOrderDTO.setSysGroupId(this.sysGroupId);
        dmpnOrderDTO.setMonth(this.month);
        dmpnOrderDTO.setYear(this.year);
        dmpnOrderDTO.setGoodsId(this.goodsId);
        dmpnOrderDTO.setGoodsCode(this.goodsCode);
        dmpnOrderDTO.setGoodsName(this.goodsName);
        dmpnOrderDTO.setQuantity(this.quantity);
        dmpnOrderDTO.setUnitName(this.unitName);
        dmpnOrderDTO.setCatUnitId(this.catUnitId);
        dmpnOrderDTO.setDescription(this.description);
        dmpnOrderDTO.setDetailMonthPlanId(this.detailMonthPlanId);
        dmpnOrderDTO.setCreatedDate(this.createdDate);
        dmpnOrderDTO.setCreatedUserId(this.createdUserId);
        dmpnOrderDTO.setCreatedGroupId(this.createdGroupId);
        dmpnOrderDTO.setUpdatedDate(this.updatedDate);
        dmpnOrderDTO.setUpdatedUserId(this.updatedUserId);
        dmpnOrderDTO.setUpdatedGroupId(this.updatedGroupId);
        return dmpnOrderDTO;
    }
}
