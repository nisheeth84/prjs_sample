package com.viettel.coms.dto;

import com.viettel.asset.dto.ResultInfo;

import java.util.List;

public class IssueDTOResponse {
    private List<IssueWorkItemDTO> listIssueEntityDTO;
    private ResultInfo resultInfo;
    private long type = 0l;

    public List<IssueWorkItemDTO> getListIssueEntityDTO() {
        return listIssueEntityDTO;
    }

    public void setListIssueEntityDTO(List<IssueWorkItemDTO> listIssueEntityDTO) {
        this.listIssueEntityDTO = listIssueEntityDTO;
    }

    public ResultInfo getResultInfo() {
        return resultInfo;
    }

    public void setResultInfo(ResultInfo resultInfo) {
        this.resultInfo = resultInfo;
    }

    public long getType() {
        return type;
    }

    public void setType(long type) {
        this.type = type;
    }
}
