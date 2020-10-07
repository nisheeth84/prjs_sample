package com.viettel.aio.dto;

import com.viettel.cat.dto.CatProvinceDTO;
import com.viettel.cat.dto.ConstructionImageInfo;
import com.viettel.coms.dto.AppParamDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class AIOContractMobileRequest {
    private SysUserRequest sysUserRequest;
    private SysUserRequest sysUserReceiver;
    private AIOContractDTO aioContractDTO;
    //VietNT_19/08/2019_start
    private AIOOrderRequestDTO orderRequest;
    //VietNT_end
    //VietNT_29/08/2019_start
    private AIOReglectDTO reglectDTO;
    //VietNT_end
    //VietNT_13/09/2019_start
    private AIORequestBHSCDTO requestBHSCDTO;
    //VietNT_end
    //VietNT_16/09/2019_start
    private AIOSysUserDTO sysUserDTO;
    private AIOSysGroupDTO sysGroupDTO;
    //VietNT_end

    // private AIOSynStockTransDetailDTO synStockTransDetailDto;
    // private List<AIOSynStockTransDetailDTO> lstStockTransDetail;
    private List<AIOContractDTO> lstAIOContractMobileDTO;
    private List<AIOContractDTO> lstImage;
    private List<ConstructionImageInfo> listConstructionImageInfo;

    private String performTogether;

    private CatProvinceDTO catProvinceDTO;
    private AIOAreaDTO aioAreaDTO;
    private AIOPackageDetailDTO aioPackageDetailDTO;
    private AIOCustomerDTO aioCustomerDTO;
    private AIOConfigServiceDTO aioConfigServiceDTO;
    private List<AIOPackageDetailDTO> lstAIOPackageDetail;
    private AppParamDTO appParam;
    private String listEmployee;
    private long sysUserId;
    private long surveyId;
    private long sysGroupId;
    private QuestionForCustomerDTO questionForCustomerDTO;
    private Long surveyCustomerId;
    private Double industryScale;

	public Double getIndustryScale() {
		return industryScale;
	}

	public void setIndustryScale(Double industryScale) {
		this.industryScale = industryScale;
	}

	public AIOSysGroupDTO getSysGroupDTO() {
        return sysGroupDTO;
    }

    public void setSysGroupDTO(AIOSysGroupDTO sysGroupDTO) {
        this.sysGroupDTO = sysGroupDTO;
    }

    public AIOSysUserDTO getSysUserDTO() {
        return sysUserDTO;
    }

    public void setSysUserDTO(AIOSysUserDTO sysUserDTO) {
        this.sysUserDTO = sysUserDTO;
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

    public String getPerformTogether() {
        return performTogether;
    }

    public void setPerformTogether(String performTogether) {
        this.performTogether = performTogether;
    }

    public List<ConstructionImageInfo> getListConstructionImageInfo() {
        return listConstructionImageInfo;
    }

    public void setListConstructionImageInfo(
            List<ConstructionImageInfo> listConstructionImageInfo) {
        this.listConstructionImageInfo = listConstructionImageInfo;
    }

    public List<AIOContractDTO> getLstImage() {
        return lstImage;
    }

    public void setLstImage(List<AIOContractDTO> lstImage) {
        this.lstImage = lstImage;
    }

    public List<AIOContractDTO> getLstAIOContractMobileDTO() {
        return lstAIOContractMobileDTO;
    }

    public void setLstAIOContractMobileDTO(
            List<AIOContractDTO> lstAIOContractMobileDTO) {
        this.lstAIOContractMobileDTO = lstAIOContractMobileDTO;
    }

    public SysUserRequest getSysUserRequest() {
        return sysUserRequest;
    }

    public void setSysUserRequest(SysUserRequest sysUserRequest) {
        this.sysUserRequest = sysUserRequest;
    }

    public SysUserRequest getSysUserReceiver() {
        return sysUserReceiver;
    }

    public void setSysUserReceiver(SysUserRequest sysUserReceiver) {
        this.sysUserReceiver = sysUserReceiver;
    }

    public AIOContractDTO getAioContractDTO() {
        return aioContractDTO;
    }

    public void setAioContractDTO(AIOContractDTO aioContractDTO) {
        this.aioContractDTO = aioContractDTO;
    }

    public AppParamDTO getAppParam() {
        return appParam;
    }

    public void setAppParam(AppParamDTO appParam) {
        this.appParam = appParam;
    }

    public List<AIOPackageDetailDTO> getLstAIOPackageDetail() {
        return lstAIOPackageDetail;
    }

    public void setLstAIOPackageDetail(List<AIOPackageDetailDTO> lstAIOPackageDetail) {
        this.lstAIOPackageDetail = lstAIOPackageDetail;
    }

    public AIOConfigServiceDTO getAioConfigServiceDTO() {
        return aioConfigServiceDTO;
    }

    public void setAioConfigServiceDTO(AIOConfigServiceDTO aioConfigServiceDTO) {
        this.aioConfigServiceDTO = aioConfigServiceDTO;
    }

    public AIOCustomerDTO getAioCustomerDTO() {
        return aioCustomerDTO;
    }

    public void setAioCustomerDTO(AIOCustomerDTO aioCustomerDTO) {
        this.aioCustomerDTO = aioCustomerDTO;
    }

    public AIOPackageDetailDTO getAioPackageDetailDTO() {
        return aioPackageDetailDTO;
    }

    public void setAioPackageDetailDTO(AIOPackageDetailDTO aioPackageDetailDTO) {
        this.aioPackageDetailDTO = aioPackageDetailDTO;
    }

    public AIOAreaDTO getAioAreaDTO() {
        return aioAreaDTO;
    }

    public void setAioAreaDTO(AIOAreaDTO aioAreaDTO) {
        this.aioAreaDTO = aioAreaDTO;
    }

    public CatProvinceDTO getCatProvinceDTO() {
        return catProvinceDTO;
    }

    public void setCatProvinceDTO(CatProvinceDTO catProvinceDTO) {
        this.catProvinceDTO = catProvinceDTO;
    }

    public long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(long sysUserId) {
        this.sysUserId = sysUserId;
    }

    public String getListEmployee() {
        return listEmployee;
    }

    public void setListEmployee(String listEmployee) {
        this.listEmployee = listEmployee;
    }

    public AIOOrderRequestDTO getOrderRequest() {
        return orderRequest;
    }

    public void setOrderRequest(AIOOrderRequestDTO orderRequest) {
        this.orderRequest = orderRequest;
    }

    public long getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(long surveyId) {
        this.surveyId = surveyId;
    }

    public long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }


    public QuestionForCustomerDTO getQuestionForCustomerDTO() {
        return questionForCustomerDTO;
    }

    public void setQuestionForCustomerDTO(QuestionForCustomerDTO questionForCustomerDTO) {
        this.questionForCustomerDTO = questionForCustomerDTO;
    }

    public Long getSurveyCustomerId() {
        return surveyCustomerId;
    }

    public void setSurveyCustomerId(Long surveyCustomerId) {
        this.surveyCustomerId = surveyCustomerId;
    }
}
