/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.AssetManagementRequestDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "ASSET_MANAGEMENT_REQUEST")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class AssetManagementRequestBO extends BaseFWModelImpl {

    private java.lang.Long requestGroupId;
    private java.lang.Long receiveGroupId;
    private java.lang.String code;
    private java.lang.String content;
    private java.lang.String status;
    private java.lang.String description;
    private java.lang.Long catReasonId;
    private java.lang.Long constructionId;
    private java.lang.String isFull;
    private java.util.Date createdDate;
    private java.lang.Long createdUserId;
    private java.lang.Long createdGroupId;
    private java.util.Date updatedDate;
    private java.lang.Long updatedUserId;
    private java.lang.Long updatedGroupId;
    private java.lang.Long assetManagementRequestId;
    private java.lang.String type;

    @Column(name = "REQUEST_GROUP_ID", length = 22)
    public java.lang.Long getRequestGroupId() {
        return requestGroupId;
    }

    public void setRequestGroupId(java.lang.Long requestGroupId) {
        this.requestGroupId = requestGroupId;
    }

    @Column(name = "RECEIVE_GROUP_ID", length = 22)
    public java.lang.Long getReceiveGroupId() {
        return receiveGroupId;
    }

    public void setReceiveGroupId(java.lang.Long receiveGroupId) {
        this.receiveGroupId = receiveGroupId;
    }

    @Column(name = "CODE", length = 100)
    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    @Column(name = "CONTENT", length = 4000)
    public java.lang.String getContent() {
        return content;
    }

    public void setContent(java.lang.String content) {
        this.content = content;
    }

    @Column(name = "STATUS", length = 2)
    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    @Column(name = "DESCRIPTION", length = 1000)
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @Column(name = "CAT_REASON_ID", length = 22)
    public java.lang.Long getCatReasonId() {
        return catReasonId;
    }

    public void setCatReasonId(java.lang.Long catReasonId) {
        this.catReasonId = catReasonId;
    }

    @Column(name = "CONSTRUCTION_ID", length = 22)
    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    @Column(name = "IS_FULL", length = 1)
    public java.lang.String getIsFull() {
        return isFull;
    }

    public void setIsFull(java.lang.String isFull) {
        this.isFull = isFull;
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

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "ASSET_MANAGEMENT_REQUEST_SEQ")})
    @Column(name = "ASSET_MANAGEMENT_REQUEST_ID", length = 22)
    public java.lang.Long getAssetManagementRequestId() {
        return assetManagementRequestId;
    }

    public void setAssetManagementRequestId(java.lang.Long assetManagementRequestId) {
        this.assetManagementRequestId = assetManagementRequestId;
    }

    @Column(name = "TYPE", length = 2)
    public java.lang.String getType() {
        return type;
    }

    public void setType(java.lang.String type) {
        this.type = type;
    }

    @Override
    public AssetManagementRequestDTO toDTO() {
        AssetManagementRequestDTO assetManagementRequestDTO = new AssetManagementRequestDTO();
        // set cac gia tri
        assetManagementRequestDTO.setRequestGroupId(this.requestGroupId);
        assetManagementRequestDTO.setReceiveGroupId(this.receiveGroupId);
        assetManagementRequestDTO.setCode(this.code);
        assetManagementRequestDTO.setContent(this.content);
        assetManagementRequestDTO.setStatus(this.status);
        assetManagementRequestDTO.setDescription(this.description);
        assetManagementRequestDTO.setCatReasonId(this.catReasonId);
        assetManagementRequestDTO.setConstructionId(this.constructionId);
        assetManagementRequestDTO.setIsFull(this.isFull);
        assetManagementRequestDTO.setCreatedDate(this.createdDate);
        assetManagementRequestDTO.setCreatedUserId(this.createdUserId);
        assetManagementRequestDTO.setCreatedGroupId(this.createdGroupId);
        assetManagementRequestDTO.setUpdatedDate(this.updatedDate);
        assetManagementRequestDTO.setUpdatedUserId(this.updatedUserId);
        assetManagementRequestDTO.setUpdatedGroupId(this.updatedGroupId);
        assetManagementRequestDTO.setAssetManagementRequestId(this.assetManagementRequestId);
        assetManagementRequestDTO.setType(this.type);
        return assetManagementRequestDTO;
    }
}
