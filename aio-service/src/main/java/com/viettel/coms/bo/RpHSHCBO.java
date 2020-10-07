package com.viettel.coms.bo;

import com.viettel.coms.dto.RpHSHCDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "RP_HSHC")
public class RpHSHCBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "WORK_ITEM_SEQ")})
    @Column(name = "RP_HSHC_ID", length = 22)
    private Long hshcId;

    @Column(name = "DATECOMPLETE",length = 22)
    private Date dateComplete;

    @Column(name = "SYSGROUPID",length = 22)
    private Long sysGroupId;

    @Column(name = "SYSGROUPNAME",length = 100)
    private String sysGroupName;

    @Column(name = "CATSTATIONCODE",length = 100)
    private String catStationCode;

    @Column(name = "CONSTRUCTIONCODE",length = 100)
    private String constructionCode;

    @Column(name = "RECEIVERECORDSDATE",length = 22)
    private Date receiveRecordsDate;

    @Column(name = "CNTCONTRACTCODE",length = 100)
    private String cntContractCode;

    @Column(name = "COMPLETEVALUE",length = 30)
    private Long completeValue;

    @Column(name = "WORKITEMCODE",length = 2000)
    private String workItemCode;

    @Column(name = "STATUS",length = 10)
    private String status;

    @Column(name = "CATPROVINCEID",length = 22)
    private Long catProvinceId;

    @Column(name = "CATPROVINCECODE",length = 100)
    private String catProvinceCode;

    @Column(name = "PERFORMERNAME",length = 100)
    private String performerName;

    @Column(name = "SUPERVISORNAME",length = 100)
    private String supervisorName;

    @Column(name = "DIRECTORNAME",length = 100)
    private String directorName;

    @Column(name = "STARTDATE",length = 22)
    private Date startDate;

    @Column(name = "ENDDATE",length = 22)
    private Date endDate;

    @Column(name = "DESCRIPTION",length = 2000)
    private String description;

    @Column(name = "CONSTRUCTIONID",length = 22)
    private Long constructionId;

    @Column(name = "INSERT_TIME",length = 22)
    private Date insertTime;

    @Column(name = "PROCESS_DATE",length = 22)
    private String processDate;

    @Column(name = "COMPLETESTATE",length = 22)
    private Long completeState;

    @Column(name = "COMPLETE_UPDATE_DATE",length = 22)
    private Date completeUpdateDate;

    @Column(name = "COMPLETE_USER_UPDATE",length = 22)
    private Long completeUserUpdate;

    @Column(name = "COMPLETEVALUE_PLAN",length = 40)
    private Long completeValuePlan;
    
    @Column(name = "APPROVE_COMPLETE_DESCRIPTION", length = 3000)
    private String approveCompleteDescription;
//    hoanm1_20181218_start
    @Column(name = "DATE_COMPLETE_TC", length = 20)
    private String dateCompleteTC;
//    hoanm1_20181218_end
    @Override
    public RpHSHCDTO toDTO() {
        RpHSHCDTO dto = new RpHSHCDTO();
        dto.setHshcId(this.getHshcId());
        dto.setDateComplete(this.getDateComplete());
        dto.setSysGroupId(this.getSysGroupId());
        dto.setSysGroupName(this.getSysGroupName());
        dto.setCatStationCode(this.getCatStationCode());
        dto.setConstructionCode(this.getConstructionCode());
        dto.setReceiveRecordsDate(this.getReceiveRecordsDate());
        dto.setCntContractCode(this.getCntContractCode());
        dto.setCompleteValue(this.getCompleteValue());
        dto.setWorkItemCode(this.getWorkItemCode());
        dto.setStatus(this.getStatus());
        dto.setCatProvinceId(this.getCatProvinceId());
        dto.setCatProvinceCode(this.getCatProvinceCode());
        dto.setPerformerName(this.getPerformerName());
        dto.setSupervisorName(this.getSupervisorName());
        dto.setDirectorName(this.getDirectorName());
        dto.setStartDate(this.getStartDate());
        dto.setEndDate(this.getEndDate());
        dto.setDescription(this.getDescription());
        dto.setConstructionId(this.getConstructionId());
        dto.setInsertTime(this.getInsertTime());
        dto.setProcessDate(this.getProcessDate());
        dto.setCompleteState(this.getCompleteState());
        dto.setCompleteUpdateDate(this.getCompleteUpdateDate());
        dto.setCompleteUserUpdate(this.getCompleteUserUpdate());
        dto.setCompleteValuePlan(this.getCompleteValuePlan());
        dto.setApproveCompleteDescription(this.getApproveCompleteDescription());
        dto.setDateCompleteTC(this.getDateCompleteTC());
        return null;
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

    //hoanm1_20181218_start
	public String getDateCompleteTC() {
		return dateCompleteTC;
	}

	public void setDateCompleteTC(String dateCompleteTC) {
		this.dateCompleteTC = dateCompleteTC;
	}
//	hoanm1_20181218_end  
}
