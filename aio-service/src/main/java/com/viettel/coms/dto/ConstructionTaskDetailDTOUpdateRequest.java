package com.viettel.coms.dto;

public class ConstructionTaskDetailDTOUpdateRequest extends ConstructionTaskDTOUpdateRequest {
    private ConstructionTaskDetailDTO constructionTaskDetail;

    public ConstructionTaskDetailDTO getConstructionTaskDetail() {
        return constructionTaskDetail;
    }

    public void setConstructionTaskDetail(ConstructionTaskDetailDTO constructionTaskDetail) {
        this.constructionTaskDetail = constructionTaskDetail;
    }

}
