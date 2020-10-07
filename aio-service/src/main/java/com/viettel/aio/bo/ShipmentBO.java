package com.viettel.aio.bo;

import com.viettel.aio.dto.ShipmentDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.ims.bo.ShipmentBO_ims")
@Table(name = "SHIPMENT")
/**
 *
 * @author: hailh10
 */
public class ShipmentBO extends BaseFWModelImpl {
     
	@Column(name = "TYPE", length = 1)
	private String type;
	@Column(name = "SHIPER", length = 100)
	private String shiper;
	@Column(name = "SHIP_PLACE", length = 1000)
	private String shipPlace;
	@Column(name = "CUSTOMS_PROCEDURE", length = 100)
	private String customsProcedure;
	@Column(name = "DESCRIPTION", length = 1000)
	private String description;
	@Column(name = "CREATED_DATE", length = 7)
	private java.util.Date createdDate;
	@Column(name = "CREATED_BY", length = 22)
	private Long createdBy;
	@Column(name = "STATUS", length = 2)
	private String status;
	@Column(name = "CREATED_DEPT_ID", length = 22)
	private Long createdDeptId;
	@Column(name = "CANCEL_DATE", length = 7)
	private java.util.Date cancelDate;
	@Column(name = "CANCEL_USER_ID", length = 22)
	private Long cancelUserId;
	@Column(name = "CANCEL_REASON_NAME", length = 1000)
	private String cancelReasonName;
	@Column(name = "CANCEL_DESCRIPTION", length = 1000)
	private String cancelDescription;
	@Column(name = "TOTAL_ORIGIN_MONEY", length = 22)
	private Long totalOriginMoney;
	@Column(name = "TOTAL_FEE", length = 22)
	private Long totalFee;
	@Column(name = "FEE_DESCRIPTION", length = 1000)
	private String feeDescription;
	@Column(name = "TOTAL_TAX", length = 22)
	private Long totalTax;
	@Column(name = "TOTAL_MONEY", length = 22)
	private Long totalMoney;
	@Column(name = "ORDER_CHECK_CODE", length = 50)
	private String orderCheckCode;
	@Column(name = "REPORT_CHECK_CODE", length = 50)
	private String reportCheckCode;
	@Column(name = "UPDATED_BY", length = 22)
	private Long updatedBy;
	@Column(name = "UPDATED_DATE", length = 7)
	private java.util.Date updatedDate;
	@Column(name = "CODE", length = 50)
	private String code;
	@Column(name = "CONTRACT_ID", length = 22)
	private Long contractId;
	@Column(name = "PROJ_INVEST_PROJECT_ID", length = 22)
	private Long projInvestProjectId;
	@Column(name = "CONTRACT_CODE", length = 100)
	private String contractCode;
	@Column(name = "PROJECT_CODE", length = 100)
	private String projectCode;
	@Column(name = "SHIP_DATE", length = 7)
	private java.util.Date shipDate;
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "SHIPMENT_SEQ") })
	@Column(name = "SHIPMENT_ID", length = 22)
	private Long shipmentId;


	public String getType(){
		return type;
	}

	public void setType(String type)
	{
		this.type = type;
	}

	public String getShiper(){
		return shiper;
	}

	public void setShiper(String shiper)
	{
		this.shiper = shiper;
	}

	public String getShipPlace(){
		return shipPlace;
	}

	public void setShipPlace(String shipPlace)
	{
		this.shipPlace = shipPlace;
	}

	public String getCustomsProcedure(){
		return customsProcedure;
	}

	public void setCustomsProcedure(String customsProcedure)
	{
		this.customsProcedure = customsProcedure;
	}

	public String getDescription(){
		return description;
	}

	public void setDescription(String description)
	{
		this.description = description;
	}

	public java.util.Date getCreatedDate(){
		return createdDate;
	}

	public void setCreatedDate(java.util.Date createdDate)
	{
		this.createdDate = createdDate;
	}

	public Long getCreatedBy(){
		return createdBy;
	}

	public void setCreatedBy(Long createdBy)
	{
		this.createdBy = createdBy;
	}

	public String getStatus(){
		return status;
	}

	public void setStatus(String status)
	{
		this.status = status;
	}

	public Long getCreatedDeptId(){
		return createdDeptId;
	}

	public void setCreatedDeptId(Long createdDeptId)
	{
		this.createdDeptId = createdDeptId;
	}

	public java.util.Date getCancelDate(){
		return cancelDate;
	}

	public void setCancelDate(java.util.Date cancelDate)
	{
		this.cancelDate = cancelDate;
	}

	public Long getCancelUserId(){
		return cancelUserId;
	}

	public void setCancelUserId(Long cancelUserId)
	{
		this.cancelUserId = cancelUserId;
	}

	public String getCancelReasonName(){
		return cancelReasonName;
	}

	public void setCancelReasonName(String cancelReasonName)
	{
		this.cancelReasonName = cancelReasonName;
	}

	public String getCancelDescription(){
		return cancelDescription;
	}

	public void setCancelDescription(String cancelDescription)
	{
		this.cancelDescription = cancelDescription;
	}

	public Long getTotalOriginMoney(){
		return totalOriginMoney;
	}

	public void setTotalOriginMoney(Long totalOriginMoney)
	{
		this.totalOriginMoney = totalOriginMoney;
	}

	public Long getTotalFee(){
		return totalFee;
	}

	public void setTotalFee(Long totalFee)
	{
		this.totalFee = totalFee;
	}

	public String getFeeDescription(){
		return feeDescription;
	}

	public void setFeeDescription(String feeDescription)
	{
		this.feeDescription = feeDescription;
	}

	public Long getTotalTax(){
		return totalTax;
	}

	public void setTotalTax(Long totalTax)
	{
		this.totalTax = totalTax;
	}

	public Long getTotalMoney(){
		return totalMoney;
	}

	public void setTotalMoney(Long totalMoney)
	{
		this.totalMoney = totalMoney;
	}

	public String getOrderCheckCode(){
		return orderCheckCode;
	}

	public void setOrderCheckCode(String orderCheckCode)
	{
		this.orderCheckCode = orderCheckCode;
	}

	public String getReportCheckCode(){
		return reportCheckCode;
	}

	public void setReportCheckCode(String reportCheckCode)
	{
		this.reportCheckCode = reportCheckCode;
	}

	public Long getUpdatedBy(){
		return updatedBy;
	}

	public void setUpdatedBy(Long updatedBy)
	{
		this.updatedBy = updatedBy;
	}

	public java.util.Date getUpdatedDate(){
		return updatedDate;
	}

	public void setUpdatedDate(java.util.Date updatedDate)
	{
		this.updatedDate = updatedDate;
	}

	public String getCode(){
		return code;
	}

	public void setCode(String code)
	{
		this.code = code;
	}

	public Long getContractId(){
		return contractId;
	}

	public void setContractId(Long contractId)
	{
		this.contractId = contractId;
	}

	public Long getProjInvestProjectId(){
		return projInvestProjectId;
	}

	public void setProjInvestProjectId(Long projInvestProjectId)
	{
		this.projInvestProjectId = projInvestProjectId;
	}

	public String getContractCode(){
		return contractCode;
	}

	public void setContractCode(String contractCode)
	{
		this.contractCode = contractCode;
	}

	public String getProjectCode(){
		return projectCode;
	}

	public void setProjectCode(String projectCode)
	{
		this.projectCode = projectCode;
	}

	public java.util.Date getShipDate(){
		return shipDate;
	}

	public void setShipDate(java.util.Date shipDate)
	{
		this.shipDate = shipDate;
	}

	public Long getShipmentId(){
		return shipmentId;
	}

	public void setShipmentId(Long shipmentId)
	{
		this.shipmentId = shipmentId;
	}
   
    @Override
    public ShipmentDTO toDTO() {
        ShipmentDTO shipmentDTO = new ShipmentDTO(); 
        shipmentDTO.setType(this.type);		
        shipmentDTO.setShiper(this.shiper);		
        shipmentDTO.setShipPlace(this.shipPlace);		
        shipmentDTO.setCustomsProcedure(this.customsProcedure);		
        shipmentDTO.setDescription(this.description);		
        shipmentDTO.setCreatedDate(this.createdDate);		
        shipmentDTO.setCreatedBy(this.createdBy);		
        shipmentDTO.setStatus(this.status);		
        shipmentDTO.setCreatedDeptId(this.createdDeptId);		
        shipmentDTO.setCancelDate(this.cancelDate);		
        shipmentDTO.setCancelUserId(this.cancelUserId);		
        shipmentDTO.setCancelReasonName(this.cancelReasonName);		
        shipmentDTO.setCancelDescription(this.cancelDescription);		
        shipmentDTO.setTotalOriginMoney(this.totalOriginMoney);		
        shipmentDTO.setTotalFee(this.totalFee);		
        shipmentDTO.setFeeDescription(this.feeDescription);		
        shipmentDTO.setTotalTax(this.totalTax);		
        shipmentDTO.setTotalMoney(this.totalMoney);		
        shipmentDTO.setOrderCheckCode(this.orderCheckCode);		
        shipmentDTO.setReportCheckCode(this.reportCheckCode);		
        shipmentDTO.setUpdatedBy(this.updatedBy);		
        shipmentDTO.setUpdatedDate(this.updatedDate);		
        shipmentDTO.setCode(this.code);		
        shipmentDTO.setContractId(this.contractId);		
        shipmentDTO.setProjInvestProjectId(this.projInvestProjectId);		
        shipmentDTO.setContractCode(this.contractCode);		
        shipmentDTO.setProjectCode(this.projectCode);		
        shipmentDTO.setShipDate(this.shipDate);		
        shipmentDTO.setShipmentId(this.shipmentId);		
        return shipmentDTO;
    }
}
