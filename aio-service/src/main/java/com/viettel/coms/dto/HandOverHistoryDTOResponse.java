package com.viettel.coms.dto;

import com.viettel.asset.dto.ResultInfo;

import java.util.List;

public class HandOverHistoryDTOResponse {
    private List<StTransactionDTO> listStTransactionReceivePagesDTO;
    private List<StTransactionDTO> listStTransactionHandoverPagesDTO;
    private List<StTransactionDTO> listStTransactionReceiveDTO;
    private List<StTransactionDTO> listStTransactionHandoverDTO;
    private List<StTransactionDTO> listStTransactionHandoverVTTBDetailDTO;
    private List<StTransactionDTO> listStTransactionReceiveVTTBDetailDTO;

    private List<StTransactionDetailDTO> listStTransactionVTTBDTO;
    private List<StTransactionDetailDTO> listStTransactionVTTBDetailDTO;

    public List<StTransactionDetailDTO> getListStTransactionVTTBDetailDTO() {
        return listStTransactionVTTBDetailDTO;
    }

    public void setListStTransactionVTTBDetailDTO(List<StTransactionDetailDTO> listStTransactionVTTBDetailDTO) {
        this.listStTransactionVTTBDetailDTO = listStTransactionVTTBDetailDTO;
    }

    public List<StTransactionDetailDTO> getListStTransactionVTTBDTO() {
        return listStTransactionVTTBDTO;
    }

    public void setListStTransactionVTTBDTO(List<StTransactionDetailDTO> listStTransactionVTTBDTO) {
        this.listStTransactionVTTBDTO = listStTransactionVTTBDTO;
    }

    private SysUserRequest sysUser;
    private ResultInfo resultInfo;

    public List<StTransactionDTO> getListStTransactionHandoverVTTBDetailDTO() {
        return listStTransactionHandoverVTTBDetailDTO;
    }

    public void setListStTransactionHandoverVTTBDetailDTO(
            List<StTransactionDTO> listStTransactionHandoverVTTBDetailDTO) {
        this.listStTransactionHandoverVTTBDetailDTO = listStTransactionHandoverVTTBDetailDTO;
    }

    public List<StTransactionDTO> getListStTransactionReceiveVTTBDetailDTO() {
        return listStTransactionReceiveVTTBDetailDTO;
    }

    public void setListStTransactionReceiveVTTBDetailDTO(List<StTransactionDTO> listStTransactionReceiveVTTBDetailDTO) {
        this.listStTransactionReceiveVTTBDetailDTO = listStTransactionReceiveVTTBDetailDTO;
    }

    public List<StTransactionDTO> getListStTransactionHandoverPagesDTO() {
        return listStTransactionHandoverPagesDTO;
    }

    public void setListStTransactionHandoverPagesDTO(List<StTransactionDTO> listStTransactionHandoverPagesDTO) {
        this.listStTransactionHandoverPagesDTO = listStTransactionHandoverPagesDTO;
    }

    public List<StTransactionDTO> getListStTransactionReceiveDTO() {
        return listStTransactionReceiveDTO;
    }

    public void setListStTransactionReceiveDTO(List<StTransactionDTO> listStTransactionReceiveDTO) {
        this.listStTransactionReceiveDTO = listStTransactionReceiveDTO;
    }

    public List<StTransactionDTO> getListStTransactionHandoverDTO() {
        return listStTransactionHandoverDTO;
    }

    public void setListStTransactionHandoverDTO(List<StTransactionDTO> listStTransactionHandoverDTO) {
        this.listStTransactionHandoverDTO = listStTransactionHandoverDTO;
    }

    public List<StTransactionDTO> getListStTransactionReceivePagesDTO() {
        return listStTransactionReceivePagesDTO;
    }

    public void setListStTransactionReceivePagesDTO(List<StTransactionDTO> listStTransactionReceivePagesDTO) {
        this.listStTransactionReceivePagesDTO = listStTransactionReceivePagesDTO;
    }

    public SysUserRequest getSysUser() {
        return sysUser;
    }

    public void setSysUser(SysUserRequest sysUser) {
        this.sysUser = sysUser;
    }

    public ResultInfo getResultInfo() {
        return resultInfo;
    }

    public void setResultInfo(ResultInfo resultInfo) {
        this.resultInfo = resultInfo;
    }

}
