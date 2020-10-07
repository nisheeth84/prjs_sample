package com.viettel.coms.dto;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class DetailMonthPlanSimpleDTO extends DetailMonthPlanDTO {
    /**
     *
     */
    private static final long serialVersionUID = 1L;
    private String sysGroupName;
    private String parentSysGroupName;
    private String sysGroupCode;

    public String getSysGroupCode() {
        return sysGroupCode;
    }

    public void setSysGroupCode(String sysGroupCode) {
        this.sysGroupCode = sysGroupCode;
    }

    public String getParentSysGroupName() {
        return parentSysGroupName;
    }

    public void setParentSysGroupName(String parentSysGroupName) {
        this.parentSysGroupName = parentSysGroupName;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    private List<String> signStateList;
    private String constructionCode;
    private List<String> yearList;
    private List<String> monthList;
    private String isTCImport;
    private String isHSHCImport;
    private String isLDTImport;
    private String isYCVTImport;
    private String isDTImport;
    private String isCVKImport;

    // chinhpxn_20180710_start
    private List<String> constructionIdLst;

    public List<String> getConstructionIdLst() {
        return constructionIdLst;
    }

    public void setConstructionIdLst(List<String> constructionIdLst) {
        this.constructionIdLst = constructionIdLst;
    }
//	chinhpxn_20180710_end

    public String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(String constructionCode) {
        this.constructionCode = constructionCode;
    }

    public List<String> getYearList() {
        return yearList;
    }

    private List<String> listConstrTaskIdDelete;

    public List<String> getListConstrTaskIdDelete() {
        return listConstrTaskIdDelete;
    }

    public void setListConstrTaskIdDelete(List<String> listConstrTaskDelete) {
        this.listConstrTaskIdDelete = listConstrTaskDelete;
    }

    private List<ConstructionTaskDetailDTO> listCVK;
    private List<ConstructionTaskDetailDTO> listTC;
    private List<ConstructionTaskDetailDTO> listHSHC;

    public String getIsTCImport() {
        return isTCImport;
    }

    public void setIsTCImport(String isTCImport) {
        this.isTCImport = isTCImport;
    }

    public String getIsHSHCImport() {
        return isHSHCImport;
    }

    public void setIsHSHCImport(String isHSHCImport) {
        this.isHSHCImport = isHSHCImport;
    }

    public String getIsLDTImport() {
        return isLDTImport;
    }

    public void setIsLDTImport(String isLDTImport) {
        this.isLDTImport = isLDTImport;
    }

    public String getIsYCVTImport() {
        return isYCVTImport;
    }

    public void setIsYCVTImport(String isYCVTImport) {
        this.isYCVTImport = isYCVTImport;
    }

    public String getIsDTImport() {
        return isDTImport;
    }

    public void setIsDTImport(String isDTImport) {
        this.isDTImport = isDTImport;
    }

    public String getIsCVKImport() {
        return isCVKImport;
    }

    public void setIsCVKImport(String isCVKImport) {
        this.isCVKImport = isCVKImport;
    }

    public List<ConstructionTaskDetailDTO> getListCVK() {
        return listCVK;
    }

    public void setListCVK(List<ConstructionTaskDetailDTO> listCVK) {
        this.listCVK = listCVK;
    }

    public List<ConstructionTaskDetailDTO> getListTC() {
        return listTC;
    }

    public void setListTC(List<ConstructionTaskDetailDTO> listTC) {
        this.listTC = listTC;
    }

    public List<ConstructionTaskDetailDTO> getListHSHC() {
        return listHSHC;
    }

    public void setListHSHC(List<ConstructionTaskDetailDTO> listHSHC) {
        this.listHSHC = listHSHC;
    }

    public List<ConstructionTaskDetailDTO> getListLDT() {
        return listLDT;
    }

    public void setListLDT(List<ConstructionTaskDetailDTO> listLDT) {
        this.listLDT = listLDT;
    }

    public List<ConstructionTaskDetailDTO> getListDT() {
        return listDT;
    }

    public void setListDT(List<ConstructionTaskDetailDTO> listDT) {
        this.listDT = listDT;
    }

    public List<DmpnOrderDetailDTO> getListDmpnOrder() {
        return listDmpnOrder;
    }

    public void setListDmpnOrder(List<DmpnOrderDetailDTO> listDmpnOrder) {
        this.listDmpnOrder = listDmpnOrder;
    }

    private List<ConstructionTaskDetailDTO> listLDT;
    private List<ConstructionTaskDetailDTO> listDT;
    private List<DmpnOrderDetailDTO> listDmpnOrder;

    public void setYearList(List<String> yearList) {
        this.yearList = yearList;
    }

    public List<String> getMonthList() {
        return monthList;
    }

    public void setMonthList(List<String> monthList) {
        this.monthList = monthList;
    }

    public List<String> getSignStateList() {
        return signStateList;
    }

    public void setSignStateList(List<String> signStateList) {
        this.signStateList = signStateList;
    }
}
