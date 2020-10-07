package com.viettel.aio.dto;

import com.viettel.aio.bo.CntContractBO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.utils.CustomJsonDateDeserializer;
import com.viettel.utils.CustomJsonDateSerializer;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

/**
 *
 * @author hailh10
 */
@SuppressWarnings("serial")
@XmlRootElement(name = "CNT_CONTRACTBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CntContractDTO extends ComsBaseFWDTO<CntContractBO> {

	private Long cntContractId;
	private String code;
	private String name;
	private String contractCodeKtts;
	private String content;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date signDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date signDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date signDateTo;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date startTime;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date startTimeFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date startTimeTo;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date endTime;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date endTimeFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date endTimeTo;
	private Double price;
	private Double appendixContract;
	private Double numStation;
	private Long biddingPackageId;
	private String biddingPackageName;
	private Long catPartnerId;
	private String catPartnerName;
	private String signerPartner;
	private Long sysGroupId;
	private String sysGroupName;
	private Long signerGroup;
	private String signerGroupName;
	private String supervisor;
	private Long status;
	private Double formal;
	private Long contractType;
	private String contractTypeName;
	private Double cntContractParentId;
	private String cntContractParentName;
	private String cntContractParentCode;

	//tatph start 8/10/2019
	private Long extensionDays;
	private Long isXNXD;
	private Long constructionForm;
	private String currentProgess;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date handoverUseDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date warrantyExpiredDate;
	private Long structureFilter;
	private String descriptionXNXD;

	//tatph - start
	private Long projectId;
	private String projectCode;
	private String projectName;
	private Long paymentExpried;
	private String warningMess;

	//tatph - end

	public Long getProjectId() {
		return projectId;
	}

	public String getWarningMess() {
		return warningMess;
	}

	public void setWarningMess(String warningMess) {
		this.warningMess = warningMess;
	}

	public Long getPaymentExpried() {
		return paymentExpried;
	}

	public void setPaymentExpried(Long paymentExpried) {
		this.paymentExpried = paymentExpried;
	}

	public Long getExtensionDays() {
		return extensionDays;
	}

	public void setExtensionDays(Long extensionDays) {
		this.extensionDays = extensionDays;
	}

	public void setProjectId(Long projectId) {
		this.projectId = projectId;
	}

	public String getProjectCode() {
		return projectCode;
	}

	public void setProjectCode(String projectCode) {
		this.projectCode = projectCode;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public Long getIsXNXD() {
		return isXNXD;
	}

	public void setIsXNXD(Long isXNXD) {
		this.isXNXD = isXNXD;
	}

	public Long getConstructionForm() {
		return constructionForm;
	}

	public void setConstructionForm(Long constructionForm) {
		this.constructionForm = constructionForm;
	}

	public String getCurrentProgess() {
		return currentProgess;
	}

	public void setCurrentProgess(String currentProgess) {
		this.currentProgess = currentProgess;
	}

	public java.util.Date getHandoverUseDate() {
		return handoverUseDate;
	}

	public void setHandoverUseDate(java.util.Date handoverUseDate) {
		this.handoverUseDate = handoverUseDate;
	}

	public java.util.Date getWarrantyExpiredDate() {
		return warrantyExpiredDate;
	}

	public void setWarrantyExpiredDate(java.util.Date warrantyExpiredDate) {
		this.warrantyExpiredDate = warrantyExpiredDate;
	}

	public Long getStructureFilter() {
		return structureFilter;
	}

	public void setStructureFilter(Long structureFilter) {
		this.structureFilter = structureFilter;
	}

	public String getDescriptionXNXD() {
		return descriptionXNXD;
	}

	public void setDescriptionXNXD(String descriptionXNXD) {
		this.descriptionXNXD = descriptionXNXD;
	}
	//HuyPQ-add-start
	private String createdName;
	@JsonProperty("createdName")
	public String getCreatedName() {
		return createdName;
	}

	public void setCreatedName(String createdName) {
		this.createdName = createdName;
	}
	//HuyPQ-add-end
	/**Hoangnh start 28012019**/
	private Long contractTypeO;
	private String contractTypeOsName;
	private String checkOS;

	public String getCheckOS() {
		return checkOS;
	}

	public void setCheckOS(String checkOS) {
		this.checkOS = checkOS;
	}

	public Long getContractTypeO() {
		return contractTypeO;
	}

	public void setContractTypeO(Long contractTypeO) {
		this.contractTypeO = contractTypeO;
	}

	public String getContractTypeOsName() {
		return contractTypeOsName;
	}

	public void setContractTypeOsName(String contractTypeOsName) {
		this.contractTypeOsName = contractTypeOsName;
	}
	/**Hoangnh end 28012019**/

	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date createdDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date createdDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date createdDateTo;
	private Long createdUserId;
	private String createdUserName;
	private Long createdGroupId;
	private String createdGroupName;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date updatedDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date updatedDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date updatedDateTo;
	private Long updatedUserId;
	private String updatedUserName;
	private Long updatedGroupId;
	private String updatedGroupName;
	private String description;
	private Long synState;
	private Double numDay;
	private Integer moneyType;
	private Long frameParentId;
	private String frameParentCode;

	private List<PurchaseOrderDTO> purchaseOrderLst;
	private List<String> statusLst;
	private List<String> contractTypeLst;
	@JsonProperty("contractTypeLst")
	public List<String> getContractTypeLst() {
		return contractTypeLst;
	}

	public void setContractTypeLst(List<String> contractTypeLst) {
		this.contractTypeLst = contractTypeLst;
	}
	private List <UtilAttachDocumentDTO> fileLst;
	//HuyPq-20181106-start
	private List<CntContractDTO> purchaseLst;

	public List<CntContractDTO> getPurchaseLst() {
		return purchaseLst;
	}

	public void setPurchaseLst(List<CntContractDTO> purchaseLst) {
		this.purchaseLst = purchaseLst;
	}
	private Long cntContractOutId;

	public Long getCntContractOutId() {
		return cntContractOutId;
	}

	public void setCntContractOutId(Long cntContractOutId) {
		this.cntContractOutId = cntContractOutId;
	}
	private Long cntContractMapId;

	public Long getCntContractMapId() {
		return cntContractMapId;
	}

	public void setCntContractMapId(Long cntContractMapId) {
		this.cntContractMapId = cntContractMapId;
	}
	//HuyPq-20181106-end
//	hoanm1_20180308_start
	private String codeKtts;
	private Long state;
	private String fileNameCntProgress;
//	1: tong hop, 2: chi tiet
	private Integer reportContract;
	private Long projectContractId;
	private String projectContractCode;

	@JsonProperty("numDay")
	public Double getNumDay() {
		return numDay;
	}

	public void setNumDay(Double numDay) {
		this.numDay = numDay;
	}

	@JsonProperty("state")
	public Long getState() {
		return state;
	}

	public void setState(Long state) {
		this.state = state;
	}

	@JsonProperty("codeKtts")
	public String getCodeKtts() {
		return codeKtts;
	}
//	hoanm1_20180308_end

	public void setCodeKtts(String codeKtts) {
		this.codeKtts = codeKtts;
	}

	@Override
    public CntContractBO toModel() {
        CntContractBO cntContractBO = new CntContractBO();
        cntContractBO.setCntContractId(this.cntContractId);
        cntContractBO.setCode(this.code);
        cntContractBO.setName(this.name);
        cntContractBO.setContractCodeKtts(this.contractCodeKtts);
        cntContractBO.setContent(this.content);
        cntContractBO.setSignDate(this.signDate);
        cntContractBO.setStartTime(this.startTime);
        cntContractBO.setEndTime(this.endTime);
        cntContractBO.setPrice(this.price);
        cntContractBO.setAppendixContract(this.appendixContract);
        cntContractBO.setNumStation(this.numStation);
        cntContractBO.setBiddingPackageId(this.biddingPackageId);
        cntContractBO.setCatPartnerId(this.catPartnerId);
        cntContractBO.setSignerPartner(this.signerPartner);
        cntContractBO.setSysGroupId(this.sysGroupId);
        cntContractBO.setSignerGroup(this.signerGroup);
        cntContractBO.setSupervisor(this.supervisor);
        cntContractBO.setNumDay(numDay);
//		if (this.supervisor == null || "".equalsIgnoreCase(this.supervisor) || "N".equalsIgnoreCase(this.supervisor)) {
//			cntContractBO.setSupervisor("N");
//		} else {
//			cntContractBO.setSupervisor("Y");
//		}
        cntContractBO.setStatus(this.status);
        cntContractBO.setFormal(this.formal);
        cntContractBO.setContractType(this.contractType);
        cntContractBO.setCntContractParentId(this.cntContractParentId);
        cntContractBO.setCreatedDate(this.createdDate);
        cntContractBO.setCreatedUserId(this.createdUserId);
        cntContractBO.setCreatedGroupId(this.createdGroupId);
        cntContractBO.setUpdatedDate(this.updatedDate);
        cntContractBO.setUpdatedUserId(this.updatedUserId);
        cntContractBO.setUpdatedGroupId(this.updatedGroupId);
        cntContractBO.setDescription(description);
        cntContractBO.setState(this.state);
        cntContractBO.setSynState(this.synState);
        cntContractBO.setFrameParentId(frameParentId);
        cntContractBO.setMoneyType(moneyType);
        cntContractBO.setProjectContractId(projectContractId);
        /**Hoangnh start 28012019**/
        cntContractBO.setContractTypeO(this.contractTypeO);
        cntContractBO.setContractTypeOsName(this.contractTypeOsName);
        /**Hoangnh start 28012019**/

        //hienvd: START 7/9/2019
		cntContractBO.setMonthHTCT(this.monthHTCT);
		cntContractBO.setPriceHTCT(this.priceHTCT);
		cntContractBO.setTypeHTCT(this.typeHTCT);
		//hienvd: END 7/9/2019

		//tatph start 8/10/2019
		cntContractBO.setIsXNXD(this.isXNXD);
		cntContractBO.setConstructionForm(this.constructionForm);
		cntContractBO.setCurrentProgess(this.currentProgess);
		cntContractBO.setHandoverUseDate(this.handoverUseDate);
		cntContractBO.setWarrantyExpiredDate(this.warrantyExpiredDate);
		cntContractBO.setStructureFilter(this.structureFilter);
		cntContractBO.setDescriptionXNXD(this.descriptionXNXD);
		cntContractBO.setProjectId(this.projectId);
		cntContractBO.setProjectCode(this.projectCode);
		cntContractBO.setProjectName(this.projectName);
		cntContractBO.setExtensionDays(this.extensionDays);
		cntContractBO.setPaymentExpried(this.paymentExpried);

		//tatph end
		cntContractBO.setCoefficient(this.coefficient);
        return cntContractBO;
    }

    @Override
     public Long getFWModelId() {
        return cntContractId;
    }

    @Override
    public String catchName() {
        return getCntContractId().toString();
    }

	@JsonProperty("cntContractId")
    public Long getCntContractId(){
		return cntContractId;
    }

    public void setCntContractId(Long cntContractId){
		this.cntContractId = cntContractId;
    }

	@JsonProperty("code")
    public String getCode(){
		return code;
    }

    public void setCode(String code){
		this.code = code;
    }

	@JsonProperty("name")
    public String getName(){
		return name;
    }

    public void setName(String name){
		this.name = name;
    }

	@JsonProperty("contractCodeKtts")
    public String getContractCodeKtts(){
		return contractCodeKtts;
    }

    public void setContractCodeKtts(String contractCodeKtts){
		this.contractCodeKtts = contractCodeKtts;
    }

	@JsonProperty("content")
    public String getContent(){
		return content;
    }

    public void setContent(String content){
		this.content = content;
    }

	@JsonProperty("signDate")
    public java.util.Date getSignDate(){
		return signDate;
    }

    public void setSignDate(java.util.Date signDate){
		this.signDate = signDate;
    }

	public java.util.Date getSignDateFrom() {
    	return signDateFrom;
    }

    public void setSignDateFrom(java.util.Date signDateFrom) {
    	this.signDateFrom = signDateFrom;
    }

	public java.util.Date getSignDateTo() {
    	return signDateTo;
    }

    public void setSignDateTo(java.util.Date signDateTo) {
    	this.signDateTo = signDateTo;
    }

	@JsonProperty("startTime")
    public java.util.Date getStartTime(){
		return startTime;
    }

    public void setStartTime(java.util.Date startTime){
		this.startTime = startTime;
    }

	public java.util.Date getStartTimeFrom() {
    	return startTimeFrom;
    }

    public void setStartTimeFrom(java.util.Date startTimeFrom) {
    	this.startTimeFrom = startTimeFrom;
    }

	public java.util.Date getStartTimeTo() {
    	return startTimeTo;
    }

    public void setStartTimeTo(java.util.Date startTimeTo) {
    	this.startTimeTo = startTimeTo;
    }

	@JsonProperty("endTime")
    public java.util.Date getEndTime(){
		return endTime;
    }

    public void setEndTime(java.util.Date endTime){
		this.endTime = endTime;
    }

	public java.util.Date getEndTimeFrom() {
    	return endTimeFrom;
    }

    public void setEndTimeFrom(java.util.Date endTimeFrom) {
    	this.endTimeFrom = endTimeFrom;
    }

	public java.util.Date getEndTimeTo() {
    	return endTimeTo;
    }

    public void setEndTimeTo(java.util.Date endTimeTo) {
    	this.endTimeTo = endTimeTo;
    }

	@JsonProperty("price")
    public Double getPrice(){
		return price;
    }

    public void setPrice(Double price){
		this.price = price;
    }

	@JsonProperty("appendixContract")
    public Double getAppendixContract(){
		return appendixContract;
    }

    public void setAppendixContract(Double appendixContract){
		this.appendixContract = appendixContract;
    }

	@JsonProperty("numStation")
    public Double getNumStation(){
		return numStation;
    }

    public void setNumStation(Double numStation){
		this.numStation = numStation;
    }

	@JsonProperty("biddingPackageId")
    public Long getBiddingPackageId(){
		return biddingPackageId;
    }

    public void setBiddingPackageId(Long biddingPackageId){
		this.biddingPackageId = biddingPackageId;
    }

	@JsonProperty("biddingPackageName")
    public String getBiddingPackageName(){
		return biddingPackageName;
    }

    public void setBiddingPackageName(String biddingPackageName){
		this.biddingPackageName = biddingPackageName;
    }

	@JsonProperty("catPartnerId")
    public Long getCatPartnerId(){
		return catPartnerId;
    }

    public void setCatPartnerId(Long catPartnerId){
		this.catPartnerId = catPartnerId;
    }

	@JsonProperty("catPartnerName")
    public String getCatPartnerName(){
		return catPartnerName;
    }

    public void setCatPartnerName(String catPartnerName){
		this.catPartnerName = catPartnerName;
    }

	@JsonProperty("signerPartner")
    public String getSignerPartner(){
		return signerPartner;
    }

    public void setSignerPartner(String signerPartner){
		this.signerPartner = signerPartner;
    }

	@JsonProperty("sysGroupId")
    public Long getSysGroupId(){
		return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId){
		this.sysGroupId = sysGroupId;
    }

	@JsonProperty("sysGroupName")
    public String getSysGroupName(){
		return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName){
		this.sysGroupName = sysGroupName;
    }

	@JsonProperty("signerGroup")
    public Long getSignerGroup(){
		return signerGroup;
    }

    public void setSignerGroup(Long signerGroup){
		this.signerGroup = signerGroup;
    }

    @JsonProperty("signerGroupName")

	public String getSignerGroupName() {
		return signerGroupName;
	}

	public void setSignerGroupName(String signerGroupName) {
		this.signerGroupName = signerGroupName;
	}

	@JsonProperty("supervisor")
    public String getSupervisor(){
		return supervisor;
    }

    public void setSupervisor(String supervisor){
		this.supervisor = supervisor;
    }

	@JsonProperty("status")
    public Long getStatus(){
		return status;
    }

    public void setStatus(Long status){
		this.status = status;
    }

	@JsonProperty("formal")
    public Double getFormal(){
		return formal;
    }

    public void setFormal(Double formal){
		this.formal = formal;
    }

	@JsonProperty("contractType")
    public Long getContractType(){
		return contractType;
    }

    public void setContractType(Long contractType){
		this.contractType = contractType;
    }

	@JsonProperty("cntContractParentId")
    public Double getCntContractParentId(){
		return cntContractParentId;
    }

    public void setCntContractParentId(Double cntContractParentId){
		this.cntContractParentId = cntContractParentId;
    }

	@JsonProperty("cntContractParentName")
    public String getCntContractParentName(){
		return cntContractParentName;
    }

    public void setCntContractParentName(String cntContractParentName){
		this.cntContractParentName = cntContractParentName;
    }

	@JsonProperty("createdDate")
    public java.util.Date getCreatedDate(){
		return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate){
		this.createdDate = createdDate;
    }

	public java.util.Date getCreatedDateFrom() {
    	return createdDateFrom;
    }

    public void setCreatedDateFrom(java.util.Date createdDateFrom) {
    	this.createdDateFrom = createdDateFrom;
    }

	public java.util.Date getCreatedDateTo() {
    	return createdDateTo;
    }

    public void setCreatedDateTo(java.util.Date createdDateTo) {
    	this.createdDateTo = createdDateTo;
    }

	@JsonProperty("createdUserId")
    public Long getCreatedUserId(){
		return createdUserId;
    }

    public void setCreatedUserId(Long createdUserId){
		this.createdUserId = createdUserId;
    }

	@JsonProperty("createdUserName")
    public String getCreatedUserName(){
		return createdUserName;
    }

    public void setCreatedUserName(String createdUserName){
		this.createdUserName = createdUserName;
    }

	@JsonProperty("createdGroupId")
    public Long getCreatedGroupId(){
		return createdGroupId;
    }

    public void setCreatedGroupId(Long createdGroupId){
		this.createdGroupId = createdGroupId;
    }

	@JsonProperty("createdGroupName")
    public String getCreatedGroupName(){
		return createdGroupName;
    }

    public void setCreatedGroupName(String createdGroupName){
		this.createdGroupName = createdGroupName;
    }

	@JsonProperty("updatedDate")
    public java.util.Date getUpdatedDate(){
		return updatedDate;
    }

    public void setUpdatedDate(java.util.Date updatedDate){
		this.updatedDate = updatedDate;
    }

	public java.util.Date getUpdatedDateFrom() {
    	return updatedDateFrom;
    }

    public void setUpdatedDateFrom(java.util.Date updatedDateFrom) {
    	this.updatedDateFrom = updatedDateFrom;
    }

	public java.util.Date getUpdatedDateTo() {
    	return updatedDateTo;
    }

    public void setUpdatedDateTo(java.util.Date updatedDateTo) {
    	this.updatedDateTo = updatedDateTo;
    }

	@JsonProperty("updatedUserId")
    public Long getUpdatedUserId(){
		return updatedUserId;
    }

    public void setUpdatedUserId(Long updatedUserId){
		this.updatedUserId = updatedUserId;
    }

	@JsonProperty("updatedUserName")
    public String getUpdatedUserName(){
		return updatedUserName;
    }

    public void setUpdatedUserName(String updatedUserName){
		this.updatedUserName = updatedUserName;
    }

	@JsonProperty("updatedGroupId")
    public Long getUpdatedGroupId(){
		return updatedGroupId;
    }

    public void setUpdatedGroupId(Long updatedGroupId){
		this.updatedGroupId = updatedGroupId;
    }

	@JsonProperty("updatedGroupName")
    public String getUpdatedGroupName(){
		return updatedGroupName;
    }

    public void setUpdatedGroupName(String updatedGroupName){
		this.updatedGroupName = updatedGroupName;
    }

	@JsonProperty("purchaseOrderLst")
	public List<PurchaseOrderDTO> getPurchaseOrderLst() {
		return purchaseOrderLst;
	}

	public void setPurchaseOrderLst(List<PurchaseOrderDTO> purchaseOrderLst) {
		this.purchaseOrderLst = purchaseOrderLst;
	}

	@JsonProperty("fileLst")
	public List<UtilAttachDocumentDTO> getFileLst() {
		return fileLst;
	}

	public void setFileLst(List<UtilAttachDocumentDTO> fileLst) {
		this.fileLst = fileLst;
	}

	@JsonProperty("statusLst")
	public List<String> getStatusLst() {
		return statusLst;
	}

	public void setStatusLst(List<String> statusLst) {
		this.statusLst = statusLst;
	}

	@JsonProperty("description")
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getContractTypeName() {
		return contractTypeName;
	}

	public void setContractTypeName(String contractTypeName) {
		this.contractTypeName = contractTypeName;
	}

	public String getFileNameCntProgress() {
		return fileNameCntProgress;
	}

	public void setFileNameCntProgress(String fileNameCntProgress) {
		this.fileNameCntProgress = fileNameCntProgress;
	}

//	@JsonProperty("synState")
	public Long getSynState() {
		return synState;
	}

	public void setSynState(Long synState) {
		this.synState = synState;
	}

	public Integer getReportContract() {
		return reportContract;
	}

	public void setReportContract(Integer reportContract) {
		this.reportContract = reportContract;
	}

	public Integer getMoneyType() {
		return moneyType;
	}

	public void setMoneyType(Integer moneyType) {
		this.moneyType = moneyType;
	}

	public Long getFrameParentId() {
		return frameParentId;
	}

	public void setFrameParentId(Long frameParentId) {
		this.frameParentId = frameParentId;
	}

	public String getFrameParentCode() {
		return frameParentCode;
	}

	public void setFrameParentCode(String frameParentCode) {
		this.frameParentCode = frameParentCode;
	}

	public String getCntContractParentCode() {
		return cntContractParentCode;
	}

	public void setCntContractParentCode(String cntContractParentCode) {
		this.cntContractParentCode = cntContractParentCode;
	}

	public Long getProjectContractId() {
		return projectContractId;
	}

	public void setProjectContractId(Long projectContractId) {
		this.projectContractId = projectContractId;
	}

	public String getProjectContractCode() {
		return projectContractCode;
	}

	public void setProjectContractCode(String projectContractCode) {
		this.projectContractCode = projectContractCode;
	}

	//hienvd: ADD 5/9/2019
	private Long typeHTCT;
	private Double priceHTCT;
	private Long monthHTCT;

	public Long getTypeHTCT() {
		return typeHTCT;
	}

	public void setTypeHTCT(Long typeHTCT) {
		this.typeHTCT = typeHTCT;
	}

	public Double getPriceHTCT() {
		return priceHTCT;
	}

	public void setPriceHTCT(Double priceHTCT) {
		this.priceHTCT = priceHTCT;
	}

	public Long getMonthHTCT() {
		return monthHTCT;
	}

	public void setMonthHTCT(Long monthHTCT) {
		this.monthHTCT = monthHTCT;
	}
	//hienvd: END
 
	//huypq-20190917-start
	private List<Long> listTypeHtct;
	
	public List<Long> getListTypeHtct() {
		return listTypeHtct;
	}

	public void setListTypeHtct(List<Long> listTypeHtct) {
		this.listTypeHtct = listTypeHtct;
	}
	//huy-end
	
	//Huypq-20191021-start
	private String cntContractCode;
	private Long cntContractPrice;

	public String getCntContractCode() {
		return cntContractCode;
	}

	public void setCntContractCode(String cntContractCode) {
		this.cntContractCode = cntContractCode;
	}

	public Long getCntContractPrice() {
		return cntContractPrice;
	}

	public void setCntContractPrice(Long cntContractPrice) {
		this.cntContractPrice = cntContractPrice;
	}
	
	private Double coefficient;



	public Double getCoefficient() {
		return coefficient;
	}

	public void setCoefficient(Double coefficient) {
		this.coefficient = coefficient;
	}
	
	
	//Huy-end
}
