package com.viettel.coms;

import java.util.Date;

public class ConstructionProgressDTO {
    private String id; 
    private String title;
    private String parentId;
    private String orderId;
    private Date startDate;
    private Date endDate;
    private Long thoiGian;
    private Long percentComplete;
    private String percentCompleteStr;
    private String summary;
    private String expanded;

    private String predecessorId;
    private String successorId;
    private String type;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getExpanded() {
        return expanded;
    }

    public void setExpanded(String expanded) {
        this.expanded = expanded;
    }

    public String getPredecessorId() {
        return predecessorId;
    }

    public void setPredecessorId(String predecessorId) {
        this.predecessorId = predecessorId;
    }

    public String getSuccessorId() {
        return successorId;
    }

    public void setSuccessorId(String successorId) {
        this.successorId = successorId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getThoiGian() {
        return thoiGian;
    }

    public void setThoiGian(Long thoiGian) {
        this.thoiGian = thoiGian;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Long getPercentComplete() {
        return percentComplete;
    }

    public void setPercentComplete(Long percentComplete) {
        this.percentComplete = percentComplete;
    }

    public String getPercentCompleteStr() {
        return percentCompleteStr;
    }

    public void setPercentCompleteStr(String percentCompleteStr) {
        this.percentCompleteStr = percentCompleteStr;
    }


}
