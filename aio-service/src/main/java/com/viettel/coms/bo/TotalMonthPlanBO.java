/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.TotalMonthPlanDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "TOTAL_MONTH_PLAN")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class TotalMonthPlanBO extends BaseFWModelImpl {

    private java.lang.Long totalMonthPlanId;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.String code;
    private java.lang.String name;
    private java.lang.String description;
    private java.lang.String signState;
    private java.lang.String status;
    private java.lang.String conclution;
    private java.lang.String targetNote;
    private java.lang.String maintainNote;
    private java.lang.String btsNote;
    private java.lang.String lineNote;
    private java.lang.String materialNote;
    private java.lang.String sourceNote;
    private java.lang.String financeNote;
    private java.lang.String contractNote;
    private java.util.Date createdDate;
    private java.lang.Long createdUserId;
    private java.lang.Long createdGroupId;
    private java.util.Date updatedDate;
    private java.lang.Long updatedUserId;
    private java.lang.Long updatedGroupId;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "TOTAL_MONTH_PLAN_SEQ")})
    @Column(name = "TOTAL_MONTH_PLAN_ID", length = 22)
    public java.lang.Long getTotalMonthPlanId() {
        return totalMonthPlanId;
    }

    public void setTotalMonthPlanId(java.lang.Long totalMonthPlanId) {
        this.totalMonthPlanId = totalMonthPlanId;
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

    @Column(name = "CONCLUTION", length = 2000)
    public java.lang.String getConclution() {
        return conclution;
    }

    public void setConclution(java.lang.String conclution) {
        this.conclution = conclution;
    }

    @Column(name = "TARGET_NOTE", length = 2000)
    public java.lang.String getTargetNote() {
        return targetNote;
    }

    public void setTargetNote(java.lang.String targetNote) {
        this.targetNote = targetNote;
    }

    @Column(name = "SOURCE_NOTE", length = 2000)
    public java.lang.String getSourceNote() {
        return sourceNote;
    }

    public void setSourceNote(java.lang.String sourceNote) {
        this.sourceNote = sourceNote;
    }

    @Column(name = "FINANCE_NOTE", length = 2000)
    public java.lang.String getFinanceNote() {
        return financeNote;
    }

    public void setFinanceNote(java.lang.String financeNote) {
        this.financeNote = financeNote;
    }

    @Column(name = "CONTRACT_NOTE", length = 2000)
    public java.lang.String getContractNote() {
        return contractNote;
    }

    public void setContractNote(java.lang.String contractNote) {
        this.contractNote = contractNote;
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

    @Column(name = "MAINTAIN_NOTE", length = 2000)
    public java.lang.String getMaintainNote() {
        return maintainNote;
    }

    public void setMaintainNote(java.lang.String maintainNote) {
        this.maintainNote = maintainNote;
    }

    @Column(name = "BTS_NOTE", length = 2000)
    public java.lang.String getBtsNote() {
        return btsNote;
    }

    public void setBtsNote(java.lang.String btsNote) {
        this.btsNote = btsNote;
    }

    @Column(name = "LINE_NOTE", length = 2000)
    public java.lang.String getLineNote() {
        return lineNote;
    }

    public void setLineNote(java.lang.String lineNote) {
        this.lineNote = lineNote;
    }

    @Column(name = "MATERIAL_NOTE", length = 2000)
    public java.lang.String getMaterialNote() {
        return materialNote;
    }

    public void setMaterialNote(java.lang.String materialNote) {
        this.materialNote = materialNote;
    }

    @Override
    public TotalMonthPlanDTO toDTO() {
        TotalMonthPlanDTO totalMonthPlanDTO = new TotalMonthPlanDTO();
        // set cac gia tri
        totalMonthPlanDTO.setTotalMonthPlanId(this.totalMonthPlanId);
        totalMonthPlanDTO.setMonth(this.month);
        totalMonthPlanDTO.setYear(this.year);
        totalMonthPlanDTO.setCode(this.code);
        totalMonthPlanDTO.setName(this.name);
        totalMonthPlanDTO.setDescription(this.description);
        totalMonthPlanDTO.setSignState(this.signState);
        totalMonthPlanDTO.setStatus(this.status);
        totalMonthPlanDTO.setConclution(this.conclution);
        totalMonthPlanDTO.setTargetNote(this.targetNote);
        totalMonthPlanDTO.setSourceNote(this.sourceNote);
        totalMonthPlanDTO.setFinanceNote(this.financeNote);
        totalMonthPlanDTO.setContractNote(this.contractNote);
        totalMonthPlanDTO.setMaintainNote(this.maintainNote);
        totalMonthPlanDTO.setBtsNote(this.btsNote);
        totalMonthPlanDTO.setLineNote(this.lineNote);
        totalMonthPlanDTO.setMaterialNote(this.materialNote);
        totalMonthPlanDTO.setCreatedDate(this.createdDate);
        totalMonthPlanDTO.setCreatedUserId(this.createdUserId);
        totalMonthPlanDTO.setCreatedGroupId(this.createdGroupId);
        totalMonthPlanDTO.setUpdatedDate(this.updatedDate);
        totalMonthPlanDTO.setUpdatedUserId(this.updatedUserId);
        totalMonthPlanDTO.setUpdatedGroupId(this.updatedGroupId);
        return totalMonthPlanDTO;
    }
}
