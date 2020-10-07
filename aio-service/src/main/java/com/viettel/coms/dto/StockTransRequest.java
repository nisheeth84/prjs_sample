package com.viettel.coms.dto;

public class StockTransRequest {
    private SysUserRequest sysUserRequest;
    private SysUserRequest sysUserReceiver;
    private SynStockTransDTO synStockTransDto;
    private SynStockTransDetailDTO synStockTransDetailDto;
    private int totalConfirm;
    private int totalNoConfirm;
    private int totalRedct;

    public SysUserRequest getSysUserRequest() {
        return sysUserRequest;
    }

    public void setSysUserRequest(SysUserRequest sysUserRequest) {
        this.sysUserRequest = sysUserRequest;
    }

    public SynStockTransDTO getSynStockTransDto() {
        return synStockTransDto;
    }

    public void setSynStockTransDto(SynStockTransDTO synStockTransDto) {
        this.synStockTransDto = synStockTransDto;
    }

    public SynStockTransDetailDTO getSynStockTransDetailDto() {
        return synStockTransDetailDto;
    }

    public void setSynStockTransDetailDto(SynStockTransDetailDTO synStockTransDetailDto) {
        this.synStockTransDetailDto = synStockTransDetailDto;
    }

    public SysUserRequest getSysUserReceiver() {
        return sysUserReceiver;
    }

    public void setSysUserReceiver(SysUserRequest sysUserReceiver) {
        this.sysUserReceiver = sysUserReceiver;
    }

}
