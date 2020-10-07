package com.viettel.coms.dto;

import com.viettel.asset.dto.ResultInfo;

import java.util.List;

public class ConstructionStationWorkItemDTOResponse {

    private List<ConstructionStationWorkItemDTO> constructionstationWorkitem;
    private ResultInfo resultInfo;
    private SysUserRequest sysUser;

    public ResultInfo getResultInfo() {
        return resultInfo;
    }

    public void setResultInfo(ResultInfo resultInfo) {
        this.resultInfo = resultInfo;
    }

    public List<ConstructionStationWorkItemDTO> getListConstructionStationWorkItem() {
        return constructionstationWorkitem;
    }

    public void setListConstructionStationWorkItem(List<ConstructionStationWorkItemDTO> constructionstationWorkitem) {
        this.constructionstationWorkitem = constructionstationWorkitem;
    }

    public SysUserRequest getSysUser() {
        return sysUser;
    }

    public void setSysUser(SysUserRequest sysUser) {
        this.sysUser = sysUser;
    }
}
