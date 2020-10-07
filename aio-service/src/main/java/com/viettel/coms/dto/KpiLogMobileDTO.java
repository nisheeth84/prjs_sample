package com.viettel.coms.dto;

import com.viettel.coms.bo.KpiLogMobileBO;
import com.viettel.erp.utils.CustomJsonDateDeserializer;
import com.viettel.erp.utils.CustomJsonDateSerializer;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;

@SuppressWarnings("serial")
@XmlRootElement(name = "KPI_LOG_MOBILEBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class KpiLogMobileDTO extends ComsBaseFWDTO<KpiLogMobileBO> {

    private java.lang.Long workItemId;
    private java.lang.String workItemName;
    private java.lang.Long catTaskId;
    private java.lang.String catTaskName;
    private java.lang.String description;
    private java.lang.String functionCode;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date timeDate;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date timeDateFrom;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date timeDateTo;
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
    private java.lang.String kpiLogMobileName;
    private java.lang.Long catConstructionType;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date updateTime;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date updateTimeFrom;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date updateTimeTo;
    private java.lang.String constructiontypename;
    private java.lang.String provincecode;
    private java.lang.String stationcode;
    private java.lang.Double constructiontaskid;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date endDate;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date endDateFrom;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date endDateTo;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date startDate;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date startDateFrom;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date startDateTo;
    private java.lang.Double completepercent;
    private java.lang.Long status;
    private java.lang.String constructionCode;
    private java.lang.Long constructionId;
    private java.lang.String constructionName;
    private int start;
    private int maxResult;
    private java.lang.String provincename;
    private java.lang.String luyKeThucHien;

    @Override
    public KpiLogMobileBO toModel() {
        KpiLogMobileBO kpiLogMobileBO = new KpiLogMobileBO();
        kpiLogMobileBO.setWorkItemId(this.workItemId);
        kpiLogMobileBO.setCatTaskName(this.catTaskName);
        kpiLogMobileBO.setCatTaskId(this.catTaskId);
        kpiLogMobileBO.setDescription(this.description);
        kpiLogMobileBO.setFunctionCode(this.functionCode);
        kpiLogMobileBO.setTimeDate(this.timeDate);
        kpiLogMobileBO.setSysgroupid(this.sysgroupid);
        kpiLogMobileBO.setSysgroupname(this.sysgroupname);
        kpiLogMobileBO.setPhonenumber(this.phonenumber);
        kpiLogMobileBO.setEmployeecode(this.employeecode);
        kpiLogMobileBO.setFullname(this.fullname);
        kpiLogMobileBO.setEmail(this.email);
        kpiLogMobileBO.setPassword(this.password);
        kpiLogMobileBO.setLoginname(this.loginname);
        kpiLogMobileBO.setSysuserid(this.sysuserid);
        kpiLogMobileBO.setKpiLogMobileId(this.kpiLogMobileId);
        kpiLogMobileBO.setCatConstructionType(this.catConstructionType);
        kpiLogMobileBO.setUpdateTime(this.updateTime);
        kpiLogMobileBO.setConstructiontypename(this.constructiontypename);
        kpiLogMobileBO.setProvincecode(this.provincecode);
        kpiLogMobileBO.setStationcode(this.stationcode);
        kpiLogMobileBO.setConstructiontaskid(this.constructiontaskid);
        kpiLogMobileBO.setEndDate(this.endDate);
        kpiLogMobileBO.setStartDate(this.startDate);
        kpiLogMobileBO.setCompletepercent(this.completepercent);
        kpiLogMobileBO.setStatus(this.status);
        kpiLogMobileBO.setConstructionCode(this.constructionCode);
        kpiLogMobileBO.setConstructionId(this.constructionId);
        kpiLogMobileBO.setWorkItemName(this.workItemName);
        return kpiLogMobileBO;
    }

    @JsonProperty("workItemId")
    public java.lang.Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(java.lang.Long workItemId) {
        this.workItemId = workItemId;
    }

    @JsonProperty("workItemName")
    public java.lang.String getWorkItemName() {
        return workItemName;
    }

    public void setWorkItemName(java.lang.String workItemName) {
        this.workItemName = workItemName;
    }

    @JsonProperty("catTaskId")
    public java.lang.Long getCatTaskId() {
        return catTaskId;
    }

    public void setCatTaskId(java.lang.Long catTaskId) {
        this.catTaskId = catTaskId;
    }

    @JsonProperty("catTaskName")
    public java.lang.String getCatTaskName() {
        return catTaskName;
    }

    public void setCatTaskName(java.lang.String catTaskName) {
        this.catTaskName = catTaskName;
    }

    @JsonProperty("description")
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @JsonProperty("functionCode")
    public java.lang.String getFunctionCode() {
        return functionCode;
    }

    public void setFunctionCode(java.lang.String functionCode) {
        this.functionCode = functionCode;
    }

    @JsonProperty("timeDate")
    public java.util.Date getTimeDate() {
        return timeDate;
    }

    public void setTimeDate(java.util.Date timeDate) {
        this.timeDate = timeDate;
    }

    public java.util.Date getTimeDateFrom() {
        return timeDateFrom;
    }

    public void setTimeDateFrom(java.util.Date timeDateFrom) {
        this.timeDateFrom = timeDateFrom;
    }

    public java.util.Date getTimeDateTo() {
        return timeDateTo;
    }

    public void setTimeDateTo(java.util.Date timeDateTo) {
        this.timeDateTo = timeDateTo;
    }

    @JsonProperty("sysgroupid")
    public java.lang.Long getSysgroupid() {
        return sysgroupid;
    }

    public void setSysgroupid(java.lang.Long sysgroupid) {
        this.sysgroupid = sysgroupid;
    }

    @JsonProperty("sysgroupname")
    public java.lang.String getSysgroupname() {
        return sysgroupname;
    }

    public void setSysgroupname(java.lang.String sysgroupname) {
        this.sysgroupname = sysgroupname;
    }

    @JsonProperty("phonenumber")
    public java.lang.String getPhonenumber() {
        return phonenumber;
    }

    public void setPhonenumber(java.lang.String phonenumber) {
        this.phonenumber = phonenumber;
    }

    @JsonProperty("employeecode")
    public java.lang.String getEmployeecode() {
        return employeecode;
    }

    public void setEmployeecode(java.lang.String employeecode) {
        this.employeecode = employeecode;
    }

    @JsonProperty("fullname")
    public java.lang.String getFullname() {
        return fullname;
    }

    public void setFullname(java.lang.String fullname) {
        this.fullname = fullname;
    }

    @JsonProperty("email")
    public java.lang.String getEmail() {
        return email;
    }

    public void setEmail(java.lang.String email) {
        this.email = email;
    }

    @JsonProperty("password")
    public java.lang.String getPassword() {
        return password;
    }

    public void setPassword(java.lang.String password) {
        this.password = password;
    }

    @JsonProperty("loginname")
    public java.lang.String getLoginname() {
        return loginname;
    }

    public void setLoginname(java.lang.String loginname) {
        this.loginname = loginname;
    }

    @JsonProperty("sysuserid")
    public java.lang.Long getSysuserid() {
        return sysuserid;
    }

    public void setSysuserid(java.lang.Long sysuserid) {
        this.sysuserid = sysuserid;
    }

    @JsonProperty("kpiLogMobileId")
    public java.lang.Long getKpiLogMobileId() {
        return kpiLogMobileId;
    }

    public void setKpiLogMobileId(java.lang.Long kpiLogMobileId) {
        this.kpiLogMobileId = kpiLogMobileId;
    }

    @JsonProperty("kpiLogMobileName")
    public java.lang.String getKpiLogMobileName() {
        return kpiLogMobileName;
    }

    public void setKpiLogMobileName(java.lang.String kpiLogMobileName) {
        this.kpiLogMobileName = kpiLogMobileName;
    }

    @JsonProperty("catConstructionType")
    public java.lang.Long getCatConstructionType() {
        return catConstructionType;
    }

    public void setCatConstructionType(java.lang.Long catConstructionType) {
        this.catConstructionType = catConstructionType;
    }

    @JsonProperty("updateTime")
    public java.util.Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(java.util.Date updateTime) {
        this.updateTime = updateTime;
    }

    public java.util.Date getUpdateTimeFrom() {
        return updateTimeFrom;
    }

    public void setUpdateTimeFrom(java.util.Date updateTimeFrom) {
        this.updateTimeFrom = updateTimeFrom;
    }

    public java.util.Date getUpdateTimeTo() {
        return updateTimeTo;
    }

    public void setUpdateTimeTo(java.util.Date updateTimeTo) {
        this.updateTimeTo = updateTimeTo;
    }

    @JsonProperty("constructiontypename")
    public java.lang.String getConstructiontypename() {
        return constructiontypename;
    }

    public void setConstructiontypename(java.lang.String constructiontypename) {
        this.constructiontypename = constructiontypename;
    }

    @JsonProperty("provincecode")
    public java.lang.String getProvincecode() {
        return provincecode;
    }

    public void setProvincecode(java.lang.String provincecode) {
        this.provincecode = provincecode;
    }

    @JsonProperty("stationcode")
    public java.lang.String getStationcode() {
        return stationcode;
    }

    public void setStationcode(java.lang.String stationcode) {
        this.stationcode = stationcode;
    }

    @JsonProperty("constructiontaskid")
    public java.lang.Double getConstructiontaskid() {
        return constructiontaskid;
    }

    public void setConstructiontaskid(java.lang.Double constructiontaskid) {
        this.constructiontaskid = constructiontaskid;
    }

    @JsonProperty("endDate")
    public java.util.Date getEndDate() {
        return endDate;
    }

    public void setEndDate(java.util.Date endDate) {
        this.endDate = endDate;
    }

    public java.util.Date getEndDateFrom() {
        return endDateFrom;
    }

    public void setEndDateFrom(java.util.Date endDateFrom) {
        this.endDateFrom = endDateFrom;
    }

    public java.util.Date getEndDateTo() {
        return endDateTo;
    }

    public void setEndDateTo(java.util.Date endDateTo) {
        this.endDateTo = endDateTo;
    }

    @JsonProperty("startDate")
    public java.util.Date getStartDate() {
        return startDate;
    }

    public void setStartDate(java.util.Date startDate) {
        this.startDate = startDate;
    }

    public java.util.Date getStartDateFrom() {
        return startDateFrom;
    }

    public void setStartDateFrom(java.util.Date startDateFrom) {
        this.startDateFrom = startDateFrom;
    }

    public java.util.Date getStartDateTo() {
        return startDateTo;
    }

    public void setStartDateTo(java.util.Date startDateTo) {
        this.startDateTo = startDateTo;
    }

    @JsonProperty("completepercent")
    public java.lang.Double getCompletepercent() {
        return completepercent;
    }

    public void setCompletepercent(java.lang.Double completepercent) {
        this.completepercent = completepercent;
    }

    @JsonProperty("status")
    public java.lang.Long getStatus() {
        return status;
    }

    public void setStatus(java.lang.Long status) {
        this.status = status;
    }

    @JsonProperty("constructionCode")
    public java.lang.String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(java.lang.String constructionCode) {
        this.constructionCode = constructionCode;
    }

    @JsonProperty("constructionId")
    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    @JsonProperty("constructionName")
    public java.lang.String getConstructionName() {
        return constructionName;
    }

    public void setConstructionName(java.lang.String constructionName) {
        this.constructionName = constructionName;
    }

    @JsonProperty("start")
    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    @JsonProperty("maxResult")
    public int getMaxResult() {
        return maxResult;
    }

    public void setMaxResult(int maxResult) {
        this.maxResult = maxResult;
    }

    public java.lang.String getProvincename() {
        return provincename;
    }

    public void setProvincename(java.lang.String provincename) {
        this.provincename = provincename;
    }

    public java.lang.String getLuyKeThucHien() {
        return luyKeThucHien;
    }

    public void setLuyKeThucHien(java.lang.String luyKeThucHien) {
        this.luyKeThucHien = luyKeThucHien;
    }

    @Override
    public String catchName() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Long getFWModelId() {
        // TODO Auto-generated method stub
        return null;
    }

}
