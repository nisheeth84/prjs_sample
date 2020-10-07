package com.viettel.coms.dto;

import com.viettel.coms.bo.RpHSHCBO;

import java.util.Date;

public class RpHSHCDTO extends ComsBaseFWDTO<RpHSHCBO> {

    @Override
    @SuppressWarnings("Duplicates")
    public RpHSHCBO toModel() {
        RpHSHCBO bo = new RpHSHCBO();
        bo.setHshcId(this.getHshcId());
        bo.setDateComplete(this.getDateComplete());
        bo.setSysGroupId(this.getSysGroupId());
        bo.setSysGroupName(this.getSysGroupName());
        bo.setCatStationCode(this.getCatStationCode());
        bo.setConstructionCode(this.getConstructionCode());
        bo.setReceiveRecordsDate(this.getReceiveRecordsDate());
        bo.setCntContractCode(this.getCntContractCode());
        bo.setCompleteValue(this.getCompleteValue());
        bo.setWorkItemCode(this.getWorkItemCode());
        bo.setStatus(this.getStatus());
        bo.setCatProvinceId(this.getCatProvinceId());
        bo.setCatProvinceCode(this.getCatProvinceCode());
        bo.setPerformerName(this.getPerformerName());
        bo.setSupervisorName(this.getSupervisorName());
        bo.setDirectorName(this.getDirectorName());
        bo.setStartDate(this.getStartDate());
        bo.setEndDate(this.getEndDate());
        bo.setDescription(this.getDescription());
        bo.setConstructionId(this.getConstructionId());
        bo.setInsertTime(this.getInsertTime());
        bo.setProcessDate(this.getProcessDate());
        bo.setCompleteState(this.getCompleteState());
        bo.setCompleteUpdateDate(this.getCompleteUpdateDate());
        bo.setCompleteUserUpdate(this.getCompleteUserUpdate());
        bo.setCompleteValuePlan(this.getCompleteValuePlan());
        bo.setApproveCompleteDescription(this.getApproveCompleteDescription());
//        hoanm1_20181218_start
        bo.setDateCompleteTC(this.getDateCompleteTC());
//        hoanm1_20181218_end
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return this.getHshcId();
    }

    @Override
    public String catchName() {
        return this.getHshcId().toString();
    }

    private Long hshcId;

    private Date dateComplete;

    private Long sysGroupId;

    private String sysGroupName;

    private String catStationCode;

    private String constructionCode;

    private Date receiveRecordsDate;

    private String cntContractCode;

    private Long completeValue;

    private String workItemCode;

    private String status;

    private Long catProvinceId;

    private String catProvinceCode;

    private String performerName;

    private String supervisorName;

    private String directorName;

    private Date startDate;

    private Date endDate;

    private String description;

    private Long constructionId;

    private Date insertTime;

    private String processDate;

    private Long completeState;

    private Date completeUpdateDate;

    private Long completeUserUpdate;

    private Long completeValuePlan;

    private String approveCompleteDescription;
    
//    hoanm1_20181218_start
    private String dateCompleteTC;
    
    public String getDateCompleteTC() {
		return dateCompleteTC;
	}
//    hoanm1_20181218_end
	public void setDateCompleteTC(String dateCompleteTC) {
		this.dateCompleteTC = dateCompleteTC;
	}

	public String getApproveCompleteDescription() {
		return approveCompleteDescription;
	}

	public void setApproveCompleteDescription(String approveCompleteDescription) {
		this.approveCompleteDescription = approveCompleteDescription;
	}

	public Long getHshcId() {
        return hshcId;
    }

    public void setHshcId(Long hshcId) {
        this.hshcId = hshcId;
    }

    public Date getDateComplete() {
        return dateComplete;
    }

    public void setDateComplete(Date dateComplete) {
        this.dateComplete = dateComplete;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    public String getCatStationCode() {
        return catStationCode;
    }

    public void setCatStationCode(String catStationCode) {
        this.catStationCode = catStationCode;
    }

    public String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(String constructionCode) {
        this.constructionCode = constructionCode;
    }

    public Date getReceiveRecordsDate() {
        return receiveRecordsDate;
    }

    public void setReceiveRecordsDate(Date receiveRecordsDate) {
        this.receiveRecordsDate = receiveRecordsDate;
    }

    public String getCntContractCode() {
        return cntContractCode;
    }

    public void setCntContractCode(String cntContractCode) {
        this.cntContractCode = cntContractCode;
    }

    public Long getCompleteValue() {
        return completeValue;
    }

    public void setCompleteValue(Long completeValue) {
        this.completeValue = completeValue;
    }

    public String getWorkItemCode() {
        return workItemCode;
    }

    public void setWorkItemCode(String workItemCode) {
        this.workItemCode = workItemCode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public String getPerformerName() {
        return performerName;
    }

    public void setPerformerName(String performerName) {
        this.performerName = performerName;
    }

    public String getSupervisorName() {
        return supervisorName;
    }

    public void setSupervisorName(String supervisorName) {
        this.supervisorName = supervisorName;
    }

    public String getDirectorName() {
        return directorName;
    }

    public void setDirectorName(String directorName) {
        this.directorName = directorName;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(Long constructionId) {
        this.constructionId = constructionId;
    }

    public Date getInsertTime() {
        return insertTime;
    }

    public void setInsertTime(Date insertTime) {
        this.insertTime = insertTime;
    }

    public String getProcessDate() {
        return processDate;
    }

    public void setProcessDate(String processDate) {
        this.processDate = processDate;
    }

    public Long getCompleteState() {
        return completeState;
    }

    public void setCompleteState(Long completeState) {
        this.completeState = completeState;
    }

    public Date getCompleteUpdateDate() {
        return completeUpdateDate;
    }

    public void setCompleteUpdateDate(Date completeUpdateDate) {
        this.completeUpdateDate = completeUpdateDate;
    }

    public Long getCompleteUserUpdate() {
        return completeUserUpdate;
    }

    public void setCompleteUserUpdate(Long completeUserUpdate) {
        this.completeUserUpdate = completeUserUpdate;
    }

    public Long getCompleteValuePlan() {
        return completeValuePlan;
    }

    public void setCompleteValuePlan(Long completeValuePlan) {
        this.completeValuePlan = completeValuePlan;
    }
//    hoanm1_20181219_start
    private String catStationHouseCode;

	public String getCatStationHouseCode() {
		return catStationHouseCode;
	}

	public void setCatStationHouseCode(String catStationHouseCode) {
		this.catStationHouseCode = catStationHouseCode;
	} 
//	hoanm1_20181219_end
    
}
