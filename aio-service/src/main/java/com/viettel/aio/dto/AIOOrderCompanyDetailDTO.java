package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOOrderCompanyDetailBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

//VietNT_20190903_create
@XmlRootElement(name = "AIO_ORDER_COMPANY_DETAILBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOOrderCompanyDetailDTO extends ComsBaseFWDTO<AIOOrderCompanyDetailBO> {
    private Long orderCompanyDetailId;
    private Long orderCompanyId;
    private Long orderBranchDetailId;
    private Long orderRequestDetailId;
    private Long type;
    private Long isProvinceBought;
    private Long status;
    private Long goodsId;
    private String goodsCode;
    private String goodsName;
    private String manufacturerName;
    private String producingCountryName;
    private String goodsUnitName;
    private Long goodsUnitId;
    private String specifications;
    private String description;
    private Double amount;
    private Date orderDate;
    private Long cancelUserId;
    private String cancelDescription;
    private String orderCompanyCode;
    private String orderRequestCode;
    private String orderBranchCode;
    private Long amountTotal;
    private Long totalAmount;

    public Long getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(Long totalAmount) {
		this.totalAmount = totalAmount;
	}

	public Long getAmountTotal() {
		return amountTotal;
	}

	public void setAmountTotal(Long amountTotal) {
		this.amountTotal = amountTotal;
	}

	public Long getOrderCompanyDetailId() {
        return orderCompanyDetailId;
    }

    public void setOrderCompanyDetailId(Long orderCompanyDetailId) {
        this.orderCompanyDetailId = orderCompanyDetailId;
    }

    public Long getOrderCompanyId() {
        return orderCompanyId;
    }

    public void setOrderCompanyId(Long orderCompanyId) {
        this.orderCompanyId = orderCompanyId;
    }

    public Long getOrderBranchDetailId() {
        return orderBranchDetailId;
    }

    public void setOrderBranchDetailId(Long orderBranchDetailId) {
        this.orderBranchDetailId = orderBranchDetailId;
    }

    public Long getOrderRequestDetailId() {
        return orderRequestDetailId;
    }

    public void setOrderRequestDetailId(Long orderRequestDetailId) {
        this.orderRequestDetailId = orderRequestDetailId;
    }

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }

    public Long getIsProvinceBought() {
        return isProvinceBought;
    }

    public void setIsProvinceBought(Long isProvinceBought) {
        this.isProvinceBought = isProvinceBought;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(Long goodsId) {
        this.goodsId = goodsId;
    }

    public String getGoodsCode() {
        return goodsCode;
    }

    public void setGoodsCode(String goodsCode) {
        this.goodsCode = goodsCode;
    }

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }

    public String getManufacturerName() {
        return manufacturerName;
    }

    public void setManufacturerName(String manufacturerName) {
        this.manufacturerName = manufacturerName;
    }

    public String getProducingCountryName() {
        return producingCountryName;
    }

    public void setProducingCountryName(String producingCountryName) {
        this.producingCountryName = producingCountryName;
    }

    public String getGoodsUnitName() {
        return goodsUnitName;
    }

    public void setGoodsUnitName(String goodsUnitName) {
        this.goodsUnitName = goodsUnitName;
    }

    public Long getGoodsUnitId() {
        return goodsUnitId;
    }

    public void setGoodsUnitId(Long goodsUnitId) {
        this.goodsUnitId = goodsUnitId;
    }

    public String getSpecifications() {
        return specifications;
    }

    public void setSpecifications(String specifications) {
        this.specifications = specifications;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Date getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }

    public Long getCancelUserId() {
        return cancelUserId;
    }

    public void setCancelUserId(Long cancelUserId) {
        this.cancelUserId = cancelUserId;
    }

    public String getCancelDescription() {
        return cancelDescription;
    }

    public void setCancelDescription(String cancelDescription) {
        this.cancelDescription = cancelDescription;
    }

    public String getOrderCompanyCode() {
        return orderCompanyCode;
    }

    public void setOrderCompanyCode(String orderCompanyCode) {
        this.orderCompanyCode = orderCompanyCode;
    }

    public String getOrderRequestCode() {
        return orderRequestCode;
    }

    public void setOrderRequestCode(String orderRequestCode) {
        this.orderRequestCode = orderRequestCode;
    }

    public String getOrderBranchCode() {
        return orderBranchCode;
    }

    public void setOrderBranchCode(String orderBranchCode) {
        this.orderBranchCode = orderBranchCode;
    }

    @Override
    public AIOOrderCompanyDetailBO toModel() {
        AIOOrderCompanyDetailBO bo = new AIOOrderCompanyDetailBO();
        bo.setOrderCompanyDetailId(this.getOrderCompanyDetailId());
        bo.setOrderCompanyId(this.getOrderCompanyId());
        bo.setOrderBranchDetailId(this.getOrderBranchDetailId());
//        bo.setOrderRequestDetailId(this.getOrderRequestDetailId());
        bo.setType(this.getType());
        bo.setIsProvinceBought(this.getIsProvinceBought());
        bo.setStatus(this.getStatus());
        bo.setGoodsId(this.getGoodsId());
        bo.setGoodsCode(this.getGoodsCode());
        bo.setGoodsName(this.getGoodsName());
        bo.setManufacturerName(this.getManufacturerName());
        bo.setProducingCountryName(this.getProducingCountryName());
        bo.setGoodsUnitName(this.getGoodsUnitName());
        bo.setGoodsUnitId(this.getGoodsUnitId());
        bo.setSpecifications(this.getSpecifications());
        bo.setDescription(this.getDescription());
        bo.setAmount(this.getAmount());
        bo.setOrderDate(this.getOrderDate());
//        bo.setCancelUserId(this.getCancelUserId());
//        bo.setCancelDescription(this.getCancelDescription());
//        bo.setOrderCompanyCode(this.getOrderCompanyCode());
//        bo.setOrderRequestCode(this.getOrderRequestCode());
//        bo.setOrderBranchCode(this.getOrderBranchCode());
        bo.setOrderBranchId(this.orderBranchId);
        bo.setAmountTotal(this.amountTotal);
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return orderCompanyDetailId;
    }

    @Override
    public String catchName() {
        return orderCompanyDetailId.toString();
    }
    
    private Long orderBranchId;

	public Long getOrderBranchId() {
		return orderBranchId;
	}

	public void setOrderBranchId(Long orderBranchId) {
		this.orderBranchId = orderBranchId;
	}
    
}
