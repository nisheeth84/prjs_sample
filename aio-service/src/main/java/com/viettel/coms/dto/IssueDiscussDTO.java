/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.IssueDiscussBO;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "ISSUE_DISCUSSBO")
public class IssueDiscussDTO extends ComsBaseFWDTO<IssueDiscussBO> {

    private java.lang.Long issueDiscussId;
    private java.lang.Long issueId;
    private java.lang.String content;
    private java.lang.Long createdUserId;
    private java.util.Date createdDate;
    private String createdDateStr;
    private String createdUserName;

    @Override
    public IssueDiscussBO toModel() {
        IssueDiscussBO issueDiscussBO = new IssueDiscussBO();
        issueDiscussBO.setIssueDiscussId(this.issueDiscussId);
        issueDiscussBO.setIssueId(this.issueId);
        issueDiscussBO.setContent(this.content);
        issueDiscussBO.setCreatedUserId(this.createdUserId);
        issueDiscussBO.setCreatedDate(this.createdDate);
        return issueDiscussBO;
    }

    @Override
    public Long getFWModelId() {
        return issueDiscussId;
    }

    @Override
    public String catchName() {
        return getIssueDiscussId().toString();
    }

    public String getCreatedUserName() {
        return createdUserName;
    }

    public void setCreatedUserName(String createdUserName) {
        this.createdUserName = createdUserName;
    }

    public String getCreatedDateStr() {
        return createdDateStr;
    }

    public void setCreatedDateStr(String createdDateStr) {
        this.createdDateStr = createdDateStr;
    }

    public java.lang.Long getIssueDiscussId() {
        return issueDiscussId;
    }

    public void setIssueDiscussId(java.lang.Long issueDiscussId) {
        this.issueDiscussId = issueDiscussId;
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

    public java.lang.Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(java.lang.Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

}
