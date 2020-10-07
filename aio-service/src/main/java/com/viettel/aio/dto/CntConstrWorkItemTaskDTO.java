package com.viettel.aio.dto;

import com.viettel.aio.bo.CntConstrWorkItemTaskBO;
import com.viettel.utils.CustomJsonDateDeserializer;
import com.viettel.utils.CustomJsonDateSerializer;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

/**
 *
 * @author hailh10
 */
@SuppressWarnings("serial")
@XmlRootElement(name = "CNT_CONSTR_WORK_ITEM_TASKBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CntConstrWorkItemTaskDTO extends ComsBaseFWDTO<CntConstrWorkItemTaskBO> {

	private Long constructionId;
	private String constructionName;
	private Long updatedGroupId;
	private String updatedGroupName;
	private Long updatedUserId;
	private String updatedUserName;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private Date updatedDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private Date updatedDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private Date updatedDateTo;
	private Long createdGroupId;
	private String createdGroupName;
	private Long createdUserId;
	private String createdUserName;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private Date createdDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private Date createdDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private Date createdDateTo;
	private Long status;
	private String description;
	private Double price;
	private Double unitPrice;
	private Long quantity;
	private Long catUnitId;
	private String catUnitName;
	private Long catTaskId;
	private String catTaskName;
	private String catTaskCode;
	private Long workItemId;
	private String workItemName;
	private String workItemCode;
	private Long cntContractId;
	private String cntContractName;
	private String cntContractCode;
	private Long cntConstrWorkItemTaskId;
	private String constructionCode;
	private String catStationCode;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private Date startingDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private Date completeDate;
	private Double completeValue;
	private Double completeValueWorkItem;
	private String taskCode;
//	hoanm1_20180312_start
	private String complateState;
	private String email;
	private String fullName;
//	hoanm1_20180312_end
	private String sysGroupName;
//	hnx_20180418_start
	private Long isInternal;
	private Long constructorId;
	private String listContractIn;
//	hnx_20180418_end
	private Long type;

	/**hoangnh start 02012018**/
	private String synStatus;
	/**hoangnh start 02012018**/

	//hienvd: START 7/9/2019
	private String stationHTCT;
	public String getStationHTCT() {
		return stationHTCT;
	}
	public void setStationHTCT(String stationHTCT) {
		this.stationHTCT = stationHTCT;
	}
	//hienvd: END 7/9/2019




	@Override
    public CntConstrWorkItemTaskBO toModel() {
        CntConstrWorkItemTaskBO cntConstrWorkItemTaskBO = new CntConstrWorkItemTaskBO();
        cntConstrWorkItemTaskBO.setConstructionId(this.constructionId);
        cntConstrWorkItemTaskBO.setUpdatedGroupId(this.updatedGroupId);
        cntConstrWorkItemTaskBO.setUpdatedUserId(this.updatedUserId);
        cntConstrWorkItemTaskBO.setUpdatedDate(this.updatedDate);
        cntConstrWorkItemTaskBO.setCreatedGroupId(this.createdGroupId);
        cntConstrWorkItemTaskBO.setCreatedUserId(this.createdUserId);
        cntConstrWorkItemTaskBO.setCreatedDate(this.createdDate);
        cntConstrWorkItemTaskBO.setStatus(this.status);
        cntConstrWorkItemTaskBO.setDescription(this.description);
        cntConstrWorkItemTaskBO.setPrice(this.price);
        cntConstrWorkItemTaskBO.setUnitPrice(this.unitPrice);
        cntConstrWorkItemTaskBO.setQuantity(this.quantity);
        cntConstrWorkItemTaskBO.setCatUnitId(this.catUnitId);
        cntConstrWorkItemTaskBO.setCatTaskId(this.catTaskId);
        cntConstrWorkItemTaskBO.setWorkItemId(this.workItemId);
        cntConstrWorkItemTaskBO.setCntContractId(this.cntContractId);
        cntConstrWorkItemTaskBO.setCntConstrWorkItemTaskId(this.cntConstrWorkItemTaskId);
        cntConstrWorkItemTaskBO.setSynStatus(this.synStatus);
        //hienvd: START 7/9/2019
		cntConstrWorkItemTaskBO.setStationHTCT(this.stationHTCT);
		//hienvd: END 7/9/2019

        return cntConstrWorkItemTaskBO;
    }

	@JsonProperty("catTaskCode")
	public String getCatTaskCode() {
		return catTaskCode;
	}

	public void setCatTaskCode(String catTaskCode) {
		this.catTaskCode = catTaskCode;
	}

	@JsonProperty("type")
    public Long getType() {
		return type;
	}

	public void setType(Long type) {
		this.type = type;
	}

	@JsonProperty("constructionId")
    public Long getConstructionId(){
		return constructionId;
    }

    public void setConstructionId(Long constructionId){
		this.constructionId = constructionId;
    }

	@JsonProperty("constructionName")
    public String getConstructionName(){
		return constructionName;
    }

    public void setConstructionName(String constructionName){
		this.constructionName = constructionName;
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

	@JsonProperty("updatedDate")
    public Date getUpdatedDate(){
		return updatedDate;
    }

    public void setUpdatedDate(Date updatedDate){
		this.updatedDate = updatedDate;
    }

	public Date getUpdatedDateFrom() {
    	return updatedDateFrom;
    }

    public void setUpdatedDateFrom(Date updatedDateFrom) {
    	this.updatedDateFrom = updatedDateFrom;
    }

	public Date getUpdatedDateTo() {
    	return updatedDateTo;
    }

    public void setUpdatedDateTo(Date updatedDateTo) {
    	this.updatedDateTo = updatedDateTo;
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

	@JsonProperty("createdDate")
    public Date getCreatedDate(){
		return createdDate;
    }

    public void setCreatedDate(Date createdDate){
		this.createdDate = createdDate;
    }

	public Date getCreatedDateFrom() {
    	return createdDateFrom;
    }

    public void setCreatedDateFrom(Date createdDateFrom) {
    	this.createdDateFrom = createdDateFrom;
    }

	public Date getCreatedDateTo() {
    	return createdDateTo;
    }

    public void setCreatedDateTo(Date createdDateTo) {
    	this.createdDateTo = createdDateTo;
    }

	@JsonProperty("status")
    public Long getStatus(){
		return status;
    }

    public void setStatus(Long status){
		this.status = status;
    }

	@JsonProperty("description")
    public String getDescription(){
		return description;
    }

    public void setDescription(String description){
		this.description = description;
    }

	@JsonProperty("price")
    public Double getPrice(){
		return price;
    }

    public void setPrice(Double price){
		this.price = price;
    }

	@JsonProperty("unitPrice")
    public Double getUnitPrice(){
		return unitPrice;
    }

    public void setUnitPrice(Double unitPrice){
		this.unitPrice = unitPrice;
    }

	@JsonProperty("quantity")
    public Long getQuantity(){
		return quantity;
    }

    public void setQuantity(Long quantity){
		this.quantity = quantity;
    }

	@JsonProperty("catUnitId")
    public Long getCatUnitId(){
		return catUnitId;
    }

    public void setCatUnitId(Long catUnitId){
		this.catUnitId = catUnitId;
    }

	@JsonProperty("catUnitName")
    public String getCatUnitName(){
		return catUnitName;
    }

    public void setCatUnitName(String catUnitName){
		this.catUnitName = catUnitName;
    }

	@JsonProperty("catTaskId")
    public Long getCatTaskId(){
		return catTaskId;
    }

    public void setCatTaskId(Long catTaskId){
		this.catTaskId = catTaskId;
    }

	@JsonProperty("catTaskName")
    public String getCatTaskName(){
		return catTaskName;
    }

    public void setCatTaskName(String catTaskName){
		this.catTaskName = catTaskName;
    }

	@JsonProperty("workItemId")
    public Long getWorkItemId(){
		return workItemId;
    }

    public void setWorkItemId(Long workItemId){
		this.workItemId = workItemId;
    }

	@JsonProperty("workItemName")
    public String getWorkItemName(){
		return workItemName;
    }

    public void setWorkItemName(String workItemName){
		this.workItemName = workItemName;
    }

	@JsonProperty("cntContractId")
    public Long getCntContractId(){
		return cntContractId;
    }

    public void setCntContractId(Long cntContractId){
		this.cntContractId = cntContractId;
    }

	@JsonProperty("cntContractName")
    public String getCntContractName(){
		return cntContractName;
    }

    public void setCntContractName(String cntContractName){
		this.cntContractName = cntContractName;
    }

    @Override
     public Long getFWModelId() {
        return cntConstrWorkItemTaskId;
    }

    @Override
    public String catchName() {
        return getCntConstrWorkItemTaskId().toString();
    }

	@JsonProperty("cntConstrWorkItemTaskId")
    public Long getCntConstrWorkItemTaskId(){
		return cntConstrWorkItemTaskId;
    }

    public void setCntConstrWorkItemTaskId(Long cntConstrWorkItemTaskId){
		this.cntConstrWorkItemTaskId = cntConstrWorkItemTaskId;
    }

    @JsonProperty("constructionCode")
	public String getConstructionCode() {
		return constructionCode;
	}

	public void setConstructionCode(String constructionCode) {
		this.constructionCode = constructionCode;
	}

	  @JsonProperty("catStationCode")
	public String getCatStationCode() {
		return catStationCode;
	}

	public void setCatStationCode(String catStationCode) {
		this.catStationCode = catStationCode;
	}

	@JsonProperty("startingDate")
	public Date getStartingDate() {
		return this.startingDate;
	}

	public void setStartingDate(Date startingDate) {
		this.startingDate = startingDate;
	}

	@JsonProperty("completeDate")
	public Date getCompleteDate() {
		return this.completeDate;
	}

	public void setCompleteDate(Date completeDate) {
		this.completeDate = completeDate;
	}

	@JsonProperty("completeValue")
	public Double getCompleteValue() {
		return this.completeValue;
	}

	public void setCompleteValue(Double completeValue) {
		this.completeValue = completeValue;
	}

	@JsonProperty("workItemCode")
	public String getWorkItemCode() {
		return workItemCode;
	}

	public void setWorkItemCode(String workItemCode) {
		this.workItemCode = workItemCode;
	}


	@JsonProperty("taskCode")
	public String getTaskCode() {
		return taskCode;
	}

	public void setTaskCode(String taskCode) {
		this.taskCode = taskCode;
	}
	
//	hoanm1_20180312_start
	@JsonProperty("complateState")
	public String getComplateState() {
		return complateState;
	}

	public void setComplateState(String complateState) {
		this.complateState = complateState;
	}
	@JsonProperty("email")
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	@JsonProperty("fullName")
	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	@JsonProperty("sysGroupName")
	public String getSysGroupName() {
		return sysGroupName;
	}

	public void setSysGroupName(String sysGroupName) {
		this.sysGroupName = sysGroupName;
	}
//	hoanm1_20180312_end

	@JsonProperty("cntContractCode")
	public String getCntContractCode() {
		return cntContractCode;
	}

	public void setCntContractCode(String cntContractCode) {
		this.cntContractCode = cntContractCode;
	}

	@JsonProperty("completeValueWorkItem")
	public Double getCompleteValueWorkItem() {
		return completeValueWorkItem;
	}

	public void setCompleteValueWorkItem(Double completeValueWorkItem) {
		this.completeValueWorkItem = completeValueWorkItem;
	}

	public Long getIsInternal() {
		return isInternal;
	}

	public void setIsInternal(Long isInternal) {
		this.isInternal = isInternal;
	}

	public Long getConstructorId() {
		return constructorId;
	}

	public void setConstructorId(Long constructorId) {
		this.constructorId = constructorId;
	}

	public String getListContractIn() {
		return listContractIn;
	}

	public void setListContractIn(String listContractIn) {
		this.listContractIn = listContractIn;
	}

	public String getSynStatus() {
		return synStatus;
	}

	public void setSynStatus(String synStatus) {
		this.synStatus = synStatus;
	}
	
	//Huypq-20190919-start
	private String catStationCodeCtct;
	private String catStationCodeViettel;
	private String address;
	private String catProvinceName;
	private String catProvinceCode;
	private String longitude;
	private String latitude;
	private String location;
	private String highHtct;
	private String capexHtct;
	private String partnerName;
	private String stationHtct;
	private String contractHlDate;
	private String paymentFrom;
	private String paymentTo;
	private String paymentPrice;
	private String paymentContinue;
	public String getCatStationCodeCtct() {
		return catStationCodeCtct;
	}
	public void setCatStationCodeCtct(String catStationCodeCtct) {
		this.catStationCodeCtct = catStationCodeCtct;
	}
	public String getCatStationCodeViettel() {
		return catStationCodeViettel;
	}
	public void setCatStationCodeViettel(String catStationCodeViettel) {
		this.catStationCodeViettel = catStationCodeViettel;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getCatProvinceName() {
		return catProvinceName;
	}
	public void setCatProvinceName(String catProvinceName) {
		this.catProvinceName = catProvinceName;
	}
	public String getCatProvinceCode() {
		return catProvinceCode;
	}
	public void setCatProvinceCode(String catProvinceCode) {
		this.catProvinceCode = catProvinceCode;
	}
	public String getLongitude() {
		return longitude;
	}
	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}
	public String getLatitude() {
		return latitude;
	}
	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getHighHtct() {
		return highHtct;
	}
	public void setHighHtct(String highHtct) {
		this.highHtct = highHtct;
	}
	public String getCapexHtct() {
		return capexHtct;
	}
	public void setCapexHtct(String capexHtct) {
		this.capexHtct = capexHtct;
	}
	public String getPartnerName() {
		return partnerName;
	}
	public void setPartnerName(String partnerName) {
		this.partnerName = partnerName;
	}
	public String getStationHtct() {
		return stationHtct;
	}
	public void setStationHtct(String stationHtct) {
		this.stationHtct = stationHtct;
	}
	public String getContractHlDate() {
		return contractHlDate;
	}
	public void setContractHlDate(String contractHlDate) {
		this.contractHlDate = contractHlDate;
	}
	public String getPaymentFrom() {
		return paymentFrom;
	}
	public void setPaymentFrom(String paymentFrom) {
		this.paymentFrom = paymentFrom;
	}
	public String getPaymentTo() {
		return paymentTo;
	}
	public void setPaymentTo(String paymentTo) {
		this.paymentTo = paymentTo;
	}
	public String getPaymentPrice() {
		return paymentPrice;
	}
	public void setPaymentPrice(String paymentPrice) {
		this.paymentPrice = paymentPrice;
	}
	public String getPaymentContinue() {
		return paymentContinue;
	}
	public void setPaymentContinue(String paymentContinue) {
		this.paymentContinue = paymentContinue;
	}
	
	private String contractType;
	private String projectType;
	
	public String getContractType() {
		return contractType;
	}
	public void setContractType(String contractType) {
		this.contractType = contractType;
	}
	public String getProjectType() {
		return projectType;
	}
	public void setProjectType(String projectType) {
		this.projectType = projectType;
	}
	
	private List<String> contractTypeLst;
	public List<String> getContractTypeLst() {
		return contractTypeLst;
	}
	public void setContractTypeLst(List<String> contractTypeLst) {
		this.contractTypeLst = contractTypeLst;
	}
	
	
	//Huy-end
	
}
