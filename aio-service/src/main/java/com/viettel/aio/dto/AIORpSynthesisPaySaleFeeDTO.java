package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOAreaBO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

@XmlRootElement(name = "RP_SYNTHESIS_PAY_SALE_FEEBO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIORpSynthesisPaySaleFeeDTO extends ComsBaseFWDTO<AIOAreaBO>{

    private String provinceCode;
    private String sysGroupName;
    private String areaCode;
    private String sysGroupId;
    private String employeeCode;
    private String sysUserName;
    private String sysUserPhone;
    private String emailQL;
    private String employeeCodeCTV;
    private String nameCTV;
    private String taxCodeCTV;
    private Double amount;
    private Double salary;
    private Double taxSalary;
    private Double realSalary;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateFrom;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateTo;
    private Long areaId;
    private String path;
    private String content;

    public String getAreaCode() {
        return areaCode;
    }

    public void setAreaCode(String areaCode) {
        this.areaCode = areaCode;
    }

    public String getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(String sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getProvinceCode() {
        return provinceCode;
    }

    public void setProvinceCode(String provinceCode) {
        this.provinceCode = provinceCode;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public String getSysUserPhone() {
        return sysUserPhone;
    }

    public void setSysUserPhone(String sysUserPhone) {
        this.sysUserPhone = sysUserPhone;
    }

    public String getEmailQL() {
        return emailQL;
    }

    public void setEmailQL(String emailQL) {
        this.emailQL = emailQL;
    }

    public String getEmployeeCodeCTV() {
        return employeeCodeCTV;
    }

    public void setEmployeeCodeCTV(String employeeCodeCTV) {
        this.employeeCodeCTV = employeeCodeCTV;
    }

    public String getNameCTV() {
        return nameCTV;
    }

    public void setNameCTV(String nameCTV) {
        this.nameCTV = nameCTV;
    }

    public String getTaxCodeCTV() {
        return taxCodeCTV;
    }

    public void setTaxCodeCTV(String taxCodeCTV) {
        this.taxCodeCTV = taxCodeCTV;
    }

    public Long getAreaId() {
        return areaId;
    }

    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Date getDateFrom() {
        return dateFrom;
    }

    public void setDateFrom(Date dateFrom) {
        this.dateFrom = dateFrom;
    }

    public Date getDateTo() {
        return dateTo;
    }

    public void setDateTo(Date dateTo) {
        this.dateTo = dateTo;
    }

    public String getSysUserName() {
        return sysUserName;
    }

    public void setSysUserName(String sysUserName) {
        this.sysUserName = sysUserName;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public Double getTaxSalary() {
        return taxSalary;
    }

    public void setTaxSalary(Double taxSalary) {
        this.taxSalary = taxSalary;
    }

    public Double getRealSalary() {
        return realSalary;
    }

    public void setRealSalary(Double realSalary) {
        this.realSalary = realSalary;
    }

    @Override
    public AIOAreaBO toModel() {
        return null;
    }

    @Override
    public Long getFWModelId() {
        return null;
    }

    @Override
    public String catchName() {
        return null;
    }
}
