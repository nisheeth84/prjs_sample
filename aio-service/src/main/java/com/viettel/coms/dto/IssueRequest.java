
package com.viettel.coms.dto;

/**
 * @author CuongNV2
 * @version 1.0
 * @since 2018-05-23
 */
public class IssueRequest {
    private SysUserRequest sysUserRequest;
    private IssueWorkItemDTO issueDetail;
    private IssueHistoryEntityDTO issueHistoryContentIssueDetail;
    private IssueHistoryEntityDTO issueHistoryContentHandingDetail;
    private IssueDicussEntityDTO issueDicussDetail;

    // mod governor or staff
    private long type;
    private IssueDTO issueDTODetail;

    public SysUserRequest getSysUserRequest() {
        return sysUserRequest;
    }

    public void setSysUserRequest(SysUserRequest sysUserRequest) {
        this.sysUserRequest = sysUserRequest;
    }

    public IssueWorkItemDTO getIssueDetail() {
        return issueDetail;
    }

    public void setIssueDetail(IssueWorkItemDTO issueDetail) {
        this.issueDetail = issueDetail;
    }

    public IssueHistoryEntityDTO getIssueHistoryContentIssueDetail() {
        return issueHistoryContentIssueDetail;
    }

    public void setIssueHistoryContentIssueDetail(IssueHistoryEntityDTO issueHistoryContentIssueDetail) {
        this.issueHistoryContentIssueDetail = issueHistoryContentIssueDetail;
    }

    public IssueHistoryEntityDTO getIssueHistoryContentHandingDetail() {
        return issueHistoryContentHandingDetail;
    }

    public void setIssueHistoryContentHandingDetail(IssueHistoryEntityDTO issueHistoryContentHandingDetail) {
        this.issueHistoryContentHandingDetail = issueHistoryContentHandingDetail;
    }

    public IssueDicussEntityDTO getIssueDicussDetail() {
        return issueDicussDetail;
    }

    public void setIssueDicussDetail(IssueDicussEntityDTO issueDicussDetail) {
        this.issueDicussDetail = issueDicussDetail;
    }

    public IssueDTO getIssueDTODetail() {
        return issueDTODetail;
    }

    public void setIssueDTODetail(IssueDTO issueDTODetail) {
        this.issueDTODetail = issueDTODetail;
    }

    public long getType() {
        return type;
    }

    public void setType(long type) {
        this.type = type;
    }
}