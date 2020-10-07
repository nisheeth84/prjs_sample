/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.YearPlanDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "YEAR_PLAN")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class YearPlanBO extends BaseFWModelImpl {
    private java.lang.Long yearPlanId;
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

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "YEAR_PLAN_SEQ")})
    @Column(name = "YEAR_PLAN_ID", length = 18)
    public java.lang.Long getYearPlanId() {
        return yearPlanId;
    }

    public void setYearPlanId(java.lang.Long yearPlanId) {
        this.yearPlanId = yearPlanId;
    }

    @Column(name = "YEAR", length = 22)
    public java.lang.Long getYear() {
        return year;
    }

    public void setYear(java.lang.Long year) {
        this.year = year;
    }

    @Column(name = "CODE", length = 50)
    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    @Column(name = "NAME", length = 1000)
    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
    }

    @Column(name = "DESCRIPTION", length = 1000)
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

    @Override
    public YearPlanDTO toDTO() {
        YearPlanDTO yearPlanDTO = new YearPlanDTO();
        // set cac gia tri
        yearPlanDTO.setYear(this.year);
        yearPlanDTO.setCode(this.code);
        yearPlanDTO.setName(this.name);
        yearPlanDTO.setDescription(this.description);
        yearPlanDTO.setSignState(this.signState);
        yearPlanDTO.setStatus(this.status);
        yearPlanDTO.setCreatedDate(this.createdDate);
        yearPlanDTO.setCreatedUserId(this.createdUserId);
        yearPlanDTO.setCreatedGroupId(this.createdGroupId);
        yearPlanDTO.setUpdatedDate(this.updatedDate);
        yearPlanDTO.setUpdatedUserId(this.updatedUserId);
        yearPlanDTO.setUpdatedGroupId(this.updatedGroupId);
        return yearPlanDTO;
    }
}
