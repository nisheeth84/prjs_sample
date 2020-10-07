/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.ConstructionBO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

/**
 * @author thuannht
 */
@XmlRootElement(name = "CONSTRUCTIONBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ConstructionDTO extends ComsBaseFWDTO<ConstructionBO> {
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date returnDate;
	private java.lang.String returner;
	private java.lang.Long catStationId;
	private java.lang.Long region;
	private java.lang.Long catConstructionDeployId;
	private java.lang.String status;
	private java.lang.String deployType;
	private java.lang.Long catConstructionTypeId;
	private java.lang.Long updatedGroupId;
	private java.lang.Long updatedUserId;
	private java.util.Date updatedDate;
	private java.lang.Long createdGroupId;
	private java.lang.Long createdUserId;
	private java.util.Date createdDate;
	private java.lang.String approveRevenueDescription;
	private java.lang.String approveRevenueState;
	private java.lang.Long approveRevenueUserId;
	private java.util.Date approveRevenueDate;
	private java.lang.Double approveRevenueValue;
	private java.lang.String approveCompleteDescription;
	private java.lang.String approveCompleteState;
	private java.lang.Long approveCompleteUserId;
	private java.util.Date approveCompleteDate;
	private java.lang.Double approveCompleteValue;
	private java.lang.String completeValue;
	private java.lang.String isReturn;
	private java.lang.String description;
	private java.util.Date broadcastingDate;
	private java.lang.String obstructedContent;
	private java.lang.String obstructedState;
	private java.lang.String isObstructed;
	private java.lang.String startingNote;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date completeDate;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date excpectedCompleteDate;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date startingDate;
	private java.lang.String handoverNote;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date handoverDate;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date excpectedStartingDate;
	private java.lang.String catPartnerId;
	private java.lang.String sysGroupId;
	private java.lang.Long year;
	private java.lang.Long month;
	private java.lang.String name;
	private java.lang.String code;
	private java.lang.Long constructionId;
	private java.lang.String constructionState;
//	hungtd_20181207_start
	private java.lang.String approveDescription;
	private List<Long> listContractionId;
	/**hoangnh --start**/
	private java.lang.Double amountCableRent;
	private java.lang.Double amountCableLive;
	private java.lang.Double totalAmountChest;
	private java.lang.Double priceChest;
	private java.lang.Double totalAmountGate;
	private java.lang.Double priceGate;
	/**hoangnh end**/
	//HuyPq-start
	private java.lang.String approvedAcceptance;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date acceptanceDate;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date approvedAcceptanceDate;
	private Long approvedAcceptanceUserId;
	private List<String> approvedAcceptanceLst;
	
	public List<String> getApprovedAcceptanceLst() {
		return approvedAcceptanceLst;
	}

	public void setApprovedAcceptanceLst(List<String> approvedAcceptanceLst) {
		this.approvedAcceptanceLst = approvedAcceptanceLst;
	}
	public Date getApprovedAcceptanceDate() {
		return approvedAcceptanceDate;
	}

	public void setApprovedAcceptanceDate(Date approvedAcceptanceDate) {
		this.approvedAcceptanceDate = approvedAcceptanceDate;
	}

	public Long getApprovedAcceptanceUserId() {
		return approvedAcceptanceUserId;
	}

	public void setApprovedAcceptanceUserId(Long approvedAcceptanceUserId) {
		this.approvedAcceptanceUserId = approvedAcceptanceUserId;
	}

	public Date getAcceptanceDate() {
		return acceptanceDate;
	}

	public void setAcceptanceDate(Date acceptanceDate) {
		this.acceptanceDate = acceptanceDate;
	}

	public java.lang.String getApprovedAcceptance() {
		return approvedAcceptance;
	}

	public void setApprovedAcceptance(java.lang.String approvedAcceptance) {
		this.approvedAcceptance = approvedAcceptance;
	}

	//Huypq-end
	public List<Long> getListContractionId() {
		return listContractionId;
	}

	public java.lang.Double getTotalAmountChest() {
		return totalAmountChest;
	}

	public void setTotalAmountChest(java.lang.Double totalAmountChest) {
		this.totalAmountChest = totalAmountChest;
	}

	public java.lang.Double getPriceChest() {
		return priceChest;
	}

	public void setPriceChest(java.lang.Double priceChest) {
		this.priceChest = priceChest;
	}

	public java.lang.Double getTotalAmountGate() {
		return totalAmountGate;
	}

	public void setTotalAmountGate(java.lang.Double totalAmountGate) {
		this.totalAmountGate = totalAmountGate;
	}

	public java.lang.Double getPriceGate() {
		return priceGate;
	}

	public void setPriceGate(java.lang.Double priceGate) {
		this.priceGate = priceGate;
	}

	public java.lang.Double getAmountCableRent() {
		return amountCableRent;
	}

	public void setAmountCableRent(java.lang.Double amountCableRent) {
		this.amountCableRent = amountCableRent;
	}

	public java.lang.Double getAmountCableLive() {
		return amountCableLive;
	}

	public void setAmountCableLive(java.lang.Double amountCableLive) {
		this.amountCableLive = amountCableLive;
	}

	public void setListContractionId(List<Long> listContractionId) {
		this.listContractionId = listContractionId;
	}

	public java.lang.String getApproveDescription() {
		return approveDescription;
	}

	public void setApproveDescription(java.lang.String approveDescription) {
		this.approveDescription = approveDescription;
	}

	private Long sysUserId;

	public Long getSysUserId() {
		return sysUserId;
	}

	public void setSysUserId(Long sysUserId) {
		this.sysUserId = sysUserId;
	}
	//TungTT 24/1/2019 start
	private String sysUserName;
    public String getSysUserName() {
		return sysUserName;
	 }

	public void setSysUserName(String sysUserName) {
		this.sysUserName = sysUserName;
	}
	//TungTT 24/1/2019 end
	//	hungtd_20181207_end
	// anhnn20180810
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date receiveRecordsDate;

	private java.lang.String handoverNoteElectric;

	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date handoverDateElectric;
    
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date handoverDateElectricFrom;
    
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date handoverDateElectricTo;
    
	private java.lang.String handoverNoteBuild;
	
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date handoverDateBuild;
	
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date blueprintDate;
	
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date blueprintDateFrom;
	
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date blueprintDateTo;
	
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date buildingPermitDate;
	
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date buildingPermitDateFrom;
	
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date buildingPermitDateTo;
	
	private java.lang.String isBuildingPermit;

    public java.util.Date getReceiveRecordsDate() {
        return receiveRecordsDate;
    }

    public void setReceiveRecordsDate(java.util.Date receiveRecordsDate) {
        this.receiveRecordsDate = receiveRecordsDate;
    }

    // hungnx 20180607 start
    private List<UtilAttachDocumentDTO> fileLst;
    private java.lang.Double price;
    private java.lang.Double amount;
    private Integer moneyType;
    //hungnx 20180621 end
    private String catContructionTypeName;
    //tanqn start 20181105
    private Long constructionTaskId;
    //private Long constructionID;
    private String dateComplete;
    //private String sysGroupID;
    
    //end

    //VietNT_20181204_start
    private Date completeApprovedUpdateDate;
    private Long completeApprovedValue;
    private Long completeApprovedState;
    private String completeApprovedUserId;

    public Long getCompleteApprovedValue() {
        return completeApprovedValue;
    }

    public void setCompleteApprovedValue(Long completeApprovedValue) {
        this.completeApprovedValue = completeApprovedValue;
    }

    public Long getCompleteApprovedState() {
        return completeApprovedState;
    }

    public void setCompleteApprovedState(Long completeApprovedState) {
        this.completeApprovedState = completeApprovedState;
    }

    public String getCompleteApprovedUserId() {
        return completeApprovedUserId;
    }

    public void setCompleteApprovedUserId(String completeApprovedUserId) {
        this.completeApprovedUserId = completeApprovedUserId;
    }

    public Date getCompleteApprovedUpdateDate() {
        return completeApprovedUpdateDate;
    }

    public void setCompleteApprovedUpdateDate(Date completeApprovedUpdateDate) {
        this.completeApprovedUpdateDate = completeApprovedUpdateDate;
    }

    //VietNT_end
//	public String getSysGroupID() {
//		return sysGroupID;
//	}
//
//	public void setSysGroupID(String sysGroupID) {
//		this.sysGroupID = sysGroupID;
//	}

	@Override
    public ConstructionBO toModel() {
        ConstructionBO constructionBO = new ConstructionBO();
        constructionBO.setReturnDate(this.returnDate);
        constructionBO.setReturner(this.returner);
        constructionBO.setCatStationId(this.catStationId);
        constructionBO.setRegion(this.region);
        constructionBO.setCatConstructionDeployId(this.catConstructionDeployId);
        constructionBO.setStatus(this.status);
        constructionBO.setDeployType(this.deployType);
        constructionBO.setCatConstructionTypeId(this.catConstructionTypeId);
        constructionBO.setUpdatedGroupId(this.updatedGroupId);
        constructionBO.setUpdatedUserId(this.updatedUserId);
        constructionBO.setUpdatedDate(this.updatedDate);
        constructionBO.setCreatedGroupId(this.createdGroupId);
        constructionBO.setCreatedUserId(this.createdUserId);
        constructionBO.setCreatedDate(this.createdDate);
        constructionBO.setApproveRevenueDescription(this.approveRevenueDescription);
        constructionBO.setApproveRevenueState(this.approveRevenueState);
        constructionBO.setApproveRevenueUserId(this.approveRevenueUserId);
        constructionBO.setApproveRevenueDate(this.approveRevenueDate);
        constructionBO.setApproveRevenueValue(this.approveRevenueValue);
        constructionBO.setApproveCompleteDescription(this.approveCompleteDescription);
        constructionBO.setApproveCompleteState(this.approveCompleteState);
        constructionBO.setApproveCompleteUserId(this.approveCompleteUserId);
        constructionBO.setApproveCompleteDate(this.approveCompleteDate);
        constructionBO.setApproveCompleteValue(this.approveCompleteValue);
        constructionBO.setCompleteValue(this.completeValue);
        constructionBO.setIsReturn(this.isReturn);
        constructionBO.setDescription(this.description);
        constructionBO.setBroadcastingDate(this.broadcastingDate);
        constructionBO.setObstructedContent(this.obstructedContent);
        constructionBO.setObstructedState(this.obstructedState);
        constructionBO.setIsObstructed(this.isObstructed);
        constructionBO.setStartingNote(this.startingNote);
        constructionBO.setCompleteDate(this.completeDate);
        constructionBO.setExcpectedCompleteDate(this.excpectedCompleteDate);
        constructionBO.setStartingDate(this.startingDate);
        constructionBO.setHandoverNote(this.handoverNote);
        constructionBO.setHandoverDate(this.handoverDate);
        constructionBO.setCatPartnerId(this.catPartnerId);
        constructionBO.setSysGroupId(this.sysGroupId);
        constructionBO.setYear(this.year);
        constructionBO.setMonth(this.month);
        constructionBO.setName(this.name);
        constructionBO.setCode(this.code);
        constructionBO.setConstructionId(this.constructionId);
        constructionBO.setConstructionState(this.constructionState);
        constructionBO.setExcpectedStartingDate(this.excpectedStartingDate);
        // anhnn20180810
        constructionBO.setReceiveRecordsDate(this.receiveRecordsDate);
        // hungnx 20180607 start
        constructionBO.setAmount(this.amount);
        constructionBO.setPrice(price);
        constructionBO.setMoneyType(moneyType);
        // hungnx 20180607 end
        
        //nhantv 22092018 begin
        constructionBO.setBlueprintDate(blueprintDate);
        constructionBO.setBuildingPermitDate(buildingPermitDate);
        constructionBO.setIsBuildingPermit(isBuildingPermit);
        constructionBO.setHandoverNoteElectric(handoverNoteElectric);
        constructionBO.setHandoverDateElectric(handoverDateElectric);
        constructionBO.setHandoverNoteBuild(handoverNoteBuild);
        constructionBO.setHandoverDateBuild(handoverDateBuild);
//        nhantv 22092018 end
		//hoangnh 20181217 start
        constructionBO.setAmountCableLive(this.amountCableLive);
        constructionBO.setAmountCableRent(this.amountCableRent);
        constructionBO.setTotalAmountChest(this.totalAmountChest);
        constructionBO.setPriceChest(this.priceChest);
        constructionBO.setTotalAmountGate(this.totalAmountGate);
        constructionBO.setPriceGate(this.priceGate);
        //hoangnh 20181217 start
        //Huypq-start
        constructionBO.setApprovedAcceptance(this.approvedAcceptance);
        constructionBO.setApproveCompleteDate(this.approveCompleteDate);
        constructionBO.setApproveCompleteUserId(this.approveCompleteUserId);
        //Huypq-end
        return constructionBO;
    }

    public String getCatContructionTypeName() {
        return catContructionTypeName;
    }


    public void setCatContructionTypeName(String catContructionTypeName) {
        this.catContructionTypeName = catContructionTypeName;
    }

    public java.util.Date getExcpectedStartingDate() {
        return excpectedStartingDate;
    }

    public void setExcpectedStartingDate(java.util.Date excpectedStartingDate) {
        this.excpectedStartingDate = excpectedStartingDate;
    }

    public java.lang.String getConstructionState() {
        return constructionState;
    }

    public void setConstructionState(java.lang.String constructionState) {
        this.constructionState = constructionState;
    }

    public java.lang.String getApproveRevenueState() {
        return approveRevenueState;
    }

    public void setApproveRevenueState(java.lang.String approveRevenueState) {
        this.approveRevenueState = approveRevenueState;
    }

    public java.lang.String getApproveCompleteState() {
        return approveCompleteState;
    }

    public void setApproveCompleteState(java.lang.String approveCompleteState) {
        this.approveCompleteState = approveCompleteState;
    }

    public java.util.Date getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(java.util.Date returnDate) {
        this.returnDate = returnDate;
    }

    public java.lang.String getReturner() {
        return returner;
    }

    public void setReturner(java.lang.String returner) {
        this.returner = returner;
    }

    public java.lang.Long getCatStationId() {
        return catStationId;
    }

    public void setCatStationId(java.lang.Long catStationId) {
        this.catStationId = catStationId;
    }

    public java.lang.Long getRegion() {
        return region;
    }

    public void setRegion(java.lang.Long region) {
        this.region = region;
    }

    public java.lang.Long getCatConstructionDeployId() {
        return catConstructionDeployId;
    }

    public void setCatConstructionDeployId(java.lang.Long catConstructionDeployId) {
        this.catConstructionDeployId = catConstructionDeployId;
    }

    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    public java.lang.String getDeployType() {
        return deployType;
    }

    public void setDeployType(java.lang.String deployType) {
        this.deployType = deployType;
    }

    public java.lang.Long getCatConstructionTypeId() {
        return catConstructionTypeId;
    }

    public void setCatConstructionTypeId(java.lang.Long catConstructionTypeId) {
        this.catConstructionTypeId = catConstructionTypeId;
    }

    public java.lang.Long getUpdatedGroupId() {
        return updatedGroupId;
    }

    public void setUpdatedGroupId(java.lang.Long updatedGroupId) {
        this.updatedGroupId = updatedGroupId;
    }

    public java.lang.Long getUpdatedUserId() {
        return updatedUserId;
    }

    public void setUpdatedUserId(java.lang.Long updatedUserId) {
        this.updatedUserId = updatedUserId;
    }

    public java.util.Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(java.util.Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public java.lang.Long getCreatedGroupId() {
        return createdGroupId;
    }

    public void setCreatedGroupId(java.lang.Long createdGroupId) {
        this.createdGroupId = createdGroupId;
    }

    public java.lang.Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(java.lang.Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    public java.lang.String getApproveRevenueDescription() {
        return approveRevenueDescription;
    }

    public void setApproveRevenueDescription(java.lang.String approveRevenueDescription) {
        this.approveRevenueDescription = approveRevenueDescription;
    }

    public java.lang.Long getApproveRevenueUserId() {
        return approveRevenueUserId;
    }

    public void setApproveRevenueUserId(java.lang.Long approveRevenueUserId) {
        this.approveRevenueUserId = approveRevenueUserId;
    }

    public java.util.Date getApproveRevenueDate() {
        return approveRevenueDate;
    }

    public void setApproveRevenueDate(java.util.Date approveRevenueDate) {
        this.approveRevenueDate = approveRevenueDate;
    }

    public java.lang.Double getApproveRevenueValue() {
        return approveRevenueValue;
    }

    public void setApproveRevenueValue(java.lang.Double approveRevenueValue) {
        this.approveRevenueValue = approveRevenueValue;
    }

    public java.lang.String getApproveCompleteDescription() {
        return approveCompleteDescription;
    }

    public void setApproveCompleteDescription(java.lang.String approveCompleteDescription) {
        this.approveCompleteDescription = approveCompleteDescription;
    }

    public java.lang.Long getApproveCompleteUserId() {
        return approveCompleteUserId;
    }

    public void setApproveCompleteUserId(java.lang.Long approveCompleteUserId) {
        this.approveCompleteUserId = approveCompleteUserId;
    }

    public java.util.Date getApproveCompleteDate() {
        return approveCompleteDate;
    }

    public void setApproveCompleteDate(java.util.Date approveCompleteDate) {
        this.approveCompleteDate = approveCompleteDate;
    }

    public java.lang.Double getApproveCompleteValue() {
        return approveCompleteValue;
    }

    public void setApproveCompleteValue(java.lang.Double approveCompleteValue) {
        this.approveCompleteValue = approveCompleteValue;
    }

    public java.lang.String getCompleteValue() {
        return completeValue;
    }

    public void setCompleteValue(java.lang.String completeValue) {
        this.completeValue = completeValue;
    }

    public java.lang.String getIsReturn() {
        return isReturn;
    }

    public void setIsReturn(java.lang.String isReturn) {
        this.isReturn = isReturn;
    }

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    public java.util.Date getBroadcastingDate() {
        return broadcastingDate;
    }

    public void setBroadcastingDate(java.util.Date broadcastingDate) {
        this.broadcastingDate = broadcastingDate;
    }

    public java.lang.String getObstructedContent() {
        return obstructedContent;
    }

    public void setObstructedContent(java.lang.String obstructedContent) {
        this.obstructedContent = obstructedContent;
    }

    public java.lang.String getObstructedState() {
        return obstructedState;
    }

    public void setObstructedState(java.lang.String obstructedState) {
        this.obstructedState = obstructedState;
    }

    public java.lang.String getIsObstructed() {
        return isObstructed;
    }

    public void setIsObstructed(java.lang.String isObstructed) {
        this.isObstructed = isObstructed;
    }

    public java.lang.String getStartingNote() {
        return startingNote;
    }

    public void setStartingNote(java.lang.String startingNote) {
        this.startingNote = startingNote;
    }

    public java.util.Date getCompleteDate() {
        return completeDate;
    }

    public void setCompleteDate(java.util.Date completeDate) {
        this.completeDate = completeDate;
    }

    public java.util.Date getExcpectedCompleteDate() {
        return excpectedCompleteDate;
    }

    public void setExcpectedCompleteDate(java.util.Date excpectedCompleteDate) {
        this.excpectedCompleteDate = excpectedCompleteDate;
    }

    public java.util.Date getStartingDate() {
        return startingDate;
    }

    public void setStartingDate(java.util.Date startingDate) {
        this.startingDate = startingDate;
    }

    public java.lang.String getHandoverNote() {
        return handoverNote;
    }

    public void setHandoverNote(java.lang.String handoverNote) {
        this.handoverNote = handoverNote;
    }

    public java.util.Date getHandoverDate() {
        return handoverDate;
    }

    public void setHandoverDate(java.util.Date handoverDate) {
        this.handoverDate = handoverDate;
    }

    public java.lang.String getCatPartnerId() {
        return catPartnerId;
    }

    public void setCatPartnerId(java.lang.String catPartnerId) {
        this.catPartnerId = catPartnerId;
    }

    public java.lang.String getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.String sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public java.lang.Long getYear() {
        return year;
    }

    public void setYear(java.lang.Long year) {
        this.year = year;
    }

    public java.lang.Long getMonth() {
        return month;
    }

    public void setMonth(java.lang.Long month) {
        this.month = month;
    }

    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
    }

    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    @Override
    public Long getFWModelId() {
        return constructionId;
    }

    @Override
    public String catchName() {
        return getConstructionId().toString();
    }

    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    public List<UtilAttachDocumentDTO> getFileLst() {
        return fileLst;
    }

    public void setFileLst(List<UtilAttachDocumentDTO> fileLst) {
        this.fileLst = fileLst;
    }

    public java.lang.Double getPrice() {
        return price;
    }

    public void setPrice(java.lang.Double price) {
        this.price = price;
    }

    public java.lang.Double getAmount() {
        return amount;
    }

    public void setAmount(java.lang.Double amount) {
        this.amount = amount;
    }

    public Integer getMoneyType() {
        return moneyType;
    }

    public void setMoneyType(Integer moneyType) {
        this.moneyType = moneyType;
    }

	public java.lang.String getHandoverNoteElectric() {
		return handoverNoteElectric;
	}

	public void setHandoverNoteElectric(java.lang.String handoverNoteElectric) {
		this.handoverNoteElectric = handoverNoteElectric;
	}

	public java.util.Date getHandoverDateElectric() {
		return handoverDateElectric;
	}

	public void setHandoverDateElectric(java.util.Date handoverDateElectric) {
		this.handoverDateElectric = handoverDateElectric;
	}

	public java.util.Date getHandoverDateElectricFrom() {
		return handoverDateElectricFrom;
	}

	public void setHandoverDateElectricFrom(java.util.Date handoverDateElectricFrom) {
		this.handoverDateElectricFrom = handoverDateElectricFrom;
	}

	public java.util.Date getHandoverDateElectricTo() {
		return handoverDateElectricTo;
	}

	public void setHandoverDateElectricTo(java.util.Date handoverDateElectricTo) {
		this.handoverDateElectricTo = handoverDateElectricTo;
	}

	public java.lang.String getHandoverNoteBuild() {
		return handoverNoteBuild;
	}

	public void setHandoverNoteBuild(java.lang.String handoverNoteBuild) {
		this.handoverNoteBuild = handoverNoteBuild;
	}

	public java.util.Date getHandoverDateBuild() {
		return handoverDateBuild;
	}

	public void setHandoverDateBuild(java.util.Date handoverDateBuild) {
		this.handoverDateBuild = handoverDateBuild;
	}

	public java.util.Date getBlueprintDate() {
		return blueprintDate;
	}

	public void setBlueprintDate(java.util.Date blueprintDate) {
		this.blueprintDate = blueprintDate;
	}

	public java.util.Date getBlueprintDateFrom() {
		return blueprintDateFrom;
	}

	public void setBlueprintDateFrom(java.util.Date blueprintDateFrom) {
		this.blueprintDateFrom = blueprintDateFrom;
	}

	public java.util.Date getBlueprintDateTo() {
		return blueprintDateTo;
	}

	public void setBlueprintDateTo(java.util.Date blueprintDateTo) {
		this.blueprintDateTo = blueprintDateTo;
	}

	public java.util.Date getBuildingPermitDate() {
		return buildingPermitDate;
	}

	public void setBuildingPermitDate(java.util.Date buildingPermitDate) {
		this.buildingPermitDate = buildingPermitDate;
	}

	public java.util.Date getBuildingPermitDateFrom() {
		return buildingPermitDateFrom;
	}

	public void setBuildingPermitDateFrom(java.util.Date buildingPermitDateFrom) {
		this.buildingPermitDateFrom = buildingPermitDateFrom;
	}

	public java.util.Date getBuildingPermitDateTo() {
		return buildingPermitDateTo;
	}

	public void setBuildingPermitDateTo(java.util.Date buildingPermitDateTo) {
		this.buildingPermitDateTo = buildingPermitDateTo;
	}

	public java.lang.String getIsBuildingPermit() {
		return isBuildingPermit;
	}

	public void setIsBuildingPermit(java.lang.String isBuildingPermit) {
		this.isBuildingPermit = isBuildingPermit;
	}

	public Long getConstructionTaskId() {
		return constructionTaskId;
	}

	public void setConstructionTaskId(Long constructionTaskId) {
		this.constructionTaskId = constructionTaskId;
	}

	public String getDateComplete() {
		return dateComplete;
	}

	public void setDateComplete(String dateComplete) {
		this.dateComplete = dateComplete;
	}

//	public Long getConstructionID() {
//		return constructionID;
//	}
//
//	public void setConstructionID(Long constructionID) {
//		this.constructionID = constructionID;
//	}
    //	hoanm1_20181218_start
	private java.lang.String dateCompleteTC;
	
	public java.lang.String getDateCompleteTC() {
		return dateCompleteTC;
	}

	public void setDateCompleteTC(java.lang.String dateCompleteTC) {
		this.dateCompleteTC = dateCompleteTC;
	}
//	hoanm1_20181218_end
    

}
