package com.viettel.aio.dto;

import com.viettel.aio.bo.CntContractPaymentBO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.utils.CustomJsonDateDeserializer;
import com.viettel.utils.CustomJsonDateSerializer;
import com.viettel.wms.dto.StockTransDTO;
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
@XmlRootElement(name = "CNT_CONTRACT_PAYMENTBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CntContractPaymentDTO extends ComsBaseFWDTO<CntContractPaymentBO> {

	private Long cntContractPaymentId;
	private String paymentPhase;
	private Double paymentPrice;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date paymentDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date paymentDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date paymentDateTo;
	private String paymentMode;
	private String description;
	private Long cntContractId;
	private String cntContractName;
	private Long status;
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
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date createdDate;
	private List<CntConstrWorkItemTaskDTO> lstConstruction;
	private List<UtilAttachDocumentDTO> attachmentLst;
	private Integer moneyType;
	private List<ShipmentDTO> shipmentGoodsLst;
	private List<StockTransDTO> stockTransLst;
	private Double paymentPlanPrice;

    @Override
    public CntContractPaymentBO toModel() {
        CntContractPaymentBO cntContractPaymentBO = new CntContractPaymentBO();
        cntContractPaymentBO.setCntContractPaymentId(this.cntContractPaymentId);
        cntContractPaymentBO.setPaymentPhase(this.paymentPhase);
        cntContractPaymentBO.setPaymentPrice(this.paymentPrice);
        cntContractPaymentBO.setPaymentDate(this.paymentDate);
        cntContractPaymentBO.setPaymentMode(this.paymentMode);
        cntContractPaymentBO.setDescription(this.description);
        cntContractPaymentBO.setCntContractId(this.cntContractId);
        cntContractPaymentBO.setStatus(this.status);
        cntContractPaymentBO.setCreatedUserId(this.createdUserId);
        cntContractPaymentBO.setCreatedGroupId(this.createdGroupId);
        cntContractPaymentBO.setUpdatedDate(this.updatedDate);
        cntContractPaymentBO.setUpdatedUserId(this.updatedUserId);
        cntContractPaymentBO.setUpdatedGroupId(this.updatedGroupId);
        cntContractPaymentBO.setCreatedDate(this.createdDate);
        cntContractPaymentBO.setMoneyType(moneyType);
        cntContractPaymentBO.setPaymentPlanPrice(paymentPlanPrice);
        cntContractPaymentBO.setPaymentDateTo(this.paymentDateTo);
        return cntContractPaymentBO;
    }

    @Override
     public Long getFWModelId() {
        return cntContractPaymentId;
    }

    @Override
    public String catchName() {
        return getCntContractPaymentId().toString();
    }

	@JsonProperty("cntContractPaymentId")
    public Long getCntContractPaymentId(){
		return cntContractPaymentId;
    }

    public void setCntContractPaymentId(Long cntContractPaymentId){
		this.cntContractPaymentId = cntContractPaymentId;
    }

	@JsonProperty("paymentPhase")
    public String getPaymentPhase(){
		return paymentPhase;
    }

    public void setPaymentPhase(String paymentPhase){
		this.paymentPhase = paymentPhase;
    }

	@JsonProperty("paymentPrice")
    public Double getPaymentPrice(){
		return paymentPrice;
    }

    public void setPaymentPrice(Double paymentPrice){
		this.paymentPrice = paymentPrice;
    }

	@JsonProperty("paymentDate")
    public java.util.Date getPaymentDate(){
		return paymentDate;
    }

    public void setPaymentDate(java.util.Date paymentDate){
		this.paymentDate = paymentDate;
    }

	public java.util.Date getPaymentDateFrom() {
    	return paymentDateFrom;
    }

    public void setPaymentDateFrom(java.util.Date paymentDateFrom) {
    	this.paymentDateFrom = paymentDateFrom;
    }

	public java.util.Date getPaymentDateTo() {
    	return paymentDateTo;
    }

    public void setPaymentDateTo(java.util.Date paymentDateTo) {
    	this.paymentDateTo = paymentDateTo;
    }

	@JsonProperty("paymentMode")
    public String getPaymentMode(){
		return paymentMode;
    }

    public void setPaymentMode(String paymentMode){
		this.paymentMode = paymentMode;
    }

	@JsonProperty("description")
    public String getDescription(){
		return description;
    }

    public void setDescription(String description){
		this.description = description;
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

	@JsonProperty("status")
    public Long getStatus(){
		return status;
    }

    public void setStatus(Long status){
		this.status = status;
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
    @JsonProperty("createdDate")
    public java.util.Date getCreatedDate(){
		return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate){
		this.createdDate = createdDate;
    }

    @JsonProperty("attachmentLst")
	public List<UtilAttachDocumentDTO> getAttachmentLst() {
		return attachmentLst;
	}

	public void setAttachmentLst(List<UtilAttachDocumentDTO> attachmentLst) {
		this.attachmentLst = attachmentLst;
	}

	public List<CntConstrWorkItemTaskDTO> getLstConstruction() {
		return lstConstruction;
	}

	public void setLstConstruction(List<CntConstrWorkItemTaskDTO> lstConstruction) {
		this.lstConstruction = lstConstruction;
	}

	public Integer getMoneyType() {
		return moneyType;
	}

	public void setMoneyType(Integer moneyType) {
		this.moneyType = moneyType;
	}

	public List<ShipmentDTO> getShipmentGoodsLst() {
		return shipmentGoodsLst;
	}

	public void setShipmentGoodsLst(List<ShipmentDTO> shipmentGoodsLst) {
		this.shipmentGoodsLst = shipmentGoodsLst;
	}

	public List<StockTransDTO> getStockTransLst() {
		return stockTransLst;
	}

	public void setStockTransLst(List<StockTransDTO> stockTransLst) {
		this.stockTransLst = stockTransLst;
	}

	public Double getPaymentPlanPrice() {
		return paymentPlanPrice;
	}

	public void setPaymentPlanPrice(Double paymentPlanPrice) {
		this.paymentPlanPrice = paymentPlanPrice;
	}	
	
	
	
}
