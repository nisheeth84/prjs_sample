package com.viettel.aio.dto;

import com.viettel.aio.bo.ShipmentBO;
import com.viettel.utils.CustomJsonDateDeserializer;
import com.viettel.utils.CustomJsonDateSerializer;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author HungNX
 */
@SuppressWarnings("serial")
@XmlRootElement(name = "SHIPMENTBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ShipmentDTO extends ComsBaseFWDTO<ShipmentBO> {

	private String type;
	private String typeShipment;
	private String shiper;
	private String shipPlace;
	private String customsProcedure;
	private String description;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date createdDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date createdDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date createdDateTo;
	private Long createdBy;
	private String status;
	private Long createdDeptId;
	private String createdDeptName;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date cancelDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date cancelDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date cancelDateTo;
	private Long cancelUserId;
	private String cancelUserName;
	private String cancelReasonName;
	private String cancelDescription;
	private Long totalOriginMoney;
	private Long totalFee;
	private String feeDescription;
	private Long totalTax;
	private Long totalMoney;
	private String orderCheckCode;
	private String reportCheckCode;
	private Long updatedBy;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date updatedDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date updatedDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date updatedDateTo;
	private String code;
	private Long contractId;
	private String contractName;
	private Long projInvestProjectId;
	private String projInvestProjectName;
	private String contractCode;
	private String projectCode;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date shipDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date shipDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date shipDateTo;
	private Long shipmentId;
	private String shipmentName;
	private String text;
	private int start;
	private int maxResult;
	private String goodsCode, goodsName, unitTypeName;
	private Long amount, applyTotalMoney, applyPrice;
	private Long shipmentGoodsId;
    @Override
    public ShipmentBO toModel() {
        ShipmentBO shipmentBO = new ShipmentBO();
        shipmentBO.setType(this.type);
        shipmentBO.setShiper(this.shiper);
        shipmentBO.setShipPlace(this.shipPlace);
        shipmentBO.setCustomsProcedure(this.customsProcedure);
        shipmentBO.setDescription(this.description);
        shipmentBO.setCreatedDate(this.createdDate);
        shipmentBO.setCreatedBy(this.createdBy);
        shipmentBO.setStatus(this.status);
        shipmentBO.setCreatedDeptId(this.createdDeptId);
        shipmentBO.setCancelDate(this.cancelDate);
        shipmentBO.setCancelUserId(this.cancelUserId);
        shipmentBO.setCancelReasonName(this.cancelReasonName);
        shipmentBO.setCancelDescription(this.cancelDescription);
        shipmentBO.setTotalOriginMoney(this.totalOriginMoney);
        shipmentBO.setTotalFee(this.totalFee);
        shipmentBO.setFeeDescription(this.feeDescription);
        shipmentBO.setTotalTax(this.totalTax);
        shipmentBO.setTotalMoney(this.totalMoney);
        shipmentBO.setOrderCheckCode(this.orderCheckCode);
        shipmentBO.setReportCheckCode(this.reportCheckCode);
        shipmentBO.setUpdatedBy(this.updatedBy);
        shipmentBO.setUpdatedDate(this.updatedDate);
        shipmentBO.setCode(this.code);
        shipmentBO.setContractId(this.contractId);
        shipmentBO.setProjInvestProjectId(this.projInvestProjectId);
        shipmentBO.setContractCode(this.contractCode);
        shipmentBO.setProjectCode(this.projectCode);
        shipmentBO.setShipDate(this.shipDate);
        shipmentBO.setShipmentId(this.shipmentId);
        return shipmentBO;
    }

	@JsonProperty("type")
    public String getType(){
		return type;
    }

    public void setType(String type){
		this.type = type;
    }

	@JsonProperty("shiper")
    public String getShiper(){
		return shiper;
    }

    public void setShiper(String shiper){
		this.shiper = shiper;
    }

	@JsonProperty("shipPlace")
    public String getShipPlace(){
		return shipPlace;
    }

    public void setShipPlace(String shipPlace){
		this.shipPlace = shipPlace;
    }

	@JsonProperty("customsProcedure")
    public String getCustomsProcedure(){
		return customsProcedure;
    }

    public void setCustomsProcedure(String customsProcedure){
		this.customsProcedure = customsProcedure;
    }

	@JsonProperty("description")
    public String getDescription(){
		return description;
    }

    public void setDescription(String description){
		this.description = description;
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

	@JsonProperty("createdBy")
    public Long getCreatedBy(){
		return createdBy;
    }

    public void setCreatedBy(Long createdBy){
		this.createdBy = createdBy;
    }

	@JsonProperty("status")
    public String getStatus(){
		return status;
    }

    public void setStatus(String status){
		this.status = status;
    }

	@JsonProperty("createdDeptId")
    public Long getCreatedDeptId(){
		return createdDeptId;
    }

    public void setCreatedDeptId(Long createdDeptId){
		this.createdDeptId = createdDeptId;
    }

	@JsonProperty("createdDeptName")
    public String getCreatedDeptName(){
		return createdDeptName;
    }

    public void setCreatedDeptName(String createdDeptName){
		this.createdDeptName = createdDeptName;
    }

	@JsonProperty("cancelDate")
    public java.util.Date getCancelDate(){
		return cancelDate;
    }

    public void setCancelDate(java.util.Date cancelDate){
		this.cancelDate = cancelDate;
    }

	public java.util.Date getCancelDateFrom() {
    	return cancelDateFrom;
    }

    public void setCancelDateFrom(java.util.Date cancelDateFrom) {
    	this.cancelDateFrom = cancelDateFrom;
    }

	public java.util.Date getCancelDateTo() {
    	return cancelDateTo;
    }

    public void setCancelDateTo(java.util.Date cancelDateTo) {
    	this.cancelDateTo = cancelDateTo;
    }

	@JsonProperty("cancelUserId")
    public Long getCancelUserId(){
		return cancelUserId;
    }

    public void setCancelUserId(Long cancelUserId){
		this.cancelUserId = cancelUserId;
    }

	@JsonProperty("cancelUserName")
    public String getCancelUserName(){
		return cancelUserName;
    }

    public void setCancelUserName(String cancelUserName){
		this.cancelUserName = cancelUserName;
    }

	@JsonProperty("cancelReasonName")
    public String getCancelReasonName(){
		return cancelReasonName;
    }

    public void setCancelReasonName(String cancelReasonName){
		this.cancelReasonName = cancelReasonName;
    }

	@JsonProperty("cancelDescription")
    public String getCancelDescription(){
		return cancelDescription;
    }

    public void setCancelDescription(String cancelDescription){
		this.cancelDescription = cancelDescription;
    }

	@JsonProperty("totalOriginMoney")
    public Long getTotalOriginMoney(){
		return totalOriginMoney;
    }

    public void setTotalOriginMoney(Long totalOriginMoney){
		this.totalOriginMoney = totalOriginMoney;
    }

	@JsonProperty("totalFee")
    public Long getTotalFee(){
		return totalFee;
    }

    public void setTotalFee(Long totalFee){
		this.totalFee = totalFee;
    }

	@JsonProperty("feeDescription")
    public String getFeeDescription(){
		return feeDescription;
    }

    public void setFeeDescription(String feeDescription){
		this.feeDescription = feeDescription;
    }

	@JsonProperty("totalTax")
    public Long getTotalTax(){
		return totalTax;
    }

    public void setTotalTax(Long totalTax){
		this.totalTax = totalTax;
    }

	@JsonProperty("totalMoney")
    public Long getTotalMoney(){
		return totalMoney;
    }

    public void setTotalMoney(Long totalMoney){
		this.totalMoney = totalMoney;
    }

	@JsonProperty("orderCheckCode")
    public String getOrderCheckCode(){
		return orderCheckCode;
    }

    public void setOrderCheckCode(String orderCheckCode){
		this.orderCheckCode = orderCheckCode;
    }

	@JsonProperty("reportCheckCode")
    public String getReportCheckCode(){
		return reportCheckCode;
    }

    public void setReportCheckCode(String reportCheckCode){
		this.reportCheckCode = reportCheckCode;
    }

	@JsonProperty("updatedBy")
    public Long getUpdatedBy(){
		return updatedBy;
    }

    public void setUpdatedBy(Long updatedBy){
		this.updatedBy = updatedBy;
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

	@JsonProperty("code")
    public String getCode(){
		return code;
    }

    public void setCode(String code){
		this.code = code;
    }

	@JsonProperty("cntContractId")
    public Long getContractId(){
		return contractId;
    }

    public void setContractId(Long contractId){
		this.contractId = contractId;
    }

	@JsonProperty("contractName")
    public String getContractName(){
		return contractName;
    }

    public void setContractName(String contractName){
		this.contractName = contractName;
    }

	@JsonProperty("projInvestProjectId")
    public Long getProjInvestProjectId(){
		return projInvestProjectId;
    }

    public void setProjInvestProjectId(Long projInvestProjectId){
		this.projInvestProjectId = projInvestProjectId;
    }

	@JsonProperty("projInvestProjectName")
    public String getProjInvestProjectName(){
		return projInvestProjectName;
    }

    public void setProjInvestProjectName(String projInvestProjectName){
		this.projInvestProjectName = projInvestProjectName;
    }

	@JsonProperty("contractCode")
    public String getContractCode(){
		return contractCode;
    }

    public void setContractCode(String contractCode){
		this.contractCode = contractCode;
    }

	@JsonProperty("projectCode")
    public String getProjectCode(){
		return projectCode;
    }

    public void setProjectCode(String projectCode){
		this.projectCode = projectCode;
    }

	@JsonProperty("shipDate")
    public java.util.Date getShipDate(){
		return shipDate;
    }

    public void setShipDate(java.util.Date shipDate){
		this.shipDate = shipDate;
    }

	public java.util.Date getShipDateFrom() {
    	return shipDateFrom;
    }

    public void setShipDateFrom(java.util.Date shipDateFrom) {
    	this.shipDateFrom = shipDateFrom;
    }

	public java.util.Date getShipDateTo() {
    	return shipDateTo;
    }

    public void setShipDateTo(java.util.Date shipDateTo) {
    	this.shipDateTo = shipDateTo;
    }

	@JsonProperty("shipmentId")
    public Long getShipmentId(){
		return shipmentId;
    }

    public void setShipmentId(Long shipmentId){
		this.shipmentId = shipmentId;
    }

	@JsonProperty("shipmentName")
    public String getShipmentName(){
		return shipmentName;
    }

    public void setShipmentName(String shipmentName){
		this.shipmentName = shipmentName;
    }

	@JsonProperty("start")
	public int getStart() {
		return start;
	}

	public void setStart(int start) {
		this.start = start;
	}

	@JsonProperty("maxResult")
	public int getMaxResult() {
		return maxResult;
	}

	public void setMaxResult(int maxResult) {
		this.maxResult = maxResult;
	}

//	@JsonProperty("text")
//	public String getText() {
//		if (this.value != null && this.name != null) {
//			if (!this.value.contains(ApplicationConstants.SEARCH_MORE) && !this.name.contains(ApplicationConstants.SEARCH_MORE)) {
//				return this.value != null ? this.value + " - " + this.name : this.name;
//			} else {
//				return ApplicationConstants.SEARCH_MORE;
//			}
//		} else {
//			return this.name;
//		}
//	}

	public void setText(String text) {
		this.text = text;
	}

	@Override
	public String catchName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Long getFWModelId() {
		// TODO Auto-generated method stub
		return null;
	}

	@JsonProperty("typeShipment")
	public String getTypeShipment() {
		return typeShipment;
	}

	public void setTypeShipment(String typeShipment) {
		this.typeShipment = typeShipment;
	}

	@JsonProperty("goodsCode")
	public String getGoodsCode() {
		return goodsCode;
	}

	public void setGoodsCode(String goodsCode) {
		this.goodsCode = goodsCode;
	}
	
	@JsonProperty("goodsName")
	public String getGoodsName() {
		return goodsName;
	}

	public void setGoodsName(String goodsName) {
		this.goodsName = goodsName;
	}

	@JsonProperty("unitTypeName")
	public String getUnitTypeName() {
		return unitTypeName;
	}

	public void setUnitTypeName(String unitTypeName) {
		this.unitTypeName = unitTypeName;
	}

	@JsonProperty("amount")
	public Long getAmount() {
		return amount;
	}

	public void setAmount(Long amount) {
		this.amount = amount;
	}

	@JsonProperty("applyTotalMoney")
	public Long getApplyTotalMoney() {
		return applyTotalMoney;
	}

	public void setApplyTotalMoney(Long applyTotalMoney) {
		this.applyTotalMoney = applyTotalMoney;
	}

	@JsonProperty("applyPrice")
	public Long getApplyPrice() {
		return applyPrice;
	}

	public void setApplyPrice(Long applyPrice) {
		this.applyPrice = applyPrice;
	}

	public Long getShipmentGoodsId() {
		return shipmentGoodsId;
	}

	public void setShipmentGoodsId(Long shipmentGoodsId) {
		this.shipmentGoodsId = shipmentGoodsId;
	}
}
