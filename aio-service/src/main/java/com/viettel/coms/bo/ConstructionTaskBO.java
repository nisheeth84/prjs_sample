/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.ConstructionTaskDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "CONSTRUCTION_TASK")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class ConstructionTaskBO extends BaseFWModelImpl {

    private java.lang.Double completePercent;
    private java.lang.String description;
    private java.lang.String status;
    private java.lang.String sourceType;
    private java.lang.String deployType;
    private java.lang.String type;
    private java.lang.Double vat;
    private java.lang.Long detailMonthPlanId;
    private java.util.Date createdDate;
    private java.lang.Long createdUserId;
    private java.lang.Long createdGroupId;
    private java.util.Date updatedDate;
    private java.lang.Long updatedUserId;
    private java.lang.Long updatedGroupId;
    private java.lang.String completeState;
    private java.lang.Long performerWorkItemId;
    private java.lang.Double supervisorId;
    private java.lang.Double directorId;
    private java.lang.Long performerId;
    private java.lang.Double quantity;
    private java.lang.Long constructionTaskId;
    private java.lang.Long sysGroupId;
    private java.lang.Long month;
    private java.lang.Long year;
    private java.lang.String taskName;
    private java.util.Date startDate;
    private java.util.Date endDate;
    private java.util.Date baselineStartDate;
    private java.util.Date baselineEndDate;
    private java.lang.Long constructionId;
    private java.lang.Long workItemId;
    private java.lang.Long catTaskId;
    private java.lang.Long levelId;
    private java.lang.String path;
    private java.lang.Long parentId;
    private java.lang.String reasonStop;
//    hoanm1_20181229_start
    private java.lang.String workItemNameHSHC;
    
    @Column(name = "WORK_ITEM_NAME_HSHC", length = 4000)
    public java.lang.String getWorkItemNameHSHC() {
		return workItemNameHSHC;
	}

	public void setWorkItemNameHSHC(java.lang.String workItemNameHSHC) {
		this.workItemNameHSHC = workItemNameHSHC;
	}
//	hoanm1_20181229_start
	//chinhpxn20180621
    private java.lang.String taskOrder;
//chinhpxn20180621

    @Column(name = "TASK_ORDER", length = 2)
    public java.lang.String getTaskOrder() {
        return taskOrder;
    }

    public void setTaskOrder(java.lang.String taskOrder) {
        this.taskOrder = taskOrder;
    }

    @Column(name = "COMPLETE_PERCENT", length = 22)
    public java.lang.Double getCompletePercent() {
        return completePercent;
    }

    public void setCompletePercent(java.lang.Double completePercent) {
        this.completePercent = completePercent;
    }

    @Column(name = "DESCRIPTION", length = 2000)
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @Column(name = "STATUS", length = 2)
    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    @Column(name = "SOURCE_TYPE", length = 2)
    public java.lang.String getSourceType() {
        return sourceType;
    }

    public void setSourceType(java.lang.String sourceType) {
        this.sourceType = sourceType;
    }

    @Column(name = "DEPLOY_TYPE", length = 2)
    public java.lang.String getDeployType() {
        return deployType;
    }

    public void setDeployType(java.lang.String deployType) {
        this.deployType = deployType;
    }

    @Column(name = "TYPE", length = 2)
    public java.lang.String getType() {
        return type;
    }

    public void setType(java.lang.String type) {
        this.type = type;
    }

    @Column(name = "VAT", length = 22)
    public java.lang.Double getVat() {
        return vat;
    }

    public void setVat(java.lang.Double vat) {
        this.vat = vat;
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

    @Column(name = "COMPLETE_STATE", length = 4)
    public java.lang.String getCompleteState() {
        return completeState;
    }

    public void setCompleteState(java.lang.String completeState) {
        this.completeState = completeState;
    }

    @Column(name = "PERFORMER_WORK_ITEM_ID", length = 22)
    public java.lang.Long getPerformerWorkItemId() {
        return performerWorkItemId;
    }

    public void setPerformerWorkItemId(java.lang.Long performerWorkItemId) {
        this.performerWorkItemId = performerWorkItemId;
    }

    @Column(name = "SUPERVISOR_ID", length = 22)
    public java.lang.Double getSupervisorId() {
        return supervisorId;
    }

    public void setSupervisorId(java.lang.Double supervisorId) {
        this.supervisorId = supervisorId;
    }

    @Column(name = "DIRECTOR_ID", length = 22)
    public java.lang.Double getDirectorId() {
        return directorId;
    }

    public void setDirectorId(java.lang.Double directorId) {
        this.directorId = directorId;
    }

    @Column(name = "PERFORMER_ID", length = 22)
    public java.lang.Long getPerformerId() {
        return performerId;
    }

    public void setPerformerId(java.lang.Long performerId) {
        this.performerId = performerId;
    }

    @Column(name = "QUANTITY", length = 22)
    public java.lang.Double getQuantity() {
        return quantity;
    }

    public void setQuantity(java.lang.Double quantity) {
        this.quantity = quantity;
    }

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "CONSTRUCTION_TASK_SEQ")})
    @Column(name = "CONSTRUCTION_TASK_ID", length = 22)
    public java.lang.Long getConstructionTaskId() {
        return constructionTaskId;
    }

    public void setConstructionTaskId(java.lang.Long constructionTaskId) {
        this.constructionTaskId = constructionTaskId;
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

    @Column(name = "TASK_NAME", length = 4000)
    public java.lang.String getTaskName() {
        return taskName;
    }

    public void setTaskName(java.lang.String taskName) {
        this.taskName = taskName;
    }

    @Column(name = "START_DATE", length = 7)
    public java.util.Date getStartDate() {
        return startDate;
    }

    public void setStartDate(java.util.Date startDate) {
        this.startDate = startDate;
    }

    @Column(name = "END_DATE", length = 7)
    public java.util.Date getEndDate() {
        return endDate;
    }

    public void setEndDate(java.util.Date endDate) {
        this.endDate = endDate;
    }

    @Column(name = "BASELINE_START_DATE", length = 7)
    public java.util.Date getBaselineStartDate() {
        return baselineStartDate;
    }

    public void setBaselineStartDate(java.util.Date baselineStartDate) {
        this.baselineStartDate = baselineStartDate;
    }

    @Column(name = "BASELINE_END_DATE", length = 7)
    public java.util.Date getBaselineEndDate() {
        return baselineEndDate;
    }

    public void setBaselineEndDate(java.util.Date baselineEndDate) {
        this.baselineEndDate = baselineEndDate;
    }

    @Column(name = "CONSTRUCTION_ID", length = 22)
    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    @Column(name = "WORK_ITEM_ID", length = 22)
    public java.lang.Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(java.lang.Long workItemId) {
        this.workItemId = workItemId;
    }

    @Column(name = "CAT_TASK_ID", length = 22)
    public java.lang.Long getCatTaskId() {
        return catTaskId;
    }

    public void setCatTaskId(java.lang.Long catTaskId) {
        this.catTaskId = catTaskId;
    }

    @Column(name = "LEVEL_ID", length = 10)
    public java.lang.Long getLevelId() {
        return levelId;
    }

    public void setLevelId(java.lang.Long levelId) {
        this.levelId = levelId;
    }

    @Column(name = "PARENT_ID", length = 10)
    public java.lang.Long getParentId() {
        return parentId;
    }

    public void setParentId(java.lang.Long parentId) {
        this.parentId = parentId;
    }

    @Column(name = "PATH")
    public java.lang.String getPath() {
        return path;
    }

    public void setPath(java.lang.String path) {
        this.path = path;
    }

    @Column(name = "REASON_STOP", length = 500)
    public java.lang.String getReasonStop() {
        return reasonStop;
    }

    public void setReasonStop(java.lang.String reasonStop) {
        this.reasonStop = reasonStop;
    }

    @Override
    public ConstructionTaskDTO toDTO() {
        ConstructionTaskDTO constructionTaskDTO = new ConstructionTaskDTO();
        // set cac gia tri
        constructionTaskDTO.setCompletePercent(this.completePercent);
        constructionTaskDTO.setDescription(this.description);
        constructionTaskDTO.setStatus(this.status);
        constructionTaskDTO.setSourceType(this.sourceType);
        constructionTaskDTO.setDeployType(this.deployType);
        constructionTaskDTO.setType(this.type);
        constructionTaskDTO.setVat(this.vat);
        constructionTaskDTO.setDetailMonthPlanId(this.detailMonthPlanId);
        constructionTaskDTO.setCreatedDate(this.createdDate);
        constructionTaskDTO.setCreatedUserId(this.createdUserId);
        constructionTaskDTO.setCreatedGroupId(this.createdGroupId);
        constructionTaskDTO.setUpdatedDate(this.updatedDate);
        constructionTaskDTO.setUpdatedUserId(this.updatedUserId);
        constructionTaskDTO.setUpdatedGroupId(this.updatedGroupId);
        constructionTaskDTO.setCompleteState(this.completeState);
        constructionTaskDTO.setPerformerWorkItemId(this.performerWorkItemId);
        constructionTaskDTO.setSupervisorId(this.supervisorId);
        constructionTaskDTO.setDirectorId(this.directorId);
        constructionTaskDTO.setPerformerId(this.performerId);
        constructionTaskDTO.setQuantity(this.quantity);
        constructionTaskDTO.setConstructionTaskId(this.constructionTaskId);
        constructionTaskDTO.setSysGroupId(this.sysGroupId);
        constructionTaskDTO.setMonth(this.month);
        constructionTaskDTO.setYear(this.year);
        constructionTaskDTO.setTaskName(this.taskName);
        constructionTaskDTO.setStartDate(this.startDate);
        constructionTaskDTO.setEndDate(this.endDate);
        constructionTaskDTO.setBaselineStartDate(this.baselineStartDate);
        constructionTaskDTO.setBaselineEndDate(this.baselineEndDate);
        constructionTaskDTO.setConstructionId(this.constructionId);
        constructionTaskDTO.setWorkItemId(this.workItemId);
        constructionTaskDTO.setCatTaskId(this.catTaskId);
        constructionTaskDTO.setLevelId(this.levelId);
        constructionTaskDTO.setParentId(this.parentId);
        constructionTaskDTO.setPath(this.path);
        constructionTaskDTO.setReasonStop(this.reasonStop);
        constructionTaskDTO.setTaskOrder(this.taskOrder);
//        hoanm1_20181229_start
        constructionTaskDTO.setWorkItemNameHSHC(this.workItemNameHSHC);
//        hoanm1_20181229_end
        return constructionTaskDTO;
    }
}
