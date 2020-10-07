package com.viettel.coms.dto;

import com.viettel.asset.dto.ResultInfo;

public class AppVersionDTOResponse {
    private ResultInfo resultInfo;
    private AppVersionWorkItemDTO AppVersionWorkItemDTO;

    public ResultInfo getResultInfo() {
        return resultInfo;
    }

    public void setResultInfo(ResultInfo resultInfo) {
        this.resultInfo = resultInfo;
    }

    public AppVersionWorkItemDTO getAppVersionWorkItemDTO() {
        return AppVersionWorkItemDTO;
    }

    public void setAppVersionWorkItemDTO(AppVersionWorkItemDTO appVersionWorkItemDTO) {
        AppVersionWorkItemDTO = appVersionWorkItemDTO;
    }

}
