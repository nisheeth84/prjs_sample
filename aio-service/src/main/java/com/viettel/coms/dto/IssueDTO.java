package com.viettel.coms.dto;

import com.viettel.coms.bo.IssueBO;

public class IssueDTO extends ComsBaseFWDTO<IssueBO> {
    private java.lang.Long changeSysRoleCode;
    private java.lang.Long issueId;
    private java.lang.String content;
    private java.lang.Long constructionId;
    private java.lang.Long workItemId;
    private java.lang.String status;
    private java.lang.String state;
    private java.lang.String contentHanding;
    private java.lang.Long currentHandingUserId;

    private java.util.Date createdDate;
    private java.lang.Long createdUserId;
    private java.lang.Long createdGroupId;
    private java.util.Date updatedDate;
    private java.lang.Long updatedUserId;

    @Override
    public IssueBO toModel() {
        IssueBO issueBO = new IssueBO();
        issueBO.setContent(this.content);
        issueBO.setConstructionId(this.constructionId);
        issueBO.setWorkItemId(this.workItemId);
        issueBO.setStatus(this.status);
        issueBO.setState(this.state);
        issueBO.setContentHanding(this.contentHanding);
        issueBO.setCurrentHandingUserId(this.currentHandingUserId);
        issueBO.setCreatedDate(this.createdDate);
        issueBO.setCreatedUserId(this.createdUserId);
        issueBO.setCreatedGroupId(this.createdGroupId);
        issueBO.setUpdatedDate(this.updatedDate);
        issueBO.setUpdatedUserId(this.updatedUserId);
        return issueBO;
    }

    public java.lang.Long getIssueId() {
        return issueId;
    }

    public void setIssueId(java.lang.Long issueId) {
        this.issueId = issueId;
    }

    public java.lang.String getContent() {
        return content;
    }

    public void setContent(java.lang.String content) {
        this.content = content;
    }

    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    public java.lang.Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(java.lang.Long workItemId) {
        this.workItemId = workItemId;
    }

    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    public java.lang.String getState() {
        return state;
    }

    public void setState(java.lang.String state) {
        this.state = state;
    }

    public java.lang.String getContentHanding() {
        return contentHanding;
    }

    public void setContentHanding(java.lang.String contentHanding) {
        this.contentHanding = contentHanding;
    }

    public java.lang.Long getCurrentHandingUserId() {
        return currentHandingUserId;
    }

    public void setCurrentHandingUserId(java.lang.Long currentHandingUserId) {
        this.currentHandingUserId = currentHandingUserId;
    }

    public java.lang.Long getChangeSysRoleCode() {
        return changeSysRoleCode;
    }

    public void setChangeSysRoleCode(java.lang.Long changeSysRoleCode) {
        this.changeSysRoleCode = changeSysRoleCode;
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

    @Override
    public Long getFWModelId() {
        return issueId;
    }

    @Override
    public String catchName() {
        return getIssueId().toString();
    }
}
