package com.viettel.coms.dto;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class YearPlanSimpleDTO extends YearPlanDTO {
    /**
     *
     */
    private static final long serialVersionUID = 1L;
    private List<String> signStateList;
    private List<YearPlanDetailDTO> detailList;

    public List<YearPlanDetailDTO> getDetailList() {
        return detailList;
    }

    public void setDetailList(List<YearPlanDetailDTO> detailList) {
        this.detailList = detailList;
    }

    public List<String> getSignStateList() {
        return signStateList;
    }

    public void setSignStateList(List<String> signStateList) {
        this.signStateList = signStateList;
    }

}
