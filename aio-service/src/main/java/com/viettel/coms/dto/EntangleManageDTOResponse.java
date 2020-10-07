package com.viettel.coms.dto;

import com.viettel.asset.dto.ResultInfo;
import com.viettel.cat.dto.ConstructionImageInfo;

import java.util.List;

public class EntangleManageDTOResponse {
    private ResultInfo resultInfo;
    private List<EntangleManageDTO> listEntangleManageDTO;
    private List<ConstructionImageInfo> listImg;
    private SysUserRequest sysUser;

    public ResultInfo getResultInfo() {
        return resultInfo;
    }

    public void setResultInfo(ResultInfo resultInfo) {
        this.resultInfo = resultInfo;
    }

    public List<EntangleManageDTO> getListEntangleManageDTO() {
        return listEntangleManageDTO;
    }

    public void setListEntangleManageDTO(List<EntangleManageDTO> listEntangleManageDTO) {
        this.listEntangleManageDTO = listEntangleManageDTO;
    }

    public List<ConstructionImageInfo> getListImg() {
        return listImg;
    }

    public void setListImg(List<ConstructionImageInfo> listImg) {
        this.listImg = listImg;
    }

    public SysUserRequest getSysUser() {
        return sysUser;
    }

    public void setSysUser(SysUserRequest sysUser) {
        this.sysUser = sysUser;
    }

}
