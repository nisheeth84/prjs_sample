package com.viettel.aio.bo;

import com.viettel.aio.dto.CntContractDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.aio.bo.CntContractBO")
@Table(name = "CNT_CONTRACT")
/**
 *
 * @author: hailh10
 */
public class CntContractBO extends BaseFWModelImpl {
     
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "CNT_CONTRACT_SEQ") })
	@Column(name = "CNT_CONTRACT_ID", length = 22)
	private Long cntContractId;
	@Column(name = "CODE", length = 200)
	private String code;
	@Column(name = "NAME", length = 1000)
	private String name;
	@Column(name = "CONTRACT_CODE_KTTS", length = 200)
	private String contractCodeKtts;
	@Column(name = "CONTENT", length = 4000)
	private String content;
	@Column(name = "SIGN_DATE", length = 7)
	private java.util.Date signDate;
	@Column(name = "START_TIME", length = 7)
	private java.util.Date startTime;
	@Column(name = "END_TIME", length = 7)
	private java.util.Date endTime;
	@Column(name = "PRICE", length = 22)
	private Double price;
	@Column(name = "APPENDIX_CONTRACT", length = 22)
	private Double appendixContract;
	@Column(name = "NUM_STATION", length = 22)
	private Double numStation;
	@Column(name = "BIDDING_PACKAGE_ID", length = 22)
	private Long biddingPackageId;
	@Column(name = "CAT_PARTNER_ID", length = 22)
	private Long catPartnerId;
	@Column(name = "SIGNER_PARTNER", length = 200)
	private String signerPartner;
	@Column(name = "SYS_GROUP_ID", length = 22)
	private Long sysGroupId;
	@Column(name = "SIGNER_GROUP", length = 22)
	private Long signerGroup;
	@Column(name = "SUPERVISOR", length = 200)
	private String supervisor;
	@Column(name = "STATUS", length = 22)
	private Long status;
	@Column(name = "FORMAL", length = 22)
	private Double formal;
	@Column(name = "CONTRACT_TYPE", length = 22)
	private Long contractType;
	@Column(name = "CNT_CONTRACT_PARENT_ID", length = 22)
	private Double cntContractParentId;
	@Column(name = "CREATED_DATE", length = 7)
	private java.util.Date createdDate;
	@Column(name = "CREATED_USER_ID", length = 22)
	private Long createdUserId;
	@Column(name = "CREATED_GROUP_ID", length = 22)
	private Long createdGroupId;
	@Column(name = "UPDATED_DATE", length = 7)
	private java.util.Date updatedDate;
	@Column(name = "UPDATED_USER_ID", length = 22)
	private Long updatedUserId;
	@Column(name = "UPDATED_GROUP_ID", length = 22)
	private Long updatedGroupId;
	@Column(name = "DESCRIPTION", length = 2000)
	private String description;
	@Column(name = "STATE", length = 2)
	private Long state;
	@Column(name = "SYN_STATE", length = 2)
	private Long synState;
	@Column(name = "NUM_DAY", length = 30)
	private Double numDay;
	@Column(name = "FRAME_PARENT_ID", length = 30)
	private Long frameParentId;
	@Column(name = "MONEY_TYPE", length = 6)
	private Integer moneyType;
	@Column(name = "PROJECT_CONTRACT_ID", length = 22)
	private Long projectContractId;
	@Column(name = "EXTENSION_DAYS", length = 22)
	private Long extensionDays;
	@Column(name = "PAYMENT_EXPRIED", length = 22)
	private Long paymentExpried
	;


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

	//Huypq-20191023-start
	@Column(name = "COEFFICIENT")
	private Double coefficient;

	public Double getCoefficient() {
		return coefficient;
	}

	public void setCoefficient(Double coefficient) {
		this.coefficient = coefficient;
	}

	//Huy-end
	//tatph start 8/10/2019
	@Column(name = "IS_XNXD", length = 22)
	private Long isXNXD;
	@Column(name = "CONSTRUCTION_FORM", length = 22)
	private Long constructionForm;
	@Column(name = "CURRENT_PROGRESS", length = 220)
	private String currentProgess;
	@Column(name = "HANDOVER_USE_DATE")
	private java.util.Date handoverUseDate;
	@Column(name = "WARRANTY_EXPIRED_DATE")
	private java.util.Date warrantyExpiredDate;
	@Column(name = "STRUCTURE_FILTER", length = 22)
	private Long structureFilter;
	@Column(name = "DESCRIPTION_XNXD", length = 220)
	private String descriptionXNXD;
	//tatph - start
	@Column(name = "PROJECT_ID", length = 11)
	private Long projectId;
	@Column(name = "PROJECT_CODE", length = 220)
	private String projectCode;
	@Column(name = "PROJECT_NAME", length = 2200)
	private String projectName;


	//tatph - end





	public Long getProjectId() {
		return projectId;
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

	/**Hoangnh start 28012019**/
	@Column(name = "CONTRACT_TYPE_O", length = 2)
	private Long contractTypeO;
	@Column(name = "CONTRACT_TYPE_OS_NAME", length = 50)
	private String contractTypeOsName;

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

	/**Hoangnh start 28012019**/

	//hienvd: START 7/9/2019
	@Column(name = "TYPE_HTCT")
	private Long typeHTCT;
	@Column(name = "PRICE_HTCT")
	private Double priceHTCT;
	@Column(name = "MONTH_HTCT")
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
	//hienvd: END 7/9/2019

	public Double getNumDay() {
		return numDay;
	}

	public void setNumDay(Double numDay) {
		this.numDay = numDay;
	}

	public Long getSynState() {
		return synState;
	}

	public void setSynState(Long synState) {
		this.synState = synState;
	}

	public Long getState(){
		return state;
	}

	public void setState(Long state)
	{
		this.state = state;
	}

	public Long getCntContractId(){
		return cntContractId;
	}

	public void setCntContractId(Long cntContractId)
	{
		this.cntContractId = cntContractId;
	}

	public String getCode(){
		return code;
	}

	public void setCode(String code)
	{
		this.code = code;
	}

	public String getName(){
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public String getContractCodeKtts(){
		return contractCodeKtts;
	}

	public void setContractCodeKtts(String contractCodeKtts)
	{
		this.contractCodeKtts = contractCodeKtts;
	}

	public String getContent(){
		return content;
	}

	public void setContent(String content)
	{
		this.content = content;
	}

	public java.util.Date getSignDate(){
		return signDate;
	}

	public void setSignDate(java.util.Date signDate)
	{
		this.signDate = signDate;
	}

	public java.util.Date getStartTime(){
		return startTime;
	}

	public void setStartTime(java.util.Date startTime)
	{
		this.startTime = startTime;
	}

	public java.util.Date getEndTime(){
		return endTime;
	}

	public void setEndTime(java.util.Date endTime)
	{
		this.endTime = endTime;
	}

	public Double getPrice(){
		return price;
	}

	public void setPrice(Double price)
	{
		this.price = price;
	}

	public Double getAppendixContract(){
		return appendixContract;
	}

	public void setAppendixContract(Double appendixContract)
	{
		this.appendixContract = appendixContract;
	}

	public Double getNumStation(){
		return numStation;
	}

	public void setNumStation(Double numStation)
	{
		this.numStation = numStation;
	}

	public Long getBiddingPackageId(){
		return biddingPackageId;
	}

	public void setBiddingPackageId(Long biddingPackageId)
	{
		this.biddingPackageId = biddingPackageId;
	}

	public Long getCatPartnerId(){
		return catPartnerId;
	}

	public void setCatPartnerId(Long catPartnerId)
	{
		this.catPartnerId = catPartnerId;
	}

	public String getSignerPartner(){
		return signerPartner;
	}

	public void setSignerPartner(String signerPartner)
	{
		this.signerPartner = signerPartner;
	}

	public Long getSysGroupId(){
		return sysGroupId;
	}

	public void setSysGroupId(Long sysGroupId)
	{
		this.sysGroupId = sysGroupId;
	}

	public Long getSignerGroup(){
		return signerGroup;
	}

	public void setSignerGroup(Long signerGroup)
	{
		this.signerGroup = signerGroup;
	}

	public String getSupervisor(){
		return supervisor;
	}

	public void setSupervisor(String supervisor)
	{
		this.supervisor = supervisor;
	}

	public Long getStatus(){
		return status;
	}

	public void setStatus(Long status)
	{
		this.status = status;
	}

	public Double getFormal(){
		return formal;
	}

	public void setFormal(Double formal)
	{
		this.formal = formal;
	}

	public Long getContractType(){
		return contractType;
	}

	public void setContractType(Long contractType)
	{
		this.contractType = contractType;
	}

	public Double getCntContractParentId(){
		return cntContractParentId;
	}

	public void setCntContractParentId(Double cntContractParentId)
	{
		this.cntContractParentId = cntContractParentId;
	}

	public java.util.Date getCreatedDate(){
		return createdDate;
	}

	public void setCreatedDate(java.util.Date createdDate)
	{
		this.createdDate = createdDate;
	}

	public Long getCreatedUserId(){
		return createdUserId;
	}

	public void setCreatedUserId(Long createdUserId)
	{
		this.createdUserId = createdUserId;
	}

	public Long getCreatedGroupId(){
		return createdGroupId;
	}

	public void setCreatedGroupId(Long createdGroupId)
	{
		this.createdGroupId = createdGroupId;
	}

	public java.util.Date getUpdatedDate(){
		return updatedDate;
	}

	public void setUpdatedDate(java.util.Date updatedDate)
	{
		this.updatedDate = updatedDate;
	}

	public Long getUpdatedUserId(){
		return updatedUserId;
	}

	public void setUpdatedUserId(Long updatedUserId)
	{
		this.updatedUserId = updatedUserId;
	}

	public Long getUpdatedGroupId(){
		return updatedGroupId;
	}

	public void setUpdatedGroupId(Long updatedGroupId)
	{
		this.updatedGroupId = updatedGroupId;
	}

   public void setDescription(String description) {
	this.description = description;
   }

   public String getDescription() {
	return description;
   }
    @Override
    public CntContractDTO toDTO() {
        CntContractDTO cntContractDTO = new CntContractDTO();
        cntContractDTO.setCntContractId(this.cntContractId);
        cntContractDTO.setCode(this.code);
        cntContractDTO.setName(this.name);
        cntContractDTO.setContractCodeKtts(this.contractCodeKtts);
        cntContractDTO.setContent(this.content);
        cntContractDTO.setSignDate(this.signDate);
        cntContractDTO.setStartTime(this.startTime);
        cntContractDTO.setEndTime(this.endTime);
        cntContractDTO.setPrice(this.price);
        cntContractDTO.setAppendixContract(this.appendixContract);
        cntContractDTO.setNumStation(this.numStation);
        cntContractDTO.setBiddingPackageId(this.biddingPackageId);
        cntContractDTO.setCatPartnerId(this.catPartnerId);
        cntContractDTO.setSignerPartner(this.signerPartner);
        cntContractDTO.setSysGroupId(this.sysGroupId);
        cntContractDTO.setSignerGroup(this.signerGroup);
        cntContractDTO.setSupervisor(this.supervisor);
        cntContractDTO.setStatus(this.status);
        cntContractDTO.setState(this.state);
        cntContractDTO.setFormal(this.formal);
        cntContractDTO.setContractType(this.contractType);
        cntContractDTO.setCntContractParentId(this.cntContractParentId);
        cntContractDTO.setCreatedDate(this.createdDate);
        cntContractDTO.setCreatedUserId(this.createdUserId);
        cntContractDTO.setCreatedGroupId(this.createdGroupId);
        cntContractDTO.setUpdatedDate(this.updatedDate);
        cntContractDTO.setUpdatedUserId(this.updatedUserId);
        cntContractDTO.setUpdatedGroupId(this.updatedGroupId);
        cntContractDTO.setDescription(description);
        cntContractDTO.setSynState(this.synState);
        cntContractDTO.setNumDay(this.numDay);
        cntContractDTO.setMoneyType(moneyType);
        cntContractDTO.setFrameParentId(frameParentId);
        cntContractDTO.setProjectContractId(projectContractId);
        /**Hoangnh start 28012019**/
        cntContractDTO.setContractTypeO(this.contractTypeO);
        cntContractDTO.setContractTypeOsName(this.contractTypeOsName);
        /**Hoangnh end 28012019**/

        //hienvd: START 7/9/2019
		cntContractDTO.setPriceHTCT(this.priceHTCT);
		cntContractDTO.setMonthHTCT(this.monthHTCT);
		cntContractDTO.setTypeHTCT(this.typeHTCT);
		//hienvd: END 7/9/2019

		//tatph start 8/10/2019
		cntContractDTO.setIsXNXD(this.isXNXD);
		cntContractDTO.setConstructionForm(this.constructionForm);
		cntContractDTO.setCurrentProgess(this.currentProgess);
		cntContractDTO.setHandoverUseDate(this.handoverUseDate);
		cntContractDTO.setWarrantyExpiredDate(this.warrantyExpiredDate);
		cntContractDTO.setStructureFilter(this.structureFilter);
		cntContractDTO.setDescriptionXNXD(this.descriptionXNXD);
		cntContractDTO.setProjectId(this.projectId);
		cntContractDTO.setProjectCode(this.projectCode);
		cntContractDTO.setProjectName(this.projectName);
		cntContractDTO.setExtensionDays(this.extensionDays);
		cntContractDTO.setPaymentExpried(this.paymentExpried);
				//tatph end
		cntContractDTO.setCoefficient(this.coefficient);
        return cntContractDTO;
    }

	public Long getFrameParentId() {
		return frameParentId;
	}

	public void setFrameParentId(Long frameParentId) {
		this.frameParentId = frameParentId;
	}

	public Integer getMoneyType() {
		return moneyType;
	}

	public void setMoneyType(Integer moneyType) {
		this.moneyType = moneyType;
	}

	public Long getProjectContractId() {
		return projectContractId;
	}

	public void setProjectContractId(Long projectContractId) {
		this.projectContractId = projectContractId;
	}
}
