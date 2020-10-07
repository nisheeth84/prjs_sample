package com.viettel.coms.dto;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DetailMonthPlaningDTO extends DetailMonthPlanDTO {
    /**
     *
     */
    private String sysName;
    private String sysGroupCode;
    private String parentSysGroupName;

    public String getParentSysGroupName() {
        return parentSysGroupName;
    }

    public void setParentSysGroupName(String parentSysGroupName) {
        this.parentSysGroupName = parentSysGroupName;
    }

    public String getSysGroupCode() {
        return sysGroupCode;
    }

    public void setSysGroupCode(String sysGroupCode) {
        this.sysGroupCode = sysGroupCode;
    }

    public String getSysName() {
        return sysName;
    }

    public void setSysName(String sysName) {
        this.sysName = sysName;
    }

}
