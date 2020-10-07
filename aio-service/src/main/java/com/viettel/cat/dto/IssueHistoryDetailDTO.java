package com.viettel.cat.dto;

import com.viettel.coms.dto.IssueHistoryDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class IssueHistoryDetailDTO extends IssueHistoryDTO {

    /**
     *
     */
    private static final long serialVersionUID = 1L;
    private String createdDateStr;
    private String createdUserName;
    private String createdDateFull;

    public String getCreatedDateFull() {
        return createdDateFull;
    }

    public void setCreatedDateFull(String createdDateFull) {
        this.createdDateFull = createdDateFull;
    }

    public String getCreatedDateStr() {
        return createdDateStr;
    }

    public void setCreatedDateStr(String createdDateStr) {
        this.createdDateStr = createdDateStr;
    }

    public String getCreatedUserName() {
        return createdUserName;
    }

    public void setCreatedUserName(String createdUserName) {
        this.createdUserName = createdUserName;
    }

    private List<IssueHistoryDTO> detailList;

    public List<IssueHistoryDTO> getDetailList() {
        return detailList;
    }

    public void setDetailList(List<IssueHistoryDTO> detailList) {
        this.detailList = detailList;
    }

}
