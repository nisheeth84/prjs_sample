package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOContractPayrollDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

//VietNT_20190711_start
@Entity
@Table(name = "AIO_CONTRACT_PAYROLL")
public class AIOContractPayrollBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_CONTRACT_PAYROLL_SEQ")})
    @Column(name = "CONTRACT_PAYROLL_ID", length = 10)
    private Long contractPayrollId;
    @Column(name = "CONTRACT_ID", length = 10)
    private Long contractId;
    @Column(name = "CONTRACT_DETAIL_ID", length = 10)
    private Long contractDetailId;
    @Column(name = "PACKAGE_DETAIL_ID", length = 10)
    private Long packageDetailId;
    @Column(name = "PACKAGE_NAME", length = 500)
    private String packageName;
    @Column(name = "SYS_USER_ID", length = 10)
    private Long sysUserId;
    @Column(name = "SYS_USER_CODE", length = 200)
    private String sysUserCode;
    @Column(name = "FULL_NAME", length = 500)
    private String fullName;
    @Column(name = "IS_PROVINCE_BOUGHT", length = 2)
    private Long isProvinceBought;
    @Column(name = "REVENUE", length = 32)
    private Double revenue;
    @Column(name = "TYPE", length = 2)
    private Long type;
    @Column(name = "SALARY", length = 32)
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
    public BaseFWDTOImpl toDTO() {
        AIOContractPayrollDTO dto = new AIOContractPayrollDTO();
        dto.setContractPayrollId(this.getContractPayrollId());
        dto.setContractId(this.getContractId());
        dto.setContractDetailId(this.getContractDetailId());
        dto.setPackageDetailId(this.getPackageDetailId());
        dto.setPackageName(this.getPackageName());
        dto.setSysUserId(this.getSysUserId());
        dto.setSysUserCode(this.getSysUserCode());
        dto.setFullName(this.getFullName());
        dto.setIsProvinceBought(this.getIsProvinceBought());
        dto.setRevenue(this.getRevenue());
        dto.setType(this.getType());
        dto.setSalary(this.getSalary());
        return dto;
    }
}
