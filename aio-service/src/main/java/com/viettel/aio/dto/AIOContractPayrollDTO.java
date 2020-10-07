package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOContractPayrollBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

//VietNT_20190711_create
@XmlRootElement(name = "AIO_CONTRACT_PAYROLLBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOContractPayrollDTO extends ComsBaseFWDTO<AIOContractPayrollBO> {
    private Long contractPayrollId;
    private Long contractId;
    private Long contractDetailId;
    private Long packageDetailId;
    private String packageName;
    private Long sysUserId;
    private String sysUserCode;
    private String fullName;
    private Long isProvinceBought;
    private Double revenue;
    private Long type;
    private Double salary;

    public Long getContractPayrollId() {
        return contractPayrollId;
    }

    public void setContractPayrollId(Long contractPayrollId) {
        this.contractPayrollId = contractPayrollId;
    }

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }

    public Long getContractDetailId() {
        return contractDetailId;
    }

    public void setContractDetailId(Long contractDetailId) {
        this.contractDetailId = contractDetailId;
    }

    public Long getPackageDetailId() {
        return packageDetailId;
    }

    public void setPackageDetailId(Long packageDetailId) {
        this.packageDetailId = packageDetailId;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public Long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(Long sysUserId) {
        this.sysUserId = sysUserId;
    }

    public String getSysUserCode() {
        return sysUserCode;
    }

    public void setSysUserCode(String sysUserCode) {
        this.sysUserCode = sysUserCode;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Long getIsProvinceBought() {
        return isProvinceBought;
    }

    public void setIsProvinceBought(Long isProvinceBought) {
        this.isProvinceBought = isProvinceBought;
    }

    public Double getRevenue() {
        return revenue;
    }

    public void setRevenue(Double revenue) {
        this.revenue = revenue;
    }

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    @Override
    public AIOContractPayrollBO toModel() {
        AIOContractPayrollBO bo = new AIOContractPayrollBO();
        bo.setContractPayrollId(this.getContractPayrollId());
        bo.setContractId(this.getContractId());
        bo.setContractDetailId(this.getContractDetailId());
        bo.setPackageDetailId(this.getPackageDetailId());
        bo.setPackageName(this.getPackageName());
        bo.setSysUserId(this.getSysUserId());
        bo.setSysUserCode(this.getSysUserCode());
        bo.setFullName(this.getFullName());
        bo.setIsProvinceBought(this.getIsProvinceBought());
        bo.setRevenue(this.getRevenue());
        bo.setType(this.getType());
        bo.setSalary(this.getSalary());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return contractPayrollId;
    }

    @Override
    public String catchName() {
        return contractPayrollId.toString();
    }
}
