package com.viettel.coms.dto;

import com.viettel.cat.dto.ConstructionImageInfo;

import java.util.List;

public class ConstructionScheduleDTORequest {
    private SysUserRequest sysUserRequest;
    private SysUserRequest sysUserReceiver;
    private ConstructionScheduleDTO constructionScheduleDTO;
    private ConstructionScheduleItemDTO constructionScheduleItemDTO;
    private ConstructionScheduleWorkItemDTO constructionScheduleWorkItemDTO;
    private List<ConstructionImageInfo> listConstructionImageInfo;

    public SysUserRequest getSysUserRequest() {
        return sysUserRequest;
    }

    public void setSysUserRequest(SysUserRequest sysUserRequest) {
        this.sysUserRequest = sysUserRequest;
    }

    public ConstructionScheduleDTO getConstructionScheduleDTO() {
        return constructionScheduleDTO;
    }

    public void setConstructionScheduleDTO(ConstructionScheduleDTO constructionScheduleDTO) {
        this.constructionScheduleDTO = constructionScheduleDTO;
    }

    public ConstructionScheduleItemDTO getConstructionScheduleItemDTO() {
        return constructionScheduleItemDTO;
    }

    public void setConstructionScheduleItemDTO(ConstructionScheduleItemDTO constructionScheduleItemDTO) {
        this.constructionScheduleItemDTO = constructionScheduleItemDTO;
    }

    public ConstructionScheduleWorkItemDTO getConstructionScheduleWorkItemDTO() {
        return constructionScheduleWorkItemDTO;
    }

    public void setConstructionScheduleWorkItemDTO(ConstructionScheduleWorkItemDTO constructionScheduleWorkItemDTO) {
        this.constructionScheduleWorkItemDTO = constructionScheduleWorkItemDTO;
    }

    public List<ConstructionImageInfo> getListConstructionImageInfo() {
        return listConstructionImageInfo;
    }

    public void setListConstructionImageInfo(List<ConstructionImageInfo> listConstructionImageInfo) {
        this.listConstructionImageInfo = listConstructionImageInfo;
    }

    public SysUserRequest getSysUserReceiver() {
        return sysUserReceiver;
    }

    public void setSysUserReceiver(SysUserRequest sysUserReceiver) {
        this.sysUserReceiver = sysUserReceiver;
    }
}
