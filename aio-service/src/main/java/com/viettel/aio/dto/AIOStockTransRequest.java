package com.viettel.aio.dto;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOStockTransRequest {
    private SysUserRequest sysUserRequest;
    private SysUserRequest sysUserReceiver;
    private AIOSynStockTransDTO synStockTransDto;
    private AIOSynStockTransDetailDTO synStockTransDetailDto;
    private int totalConfirm;
    private int totalNoConfirm;
    private int totalRedct;
    //VietNT_06/08/2019_start
    private int type;
    private String keySearch;

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getKeySearch() {
        return keySearch;
    }

    public void setKeySearch(String keySearch) {
        this.keySearch = keySearch;
    }

    //VietNT_end

    
    private List<AIOSynStockTransDetailDTO> lstStockTransDetail;
//    private List<AIOMerEntityDTO> lstStockTransDetailSerial;
//    
//
//    public List<AIOMerEntityDTO> getLstStockTransDetailSerial() {
//		return lstStockTransDetailSerial;
//	}
//
//	public void setLstStockTransDetailSerial(
//			List<AIOMerEntityDTO> lstStockTransDetailSerial) {
//		this.lstStockTransDetailSerial = lstStockTransDetailSerial;
//	}

	public List<AIOSynStockTransDetailDTO> getLstStockTransDetail() {
		return lstStockTransDetail;
	}

	public void setLstStockTransDetail(
			List<AIOSynStockTransDetailDTO> lstStockTransDetail) {
		this.lstStockTransDetail = lstStockTransDetail;
	}

	public SysUserRequest getSysUserRequest() {
        return sysUserRequest;
    }

    public void setSysUserRequest(SysUserRequest sysUserRequest) {
        this.sysUserRequest = sysUserRequest;
    }

    public AIOSynStockTransDTO getSynStockTransDto() {
        return synStockTransDto;
    }

    public void setSynStockTransDto(AIOSynStockTransDTO synStockTransDto) {
        this.synStockTransDto = synStockTransDto;
    }

    public AIOSynStockTransDetailDTO getSynStockTransDetailDto() {
        return synStockTransDetailDto;
    }

    public void setSynStockTransDetailDto(AIOSynStockTransDetailDTO synStockTransDetailDto) {
        this.synStockTransDetailDto = synStockTransDetailDto;
    }

    public SysUserRequest getSysUserReceiver() {
        return sysUserReceiver;
    }

    public void setSysUserReceiver(SysUserRequest sysUserReceiver) {
        this.sysUserReceiver = sysUserReceiver;
    }

}
