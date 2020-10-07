/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.IssueHistoryDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "ISSUE_HISTORY")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class IssueHistoryBO extends BaseFWModelImpl {

    private java.lang.Long issueHistoryId;
    private java.lang.String oldValue;
    private java.lang.String newValue;
    private java.lang.String type;
    private java.lang.Long createdUserId;
    private java.lang.Long issueId;
    private java.util.Date createdDate;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "ISSUE_HISTORY_SEQ")})
    @Column(name = "ISSUE_HISTORY_ID", length = 22)
    public java.lang.Long getIssueHistoryId() {
        return issueHistoryId;
    }

    public void setIssueHistoryId(java.lang.Long issueHistoryId) {
        this.issueHistoryId = issueHistoryId;
    }

    @Column(name = "OLD_VALUE", length = 1000)
    public java.lang.String getOldValue() {
        return oldValue;
    }

    public void setOldValue(java.lang.String oldValue) {
        this.oldValue = oldValue;
    }

    @Column(name = "NEW_VALUE", length = 1000)
    public java.lang.String getNewValue() {
        return newValue;
    }

    public void setNewValue(java.lang.String newValue) {
        this.newValue = newValue;
    }

    @Column(name = "TYPE", length = 4)
    public java.lang.String getType() {
        return type;
    }

    public void setType(java.lang.String type) {
        this.type = type;
    }

    @Column(name = "CREATED_USER_ID", length = 22)
    public java.lang.Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(java.lang.Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    @Column(name = "ISSUE_ID", length = 22)
    public java.lang.Long getIssueId() {
        return issueId;
    }

    public void setIssueId(java.lang.Long issueId) {
        this.issueId = issueId;
    }

    @Column(name = "CREATED_DATE", length = 7)
    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    @Override
    public IssueHistoryDTO toDTO() {
        IssueHistoryDTO issueHistoryDTO = new IssueHistoryDTO();
        // set cac gia tri
        issueHistoryDTO.setIssueHistoryId(this.issueHistoryId);
        issueHistoryDTO.setOldValue(this.oldValue);
        issueHistoryDTO.setNewValue(this.newValue);
        issueHistoryDTO.setType(this.type);
        issueHistoryDTO.setCreatedUserId(this.createdUserId);
        issueHistoryDTO.setIssueId(this.issueId);
        issueHistoryDTO.setCreatedDate(this.createdDate);
        return issueHistoryDTO;
    }
}
