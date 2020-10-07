package com.viettel.coms.dto;

public class IssueHistoryEntityDTO {

    private java.lang.String issueHistoryId;
    private java.lang.String oldValue;
    private java.lang.String newValue;
    private java.lang.String type;
    private java.util.Date createdDate;
    private java.lang.Long createdUserId;
    private java.lang.Long issueId;

    public java.lang.String getIssueHistoryId() {
        return issueHistoryId;
    }

    public void setIssueHistoryId(java.lang.String issueHistoryId) {
        this.issueHistoryId = issueHistoryId;
    }

    public java.lang.String getOldValue() {
        return oldValue;
    }

    public void setOldValue(java.lang.String oldValue) {
        this.oldValue = oldValue;
    }

    public java.lang.String getNewValue() {
        return newValue;
    }

    public void setNewValue(java.lang.String newValue) {
        this.newValue = newValue;
    }

    public java.lang.String getType() {
        return type;
    }

    public void setType(java.lang.String type) {
        this.type = type;
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

    public java.lang.Long getIssueId() {
        return issueId;
    }

    public void setIssueId(java.lang.Long issueId) {
        this.issueId = issueId;
    }
}
