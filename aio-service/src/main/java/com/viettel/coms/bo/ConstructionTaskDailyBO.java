/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.ConstructionTaskDailyDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "CONSTRUCTION_TASK_DAILY")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class ConstructionTaskDailyBO extends BaseFWModelImpl {

    private java.util.Date approveDate;
    private java.lang.Long workItemId;
    private java.lang.Long approveUserId;
    private java.lang.Double quantity;
    private java.lang.Long constructionTaskDailyId;
    private java.lang.Long sysGroupId;
    private java.lang.Double amount;
    private java.lang.String type;
    private java.lang.String confirm;
    private java.util.Date createdDate;
    private java.lang.Long createdUserId;
    private java.lang.Long createdGroupId;
    private java.util.Date updatedDate;
    private java.lang.Long updatedUserId;
    private java.lang.Long updatedGroupId;
    private java.lang.Long constructionTaskId;
    //hoanm1_20180710_start
    private java.lang.Long catTaskId;
//hoanm1_20180710_end

    @Column(name = "APPROVE_DATE", length = 7)
    public java.util.Date getApproveDate() {
        return approveDate;
    }

    public void setApproveDate(java.util.Date approveDate) {
        this.approveDate = approveDate;
    }

    @Column(name = "WORK_ITEM_ID", length = 22)
    public java.lang.Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(java.lang.Long workItemId) {
        this.workItemId = workItemId;
    }

    //hoanm1_20180710_start
    @Column(name = "CAT_TASK_ID", length = 22)
    public java.lang.Long getCatTaskId() {
        return catTaskId;
    }

    public void setCatTaskId(java.lang.Long catTaskId) {
        this.catTaskId = catTaskId;
    }

    //hoanm1_20180710_end
    @Column(name = "APPROVE_USER_ID", length = 22)
    public java.lang.Long getApproveUserId() {
        return approveUserId;
    }

    public void setApproveUserId(java.lang.Long approveUserId) {
        this.approveUserId = approveUserId;
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
            @Parameter(name = "sequence", value = "CONSTRUCTION_TASK_DAILY_SEQ")})
    @Column(name = "CONSTRUCTION_TASK_DAILY_ID", length = 22)
    public java.lang.Long getConstructionTaskDailyId() {
        return constructionTaskDailyId;
    }

    public void setConstructionTaskDailyId(java.lang.Long constructionTaskDailyId) {
        this.constructionTaskDailyId = constructionTaskDailyId;
    }

    @Column(name = "SYS_GROUP_ID", length = 22)
    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    @Column(name = "AMOUNT", length = 22)
    public java.lang.Double getAmount() {
        return amount;
    }

    public void setAmount(java.lang.Double amount) {
        this.amount = amount;
    }

    @Column(name = "TYPE", length = 2)
    public java.lang.String getType() {
        return type;
    }

    public void setType(java.lang.String type) {
        this.type = type;
    }

    @Column(name = "CONFIRM", length = 2)
    public java.lang.String getConfirm() {
        return confirm;
    }

    public void setConfirm(java.lang.String confirm) {
        this.confirm = confirm;
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

    @Column(name = "CONSTRUCTION_TASK_ID", length = 22)
    public java.lang.Long getConstructionTaskId() {
        return constructionTaskId;
    }

    public void setConstructionTaskId(java.lang.Long constructionTaskId) {
        this.constructionTaskId = constructionTaskId;
    }

    @Override
    public ConstructionTaskDailyDTO toDTO() {
        ConstructionTaskDailyDTO constructionTaskDailyDTO = new ConstructionTaskDailyDTO();
        // set cac gia tri
        constructionTaskDailyDTO.setApproveDate(this.approveDate);
        constructionTaskDailyDTO.setWorkItemId(this.workItemId);
        constructionTaskDailyDTO.setApproveUserId(this.approveUserId);
        constructionTaskDailyDTO.setQuantity(this.quantity);
        constructionTaskDailyDTO.setConstructionTaskDailyId(this.constructionTaskDailyId);
        constructionTaskDailyDTO.setSysGroupId(this.sysGroupId);
        constructionTaskDailyDTO.setAmount(this.amount);
        constructionTaskDailyDTO.setType(this.type);
        constructionTaskDailyDTO.setConfirm(this.confirm);
        constructionTaskDailyDTO.setCreatedDate(this.createdDate);
        constructionTaskDailyDTO.setCreatedUserId(this.createdUserId);
        constructionTaskDailyDTO.setCreatedGroupId(this.createdGroupId);
        constructionTaskDailyDTO.setUpdatedDate(this.updatedDate);
        constructionTaskDailyDTO.setUpdatedUserId(this.updatedUserId);
        constructionTaskDailyDTO.setUpdatedGroupId(this.updatedGroupId);
        constructionTaskDailyDTO.setConstructionTaskId(this.constructionTaskId);
        constructionTaskDailyDTO.setCatTaskId(this.catTaskId);
        return constructionTaskDailyDTO;
    }
}
