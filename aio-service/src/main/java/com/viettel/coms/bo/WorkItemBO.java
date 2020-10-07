/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.WorkItemDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "WORK_ITEM")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class WorkItemBO extends BaseFWModelImpl {

    private java.lang.Long workItemId;
    private java.lang.Long constructionId;
    private java.lang.Long catWorkItemTypeId;
    private java.lang.String code;
    private java.lang.String name;
    private java.lang.String isInternal;
    private java.lang.Long constructorId;
    private java.lang.Long supervisorId;
    private java.util.Date startingDate;
    private java.util.Date completeDate;
    private java.lang.String status;
    private java.lang.Double quantity;
    private java.lang.Double approveQuantity;
    private java.lang.String approveState;
    private java.util.Date approveDate;
    private java.lang.Long approveUserId;
    private java.lang.String approveDescription;
    private java.util.Date createdDate;
    private java.lang.Long createdUserId;
    private java.lang.Long createdGroupId;
    private java.util.Date updatedDate;
    private java.lang.Long updatedUserId;
    private java.lang.Long updatedGroupId;
    private java.lang.Long performerId;
    private java.lang.Long catWorkItemGroupId;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "WORK_ITEM_SEQ")})
    @Column(name = "WORK_ITEM_ID", length = 22)
    public java.lang.Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(java.lang.Long workItemId) {
        this.workItemId = workItemId;
    }

    @Column(name = "CONSTRUCTION_ID", length = 22)
    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    @Column(name = "CAT_WORK_ITEM_TYPE_ID", length = 22)
    public java.lang.Long getCatWorkItemTypeId() {
        return catWorkItemTypeId;
    }

    public void setCatWorkItemTypeId(java.lang.Long catWorkItemTypeId) {
        this.catWorkItemTypeId = catWorkItemTypeId;
    }

    @Column(name = "CODE", length = 100)
    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    @Column(name = "NAME", length = 400)
    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
    }

    @Column(name = "IS_INTERNAL", length = 2)
    public java.lang.String getIsInternal() {
        return isInternal;
    }

    public void setIsInternal(java.lang.String isInternal) {
        this.isInternal = isInternal;
    }

    @Column(name = "CONSTRUCTOR_ID", length = 22)
    public java.lang.Long getConstructorId() {
        return constructorId;
    }

    public void setConstructorId(java.lang.Long constructorId) {
        this.constructorId = constructorId;
    }

    @Column(name = "SUPERVISOR_ID", length = 22)
    public java.lang.Long getSupervisorId() {
        return supervisorId;
    }

    public void setSupervisorId(java.lang.Long supervisorId) {
        this.supervisorId = supervisorId;
    }

    @Column(name = "STARTING_DATE", length = 7)
    public java.util.Date getStartingDate() {
        return startingDate;
    }

    public void setStartingDate(java.util.Date startingDate) {
        this.startingDate = startingDate;
    }

    @Column(name = "COMPLETE_DATE", length = 7)
    public java.util.Date getCompleteDate() {
        return completeDate;
    }

    public void setCompleteDate(java.util.Date completeDate) {
        this.completeDate = completeDate;
    }

    @Column(name = "STATUS", length = 2)
    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    @Column(name = "QUANTITY", length = 22)
    public java.lang.Double getQuantity() {
        return quantity;
    }

    public void setQuantity(java.lang.Double quantity) {
        this.quantity = quantity;
    }

    @Column(name = "APPROVE_QUANTITY", length = 22)
    public java.lang.Double getApproveQuantity() {
        return approveQuantity;
    }

    public void setApproveQuantity(java.lang.Double approveQuantity) {
        this.approveQuantity = approveQuantity;
    }

    @Column(name = "APPROVE_STATE", length = 2)
    public java.lang.String getApproveState() {
        return approveState;
    }

    public void setApproveState(java.lang.String approveState) {
        this.approveState = approveState;
    }

    @Column(name = "APPROVE_DATE", length = 7)
    public java.util.Date getApproveDate() {
        return approveDate;
    }

    public void setApproveDate(java.util.Date approveDate) {
        this.approveDate = approveDate;
    }

    @Column(name = "APPROVE_USER_ID", length = 22)
    public java.lang.Long getApproveUserId() {
        return approveUserId;
    }

    public void setApproveUserId(java.lang.Long approveUserId) {
        this.approveUserId = approveUserId;
    }

    @Column(name = "APPROVE_DESCRIPTION", length = 2000)
    public java.lang.String getApproveDescription() {
        return approveDescription;
    }

    public void setApproveDescription(java.lang.String approveDescription) {
        this.approveDescription = approveDescription;
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

    @Column(name = "PERFORMER_ID", length = 10)
    public java.lang.Long getPerformerId() {
        return performerId;
    }

    public void setPerformerId(java.lang.Long performerId) {
        this.performerId = performerId;
    }
    
    @Column(name = "CAT_WORK_ITEM_GROUP_ID")
    public java.lang.Long getCatWorkItemGroupId() {
		return catWorkItemGroupId;
	}

	public void setCatWorkItemGroupId(java.lang.Long catWorkItemGroupId) {
		this.catWorkItemGroupId = catWorkItemGroupId;
	}

    @Override
    public WorkItemDTO toDTO() {
        WorkItemDTO workItemDTO = new WorkItemDTO();
        // set cac gia tri
        workItemDTO.setWorkItemId(this.workItemId);
        workItemDTO.setConstructionId(this.constructionId);
        workItemDTO.setCatWorkItemTypeId(this.catWorkItemTypeId);
        workItemDTO.setCode(this.code);
        workItemDTO.setName(this.name);
        workItemDTO.setIsInternal(this.isInternal);
        workItemDTO.setConstructorId(this.constructorId);
        workItemDTO.setSupervisorId(this.supervisorId);
        workItemDTO.setStartingDate(this.startingDate);
        workItemDTO.setCompleteDate(this.completeDate);
        workItemDTO.setStatus(this.status);
        workItemDTO.setQuantity(this.quantity);
        workItemDTO.setApproveQuantity(this.approveQuantity);
        workItemDTO.setApproveState(this.approveState);
        workItemDTO.setApproveDate(this.approveDate);
        workItemDTO.setApproveUserId(this.approveUserId);
        workItemDTO.setApproveDescription(this.approveDescription);
        workItemDTO.setCreatedDate(this.createdDate);
        workItemDTO.setCreatedUserId(this.createdUserId);
        workItemDTO.setCreatedGroupId(this.createdGroupId);
        workItemDTO.setUpdatedDate(this.updatedDate);
        workItemDTO.setUpdatedUserId(this.updatedUserId);
        workItemDTO.setUpdatedGroupId(this.updatedGroupId);
        workItemDTO.setPerformerId(this.performerId);
        workItemDTO.setCatWorkItemGroupId(catWorkItemGroupId);
        return workItemDTO;
    }
}
