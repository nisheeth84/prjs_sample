package com.viettel.coms.dto;

import com.viettel.asset.dto.ResultInfo;
import com.viettel.vps.webservice.SysUserBO;

import java.util.List;

public class SysUserDTOResponse {
    private List<SysUserCOMSDTO> lstSysUserComDTO;
    private ResultInfo resultInfo;
    private SysUserCOMSDTO userLogin;
    private SysUserBO user;

    public ResultInfo getResultInfo() {
        return resultInfo;
    }

    public void setResultInfo(ResultInfo resultInfo) {
        this.resultInfo = resultInfo;
    }

    public List<SysUserCOMSDTO> getListUser() {
        return lstSysUserComDTO;
    }

    public void setListUser(List<SysUserCOMSDTO> lstSysUserComDTO) {
        this.lstSysUserComDTO = lstSysUserComDTO;
    }

    public List<SysUserCOMSDTO> getLstSysUserComDTO() {
        return lstSysUserComDTO;
    }

    public void setLstSysUserComDTO(List<SysUserCOMSDTO> lstSysUserComDTO) {
        this.lstSysUserComDTO = lstSysUserComDTO;
    }

    public SysUserCOMSDTO getUserLogin() {
        return userLogin;
    }

    public void setUserLogin(SysUserCOMSDTO userLogin) {
        this.userLogin = userLogin;
    }

    public SysUserBO getUser() {
        return user;
    }

    public void setUser(SysUserBO user) {
        this.user = user;
    }

}
