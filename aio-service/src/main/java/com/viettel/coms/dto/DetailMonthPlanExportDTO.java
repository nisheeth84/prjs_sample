package com.viettel.coms.dto;

import java.util.List;

public class DetailMonthPlanExportDTO extends DetailMonthPlanSimpleDTO {

    /**
     *
     */
    private static final long serialVersionUID = 1L;
    private List<TmpnTargetDTO> summaryList;
    private List<ConstructionTaskDetailDTO> pl1List;
    private List<ConstructionTaskDetailDTO> pl2List;
    private List<ConstructionTaskDetailDTO> pl3List;
    private List<ConstructionTaskDetailDTO> pl1ExcelList;
    private List<ConstructionTaskDetailDTO> pl2ExcelList;
    private List<ConstructionTaskDetailDTO> pl3ExcelList;
    private List<DmpnOrderDTO> pl4ExcelList;
    private List<ConstructionTaskDetailDTO> pl5ExcelList;
    private List<ConstructionTaskDetailDTO> pl6ExcelList;
    private List<CatCommonDTO> listWorkItemTypeBTS;
    private List<CatCommonDTO> listWorkItemTypeGPON;
    private List<CatCommonDTO> listWorkItemTypeTuyen;
    private List<CatCommonDTO> listWorkItemTypeLe;

    public List<CatCommonDTO> getListWorkItemTypeBTS() {
        return listWorkItemTypeBTS;
    }

    public void setListWorkItemTypeBTS(List<CatCommonDTO> listWorkItemTypeBTS) {
        this.listWorkItemTypeBTS = listWorkItemTypeBTS;
    }

    public List<CatCommonDTO> getListWorkItemTypeGPON() {
        return listWorkItemTypeGPON;
    }

    public void setListWorkItemTypeGPON(List<CatCommonDTO> listWorkItemTypeGPON) {
        this.listWorkItemTypeGPON = listWorkItemTypeGPON;
    }

    public List<CatCommonDTO> getListWorkItemTypeTuyen() {
        return listWorkItemTypeTuyen;
    }

    public void setListWorkItemTypeTuyen(List<CatCommonDTO> listWorkItemTypeTuyen) {
        this.listWorkItemTypeTuyen = listWorkItemTypeTuyen;
    }

    public List<CatCommonDTO> getListWorkItemTypeLe() {
        return listWorkItemTypeLe;
    }

    public void setListWorkItemTypeLe(List<CatCommonDTO> listWorkItemTypeLe) {
        this.listWorkItemTypeLe = listWorkItemTypeLe;
    }

    public List<TmpnTargetDTO> getSummaryList() {
        return summaryList;
    }

    public void setSummaryList(List<TmpnTargetDTO> summaryList) {
        this.summaryList = summaryList;
    }

    public List<ConstructionTaskDetailDTO> getPl1List() {
        return pl1List;
    }

    public void setPl1List(List<ConstructionTaskDetailDTO> pl1List) {
        this.pl1List = pl1List;
    }

    public List<ConstructionTaskDetailDTO> getPl2List() {
        return pl2List;
    }

    public void setPl2List(List<ConstructionTaskDetailDTO> pl2List) {
        this.pl2List = pl2List;
    }

    public List<ConstructionTaskDetailDTO> getPl3List() {
        return pl3List;
    }

    public void setPl3List(List<ConstructionTaskDetailDTO> pl3List) {
        this.pl3List = pl3List;
    }

    public List<ConstructionTaskDetailDTO> getPl1ExcelList() {
        return pl1ExcelList;
    }

    public void setPl1ExcelList(List<ConstructionTaskDetailDTO> pl1ExcelList) {
        this.pl1ExcelList = pl1ExcelList;
    }

    public List<ConstructionTaskDetailDTO> getPl2ExcelList() {
        return pl2ExcelList;
    }

    public void setPl2ExcelList(List<ConstructionTaskDetailDTO> pl2ExcelList) {
        this.pl2ExcelList = pl2ExcelList;
    }

    public List<ConstructionTaskDetailDTO> getPl3ExcelList() {
        return pl3ExcelList;
    }

    public void setPl3ExcelList(List<ConstructionTaskDetailDTO> pl3ExcelList) {
        this.pl3ExcelList = pl3ExcelList;
    }

    public List<DmpnOrderDTO> getPl4ExcelList() {
        return pl4ExcelList;
    }

    public void setPl4ExcelList(List<DmpnOrderDTO> pl4ExcelList) {
        this.pl4ExcelList = pl4ExcelList;
    }

    public List<ConstructionTaskDetailDTO> getPl5ExcelList() {
        return pl5ExcelList;
    }

    public void setPl5ExcelList(List<ConstructionTaskDetailDTO> pl5ExcelList) {
        this.pl5ExcelList = pl5ExcelList;
    }

    public List<ConstructionTaskDetailDTO> getPl6ExcelList() {
        return pl6ExcelList;
    }

    public void setPl6ExcelList(List<ConstructionTaskDetailDTO> pl6ExcelList) {
        this.pl6ExcelList = pl6ExcelList;
    }

}
