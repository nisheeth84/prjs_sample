package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOKpiLogDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

//VietNT_20200213_start
@Entity
@Table(name = "KPI_LOG_MOBILE_AIO")
public class AIOKpiLogBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "KPI_LOG_MOBILE_AIO_SEQ")})
    @Column(name = "KPI_LOG_MOBILE_ID", length = 18)
    private Long kpiLogMobileId;
    @Column(name = "SYSUSERID", length = 18)
    private Long sysUserId;
    @Column(name = "LOGINNAME", length = 100)
    private String loginName;
    @Column(name = "PASSWORD", length = 100)
    private String password;
    @Column(name = "EMAIL", length = 100)
    private String email;
    @Column(name = "FULLNAME", length = 100)
    private String fullName;
    @Column(name = "EMPLOYEECODE", length = 100)
    private String employeeCode;
    @Column(name = "PHONENUMBER", length = 100)
    private String phoneNumber;
    @Column(name = "SYSGROUPNAME", length = 1000)
    private String sysGroupName;
    @Column(name = "SYSGROUPID", length = 18)
    private Long sysGroupId;
    @Column(name = "TIME_DATE", length = 22)
    private Date timeDate;
    @Column(name = "FUNCTION_CODE", length = 20)
    private String functionCode;
    @Column(name = "DESCRIPTION", length = 1000)
    private String description;
    @Column(name = "CONTRACTID", length = 18)
    private Long contractId;
    @Column(name = "CONTRACTCODE", length = 1000)
    private String contractCode;
    @Column(name = "PACKAGEDETAILID", length = 18)
    private Long packageDetailId;
    @Column(name = "ACCEPTANCERECORDSID", length = 18)
    private Long acceptanceRecordsId;
    @Column(name = "CUSTOMERID", length = 18)
    private Long customerId;
    @Column(name = "UPDATE_TIME", length = 22)
    private Date updateTime;
    @Column(name = "START_DATE", length = 22)
    private Date startDate;
    @Column(name = "END_DATE", length = 22)
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

    public void setSysUserId(Long sysuserid) {
        this.sysUserId = sysuserid;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginname) {
        this.loginName = loginname;
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

    public void setFullName(String fullname) {
        this.fullName = fullname;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeecode) {
        this.employeeCode = employeecode;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phonenumber) {
        this.phoneNumber = phonenumber;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysgroupname) {
        this.sysGroupName = sysgroupname;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysgroupid) {
        this.sysGroupId = sysgroupid;
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

    public void setContractId(Long contractid) {
        this.contractId = contractid;
    }

    public String getContractCode() {
        return contractCode;
    }

    public void setContractCode(String contractcode) {
        this.contractCode = contractcode;
    }

    public Long getPackageDetailId() {
        return packageDetailId;
    }

    public void setPackageDetailId(Long packagedetailid) {
        this.packageDetailId = packagedetailid;
    }

    public Long getAcceptanceRecordsId() {
        return acceptanceRecordsId;
    }

    public void setAcceptanceRecordsId(Long acceptancerecordsid) {
        this.acceptanceRecordsId = acceptancerecordsid;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerid) {
        this.customerId = customerid;
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
    public BaseFWDTOImpl toDTO() {
        AIOKpiLogDTO dto = new AIOKpiLogDTO();
        dto.setKpiLogMobileId(this.getKpiLogMobileId());
        dto.setSysUserId(this.getSysUserId());
        dto.setLoginName(this.getLoginName());
        dto.setPassword(this.getPassword());
        dto.setEmail(this.getEmail());
        dto.setFullName(this.getFullName());
        dto.setEmployeeCode(this.getEmployeeCode());
        dto.setPhoneNumber(this.getPhoneNumber());
        dto.setSysGroupName(this.getSysGroupName());
        dto.setSysGroupId(this.getSysGroupId());
        dto.setTimeDate(this.getTimeDate());
        dto.setFunctionCode(this.getFunctionCode());
        dto.setDescription(this.getDescription());
        dto.setContractId(this.getContractId());
        dto.setContractCode(this.getContractCode());
        dto.setPackageDetailId(this.getPackageDetailId());
        dto.setAcceptanceRecordsId(this.getAcceptanceRecordsId());
        dto.setCustomerId(this.getCustomerId());
        dto.setUpdateTime(this.getUpdateTime());
        dto.setStartDate(this.getStartDate());
        dto.setEndDate(this.getEndDate());
        return dto;
    }
}
