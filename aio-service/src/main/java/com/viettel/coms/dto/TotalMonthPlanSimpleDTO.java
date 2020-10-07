package com.viettel.coms.dto;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TotalMonthPlanSimpleDTO extends TotalMonthPlanDTO {
    /**
     *
     */
    private static final long serialVersionUID = 1L;
    private List<String> signStateList;

    private List<TmpnTargetDTO> tmpnTargetDTOList;
    private List<TmpnSourceDTO> tmpnSourceDTOList;
    private List<TmpnForceMaintainDTO> tmpnForceMaintainDTOList;
    private List<TmpnForceNewBtsDTO> tmpnForceNewBtsDTOList;
    private List<TmpnForceNewLineDTO> tmpnForceNewLineDTOList;
    private List<TmpnMaterialDTO> tmpnMaterialDTOList;
    private List<TmpnFinanceDTO> tmpnFinanceDTOList;
    private List<TmpnContractDTO> tmpnContractDTOList;
    private String catConstructionTypeName;
    private String catConstructionDeployName;
    private Long catConstructionDeployId;
    private Long catConstructionTypeId;
    private List<Long> monthList;
    private List<Long> yearList;
    private String catConstructionTypeCode;
    private String catConstructionDeployCode;
    private Long sysGroupId;
    private List<UtilAttachDocumentDTO> listAttachFile;
    private List<UtilAttachDocumentDTO> appendixFileDTOList;
    private List<Long> sysGroupIdList;

    public List<UtilAttachDocumentDTO> getAppendixFileDTOList() {
        return appendixFileDTOList;
    }

    public void setAppendixFileDTOList(List<UtilAttachDocumentDTO> appendixFileDTOList) {
        this.appendixFileDTOList = appendixFileDTOList;
    }

    public List<Long> getSysGroupIdList() {
        return sysGroupIdList;
    }

    public void setSysGroupIdList(List<Long> sysGroupIdList) {
        this.sysGroupIdList = sysGroupIdList;
    }

    public List<UtilAttachDocumentDTO> getListAttachFile() {
        return listAttachFile;
    }

    public void setListAttachFile(List<UtilAttachDocumentDTO> listAttachFile) {
        this.listAttachFile = listAttachFile;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public String getCatConstructionTypeCode() {
        return catConstructionTypeCode;
    }

    public void setCatConstructionTypeCode(String catConstructionTypeCode) {
        this.catConstructionTypeCode = catConstructionTypeCode;
    }

    public String getCatConstructionDeployCode() {
        return catConstructionDeployCode;
    }

    public void setCatConstructionDeployCode(String catConstructionDeployCode) {
        this.catConstructionDeployCode = catConstructionDeployCode;
    }

    public List<Long> getMonthList() {
        return monthList;
    }

    public void setMonthList(List<Long> monthList) {
        this.monthList = monthList;
    }

    public List<Long> getYearList() {
        return yearList;
    }

    public void setYearList(List<Long> yearList) {
        this.yearList = yearList;
    }

    public String getCatConstructionTypeName() {
        return catConstructionTypeName;
    }

    public void setCatConstructionTypeName(String catConstructionTypeName) {
        this.catConstructionTypeName = catConstructionTypeName;
    }

    public String getCatConstructionDeployName() {
        return catConstructionDeployName;
    }

    public void setCatConstructionDeployName(String catConstructionDeployName) {
        this.catConstructionDeployName = catConstructionDeployName;
    }

    public Long getCatConstructionDeployId() {
        return catConstructionDeployId;
    }

    public void setCatConstructionDeployId(Long catConstructionDeployId) {
        this.catConstructionDeployId = catConstructionDeployId;
    }

    public Long getCatConstructionTypeId() {
        return catConstructionTypeId;
    }

    public void setCatConstructionTypeId(Long catConstructionTypeId) {
        this.catConstructionTypeId = catConstructionTypeId;
    }

    public List<TmpnSourceDTO> getTmpnSourceDTOList() {
        return tmpnSourceDTOList;
    }

    public void setTmpnSourceDTOList(List<TmpnSourceDTO> tmpnSourceDTOList) {
        this.tmpnSourceDTOList = tmpnSourceDTOList;
    }

    public List<TmpnTargetDTO> getTmpnTargetDTOList() {
        return tmpnTargetDTOList;
    }

    public void setTmpnTargetDTOList(List<TmpnTargetDTO> tmpnTargetDTOList) {
        this.tmpnTargetDTOList = tmpnTargetDTOList;
    }

    public List<TmpnForceMaintainDTO> getTmpnForceMaintainDTOList() {
        return tmpnForceMaintainDTOList;
    }

    public void setTmpnForceMaintainDTOList(List<TmpnForceMaintainDTO> tmpnForceMaintainDTOList) {
        this.tmpnForceMaintainDTOList = tmpnForceMaintainDTOList;
    }

    public List<TmpnForceNewBtsDTO> getTmpnForceNewBtsDTOList() {
        return tmpnForceNewBtsDTOList;
    }

    public void setTmpnForceNewBtsDTOList(List<TmpnForceNewBtsDTO> tmpnForceNewBtsDTOList) {
        this.tmpnForceNewBtsDTOList = tmpnForceNewBtsDTOList;
    }

    public List<TmpnForceNewLineDTO> getTmpnForceNewLineDTOList() {
        return tmpnForceNewLineDTOList;
    }

    public void setTmpnForceNewLineDTOList(List<TmpnForceNewLineDTO> tmpnForceNewLineDTOList) {
        this.tmpnForceNewLineDTOList = tmpnForceNewLineDTOList;
    }

    public List<TmpnMaterialDTO> getTmpnMaterialDTOList() {
        return tmpnMaterialDTOList;
    }

    public void setTmpnMaterialDTOList(List<TmpnMaterialDTO> tmpnMaterialDTOList) {
        this.tmpnMaterialDTOList = tmpnMaterialDTOList;
    }

    public List<TmpnFinanceDTO> getTmpnFinanceDTOList() {
        return tmpnFinanceDTOList;
    }

    public void setTmpnFinanceDTOList(List<TmpnFinanceDTO> tmpnFinanceDTOList) {
        this.tmpnFinanceDTOList = tmpnFinanceDTOList;
    }

    public List<TmpnContractDTO> getTmpnContractDTOList() {
        return tmpnContractDTOList;
    }

    public void setTmpnContractDTOList(List<TmpnContractDTO> tmpnContractDTOList) {
        this.tmpnContractDTOList = tmpnContractDTOList;
    }

    public List<String> getSignStateList() {
        return signStateList;
    }

    public void setSignStateList(List<String> signStateList) {
        this.signStateList = signStateList;
    }
}
