/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.DetailMonthPlanDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "DETAIL_MONTH_PLAN")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class DetailMonthPlanBO extends BaseFWModelImpl {

    private java.lang.Long detailMonthPlanId;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.String code;
    private java.lang.String name;
    private java.lang.String description;
    private java.lang.String signState;
    private java.lang.String status;
    private java.util.Date createdDate;
    private java.lang.Long createdUserId;
    private java.lang.Long createdGroupId;
    private java.util.Date updatedDate;
    private java.lang.Long updatedUserId;
    private java.lang.Long updatedGroupId;
    private java.lang.Long sysGroupId;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "DETAIL_MONTH_PLAN_SEQ")})
    @Column(name = "DETAIL_MONTH_PLAN_ID", length = 22)
    public java.lang.Long getDetailMonthPlanId() {
        return detailMonthPlanId;
    }

    public void setDetailMonthPlanId(java.lang.Long detailMonthPlanId) {
        this.detailMonthPlanId = detailMonthPlanId;
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

    @Column(name = "CODE", length = 100)
    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    @Column(name = "NAME", length = 2000)
    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
    }

    @Column(name = "DESCRIPTION", length = 2000)
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @Column(name = "SIGN_STATE", length = 2)
    public java.lang.String getSignState() {
        return signState;
    }

    public void setSignState(java.lang.String signState) {
        this.signState = signState;
    }

    @Column(name = "STATUS", length = 2)
    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
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

    @Column(name = "SYS_GROUP_ID", length = 22)
    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    @Override
    public DetailMonthPlanDTO toDTO() {
        DetailMonthPlanDTO detailMonthPlanDTO = new DetailMonthPlanDTO();
        // set cac gia tri
        detailMonthPlanDTO.setDetailMonthPlanId(this.detailMonthPlanId);
        detailMonthPlanDTO.setMonth(this.month);
        detailMonthPlanDTO.setYear(this.year);
        detailMonthPlanDTO.setCode(this.code);
        detailMonthPlanDTO.setName(this.name);
        detailMonthPlanDTO.setDescription(this.description);
        detailMonthPlanDTO.setSignState(this.signState);
        detailMonthPlanDTO.setStatus(this.status);
        detailMonthPlanDTO.setCreatedDate(this.createdDate);
        detailMonthPlanDTO.setCreatedUserId(this.createdUserId);
        detailMonthPlanDTO.setCreatedGroupId(this.createdGroupId);
        detailMonthPlanDTO.setUpdatedDate(this.updatedDate);
        detailMonthPlanDTO.setUpdatedUserId(this.updatedUserId);
        detailMonthPlanDTO.setUpdatedGroupId(this.updatedGroupId);
        detailMonthPlanDTO.setSysGroupId(this.sysGroupId);
        return detailMonthPlanDTO;
    }
}
