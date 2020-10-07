package com.viettel.coms.dto;

public class WorkItemDetailDTORequest {
    private SysUserRequest sysUserRequest;
    private WorkItemDetailDTO workItemDetailDto;

    public SysUserRequest getSysUserRequest() {
        return sysUserRequest;
    }

    public void setSysUserRequest(SysUserRequest sysUserRequest) {
        this.sysUserRequest = sysUserRequest;
    }

    public WorkItemDetailDTO getWorkItemDetailDto() {
        return workItemDetailDto;
    }

    public void setWorkItemDetailDto(WorkItemDetailDTO workItemDetailDto) {
        this.workItemDetailDto = workItemDetailDto;
    }

}
