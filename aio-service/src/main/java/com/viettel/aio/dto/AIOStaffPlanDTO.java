package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOStaffPlanBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement(name = "AIO_STAFF_PLAN_DTO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOStaffPlanDTO {
    public int getNumberOrder() {
        return numberOrder;
    }

    public void setNumberOrder(int numberOrder) {
        this.numberOrder = numberOrder;
    }

    public String getDeptname() {
        return deptname;
    }

    public void setDeptname(String deptname) {
        this.deptname = deptname;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public Long getCommercialTarget() {
        return commercialTarget;
    }

    public void setCommercialTarget(Long commercialTarget) {
        this.commercialTarget = commercialTarget;
    }

    public Long getServiceTarget() {
        return serviceTarget;
    }

    public void setServiceTarget(Long serviceTarget) {
        this.serviceTarget = serviceTarget;
    }

    private int numberOrder;
    private String deptname;
    private String employeeCode;
    private Long commercialTarget;
    private Long serviceTarget;


    public List<AIOStaffPlanBO> getAioStaffPlanBOS() {
        return aioStaffPlanBOS;
    }

    public void setAioStaffPlanBOS(List<AIOStaffPlanBO> aioStaffPlanBOS) {
        this.aioStaffPlanBOS = aioStaffPlanBOS;
    }

    public Long getTotalRecord() {
        return totalRecord;
    }

    public void setTotalRecord(Long totalRecord) {
        this.totalRecord = totalRecord;
    }

    private List<AIOStaffPlanBO> aioStaffPlanBOS;
    private Long totalRecord;
}
