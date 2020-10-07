package com.viettel.coms.dto;

import java.util.List;

public class confingDto extends ConfigGroupProvinceDTO {
    List<ConfigGroupProvinceDTO> workItemTypeList;

    public List<ConfigGroupProvinceDTO> getWorkItemTypeList() {
        return workItemTypeList;
    }

    public void setWorkItemTypeList(List<ConfigGroupProvinceDTO> workItemTypeList) {
        this.workItemTypeList = workItemTypeList;
    }

}
