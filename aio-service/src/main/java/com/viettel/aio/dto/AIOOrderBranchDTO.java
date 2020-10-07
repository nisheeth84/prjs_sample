package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOOrderBranchBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

//VietNT_20190824_create
@XmlRootElement(name = "AIO_ORDER_BRANCHBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOOrderBranchDTO extends ComsBaseFWDTO<AIOOrderBranchBO> {
    private Long orderBranchId;
    private String orderBranchCode;
    private Long status;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date createdDate;
    private Long createdId;
    private Long sysGroupId;
    private String sysGroupName;
    private Long isProvinceBought;
    private Long signState;

    // dto only
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date startDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDate;

    private String sysUserName;
    private String sysUserCode;
    private String sysGroupCode;
    private String createdDateStr;
    private List<AIOOrderBranchDetailDTO> branchDetailDTOS;
    private List<Long> idList;
    private String cancelDescription;
    private List<Long> orderDetailIdList;
    private String goodsCode;
    private String goodsName;
    private Double amount;
    private Double amountApproved;
    private String sysGroupNameLevel3;

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getAmountApproved() {
        return amountApproved;
    }

    public void setAmountApproved(Double amountApproved) {
        this.amountApproved = amountApproved;
    }

    public String getSysGroupNameLevel3() {
        return sysGroupNameLevel3;
    }

    public void setSysGroupNameLevel3(String sysGroupNameLevel3) {
        this.sysGroupNameLevel3 = sysGroupNameLevel3;
    }

    public String getGoodsCode() {
        return goodsCode;
    }

    public void setGoodsCode(String goodsCode) {
        this.goodsCode = goodsCode;
    }

    public List<Long> getOrderDetailIdList() {
        return orderDetailIdList;
    }

    public void setOrderDetailIdList(List<Long> orderDetailIdList) {
        this.orderDetailIdList = orderDetailIdList;
    }

    public String getCancelDescription() {
        return cancelDescription;
    }

    public void setCancelDescription(String cancelDescription) {
        this.cancelDescription = cancelDescription;
    }

    public List<Long> getIdList() {
        return idList;
    }

    public void setIdList(List<Long> idList) {
        this.idList = idList;
    }

    public String getSysUserName() {
        return sysUserName;
    }

    public void setSysUserName(String sysUserName) {
        this.sysUserName = sysUserName;
    }

    public String getSysUserCode() {
        return sysUserCode;
    }

    public void setSysUserCode(String sysUserCode) {
        this.sysUserCode = sysUserCode;
    }

    public String getSysGroupCode() {
        return sysGroupCode;
    }

    public void setSysGroupCode(String sysGroupCode) {
        this.sysGroupCode = sysGroupCode;
    }

    public String getCreatedDateStr() {
        return createdDateStr;
    }

    public void setCreatedDateStr(String createdDateStr) {
        this.createdDateStr = createdDateStr;
    }

    public List<AIOOrderBranchDetailDTO> getBranchDetailDTOS() {
        return branchDetailDTOS;
    }

    public void setBranchDetailDTOS(List<AIOOrderBranchDetailDTO> branchDetailDTOS) {
        this.branchDetailDTOS = branchDetailDTOS;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Long getOrderBranchId() {
        return orderBranchId;
    }

    public void setOrderBranchId(Long orderBranchId) {
        this.orderBranchId = orderBranchId;
    }

    public String getOrderBranchCode() {
        return orderBranchCode;
    }

    public void setOrderBranchCode(String orderBranchCode) {
        this.orderBranchCode = orderBranchCode;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Long getCreatedId() {
        return createdId;
    }

    public void setCreatedId(Long createdId) {
        this.createdId = createdId;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    public Long getIsProvinceBought() {
        return isProvinceBought;
    }

    public void setIsProvinceBought(Long isProvinceBought) {
        this.isProvinceBought = isProvinceBought;
    }

    public Long getSignState() {
        return signState;
    }

    public void setSignState(Long signState) {
        this.signState = signState;
    }

    @Override
    public AIOOrderBranchBO toModel() {
        AIOOrderBranchBO bo = new AIOOrderBranchBO();
        bo.setOrderBranchId(this.getOrderBranchId());
        bo.setOrderBranchCode(this.getOrderBranchCode());
        bo.setStatus(this.getStatus());
        bo.setCreatedDate(this.getCreatedDate());
        bo.setCreatedId(this.getCreatedId());
        bo.setSysGroupId(this.getSysGroupId());
        bo.setSysGroupName(this.getSysGroupName());
        bo.setIsProvinceBought(this.getIsProvinceBought());
        bo.setSignState(this.getSignState());
//        bo.setOrderRequestId(this.orderRequestId);
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return orderBranchId;
    }

    @Override
    public String catchName() {
        return orderBranchId.toString();
    }
    
    //Huypq-20190922-start
//    private Long orderRequestId;
//
//	public Long getOrderRequestId() {
//		return orderRequestId;
//	}
//
//	public void setOrderRequestId(Long orderRequestId) {
//		this.orderRequestId = orderRequestId;
//	}
    
    private List<AIOOrderBranchDetailDTO> listDataRequest;

	public List<AIOOrderBranchDetailDTO> getListDataRequest() {
		return listDataRequest;
	}

	public void setListDataRequest(List<AIOOrderBranchDetailDTO> listDataRequest) {
		this.listDataRequest = listDataRequest;
	}
    
    
    //Huy-end
}
