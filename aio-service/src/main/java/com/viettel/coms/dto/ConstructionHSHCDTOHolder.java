package com.viettel.coms.dto;

import java.util.List;

public class ConstructionHSHCDTOHolder {

    private List<RpHSHCDTO> rpHSHCDTOS;

    private List<ConstructionDTO> constructionDTOS;

    public List<RpHSHCDTO> getRpHSHCDTOS() {
        return rpHSHCDTOS;
    }

    public void setRpHSHCDTOS(List<RpHSHCDTO> rpHSHCDTOS) {
        this.rpHSHCDTOS = rpHSHCDTOS;
    }

    public List<ConstructionDTO> getConstructionDTOS() {
        return constructionDTOS;
    }

    public void setConstructionDTOS(List<ConstructionDTO> constructionDTOS) {
        this.constructionDTOS = constructionDTOS;
    }
}
