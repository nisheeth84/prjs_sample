package com.viettel.coms.dto;

public class EntangleManageDTORequest {
    private SysUserRequest sysUserRequest;
    private EntangleManageDTO entangleManageDTODetail;
    private String code;

    public SysUserRequest getSysUserRequest() {
        return sysUserRequest;
    }

    public void setSysUserRequest(SysUserRequest sysUserRequest) {
        this.sysUserRequest = sysUserRequest;
    }

    public EntangleManageDTO getEntangleManageDTODetail() {
        return entangleManageDTODetail;
    }

    public void setEntangleManageDTODetail(EntangleManageDTO entangleManageDTODetail) {
        this.entangleManageDTODetail = entangleManageDTODetail;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
