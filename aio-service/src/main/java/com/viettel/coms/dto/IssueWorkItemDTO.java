
package com.viettel.coms.dto;

/**
 * @author CuongNV2
 * @version 1.0
 * @since 2018-05-23
 */
public class IssueWorkItemDTO {

    // 2: chuyển bộ phận điều hành
    // 1: mở phản ánh
    // 0: đóng phản ánh
    private java.lang.Long changeSysRoleCode;

    private java.lang.Long issueId;
    private java.lang.String content;
    private java.lang.Long constructionId;
    private java.lang.String code;
    private java.lang.String oldStatus;
    private java.lang.String status;
    private java.lang.Long workItemId;
    private java.lang.String workItemName;
    private java.lang.Long createdUserId;
    private java.lang.String state;
    private java.lang.String contentHanding;
    private java.lang.Long currentHandingUserId;
    private java.lang.Long gorSysUserIdByCons;
    private java.lang.Long isProcessFeedback;

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

    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    public java.lang.Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(java.lang.Long workItemId) {
        this.workItemId = workItemId;
    }

    public java.lang.String getOldStatus() {
        return oldStatus;
    }

    public void setOldStatus(java.lang.String oldStatus) {
        this.oldStatus = oldStatus;
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

    public java.lang.Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(java.lang.Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    public java.lang.String getWorkItemName() {
        return workItemName;
    }

    public void setWorkItemName(java.lang.String workItemName) {
        this.workItemName = workItemName;
    }

    public java.lang.Long getGorSysUserIdByCons() {
        return gorSysUserIdByCons;
    }

    public void setGorSysUserIdByCons(java.lang.Long gorSysUserIdByCons) {
        this.gorSysUserIdByCons = gorSysUserIdByCons;
    }

    public java.lang.Long getIsProcessFeedback() {
        return isProcessFeedback;
    }

    public void setIsProcessFeedback(java.lang.Long isProcessFeedback) {
        this.isProcessFeedback = isProcessFeedback;
    }
}