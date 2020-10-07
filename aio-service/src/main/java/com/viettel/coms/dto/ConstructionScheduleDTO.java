package com.viettel.coms.dto;

import com.viettel.coms.bo.ConstructionScheduleBO;

public class ConstructionScheduleDTO extends ComsBaseFWDTO<ConstructionScheduleBO> {

    // from sql
    private java.lang.Long constructionId;
    private java.lang.String constructionCode;
    private java.lang.String constructionName;
    private java.lang.Long detailMonthPlanId;
    private java.lang.String status;
    private java.lang.String startingDate;
    private java.lang.String stationCode;
    private java.lang.String unCompletedTask;
    private java.lang.String totalTask;
    private java.lang.String uncomTotalTask;

    // use 1 time
    private java.lang.Long constructionScheduleId;
    private java.lang.String statusText;
    private java.lang.String sortThisMonth;
    private java.lang.Double progress;
    private java.lang.String isInternal;
    // thi công:1 ,Giám Sát: 2, KH Tháng:3
    private String scheduleType;
    private String catPrtName;

    @Override
    public ConstructionScheduleBO toModel() {
        ConstructionScheduleBO constructionScheduleBO = new ConstructionScheduleBO();
        constructionScheduleBO.setConstructionScheduleId(this.constructionScheduleId);
        constructionScheduleBO.setConstructionId(this.constructionId);
        constructionScheduleBO.setConstructionCode(this.constructionCode);
        constructionScheduleBO.setConstructionName(this.constructionName);
        constructionScheduleBO.setStationCode(this.stationCode);
        constructionScheduleBO.setStatus(this.status);
        constructionScheduleBO.setStartingDate(this.startingDate);
        constructionScheduleBO.setProgress(this.progress);
        return constructionScheduleBO;
    }

    @Override
    public String catchName() {
        return getConstructionScheduleId().toString();
    }

    @Override
    public Long getFWModelId() {
        return constructionScheduleId;
    }

    public java.lang.Long getConstructionScheduleId() {
        return constructionScheduleId;
    }

    public void setConstructionScheduleId(java.lang.Long constructionScheduleId) {
        this.constructionScheduleId = constructionScheduleId;
    }

    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    public java.lang.String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(java.lang.String constructionCode) {
        this.constructionCode = constructionCode;
    }

    public java.lang.String getConstructionName() {
        return constructionName;
    }

    public void setConstructionName(java.lang.String constructionName) {
        this.constructionName = constructionName;
    }

    public java.lang.Long getDetailMonthPlanId() {
        return detailMonthPlanId;
    }

    public void setDetailMonthPlanId(java.lang.Long detailMonthPlanId) {
        this.detailMonthPlanId = detailMonthPlanId;
    }

    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    public java.lang.String getStartingDate() {
        return startingDate;
    }

    public void setStartingDate(java.lang.String startingDate) {
        this.startingDate = startingDate;
    }

    public java.lang.String getStationCode() {
        return stationCode;
    }

    public void setStationCode(java.lang.String stationCode) {
        this.stationCode = stationCode;
    }

    public java.lang.String getUnCompletedTask() {
        return unCompletedTask;
    }

    public void setUnCompletedTask(java.lang.String unCompletedTask) {
        this.unCompletedTask = unCompletedTask;
    }

    public java.lang.String getTotalTask() {
        return totalTask;
    }

    public void setTotalTask(java.lang.String totalTask) {
        this.totalTask = totalTask;
    }

    public java.lang.String getStatusText() {
        return statusText;
    }

    public void setStatusText(java.lang.String statusText) {
        this.statusText = statusText;
    }

    public java.lang.String getSortThisMonth() {
        return sortThisMonth;
    }

    public void setSortThisMonth(java.lang.String sortThisMonth) {
        this.sortThisMonth = sortThisMonth;
    }

    public java.lang.Double getProgress() {
        return progress;
    }

    public void setProgress(java.lang.Double progress) {
        this.progress = progress;
    }

    public String getScheduleType() {
        return scheduleType;
    }

    public void setScheduleType(String scheduleType) {
        this.scheduleType = scheduleType;
    }

    public java.lang.String getUncomTotalTask() {
        return uncomTotalTask;
    }

    public void setUncomTotalTask(java.lang.String uncomTotalTask) {
        this.uncomTotalTask = uncomTotalTask;
    }

    public java.lang.String getIsInternal() {
        return isInternal;
    }

    public void setIsInternal(java.lang.String isInternal) {
        this.isInternal = isInternal;
    }

    public String getCatPrtName() {
        return catPrtName;
    }

    public void setCatPrtName(String catPrtName) {
        this.catPrtName = catPrtName;
    }

}
