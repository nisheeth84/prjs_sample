package com.viettel.coms.bo;

import com.viettel.coms.dto.IssueDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "ISSUE")
public class IssueBO extends BaseFWModelImpl {
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

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "ISSUE_ID")})
    @Column(name = "ISSUE_ID", length = 11)
    public java.lang.Long getIssue_id() {
        return issueId;
    }

    public void setIssue_id(java.lang.Long issue_id) {
        this.issueId = issue_id;
    }

    @Column(name = "CONTENT", length = 2000)
    public java.lang.String getContent() {
        return content;
    }

    public void setContent(java.lang.String content) {
        this.content = content;
    }

    @Column(name = "CONSTRUCTION_ID", length = 10)
    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    @Column(name = "WORK_ITEM_ID", length = 10)
    public java.lang.Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(java.lang.Long workItemId) {
        this.workItemId = workItemId;
    }

    @Column(name = "STATUS", length = 2)
    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    @Column(name = "state", length = 50)
    public java.lang.String getState() {
        return state;
    }

    public void setState(java.lang.String state) {
        this.state = state;
    }

    @Column(name = "CONTENT_HANDING", length = 2000)
    public java.lang.String getContentHanding() {
        return contentHanding;
    }

    public void setContentHanding(java.lang.String contentHanding) {
        this.contentHanding = contentHanding;
    }

    @Column(name = "CURRENT_HANDING_USER_ID", length = 10)
    public java.lang.Long getCurrentHandingUserId() {
        return currentHandingUserId;
    }

    public void setCurrentHandingUserId(java.lang.Long currentHandingUserId) {
        this.currentHandingUserId = currentHandingUserId;
    }

    @Column(name = "CREATED_DATE", length = 7)
    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    @Column(name = "CREATED_USER_ID", length = 10)
    public java.lang.Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(java.lang.Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    @Column(name = "CREATED_GROUP_ID", length = 10)
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

    @Column(name = "UPDATED_USER_ID", length = 10)
    public java.lang.Long getUpdatedUserId() {
        return updatedUserId;
    }

    public void setUpdatedUserId(java.lang.Long updatedUserId) {
        this.updatedUserId = updatedUserId;
    }

    @Override
    public IssueDTO toDTO() {
        IssueDTO issueDTO = new IssueDTO();
        // set cac gia tri
        issueDTO.setWorkItemId(this.workItemId);
        issueDTO.setConstructionId(this.constructionId);
        issueDTO.setCreatedDate(this.createdDate);
        issueDTO.setCreatedUserId(this.createdUserId);
        issueDTO.setCreatedGroupId(this.createdGroupId);
        issueDTO.setUpdatedDate(this.updatedDate);
        issueDTO.setUpdatedUserId(this.updatedUserId);
        return issueDTO;
    }

}
