/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.IssueHistoryBO;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "ISSUE_HISTORYBO")
public class IssueHistoryDTO extends ComsBaseFWDTO<IssueHistoryBO> {

    private java.lang.Long issueHistoryId;
    private java.lang.String oldValue;
    private java.lang.String newValue;
    private java.lang.String type;
    private java.lang.Long createdUserId;
    private java.lang.Long issueId;
    private java.util.Date createdDate;

    @Override
    public IssueHistoryBO toModel() {
        IssueHistoryBO issueHistoryBO = new IssueHistoryBO();
        issueHistoryBO.setIssueHistoryId(this.issueHistoryId);
        issueHistoryBO.setOldValue(this.oldValue);
        issueHistoryBO.setNewValue(this.newValue);
        issueHistoryBO.setType(this.type);
        issueHistoryBO.setCreatedUserId(this.createdUserId);
        issueHistoryBO.setIssueId(this.issueId);
        issueHistoryBO.setCreatedDate(this.createdDate);
        return issueHistoryBO;
    }

    public java.lang.Long getIssueHistoryId() {
        return issueHistoryId;
    }

    public void setIssueHistoryId(java.lang.Long issueHistoryId) {
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

    public java.lang.Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(java.lang.Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    @Override
    public Long getFWModelId() {
        return issueId;
    }

    @Override
    public String catchName() {
        return getIssueId().toString();
    }

    public java.lang.Long getIssueId() {
        return issueId;
    }

    public void setIssueId(java.lang.Long issueId) {
        this.issueId = issueId;
    }

    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

}
