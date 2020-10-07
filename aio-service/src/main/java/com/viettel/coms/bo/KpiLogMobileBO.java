package com.viettel.coms.bo;

import com.viettel.coms.dto.KpiLogMobileDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.coms.bo.KpiLogMobileBO")
@Table(name = "KPI_LOG_MOBILE")
public class KpiLogMobileBO extends BaseFWModelImpl {

    private java.lang.Long workItemId;
    private java.lang.String catTaskName;
    private java.lang.Long catTaskId;
    private java.lang.String description;
    private java.lang.String functionCode;
    private java.util.Date timeDate;
    private java.lang.Long sysgroupid;
    private java.lang.String sysgroupname;
    private java.lang.String phonenumber;
    private java.lang.String employeecode;
    private java.lang.String fullname;
    private java.lang.String email;
    private java.lang.String password;
    private java.lang.String loginname;
    private java.lang.Long sysuserid;
    private java.lang.Long kpiLogMobileId;
    private java.lang.Long catConstructionType;
    private java.util.Date updateTime;
    private java.lang.String constructiontypename;
    private java.lang.String provincecode;
    private java.lang.String stationcode;
    private java.lang.Double constructiontaskid;
    private java.util.Date endDate;
    private java.util.Date startDate;
    private java.lang.Double completepercent;
    private java.lang.Long status;
    private java.lang.String constructionCode;
    private java.lang.Long constructionId;
    private java.lang.String workItemName;

    @Column(name = "WORK_ITEM_ID", length = 22)
    public java.lang.Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(java.lang.Long workItemId) {
        this.workItemId = workItemId;
    }

    @Column(name = "CAT_TASK_NAME", length = 1000)
    public java.lang.String getCatTaskName() {
        return catTaskName;
    }

    public void setCatTaskName(java.lang.String catTaskName) {
        this.catTaskName = catTaskName;
    }

    @Column(name = "CAT_TASK_ID", length = 22)
    public java.lang.Long getCatTaskId() {
        return catTaskId;
    }

    public void setCatTaskId(java.lang.Long catTaskId) {
        this.catTaskId = catTaskId;
    }

    @Column(name = "DESCRIPTION", length = 1000)
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @Column(name = "FUNCTION_CODE", length = 20)
    public java.lang.String getFunctionCode() {
        return functionCode;
    }

    public void setFunctionCode(java.lang.String functionCode) {
        this.functionCode = functionCode;
    }

    @Column(name = "TIME_DATE", length = 7)
    public java.util.Date getTimeDate() {
        return timeDate;
    }

    public void setTimeDate(java.util.Date timeDate) {
        this.timeDate = timeDate;
    }

    @Column(name = "SYSGROUPID", length = 22)
    public java.lang.Long getSysgroupid() {
        return sysgroupid;
    }

    public void setSysgroupid(java.lang.Long sysgroupid) {
        this.sysgroupid = sysgroupid;
    }

    @Column(name = "SYSGROUPNAME", length = 1000)
    public java.lang.String getSysgroupname() {
        return sysgroupname;
    }

    public void setSysgroupname(java.lang.String sysgroupname) {
        this.sysgroupname = sysgroupname;
    }

    @Column(name = "PHONENUMBER", length = 100)
    public java.lang.String getPhonenumber() {
        return phonenumber;
    }

    public void setPhonenumber(java.lang.String phonenumber) {
        this.phonenumber = phonenumber;
    }

    @Column(name = "EMPLOYEECODE", length = 100)
    public java.lang.String getEmployeecode() {
        return employeecode;
    }

    public void setEmployeecode(java.lang.String employeecode) {
        this.employeecode = employeecode;
    }

    @Column(name = "FULLNAME", length = 100)
    public java.lang.String getFullname() {
        return fullname;
    }

    public void setFullname(java.lang.String fullname) {
        this.fullname = fullname;
    }

    @Column(name = "EMAIL", length = 100)
    public java.lang.String getEmail() {
        return email;
    }

    public void setEmail(java.lang.String email) {
        this.email = email;
    }

    @Column(name = "PASSWORD", length = 100)
    public java.lang.String getPassword() {
        return password;
    }

    public void setPassword(java.lang.String password) {
        this.password = password;
    }

    @Column(name = "LOGINNAME", length = 100)
    public java.lang.String getLoginname() {
        return loginname;
    }

    public void setLoginname(java.lang.String loginname) {
        this.loginname = loginname;
    }

    @Column(name = "SYSUSERID", length = 22)
    public java.lang.Long getSysuserid() {
        return sysuserid;
    }

    public void setSysuserid(java.lang.Long sysuserid) {
        this.sysuserid = sysuserid;
    }

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "CONSTRUCTION_TASK_DAILY_SEQ")})
    @Column(name = "KPI_LOG_MOBILE_ID", length = 22)
    public java.lang.Long getKpiLogMobileId() {
        return kpiLogMobileId;
    }

    public void setKpiLogMobileId(java.lang.Long kpiLogMobileId) {
        this.kpiLogMobileId = kpiLogMobileId;
    }

    @Column(name = "CAT_CONSTRUCTION_TYPE_ID", length = 22)
    public java.lang.Long getCatConstructionType() {
        return catConstructionType;
    }

    public void setCatConstructionType(java.lang.Long catConstructionType) {
        this.catConstructionType = catConstructionType;
    }

    @Column(name = "UPDATE_TIME", length = 7)
    public java.util.Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(java.util.Date updateTime) {
        this.updateTime = updateTime;
    }

    @Column(name = "CONSTRUCTIONTYPENAME", length = 100)
    public java.lang.String getConstructiontypename() {
        return constructiontypename;
    }

    public void setConstructiontypename(java.lang.String constructiontypename) {
        this.constructiontypename = constructiontypename;
    }

    @Column(name = "PROVINCECODE", length = 50)
    public java.lang.String getProvincecode() {
        return provincecode;
    }

    public void setProvincecode(java.lang.String provincecode) {
        this.provincecode = provincecode;
    }

    @Column(name = "STATIONCODE", length = 50)
    public java.lang.String getStationcode() {
        return stationcode;
    }

    public void setStationcode(java.lang.String stationcode) {
        this.stationcode = stationcode;
    }

    @Column(name = "CONSTRUCTIONTASKID", length = 22)
    public java.lang.Double getConstructiontaskid() {
        return constructiontaskid;
    }

    public void setConstructiontaskid(java.lang.Double constructiontaskid) {
        this.constructiontaskid = constructiontaskid;
    }

    @Column(name = "END_DATE", length = 7)
    public java.util.Date getEndDate() {
        return endDate;
    }

    public void setEndDate(java.util.Date endDate) {
        this.endDate = endDate;
    }

    @Column(name = "START_DATE", length = 7)
    public java.util.Date getStartDate() {
        return startDate;
    }

    public void setStartDate(java.util.Date startDate) {
        this.startDate = startDate;
    }

    @Column(name = "COMPLETEPERCENT", length = 22)
    public java.lang.Double getCompletepercent() {
        return completepercent;
    }

    public void setCompletepercent(java.lang.Double completepercent) {
        this.completepercent = completepercent;
    }

    @Column(name = "STATUS", length = 22)
    public java.lang.Long getStatus() {
        return status;
    }

    public void setStatus(java.lang.Long status) {
        this.status = status;
    }

    @Column(name = "CONSTRUCTION_CODE", length = 1000)
    public java.lang.String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(java.lang.String constructionCode) {
        this.constructionCode = constructionCode;
    }

    @Column(name = "CONSTRUCTION_ID", length = 22)
    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    @Column(name = "WORK_ITEM_NAME", length = 1000)
    public java.lang.String getWorkItemName() {
        return workItemName;
    }

    public void setWorkItemName(java.lang.String workItemName) {
        this.workItemName = workItemName;
    }

    @Override
    public KpiLogMobileDTO toDTO() {
        KpiLogMobileDTO kpiLogMobileDTO = new KpiLogMobileDTO();
        kpiLogMobileDTO.setWorkItemId(this.workItemId);
        kpiLogMobileDTO.setCatTaskName(this.catTaskName);
        kpiLogMobileDTO.setCatTaskId(this.catTaskId);
        kpiLogMobileDTO.setDescription(this.description);
        kpiLogMobileDTO.setFunctionCode(this.functionCode);
        kpiLogMobileDTO.setTimeDate(this.timeDate);
        kpiLogMobileDTO.setSysgroupid(this.sysgroupid);
        kpiLogMobileDTO.setSysgroupname(this.sysgroupname);
        kpiLogMobileDTO.setPhonenumber(this.phonenumber);
        kpiLogMobileDTO.setEmployeecode(this.employeecode);
        kpiLogMobileDTO.setFullname(this.fullname);
        kpiLogMobileDTO.setEmail(this.email);
        kpiLogMobileDTO.setPassword(this.password);
        kpiLogMobileDTO.setLoginname(this.loginname);
        kpiLogMobileDTO.setSysuserid(this.sysuserid);
        kpiLogMobileDTO.setKpiLogMobileId(this.kpiLogMobileId);
        kpiLogMobileDTO.setCatConstructionType(this.catConstructionType);
        kpiLogMobileDTO.setUpdateTime(this.updateTime);
        kpiLogMobileDTO.setConstructiontypename(this.constructiontypename);
        kpiLogMobileDTO.setProvincecode(this.provincecode);
        kpiLogMobileDTO.setStationcode(this.stationcode);
        kpiLogMobileDTO.setConstructiontaskid(this.constructiontaskid);
        kpiLogMobileDTO.setEndDate(this.endDate);
        kpiLogMobileDTO.setStartDate(this.startDate);
        kpiLogMobileDTO.setCompletepercent(this.completepercent);
        kpiLogMobileDTO.setStatus(this.status);
        kpiLogMobileDTO.setConstructionCode(this.constructionCode);
        kpiLogMobileDTO.setConstructionId(this.constructionId);
        kpiLogMobileDTO.setWorkItemName(this.workItemName);
        return kpiLogMobileDTO;
    }
}
