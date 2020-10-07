package com.viettel.coms.dto;

import com.viettel.asset.dto.ResultInfo;
import com.viettel.cat.dto.ConstructionImageInfo;

import java.util.List;

public class WorkItemDetailDTOResponse {
    private List<ConstructionImageInfo> listImage;
    private List<WorkItemDetailDTO> listWorkItem;
    private ResultInfo resultInfo;

    public ResultInfo getResultInfo() {
        return resultInfo;
    }

    public void setResultInfo(ResultInfo resultInfo) {
        this.resultInfo = resultInfo;
    }

    public List<WorkItemDetailDTO> getListWorkItemDetailDTO() {
        return listWorkItem;
    }

    public void setListWorkItemDetailDTO(List<WorkItemDetailDTO> listWorkItem) {
        this.listWorkItem = listWorkItem;
    }

    public List<ConstructionImageInfo> getListImage() {
        return listImage;
    }

    public void setListImage(List<ConstructionImageInfo> listImage) {
        this.listImage = listImage;
    }

    public List<WorkItemDetailDTO> getListWorkItem() {
        return listWorkItem;
    }

    public void setListWorkItem(List<WorkItemDetailDTO> listWorkItem) {
        this.listWorkItem = listWorkItem;
    }

}
