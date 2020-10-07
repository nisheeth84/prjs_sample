package com.viettel.coms.dto;

/**
 * @author CuongNV2
 * @version 1.0
 * @since 2018-06-05
 */
public class HandOverHistoryDTORequest {
    private SysUserRequest sysUserRequest;

    private StTransactionDTO stTransactionDTO;

    private StTransactionDetailDTO stTransactionDetailDTO;

    public StTransactionDTO getStTransactionDTO() {
        return stTransactionDTO;
    }

    public StTransactionDetailDTO getStTransactionDetailDTO() {
        return stTransactionDetailDTO;
    }

    public void setStTransactionDetailDTO(StTransactionDetailDTO stTransactionDetailDTO) {
        this.stTransactionDetailDTO = stTransactionDetailDTO;
    }

    public void setStTransactionDTO(StTransactionDTO stTransactionDTO) {
        this.stTransactionDTO = stTransactionDTO;
    }

    public SysUserRequest getSysUserRequest() {
        return sysUserRequest;
    }

    public void setSysUserRequest(SysUserRequest sysUserRequest) {
        this.sysUserRequest = sysUserRequest;
    }
}
