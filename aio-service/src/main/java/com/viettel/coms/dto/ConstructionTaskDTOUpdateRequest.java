package com.viettel.coms.dto;

import com.viettel.asset.dto.ResultInfo;
import com.viettel.cat.dto.ConstructionImageInfo;

import java.util.List;

public class ConstructionTaskDTOUpdateRequest {
    private List<ConstructionImageInfo> listConstructionImageInfo;
    private SysUserRequest sysUserRequest;
    private ConstructionTaskDTO constructionTaskDTO;
    private SysUserCOMSDTO sysUserDto;
    private List<AppParamDTO> listParamDto;
    private ResultInfo resultInfo;
    //	hoanm1_20180808_start
    private String stationCode;
    private String provinceCode;
    private String constructionTypeName;
    private Long constructionTypeId;

    public Long getConstructionTypeId() {
        return constructionTypeId;
    }

    public void setConstructionTypeId(Long constructionTypeId) {
        this.constructionTypeId = constructionTypeId;
    }

    public String getStationCode() {
        return stationCode;
    }

    public void setStationCode(String stationCode) {
        this.stationCode = stationCode;
    }

    public String getProvinceCode() {
        return provinceCode;
    }

    public void setProvinceCode(String provinceCode) {
        this.provinceCode = provinceCode;
    }

    public String getConstructionTypeName() {
        return constructionTypeName;
    }

    public void setConstructionTypeName(String constructionTypeName) {
        this.constructionTypeName = constructionTypeName;
    }

    //	hoanm1_20180808_end
    public SysUserCOMSDTO getSysUserDto() {
        return sysUserDto;
    }

    public void setSysUserDto(SysUserCOMSDTO sysUserDto) {
        this.sysUserDto = sysUserDto;
    }

    private Long flag;

    public Long getFlag() {
        return flag;
    }

    public void setFlag(Long flag) {
        this.flag = flag;
    }

    public SysUserRequest getSysUserRequest() {
        return sysUserRequest;
    }

    public void setSysUserRequest(SysUserRequest sysUserRequest) {
        this.sysUserRequest = sysUserRequest;
    }

    public ConstructionTaskDTO getConstructionTaskDTO() {
        return constructionTaskDTO;
    }

    public void setConstructionTaskDTO(ConstructionTaskDTO constructionTaskDTO) {
        this.constructionTaskDTO = constructionTaskDTO;
    }

    public List<ConstructionImageInfo> getListConstructionImageInfo() {
        return listConstructionImageInfo;
    }

    public void setListConstructionImageInfo(List<ConstructionImageInfo> listConstructionImageInfo) {
        this.listConstructionImageInfo = listConstructionImageInfo;
    }

    public List<AppParamDTO> getListParamDto() {
        return listParamDto;
    }

    public void setListParamDto(List<AppParamDTO> listParamDto) {
        this.listParamDto = listParamDto;
    }

    public ResultInfo getResultInfo() {
        return resultInfo;
    }

    public void setResultInfo(ResultInfo resultInfo) {
        this.resultInfo = resultInfo;
    }
    /**Hoangnh start 15022019**/
    private ConstructionTaskDailyDTO constructionTaskDailyDTO;

	public ConstructionTaskDailyDTO getConstructionTaskDailyDTO() {
		return constructionTaskDailyDTO;
	}

	public void setConstructionTaskDailyDTO(
			ConstructionTaskDailyDTO constructionTaskDailyDTO) {
		this.constructionTaskDailyDTO = constructionTaskDailyDTO;
	}
	 /**Hoangnh end 15022019**/
}
