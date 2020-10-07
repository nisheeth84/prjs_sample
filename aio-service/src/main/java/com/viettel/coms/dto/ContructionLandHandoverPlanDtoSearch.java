package com.viettel.coms.dto;

public class ContructionLandHandoverPlanDtoSearch extends ContructionLandHandoverPlanDTO {
    private String sysGroupName;
    private String sysGroupCode;
    private String catStationCode;
    private String contructionCode;
    private String catPartnerCode;
    private String fromDate;
    private String toDate;
    private String errorFilePath;
    private String htDate;
    private Long catProvinceId;
    private String catProvinceCode;
    private String catProvinceName;

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

    public String getCatProvinceName() {
        return catProvinceName;
    }

    public void setCatProvinceName(String catProvinceName) {
        this.catProvinceName = catProvinceName;
    }

    public String getFromDate() {
        return fromDate;
    }

    public void setFromDate(String fromDate) {
        this.fromDate = fromDate;
    }

    public String getToDate() {
        return toDate;
    }

    public void setToDate(String toDate) {
        this.toDate = toDate;
    }

    public String getContructionCode() {
        return contructionCode;
    }

    public void setContructionCode(String contructionCode) {
        this.contructionCode = contructionCode;
    }

    public String getCatStationCode() {
        return catStationCode;
    }

    public void setCatStationCode(String catStationCode) {
        this.catStationCode = catStationCode;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    public String getCatPartnerCode() {
        return catPartnerCode;
    }

    public void setCatPartnerCode(String catPartnerCode) {
        this.catPartnerCode = catPartnerCode;
    }

    public String getErrorFilePath() {
        return errorFilePath;
    }

    public void setErrorFilePath(String errorFilePath) {
        this.errorFilePath = errorFilePath;
    }

    public String getHtDate() {
        return htDate;
    }

    public void setHtDate(String htDate) {
        this.htDate = htDate;
    }

    public String getSysGroupCode() {
        return sysGroupCode;
    }

    public void setSysGroupCode(String sysGroupCode) {
        this.sysGroupCode = sysGroupCode;
    }

}
