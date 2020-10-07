/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.IssueDiscussDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "ISSUE_DISCUSS")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class IssueDiscussBO extends BaseFWModelImpl {

    private java.lang.Long issueDiscussId;
    private java.lang.Long issueId;
    private java.lang.String content;
    private java.lang.Long createdUserId;
    private java.util.Date createdDate;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "ISSUE_DISCUSS_SEQ")})
    @Column(name = "ISSUE_DISCUSS_ID", length = 22)
    public java.lang.Long getIssueDiscussId() {
        return issueDiscussId;
    }

    public void setIssueDiscussId(java.lang.Long issueDiscussId) {
        this.issueDiscussId = issueDiscussId;
    }

    @Column(name = "ISSUE_ID", length = 22)
    public java.lang.Long getIssueId() {
        return issueId;
    }

    public void setIssueId(java.lang.Long issueId) {
        this.issueId = issueId;
    }

    @Column(name = "CONTENT", length = 4000)
    public java.lang.String getContent() {
        return content;
    }

    public void setContent(java.lang.String content) {
        this.content = content;
    }

    @Column(name = "CREATED_USER_ID", length = 22)
    public java.lang.Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(java.lang.Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    @Column(name = "CREATED_DATE", length = 7)
    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    @Override
    public IssueDiscussDTO toDTO() {
        IssueDiscussDTO issueDiscussDTO = new IssueDiscussDTO();
        // set cac gia tri
        issueDiscussDTO.setIssueDiscussId(this.issueDiscussId);
        issueDiscussDTO.setIssueId(this.issueId);
        issueDiscussDTO.setContent(this.content);
        issueDiscussDTO.setCreatedUserId(this.createdUserId);
        issueDiscussDTO.setCreatedDate(this.createdDate);
        return issueDiscussDTO;
    }
}
