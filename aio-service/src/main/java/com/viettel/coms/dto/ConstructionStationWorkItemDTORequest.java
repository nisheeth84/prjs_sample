package com.viettel.coms.dto;

public class ConstructionStationWorkItemDTORequest {
    private SysUserRequest sysUserRequest;
    private ConstructionStationWorkItemDTO constructionStationWorkItem;

    public SysUserRequest getSysUserRequest() {
        return sysUserRequest;
    }

    public void setSysUserRequest(SysUserRequest sysUserRequest) {
        this.sysUserRequest = sysUserRequest;
    }

    public ConstructionStationWorkItemDTO getConstructionStationWorkItem() {
        return constructionStationWorkItem;
    }

    public void setConstructionStationWorkItem(ConstructionStationWorkItemDTO constructionStationWorkItem) {
        this.constructionStationWorkItem = constructionStationWorkItem;
    }

}
