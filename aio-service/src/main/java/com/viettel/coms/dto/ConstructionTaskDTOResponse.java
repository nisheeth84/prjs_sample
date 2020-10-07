package com.viettel.coms.dto;

import com.viettel.asset.dto.ResultInfo;
import com.viettel.cat.dto.ConstructionImageInfo;

import java.util.List;

public class ConstructionTaskDTOResponse {

    private List<ConstructionImageInfo> listImage;
    private List<ConstructionTaskDTO> lstConstrucitonTask;
    private ResultInfo resultInfo;

    public ResultInfo getResultInfo() {
        return resultInfo;
    }

    public void setResultInfo(ResultInfo resultInfo) {
        this.resultInfo = resultInfo;
    }

    public List<ConstructionImageInfo> getListImage() {
        return listImage;
    }

    public void setListImage(List<ConstructionImageInfo> listImage) {
        this.listImage = listImage;
    }

    public List<ConstructionTaskDTO> getLstConstrucitonTask() {
        return lstConstrucitonTask;
    }

    public void setLstConstrucitonTask(List<ConstructionTaskDTO> lstConstrucitonTask) {
        this.lstConstrucitonTask = lstConstrucitonTask;
    }

}
