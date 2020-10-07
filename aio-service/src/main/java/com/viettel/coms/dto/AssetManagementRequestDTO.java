/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.AssetManagementRequestBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "ASSET_MANAGEMENT_REQUESTBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AssetManagementRequestDTO extends ComsBaseFWDTO<AssetManagementRequestBO> {

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

    @Override
    public AssetManagementRequestBO toModel() {
        AssetManagementRequestBO assetManagementRequestBO = new AssetManagementRequestBO();
        assetManagementRequestBO.setRequestGroupId(this.requestGroupId);
        assetManagementRequestBO.setReceiveGroupId(this.receiveGroupId);
        assetManagementRequestBO.setCode(this.code);
        assetManagementRequestBO.setContent(this.content);
        assetManagementRequestBO.setStatus(this.status);
        assetManagementRequestBO.setDescription(this.description);
        assetManagementRequestBO.setCatReasonId(this.catReasonId);
        assetManagementRequestBO.setConstructionId(this.constructionId);
        assetManagementRequestBO.setIsFull(this.isFull);
        assetManagementRequestBO.setCreatedDate(this.createdDate);
        assetManagementRequestBO.setCreatedUserId(this.createdUserId);
        assetManagementRequestBO.setCreatedGroupId(this.createdGroupId);
        assetManagementRequestBO.setUpdatedDate(this.updatedDate);
        assetManagementRequestBO.setUpdatedUserId(this.updatedUserId);
        assetManagementRequestBO.setUpdatedGroupId(this.updatedGroupId);
        assetManagementRequestBO.setAssetManagementRequestId(this.assetManagementRequestId);
        assetManagementRequestBO.setType(this.type);
        return assetManagementRequestBO;
    }

    public java.lang.Long getRequestGroupId() {
        return requestGroupId;
    }

    public void setRequestGroupId(java.lang.Long requestGroupId) {
        this.requestGroupId = requestGroupId;
    }

    public java.lang.Long getReceiveGroupId() {
        return receiveGroupId;
    }

    public void setReceiveGroupId(java.lang.Long receiveGroupId) {
        this.receiveGroupId = receiveGroupId;
    }

    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    public java.lang.String getContent() {
        return content;
    }

    public void setContent(java.lang.String content) {
        this.content = content;
    }

    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    public java.lang.Long getCatReasonId() {
        return catReasonId;
    }

    public void setCatReasonId(java.lang.Long catReasonId) {
        this.catReasonId = catReasonId;
    }

    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    public java.lang.String getIsFull() {
        return isFull;
    }

    public void setIsFull(java.lang.String isFull) {
        this.isFull = isFull;
    }

    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    public java.lang.Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(java.lang.Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    public java.lang.Long getCreatedGroupId() {
        return createdGroupId;
    }

    public void setCreatedGroupId(java.lang.Long createdGroupId) {
        this.createdGroupId = createdGroupId;
    }

    public java.util.Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(java.util.Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public java.lang.Long getUpdatedUserId() {
        return updatedUserId;
    }

    public void setUpdatedUserId(java.lang.Long updatedUserId) {
        this.updatedUserId = updatedUserId;
    }

    public java.lang.Long getUpdatedGroupId() {
        return updatedGroupId;
    }

    public void setUpdatedGroupId(java.lang.Long updatedGroupId) {
        this.updatedGroupId = updatedGroupId;
    }

    @Override
    public Long getFWModelId() {
        return assetManagementRequestId;
    }

    @Override
    public String catchName() {
        return getAssetManagementRequestId().toString();
    }

    public java.lang.Long getAssetManagementRequestId() {
        return assetManagementRequestId;
    }

    public void setAssetManagementRequestId(java.lang.Long assetManagementRequestId) {
        this.assetManagementRequestId = assetManagementRequestId;
    }

    public java.lang.String getType() {
        return type;
    }

    public void setType(java.lang.String type) {
        this.type = type;
    }

}
