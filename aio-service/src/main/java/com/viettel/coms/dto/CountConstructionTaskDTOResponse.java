package com.viettel.coms.dto;

import com.viettel.asset.dto.ResultInfo;

public class CountConstructionTaskDTOResponse {
    private CountConstructionTaskDTO countConstructionTask;
    private ResultInfo resultInfo;

    public ResultInfo getResultInfo() {
        return resultInfo;
    }

    public void setResultInfo(ResultInfo resultInfo) {
        this.resultInfo = resultInfo;
    }

    public CountConstructionTaskDTO getCountConstructionTaskDTO() {
        return countConstructionTask;
    }

    public void setCountConstructionTask(CountConstructionTaskDTO countConstructionTask) {
        this.countConstructionTask = countConstructionTask;
    }
}
