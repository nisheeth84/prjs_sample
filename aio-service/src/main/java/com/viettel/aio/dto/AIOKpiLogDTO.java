package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOKpiLogBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

//VietNT_20200213_create
@XmlRootElement(name = "AIO_KPI_LOGBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOKpiLogDTO extends ComsBaseFWDTO<AIOKpiLogBO> {

    private Long kpiLogMobileId;
    private Long sysUserId;
    private String loginName;
    private String password;
    private String email;
    private String fullName;
    private String employeeCode;
    private String phoneNumber;
    private String sysGroupName;
    private Long sysGroupId;
    private Date timeDate;
    private String functionCode;
    private String description;
    private Long contractId;
    private String contractCode;
    private Long packageDetailId;
    private Long acceptanceRecordsId;
    private Long customerId;
    private Date updateTime;
    private Date startDate;
    private Date endDate;

    public Long getKpiLogMobileId() {
        return kpiLogMobileId;
    }

    public void setKpiLogMobileId(Long kpiLogMobileId) {
        this.kpiLogMobileId = kpiLogMobileId;
    }

    public Long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(Long sysUserId) {
        this.sysUserId = sysUserId;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public Date getTimeDate() {
        return timeDate;
    }

    public void setTimeDate(Date timeDate) {
        this.timeDate = timeDate;
    }

    public String getFunctionCode() {
        return functionCode;
    }

    public void setFunctionCode(String functionCode) {
        this.functionCode = functionCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }

    public String getContractCode() {
        return contractCode;
    }

    public void setContractCode(String contractCode) {
        this.contractCode = contractCode;
    }

    public Long getPackageDetailId() {
        return packageDetailId;
    }

    public void setPackageDetailId(Long packageDetailId) {
        this.packageDetailId = packageDetailId;
    }

    public Long getAcceptanceRecordsId() {
        return acceptanceRecordsId;
    }

    public void setAcceptanceRecordsId(Long acceptanceRecordsId) {
        this.acceptanceRecordsId = acceptanceRecordsId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
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

    @Override
    public AIOKpiLogBO toModel() {
        AIOKpiLogBO bo = new AIOKpiLogBO();
        bo.setKpiLogMobileId(this.getKpiLogMobileId());
        bo.setSysUserId(this.getSysUserId());
        bo.setLoginName(this.getLoginName());
        bo.setPassword(this.getPassword());
        bo.setEmail(this.getEmail());
        bo.setFullName(this.getFullName());
        bo.setEmployeeCode(this.getEmployeeCode());
        bo.setPhoneNumber(this.getPhoneNumber());
        bo.setSysGroupName(this.getSysGroupName());
        bo.setSysGroupId(this.getSysGroupId());
        bo.setTimeDate(this.getTimeDate());
        bo.setFunctionCode(this.getFunctionCode());
        bo.setDescription(this.getDescription());
        bo.setContractId(this.getContractId());
        bo.setContractCode(this.getContractCode());
        bo.setPackageDetailId(this.getPackageDetailId());
        bo.setAcceptanceRecordsId(this.getAcceptanceRecordsId());
        bo.setCustomerId(this.getCustomerId());
        bo.setUpdateTime(this.getUpdateTime());
        bo.setStartDate(this.getStartDate());
        bo.setEndDate(this.getEndDate());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return kpiLogMobileId;
    }

    @Override
    public String catchName() {
        return kpiLogMobileId.toString();
    }
}
