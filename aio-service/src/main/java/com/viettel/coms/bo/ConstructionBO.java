/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import com.viettel.coms.dto.ConstructionDTO;
import com.viettel.service.base.model.BaseFWModelImpl;

@Entity
@Table(name = "CONSTRUCTION")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class ConstructionBO extends BaseFWModelImpl {

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
    private java.util.Date completeDate;
    private java.util.Date excpectedCompleteDate;
    private java.util.Date startingDate;
    private java.lang.String handoverNote;
    private java.util.Date handoverDate;
    private java.lang.String catPartnerId;
    private java.lang.String sysGroupId;
    private java.lang.Long year;
    private java.lang.Long month;
    private java.lang.String name;
    private java.lang.String code;
    private java.lang.Long constructionId;
    private java.lang.String constructionState;
//anhnn20180810

	private java.util.Date receiveRecordsDate;
    
  //nhantv 22092018 begin
	private java.util.Date blueprintDate;
	private java.util.Date buildingPermitDate;
	private java.lang.String isBuildingPermit;
	private java.lang.String handoverNoteElectric;
	private java.util.Date handoverDateElectric;
	private java.lang.String handoverNoteBuild;
	private java.util.Date handoverDateBuild;
	//nhantv 22092018 end   
	//Huypq-start
	private String approvedAcceptance;
	private Date acceptanceDate;
	private Date approvedAcceptanceDate;
	private Long approvedAcceptanceUserId;
	
	@Column(name = "APPROVED_ACCEPTANCE_DATE")
	public Date getApprovedAcceptanceDate() {
		return approvedAcceptanceDate;
	}

	public void setApprovedAcceptanceDate(Date approvedAcceptanceDate) {
		this.approvedAcceptanceDate = approvedAcceptanceDate;
	}
	@Column(name = "APPROVED_ACCEPTANCE_USER_ID")
	public Long getApprovedAcceptanceUserId() {
		return approvedAcceptanceUserId;
	}

	public void setApprovedAcceptanceUserId(Long approvedAcceptanceUserId) {
		this.approvedAcceptanceUserId = approvedAcceptanceUserId;
	}

	@Column(name = "ACCEPTANCE_DATE")
	public Date getAcceptanceDate() {
		return acceptanceDate;
	}

	public void setAcceptanceDate(Date acceptanceDate) {
		this.acceptanceDate = acceptanceDate;
	}

	@Column(name = "APPROVED_ACCEPTANCE")
	public String getApprovedAcceptance() {
		return approvedAcceptance;
	}

	public void setApprovedAcceptance(String approvedAcceptance) {
		this.approvedAcceptance = approvedAcceptance;
	}

	//Huypq-end
    @Column(name = "RECEIVE_RECORDS_DATE", length = 7)
    public java.util.Date getReceiveRecordsDate() {
        return receiveRecordsDate;
    }

    public void setReceiveRecordsDate(java.util.Date receiveRecordsDate) {
        this.receiveRecordsDate = receiveRecordsDate;
    }

    //hungnx 20180621 start
    private java.lang.Double price;
    private java.lang.Double amount;
    private Integer moneyType;
    //hungnx 20180621 end
    private java.util.Date excpectedStartingDate;
	  //hoangnh 20181217 start
    private java.lang.Double amountCableRent;
    private java.lang.Double amountCableLive;
    private java.lang.Double totalAmountChest;
	private java.lang.Double priceChest;
	private java.lang.Double totalAmountGate;
	private java.lang.Double priceGate;
    //hoangnh 20181217 end
    
    @Column(name = "AMOUNT_CABLE_RENT", length = 22)
    public java.lang.Double getAmountCableRent() {
		return amountCableRent;
	}

	public void setAmountCableRent(java.lang.Double amountCableRent) {
		this.amountCableRent = amountCableRent;
	}
	
	@Column(name = "AMOUNT_CABLE_LIVE", length = 22)
	public java.lang.Double getAmountCableLive() {
		return amountCableLive;
	}

	public void setAmountCableLive(java.lang.Double amountCableLive) {
		this.amountCableLive = amountCableLive;
	}
	
	@Column(name = "TOTAL_AMOUNT_CHEST", length = 22)
	public java.lang.Double getTotalAmountChest() {
		return totalAmountChest;
	}

	public void setTotalAmountChest(java.lang.Double totalAmountChest) {
		this.totalAmountChest = totalAmountChest;
	}
	
	@Column(name = "PRICE_CHEST", length = 22)
	public java.lang.Double getPriceChest() {
		return priceChest;
	}

	public void setPriceChest(java.lang.Double priceChest) {
		this.priceChest = priceChest;
	}
	
	@Column(name = "TOTAL_AMOUNT_GATE", length = 22)
	public java.lang.Double getTotalAmountGate() {
		return totalAmountGate;
	}

	public void setTotalAmountGate(java.lang.Double totalAmountGate) {
		this.totalAmountGate = totalAmountGate;
	}

	@Column(name = "PRICE_GATE", length = 22)
	public java.lang.Double getPriceGate() {
		return priceGate;
	}

	public void setPriceGate(java.lang.Double priceGate) {
		this.priceGate = priceGate;
	}
    @Column(name = "EXCPECTED_STARTING_DATE", length = 2)
    public java.util.Date getExcpectedStartingDate() {
        return excpectedStartingDate;
    }

    public void setExcpectedStartingDate(java.util.Date excpectedStartingDate) {
        this.excpectedStartingDate = excpectedStartingDate;
    }

    @Column(name = "CONSTRUCTION_STATE", length = 2)
    public java.lang.String getConstructionState() {
        return constructionState;
    }

    public void setConstructionState(java.lang.String constructionState) {
        this.constructionState = constructionState;
    }

    @Column(name = "RETURN_DATE", length = 7)
    public java.util.Date getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(java.util.Date returnDate) {
        this.returnDate = returnDate;
    }

    @Column(name = "RETURNER", length = 4000)
    public java.lang.String getReturner() {
        return returner;
    }

    public void setReturner(java.lang.String returner) {
        this.returner = returner;
    }

    @Column(name = "CAT_STATION_ID", length = 22)
    public java.lang.Long getCatStationId() {
        return catStationId;
    }

    public void setCatStationId(java.lang.Long catStationId) {
        this.catStationId = catStationId;
    }

    @Column(name = "REGION", length = 22)
    public java.lang.Long getRegion() {
        return region;
    }

    public void setRegion(java.lang.Long region) {
        this.region = region;
    }

    @Column(name = "CAT_CONSTRUCTION_DEPLOY_ID", length = 22)
    public java.lang.Long getCatConstructionDeployId() {
        return catConstructionDeployId;
    }

    public void setCatConstructionDeployId(java.lang.Long catConstructionDeployId) {
        this.catConstructionDeployId = catConstructionDeployId;
    }

    @Column(name = "STATUS", length = 2)
    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    @Column(name = "DEPLOY_TYPE", length = 2)
    public java.lang.String getDeployType() {
        return deployType;
    }

    public void setDeployType(java.lang.String deployType) {
        this.deployType = deployType;
    }

    @Column(name = "CAT_CONSTRUCTION_TYPE_ID", length = 22)
    public java.lang.Long getCatConstructionTypeId() {
        return catConstructionTypeId;
    }

    public void setCatConstructionTypeId(java.lang.Long catConstructionTypeId) {
        this.catConstructionTypeId = catConstructionTypeId;
    }

    @Column(name = "UPDATED_GROUP_ID", length = 22)
    public java.lang.Long getUpdatedGroupId() {
        return updatedGroupId;
    }

    public void setUpdatedGroupId(java.lang.Long updatedGroupId) {
        this.updatedGroupId = updatedGroupId;
    }

    @Column(name = "UPDATED_USER_ID", length = 22)
    public java.lang.Long getUpdatedUserId() {
        return updatedUserId;
    }

    public void setUpdatedUserId(java.lang.Long updatedUserId) {
        this.updatedUserId = updatedUserId;
    }

    @Column(name = "UPDATED_DATE", length = 7)
    public java.util.Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(java.util.Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    @Column(name = "CREATED_GROUP_ID", length = 22)
    public java.lang.Long getCreatedGroupId() {
        return createdGroupId;
    }

    public void setCreatedGroupId(java.lang.Long createdGroupId) {
        this.createdGroupId = createdGroupId;
    }

    @Column(name = "CREATED_USER_ID", length = 22)
    public java.lang.Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(java.lang.Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    @Column(name = "CREATED_DATE", length = 7)
    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    @Column(name = "APPROVE_REVENUE_DESCRIPTION", length = 2000)
    public java.lang.String getApproveRevenueDescription() {
        return approveRevenueDescription;
    }

    public void setApproveRevenueDescription(java.lang.String approveRevenueDescription) {
        this.approveRevenueDescription = approveRevenueDescription;
    }

    @Column(name = "APPROVE_REVENUE_STATE", length = 2)
    public java.lang.String getApproveRevenueState() {
        return approveRevenueState;
    }

    public void setApproveRevenueState(java.lang.String approveRevenueState) {
        this.approveRevenueState = approveRevenueState;
    }

    @Column(name = "APPROVE_REVENUE_USER_ID", length = 22)
    public java.lang.Long getApproveRevenueUserId() {
        return approveRevenueUserId;
    }

    public void setApproveRevenueUserId(java.lang.Long approveRevenueUserId) {
        this.approveRevenueUserId = approveRevenueUserId;
    }

    @Column(name = "APPROVE_REVENUE_DATE", length = 7)
    public java.util.Date getApproveRevenueDate() {
        return approveRevenueDate;
    }

    public void setApproveRevenueDate(java.util.Date approveRevenueDate) {
        this.approveRevenueDate = approveRevenueDate;
    }

    @Column(name = "APPROVE_REVENUE_VALUE", length = 22)
    public java.lang.Double getApproveRevenueValue() {
        return approveRevenueValue;
    }

    public void setApproveRevenueValue(java.lang.Double approveRevenueValue) {
        this.approveRevenueValue = approveRevenueValue;
    }

    @Column(name = "APPROVE_COMPLETE_DESCRIPTION", length = 2000)
    public java.lang.String getApproveCompleteDescription() {
        return approveCompleteDescription;
    }

    public void setApproveCompleteDescription(java.lang.String approveCompleteDescription) {
        this.approveCompleteDescription = approveCompleteDescription;
    }

    @Column(name = "APPROVE_COMPLETE_STATE", length = 2)
    public java.lang.String getApproveCompleteState() {
        return approveCompleteState;
    }

    public void setApproveCompleteState(java.lang.String approveCompleteState) {
        this.approveCompleteState = approveCompleteState;
    }

    @Column(name = "APPROVE_COMPLETE_USER_ID", length = 22)
    public java.lang.Long getApproveCompleteUserId() {
        return approveCompleteUserId;
    }

    public void setApproveCompleteUserId(java.lang.Long approveCompleteUserId) {
        this.approveCompleteUserId = approveCompleteUserId;
    }

    @Column(name = "APPROVE_COMPLETE_DATE", length = 7)
    public java.util.Date getApproveCompleteDate() {
        return approveCompleteDate;
    }

    public void setApproveCompleteDate(java.util.Date approveCompleteDate) {
        this.approveCompleteDate = approveCompleteDate;
    }

    @Column(name = "APPROVE_COMPLETE_VALUE", length = 22)
    public java.lang.Double getApproveCompleteValue() {
        return approveCompleteValue;
    }

    public void setApproveCompleteValue(java.lang.Double approveCompleteValue) {
        this.approveCompleteValue = approveCompleteValue;
    }

    @Column(name = "COMPLETE_VALUE", length = 10)
    public java.lang.String getCompleteValue() {
        return completeValue;
    }

    public void setCompleteValue(java.lang.String completeValue) {
        this.completeValue = completeValue;
    }

    @Column(name = "IS_RETURN", length = 2)
    public java.lang.String getIsReturn() {
        return isReturn;
    }

    public void setIsReturn(java.lang.String isReturn) {
        this.isReturn = isReturn;
    }

    @Column(name = "DESCRIPTION", length = 1000)
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @Column(name = "BROADCASTING_DATE", length = 7)
    public java.util.Date getBroadcastingDate() {
        return broadcastingDate;
    }

    public void setBroadcastingDate(java.util.Date broadcastingDate) {
        this.broadcastingDate = broadcastingDate;
    }

    @Column(name = "OBSTRUCTED_CONTENT", length = 4000)
    public java.lang.String getObstructedContent() {
        return obstructedContent;
    }

    public void setObstructedContent(java.lang.String obstructedContent) {
        this.obstructedContent = obstructedContent;
    }

    @Column(name = "OBSTRUCTED_STATE", length = 2)
    public java.lang.String getObstructedState() {
        return obstructedState;
    }

    public void setObstructedState(java.lang.String obstructedState) {
        this.obstructedState = obstructedState;
    }

    @Column(name = "IS_OBSTRUCTED", length = 2)
    public java.lang.String getIsObstructed() {
        return isObstructed;
    }

    public void setIsObstructed(java.lang.String isObstructed) {
        this.isObstructed = isObstructed;
    }

    @Column(name = "STARTING_NOTE", length = 4000)
    public java.lang.String getStartingNote() {
        return startingNote;
    }

    public void setStartingNote(java.lang.String startingNote) {
        this.startingNote = startingNote;
    }

    @Column(name = "COMPLETE_DATE", length = 7)
    public java.util.Date getCompleteDate() {
        return completeDate;
    }

    public void setCompleteDate(java.util.Date completeDate) {
        this.completeDate = completeDate;
    }

    @Column(name = "EXCPECTED_COMPLETE_DATE", length = 7)
    public java.util.Date getExcpectedCompleteDate() {
        return excpectedCompleteDate;
    }

    public void setExcpectedCompleteDate(java.util.Date excpectedCompleteDate) {
        this.excpectedCompleteDate = excpectedCompleteDate;
    }

    @Column(name = "STARTING_DATE", length = 7)
    public java.util.Date getStartingDate() {
        return startingDate;
    }

    public void setStartingDate(java.util.Date startingDate) {
        this.startingDate = startingDate;
    }

    @Column(name = "HANDOVER_NOTE", length = 4000)
    public java.lang.String getHandoverNote() {
        return handoverNote;
    }

    public void setHandoverNote(java.lang.String handoverNote) {
        this.handoverNote = handoverNote;
    }

    @Column(name = "HANDOVER_DATE", length = 7)
    public java.util.Date getHandoverDate() {
        return handoverDate;
    }

    public void setHandoverDate(java.util.Date handoverDate) {
        this.handoverDate = handoverDate;
    }

    @Column(name = "CAT_PARTNER_ID", length = 10)
    public java.lang.String getCatPartnerId() {
        return catPartnerId;
    }

    public void setCatPartnerId(java.lang.String catPartnerId) {
        this.catPartnerId = catPartnerId;
    }

    @Column(name = "SYS_GROUP_ID", length = 10)
    public java.lang.String getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.String sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    @Column(name = "YEAR", length = 22)
    public java.lang.Long getYear() {
        return year;
    }

    public void setYear(java.lang.Long year) {
        this.year = year;
    }

    @Column(name = "MONTH", length = 22)
    public java.lang.Long getMonth() {
        return month;
    }

    public void setMonth(java.lang.Long month) {
        this.month = month;
    }

    @Column(name = "NAME", length = 400)
    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
    }

    @Column(name = "CODE", length = 100)
    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "CONSTRUCTION_SEQ")})
    @Column(name = "CONSTRUCTION_ID", length = 22)
    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    //hungnx 20180621 start
    @Column(name = "PRICE", length = 22)
    public java.lang.Double getPrice() {
        return price;
    }

    public void setPrice(java.lang.Double price) {
        this.price = price;
    }

    @Column(name = "AMOUNT", length = 22)
    public java.lang.Double getAmount() {
        return amount;
    }

    public void setAmount(java.lang.Double amount) {
        this.amount = amount;
    }

    @Column(name = "MONEY_TYPE", length = 6)
    public Integer getMoneyType() {
        return moneyType;
    }

    public void setMoneyType(Integer moneyType) {
        this.moneyType = moneyType;
    }
    
   
	
	
	
	
	

	@Column(name = "BLUEPRINT_DATE", length = 7)
    public java.util.Date getBlueprintDate() {
		return blueprintDate;
	}

	public void setBlueprintDate(java.util.Date blueprintDate) {
		this.blueprintDate = blueprintDate;
	}

	@Column(name = "BUILDING_PERMIT_DATE", length = 7)
	public java.util.Date getBuildingPermitDate() {
		return buildingPermitDate;
	}

	public void setBuildingPermitDate(java.util.Date buildingPermitDate) {
		this.buildingPermitDate = buildingPermitDate;
	}

	@Column(name = "IS_BUILDING_PERMIT", length = 2)
	public java.lang.String getIsBuildingPermit() {
		return isBuildingPermit;
	}

	public void setIsBuildingPermit(java.lang.String isBuildingPermit) {
		this.isBuildingPermit = isBuildingPermit;
	}

	@Column(name = "HANDOVER_NOTE_ELECTRIC", length = 2000)
	public java.lang.String getHandoverNoteElectric() {
		return handoverNoteElectric;
	}

	public void setHandoverNoteElectric(java.lang.String handoverNoteElectric) {
		this.handoverNoteElectric = handoverNoteElectric;
	}

	@Column(name = "HANDOVER_DATE_ELECTRIC", length = 7)
	public java.util.Date getHandoverDateElectric() {
		return handoverDateElectric;
	}

	public void setHandoverDateElectric(java.util.Date handoverDateElectric) {
		this.handoverDateElectric = handoverDateElectric;
	}

	@Column(name = "HANDOVER_NOTE_BUILD", length = 2000)
	public java.lang.String getHandoverNoteBuild() {
		return handoverNoteBuild;
	}

	public void setHandoverNoteBuild(java.lang.String handoverNoteBuild) {
		this.handoverNoteBuild = handoverNoteBuild;
	}

	@Column(name = "HANDOVER_DATE_BUILD", length = 7)
	public java.util.Date getHandoverDateBuild() {
		return handoverDateBuild;
	}

	public void setHandoverDateBuild(java.util.Date handoverDateBuild) {
		this.handoverDateBuild = handoverDateBuild;
	}

	//hungnx 20180621 end
    @Override
    public ConstructionDTO toDTO() {
        ConstructionDTO constructionDTO = new ConstructionDTO();
        // set cac gia tri
        constructionDTO.setReturnDate(this.returnDate);
        constructionDTO.setReturner(this.returner);
        constructionDTO.setCatStationId(this.catStationId);
        constructionDTO.setRegion(this.region);
        constructionDTO.setCatConstructionDeployId(this.catConstructionDeployId);
        constructionDTO.setStatus(this.status);
        constructionDTO.setDeployType(this.deployType);

        constructionDTO.setCatConstructionTypeId(this.catConstructionTypeId);
        constructionDTO.setUpdatedGroupId(this.updatedGroupId);
        constructionDTO.setUpdatedUserId(this.updatedUserId);
        constructionDTO.setUpdatedDate(this.updatedDate);
        constructionDTO.setCreatedGroupId(this.createdGroupId);
        constructionDTO.setCreatedUserId(this.createdUserId);
        constructionDTO.setCreatedDate(this.createdDate);
        constructionDTO.setApproveRevenueDescription(this.approveRevenueDescription);
        constructionDTO.setApproveRevenueUserId(this.approveRevenueUserId);
        constructionDTO.setApproveRevenueDate(this.approveRevenueDate);
        constructionDTO.setApproveRevenueValue(this.approveRevenueValue);
        constructionDTO.setApproveCompleteDescription(this.approveCompleteDescription);
        constructionDTO.setApproveCompleteUserId(this.approveCompleteUserId);
        constructionDTO.setApproveCompleteDate(this.approveCompleteDate);
        constructionDTO.setApproveCompleteValue(this.approveCompleteValue);
        constructionDTO.setCompleteValue(this.completeValue);
        constructionDTO.setIsReturn(this.isReturn);
        constructionDTO.setDescription(this.description);
        constructionDTO.setBroadcastingDate(this.broadcastingDate);
        constructionDTO.setObstructedContent(this.obstructedContent);
        constructionDTO.setObstructedState(this.obstructedState);
        constructionDTO.setIsObstructed(this.isObstructed);
        constructionDTO.setStartingNote(this.startingNote);
        constructionDTO.setCompleteDate(this.completeDate);
        constructionDTO.setExcpectedCompleteDate(this.excpectedCompleteDate);
        constructionDTO.setStartingDate(this.startingDate);
        constructionDTO.setHandoverNote(this.handoverNote);
        constructionDTO.setHandoverDate(this.handoverDate);
        constructionDTO.setCatPartnerId(this.catPartnerId);
        constructionDTO.setSysGroupId(this.sysGroupId);
        constructionDTO.setYear(this.year);
        constructionDTO.setMonth(this.month);
        constructionDTO.setName(this.name);
        constructionDTO.setCode(this.code);
        constructionDTO.setConstructionId(this.constructionId);
        constructionDTO.setConstructionState(this.constructionState);
        constructionDTO.setExcpectedStartingDate(this.excpectedStartingDate);
        // anhnn20180810
        constructionDTO.setReceiveRecordsDate(this.receiveRecordsDate);
        // hungnx 20180607 start
        constructionDTO.setAmount(this.amount);
        constructionDTO.setPrice(price);
        constructionDTO.setMoneyType(moneyType);
        // hungnx 20180607 end
        
        //nhantv 22092018 begin
        constructionDTO.setBlueprintDate(blueprintDate);
        constructionDTO.setBuildingPermitDate(buildingPermitDate);
        constructionDTO.setIsBuildingPermit(isBuildingPermit);
        constructionDTO.setHandoverNoteElectric(handoverNoteElectric);
        constructionDTO.setHandoverDateElectric(handoverDateElectric);
        constructionDTO.setHandoverNoteBuild(handoverNoteBuild);
        constructionDTO.setHandoverDateBuild(handoverDateBuild);
        //nhantv 22092018 end
		//hoangnh 20181217 start
        constructionDTO.setAmountCableLive(this.amountCableLive);
        constructionDTO.setAmountCableRent(this.amountCableRent);
        constructionDTO.setTotalAmountChest(this.totalAmountChest);

        constructionDTO.setPriceChest(this.priceChest);
        constructionDTO.setTotalAmountGate(this.totalAmountGate);
        constructionDTO.setPriceGate(this.priceGate);
        //hoangnh 20181217 end
        //Huypq-start
        constructionDTO.setApprovedAcceptance(this.approvedAcceptance);
        constructionDTO.setApproveCompleteDate(this.approveCompleteDate);
        constructionDTO.setApprovedAcceptanceUserId(this.approvedAcceptanceUserId);
        //Huy-end
        return constructionDTO;
    }
}
