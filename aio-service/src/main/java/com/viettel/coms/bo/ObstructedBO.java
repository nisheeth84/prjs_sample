/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.ObstructedDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "OBSTRUCTED")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class ObstructedBO extends BaseFWModelImpl {

    private java.lang.Long obstructedId;
    private java.util.Date closedDate;
    private java.lang.String obstructedState;
    private java.lang.String obstructedContent;
    private java.lang.Long constructionId;
    private java.util.Date createdDate;
    private java.lang.Long createdUserId;
    private java.lang.Long createdGroupId;
    private java.util.Date updatedDate;
    private java.lang.Long updatedUserId;
    private java.lang.Long updatedGroupId;
    //	hoanm1_20180820_start
    private java.lang.Long workItemId;

    @Column(name = "WORK_ITEM_ID", length = 22)
    public java.lang.Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(java.lang.Long workItemId) {
        this.workItemId = workItemId;
    }
//	hoanm1_20180820_end

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "OBSTRUCTED_SEQ")})
    @Column(name = "OBSTRUCTED_ID", length = 22)
    public java.lang.Long getObstructedId() {
        return obstructedId;
    }

    public void setObstructedId(java.lang.Long obstructedId) {
        this.obstructedId = obstructedId;
    }

    @Column(name = "CLOSED_DATE", length = 7)
    public java.util.Date getClosedDate() {
        return closedDate;
    }

    public void setClosedDate(java.util.Date closedDate) {
        this.closedDate = closedDate;
    }

    @Column(name = "OBSTRUCTED_STATE", length = 2)
    public java.lang.String getObstructedState() {
        return obstructedState;
    }

    public void setObstructedState(java.lang.String obstructedState) {
        this.obstructedState = obstructedState;
    }

    @Column(name = "OBSTRUCTED_CONTENT", length = 4000)
    public java.lang.String getObstructedContent() {
        return obstructedContent;
    }

    public void setObstructedContent(java.lang.String obstructedContent) {
        this.obstructedContent = obstructedContent;
    }

    @Column(name = "CONSTRUCTION_ID", length = 22)
    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
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
    public ObstructedDTO toDTO() {
        ObstructedDTO obstructedDTO = new ObstructedDTO();
        // set cac gia tri
        obstructedDTO.setObstructedId(this.obstructedId);
        obstructedDTO.setClosedDate(this.closedDate);
        obstructedDTO.setObstructedState(this.obstructedState);
        obstructedDTO.setObstructedContent(this.obstructedContent);
        obstructedDTO.setConstructionId(this.constructionId);
        obstructedDTO.setCreatedDate(this.createdDate);
        obstructedDTO.setCreatedUserId(this.createdUserId);
        obstructedDTO.setCreatedGroupId(this.createdGroupId);
        obstructedDTO.setUpdatedDate(this.updatedDate);
        obstructedDTO.setUpdatedUserId(this.updatedUserId);
        obstructedDTO.setUpdatedGroupId(this.updatedGroupId);
//		hoanm1_20180820_start
        obstructedDTO.setWorkItemId(this.workItemId);
//		hoanm1_20180820_end
        return obstructedDTO;
    }
}
