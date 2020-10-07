package com.viettel.aio.dto;

import java.util.List;

import com.viettel.asset.dto.ResultInfo;
import com.viettel.asset.dto.SysGroupDto;
import com.viettel.cat.dto.CatProvinceDTO;
import com.viettel.coms.dto.AppParamDTO;

import org.codehaus.jackson.map.annotate.JsonSerialize;

@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIOContractMobileResponse {
	private ResultInfo resultInfo;
	private AIOContractDTO aioContractMobileDTO;
	private List<AIOContractDTO> lstAIOContractMobileDTO;
	private Boolean canCreateContract;

	//VietNT_19/08/2019_start
	private List<AIOOrderRequestDTO> orderRequests;
	private List<AIOOrderRequestDetailDTO> orderRequestsDetails;
	private AIOOrderRequestDTO orderRequestData;
	//VietNT_end
	//VietNT_29/08/2019_start
	private AIOReglectDTO reglectDTO;
	//VietNT_end
	//VietNT_13/09/2019_start
	private AIORequestBHSCDTO requestBHSCDTO;
	//VietNT_end

	//VietNT_17/09/2019_start
	private AIOSysUserDTO userLogin;
	private List<AIOSysGroupDTO> sysGroupDTOS;
	//VietNT_end
    // private List<AIOSynStockTransDetailDTO> lstSynStockTransDetail;
	// private List<AIOMerEntityDTO> lstMerEntity;
	// private List<AIORevenueDTO> lstStockGood;
	//
	// private AIORevenueDTO revenueDTO;
	// private List<AIORevenueDTO> lstRevenueDTO;
	private List<ConstructionImageInfo> listImage;

	//VietNT_19/09/2019_start
	private List<AIOSysUserDTO> listUser;
	private List<AIOSysGroupDTO> listGroup;
	//VietNT_end
    private List<String> reasons;

    public List<String> getReasons() {
        return reasons;
    }

    public void setReasons(List<String> reasons) {
        this.reasons = reasons;
    }

    public List<AIOSysUserDTO> getListUser() {
		return listUser;
	}

	public void setListUser(List<AIOSysUserDTO> listUser) {
		this.listUser = listUser;
	}

	public List<AIOSysGroupDTO> getListGroup() {
		return listGroup;
	}

	public void setListGroup(List<AIOSysGroupDTO> listGroup) {
		this.listGroup = listGroup;
	}
    public List<AIOSysGroupDTO> getSysGroupDTOS() {
        return sysGroupDTOS;
    }

    public void setSysGroupDTOS(List<AIOSysGroupDTO> sysGroupDTOS) {
        this.sysGroupDTOS = sysGroupDTOS;
    }

    public AIOSysUserDTO getUserLogin() {
        return userLogin;
    }

    public void setUserLogin(AIOSysUserDTO userLogin) {
        this.userLogin = userLogin;
    }

    public AIORequestBHSCDTO getRequestBHSCDTO() {
        return requestBHSCDTO;
    }

    public void setRequestBHSCDTO(AIORequestBHSCDTO requestBHSCDTO) {
        this.requestBHSCDTO = requestBHSCDTO;
    }

	public AIOReglectDTO getReglectDTO() {
		return reglectDTO;
	}

	public void setReglectDTO(AIOReglectDTO reglectDTO) {
		this.reglectDTO = reglectDTO;
	}

	public List<ConstructionImageInfo> getListImage() {
		return listImage;
	}

	public void setListImage(List<ConstructionImageInfo> listImage) {
		this.listImage = listImage;
	}

	public ResultInfo getResultInfo() {
		return resultInfo;
	}

	public void setResultInfo(ResultInfo resultInfo) {
		this.resultInfo = resultInfo;
	}

	public AIOContractDTO getAioContractMobileDTO() {
		return aioContractMobileDTO;
	}

	public void setAioContractMobileDTO(AIOContractDTO aioContractMobileDTO) {
		this.aioContractMobileDTO = aioContractMobileDTO;
	}

	public List<AIOContractDTO> getLstAIOContractMobileDTO() {
		return lstAIOContractMobileDTO;
	}

	public void setLstAIOContractMobileDTO(
			List<AIOContractDTO> lstAIOContractMobileDTO) {
		this.lstAIOContractMobileDTO = lstAIOContractMobileDTO;
	}

	//HuyPQ-20190503-start
	private List<AIOConfigServiceDTO> aioConfigServiceMobileDTO;
	private List<AppParamDTO> appParamSpeciesMobileDTO;
	private List<AppParamDTO> appParamAreaMobileDTO;
	private List<CatProvinceDTO> catProvinceMobileDTO;
	private List<AIOAreaDTO> areaProvinceCity;
	private List<AIOAreaDTO> areaDistrict;
	private List<AIOAreaDTO> areaWard;
	private List<AIOPackageDetailDTO> packageDetailDTO;
	private List<AIOCustomerDTO> dataCustomer;

	public List<AIOCustomerDTO> getDataCustomer() {
		return dataCustomer;
	}

	public void setDataCustomer(List<AIOCustomerDTO> dataCustomer) {
		this.dataCustomer = dataCustomer;
	}

	public List<AIOPackageDetailDTO> getPackageDetailDTO() {
		return packageDetailDTO;
	}

	public void setPackageDetailDTO(List<AIOPackageDetailDTO> packageDetailDTO) {
		this.packageDetailDTO = packageDetailDTO;
	}

	public List<AIOAreaDTO> getAreaWard() {
		return areaWard;
	}

	public void setAreaWard(List<AIOAreaDTO> areaWard) {
		this.areaWard = areaWard;
	}

	public List<AIOAreaDTO> getAreaDistrict() {
		return areaDistrict;
	}

	public void setAreaDistrict(List<AIOAreaDTO> areaDistrict) {
		this.areaDistrict = areaDistrict;
	}

	public List<AIOAreaDTO> getAreaProvinceCity() {
		return areaProvinceCity;
	}

	public void setAreaProvinceCity(List<AIOAreaDTO> areaProvinceCity) {
		this.areaProvinceCity = areaProvinceCity;
	}

	public List<CatProvinceDTO> getCatProvinceMobileDTO() {
		return catProvinceMobileDTO;
	}

	public void setCatProvinceMobileDTO(List<CatProvinceDTO> catProvinceMobileDTO) {
		this.catProvinceMobileDTO = catProvinceMobileDTO;
	}

	public List<AIOConfigServiceDTO> getAioConfigServiceMobileDTO() {
		return aioConfigServiceMobileDTO;
	}

	public void setAioConfigServiceMobileDTO(List<AIOConfigServiceDTO> aioConfigServiceMobileDTO) {
		this.aioConfigServiceMobileDTO = aioConfigServiceMobileDTO;
	}

	public List<AppParamDTO> getAppParamSpeciesMobileDTO() {
		return appParamSpeciesMobileDTO;
	}

	public void setAppParamSpeciesMobileDTO(List<AppParamDTO> appParamSpeciesMobileDTO) {
		this.appParamSpeciesMobileDTO = appParamSpeciesMobileDTO;
	}

	public List<AppParamDTO> getAppParamAreaMobileDTO() {
		return appParamAreaMobileDTO;
	}

	public void setAppParamAreaMobileDTO(List<AppParamDTO> appParamAreaMobileDTO) {
		this.appParamAreaMobileDTO = appParamAreaMobileDTO;
	}

	//HuyPq-end
	//thangtv24 110719 start
	private SysGroupDto sysGroupDto;

	public SysGroupDto getSysGroupDto() {
		return sysGroupDto;
	}

	public void setSysGroupDto(SysGroupDto sysGroupDto) {
		this.sysGroupDto = sysGroupDto;
	}
	//thangtv24 110719 end

	public Boolean getCanCreateContract() {
		return canCreateContract;
	}

	public void setCanCreateContract(Boolean canCreateContract) {
		this.canCreateContract = canCreateContract;
	}

	public List<AIOOrderRequestDTO> getOrderRequests() {
		return orderRequests;
	}

	public void setOrderRequests(List<AIOOrderRequestDTO> orderRequests) {
		this.orderRequests = orderRequests;
	}

	public List<AIOOrderRequestDetailDTO> getOrderRequestsDetails() {
		return orderRequestsDetails;
	}

	public void setOrderRequestsDetails(List<AIOOrderRequestDetailDTO> orderRequestsDetails) {
		this.orderRequestsDetails = orderRequestsDetails;
	}

	public AIOOrderRequestDTO getOrderRequestData() {
		return orderRequestData;
	}

	public void setOrderRequestData(AIOOrderRequestDTO orderRequestData) {
		this.orderRequestData = orderRequestData;
	}
}
