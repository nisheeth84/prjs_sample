package com.viettel.aio.dto;

import com.viettel.aio.bo.CntContractAcceptanceBO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.utils.CustomJsonDateDeserializer;
import com.viettel.utils.CustomJsonDateSerializer;
import com.viettel.aio.dto.ShipmentDTO;
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
@XmlRootElement(name = "CNT_CONTRACT_ACCEPTANCEBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CntContractAcceptanceDTO extends ComsBaseFWDTO<CntContractAcceptanceBO> {

	private Long updatedGroupId;
	private String updatedGroupName;
	private Long updatedUserId;
	private String updatedUserName;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date updatedDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date updatedDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date updatedDateTo;
	private Long createdGroupId;
	private String createdGroupName;
	private Long createdUserId;
	private String createdUserName;
	private Long status;
	private Long cntContractId;
	private String cntContractName;
	private String description;
	private String acceptanceResult;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date acceptanceDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date acceptanceDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date acceptanceDateTo;
	private String acceptanceSigner;
	private Long cntContractAcceptanceId;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date createdDate;
	private List<UtilAttachDocumentDTO> attachmentLst;
	private List<CntConstrWorkItemTaskDTO> lstConstruction;
	private List<ShipmentDTO> shipmentGoodsLst;
	private List<StockTransDTO> stockTransLst;

    @Override
    public CntContractAcceptanceBO toModel() {
        CntContractAcceptanceBO cntContractAcceptanceBO = new CntContractAcceptanceBO();
        cntContractAcceptanceBO.setUpdatedGroupId(this.updatedGroupId);
        cntContractAcceptanceBO.setUpdatedUserId(this.updatedUserId);
        cntContractAcceptanceBO.setUpdatedDate(this.updatedDate);
        cntContractAcceptanceBO.setCreatedGroupId(this.createdGroupId);
        cntContractAcceptanceBO.setCreatedUserId(this.createdUserId);
        cntContractAcceptanceBO.setStatus(this.status);
        cntContractAcceptanceBO.setCntContractId(this.cntContractId);
        cntContractAcceptanceBO.setDescription(this.description);
        cntContractAcceptanceBO.setAcceptanceResult(this.acceptanceResult);
        cntContractAcceptanceBO.setAcceptanceDate(this.acceptanceDate);
        cntContractAcceptanceBO.setAcceptanceSigner(this.acceptanceSigner);
        cntContractAcceptanceBO.setCntContractAcceptanceId(this.cntContractAcceptanceId);
        cntContractAcceptanceBO.setCreatedDate(this.createdDate);
        return cntContractAcceptanceBO;
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

	@JsonProperty("status")
    public Long getStatus(){
		return status;
    }

    public void setStatus(Long status){
		this.status = status;
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

	@JsonProperty("description")
    public String getDescription(){
		return description;
    }

    public void setDescription(String description){
		this.description = description;
    }

	@JsonProperty("acceptanceResult")
    public String getAcceptanceResult(){
		return acceptanceResult;
    }

    public void setAcceptanceResult(String acceptanceResult){
		this.acceptanceResult = acceptanceResult;
    }

	@JsonProperty("acceptanceDate")
    public java.util.Date getAcceptanceDate(){
		return acceptanceDate;
    }

    public void setAcceptanceDate(java.util.Date acceptanceDate){
		this.acceptanceDate = acceptanceDate;
    }

	public java.util.Date getAcceptanceDateFrom() {
    	return acceptanceDateFrom;
    }

    public void setAcceptanceDateFrom(java.util.Date acceptanceDateFrom) {
    	this.acceptanceDateFrom = acceptanceDateFrom;
    }

	public java.util.Date getAcceptanceDateTo() {
    	return acceptanceDateTo;
    }

    public void setAcceptanceDateTo(java.util.Date acceptanceDateTo) {
    	this.acceptanceDateTo = acceptanceDateTo;
    }

	@JsonProperty("acceptanceSigner")
    public String getAcceptanceSigner(){
		return acceptanceSigner;
    }

    public void setAcceptanceSigner(String acceptanceSigner){
		this.acceptanceSigner = acceptanceSigner;
    }

    @Override
     public Long getFWModelId() {
        return cntContractAcceptanceId;
    }

    @Override
    public String catchName() {
        return getCntContractAcceptanceId().toString();
    }

	@JsonProperty("cntContractAcceptanceId")
    public Long getCntContractAcceptanceId(){
		return cntContractAcceptanceId;
    }

    public void setCntContractAcceptanceId(Long cntContractAcceptanceId){
		this.cntContractAcceptanceId = cntContractAcceptanceId;
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
	
}
