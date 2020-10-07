package com.viettel.coms.dto;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.util.Date;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ConstructionTaskGranttDTO {
    private Long id;
    private Long parentID;
    private Long orderID;
    private String title;
    private Date start;
    private Date end;
    private Double percentComplete;
    private boolean summary;
    private boolean expanded;
    private Long levelId;
    private Long status;
    private String fullname;
    private Long performerId;
    private Long checkProgress;
    private Long taskAll;
    private Long taskUnfulfilled;
    private Long taskSlow;
    private Long taskPause;
    private Long workItemId;

    private Long catProvinceId;
    private String catProvinceCode;
    private String catProvinceName;
    private String isInteral;
//    hoanm1_20181208_start
    private String checkStock;
    
    
    public String getCheckStock() {
		return checkStock;
	}

	public void setCheckStock(String checkStock) {
		this.checkStock = checkStock;
	}
//	hoanm1_20181208_end


	private String completeState;

    public String getIsInteral() {
		return isInteral;
	}

	public void setIsInteral(String isInteral) {
		this.isInteral = isInteral;
	}

	public Long getCatProvinceId() {
        return catProvinceId;
    }

    public void setCatProvinceId(Long catProvinceId) {
        this.catProvinceId = catProvinceId;
    }

    public String getCatProvinceCode() {
        return catProvinceCode;
    }

    public void setCatProvinceCode(String catProvinceCode) {
        this.catProvinceCode = catProvinceCode;
    }

    public String getCatProvinceName() {
        return catProvinceName;
    }

    public void setCatProvinceName(String catProvinceName) {
        this.catProvinceName = catProvinceName;
    }


    //	hoanm1_20180723_start
    private Long sysGroupId;

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    //	hoanm1_20180723_end
    // chinhpxn20180720_start
    private Long workItemStatus;

    public Long getWorkItemStatus() {
        return workItemStatus;
    }

    public void setWorkItemStatus(Long workItemStatus) {
        this.workItemStatus = workItemStatus;
    }

    //	chinhpxn20180720_end
    // hoanm1_20180626_start
    private String taskOrder;

    public String getTaskOrder() {
        return taskOrder;
    }

    public void setTaskOrder(String taskOrder) {
        this.taskOrder = taskOrder;
    }

    // hoanm1_20180626_end
//	hoanm1_20180612_start
    private String type;
    private Long constructionId;
    private Double quantity;

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(Long constructionId) {
        this.constructionId = constructionId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
//	hoanm1_20180612_end

    private Long catContructionTypeId;

    public Long getCatContructionTypeId() {
        return catContructionTypeId;
    }

    public void setCatContructionTypeId(Long catContructionTypeId) {
        this.catContructionTypeId = catContructionTypeId;
    }

    public Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(Long workItemId) {
        this.workItemId = workItemId;
    }

    public Long getTaskAll() {
        return taskAll;
    }

    public void setTaskAll(Long taskAll) {
        this.taskAll = taskAll;
    }

    public Long getTaskUnfulfilled() {
        return taskUnfulfilled;
    }

    public void setTaskUnfulfilled(Long taskUnfulfilled) {
        this.taskUnfulfilled = taskUnfulfilled;
    }

    public Long getTaskSlow() {
        return taskSlow;
    }

    public void setTaskSlow(Long taskSlow) {
        this.taskSlow = taskSlow;
    }

    public Long getTaskPause() {
        return taskPause;
    }

    public void setTaskPause(Long taskPause) {
        this.taskPause = taskPause;
    }

    public Long getPerformerId() {
        return performerId;
    }

    public void setPerformerId(Long performerId) {
        this.performerId = performerId;
    }

    public Long getCheckProgress() {
        return checkProgress;
    }

    public void setCheckProgress(Long checkProgress) {
        this.checkProgress = checkProgress;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getLevelId() {
        return levelId;
    }

    public void setLevelId(Long levelId) {
        this.levelId = levelId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getParentID() {
        return parentID;
    }

    public void setParentID(Long parentID) {
        this.parentID = parentID;
    }

    public Long getOrderID() {
        return orderID;
    }

    public void setOrderID(Long orderID) {
        this.orderID = orderID;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Date getStart() {
        return start;
    }

    public void setStart(Date start) {
        this.start = start;
    }

    public Date getEnd() {
        return end;
    }

    public void setEnd(Date end) {
        this.end = end;
    }

    public Double getPercentComplete() {
        return percentComplete;
    }

    public void setPercentComplete(Double percentComplete) {
        this.percentComplete = percentComplete;
    }

    public boolean isSummary() {
        return summary;
    }

    public void setSummary(boolean summary) {
        this.summary = summary;
    }

    public boolean isExpanded() {
        return expanded;
    }

    public void setExpanded(boolean expanded) {
        this.expanded = expanded;
    }

	public String getCompleteState() {
		return completeState;
	}

	public void setCompleteState(String completeState) {
		this.completeState = completeState;
	}
    
    

}
