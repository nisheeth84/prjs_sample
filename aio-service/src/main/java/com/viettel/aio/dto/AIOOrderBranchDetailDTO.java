package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOOrderBranchDetailBO;
import com.viettel.aio.bo.AIOOrderRequestDetailBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

//VietNT_20190824_create
@XmlRootElement(name = "AIO_ORDER_BRANCH_DETAILBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOOrderBranchDetailDTO extends ComsBaseFWDTO<AIOOrderBranchDetailBO> {
    private Long orderBranchDetailId;
    private Long orderBranchId;
    private Long type;
    private Long status;
    private Long goodsId;
    private String goodsCode;
    private String goodsName;
    private String manufacturerName;
    private String producingCountryName;
    private String goodsUnitName;
    private Long goodsUnitId;
    private String specifications;
    private String supplier;
    private String description;
    private Double amount;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date orderDate;
    private Double amountApproved;
    private Long totalAmountApproved;
    private Long updateUser;
    private Date updateDate;
    private String updateDescription;

	//dto only
    private Long orderRequestId;
    private String requestCode;

    public Long getOrderBranchDetailId() {
        return orderBranchDetailId;
    }

    public void setOrderBranchDetailId(Long orderBranchDetailId) {
        this.orderBranchDetailId = orderBranchDetailId;
    }

    public Long getOrderBranchId() {
        return orderBranchId;
    }

    public void setOrderBranchId(Long orderBranchId) {
        this.orderBranchId = orderBranchId;
    }

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
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

    public String getSupplier() {
        return supplier;
    }

    public void setSupplier(String supplier) {
        this.supplier = supplier;
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

    public Double getAmountApproved() {
        return amountApproved;
    }

    public void setAmountApproved(Double amountApproved) {
        this.amountApproved = amountApproved;
    }

    public Long getTotalAmountApproved() {
        return totalAmountApproved;
    }

    public void setTotalAmountApproved(Long totalAmountApproved) {
        this.totalAmountApproved = totalAmountApproved;
    }

    public Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public String getUpdateDescription() {
        return updateDescription;
    }

    public void setUpdateDescription(String updateDescription) {
        this.updateDescription = updateDescription;
    }

    public Long getOrderRequestId() {
        return orderRequestId;
    }

    public void setOrderRequestId(Long orderRequestId) {
        this.orderRequestId = orderRequestId;
    }

    public String getRequestCode() {
        return requestCode;
    }

    public void setRequestCode(String requestCode) {
        this.requestCode = requestCode;
    }

    
    
    @Override
    public AIOOrderBranchDetailBO toModel() {
        AIOOrderBranchDetailBO bo = new AIOOrderBranchDetailBO();
        bo.setOrderBranchDetailId(this.getOrderBranchDetailId());
        bo.setOrderBranchId(this.getOrderBranchId());
        bo.setType(this.getType());
        bo.setStatus(this.getStatus());
        bo.setGoodsId(this.getGoodsId());
        bo.setGoodsName(this.getGoodsName());
        bo.setGoodsUnitId(this.getGoodsUnitId());
        bo.setGoodsUnitName(this.getGoodsUnitName());
        bo.setManufacturerName(this.getManufacturerName());
        bo.setOrderBranchDetailId(this.getOrderBranchDetailId());
        bo.setOrderBranchId(this.getOrderBranchId());
        bo.setOrderDate(this.getOrderDate());
        bo.setProducingCountryName(this.getProducingCountryName());
        bo.setSpecifications(this.getSpecifications());
        bo.setStatus(this.getStatus());
        bo.setSupplier(this.getSupplier());
        bo.setDescription(this.getDescription());
        bo.setAmount(this.getAmount());
        bo.setAmountApproved(this.getAmountApproved());
        bo.setTotalAmount(this.getTotalAmount());
        bo.setTotalAmountApproved(this.getTotalAmountApproved());
        bo.setUpdateUser(this.getUpdateUser());
        bo.setUpdateDate(this.getUpdateDate());
        bo.setUpdateDescription(this.getUpdateDescription());
        bo.setGoodsCode(this.goodsCode);
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return orderBranchDetailId;
    }

    @Override
    public String catchName() {
        return orderBranchDetailId.toString();
    }
    
    //huypq-20190923-start
    private Long totalAmount;

	public Long getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(Long totalAmount) {
		this.totalAmount = totalAmount;
	}
    
	private Long isProvinceBought;

	public Long getIsProvinceBought() {
		return isProvinceBought;
	}

	public void setIsProvinceBought(Long isProvinceBought) {
		this.isProvinceBought = isProvinceBought;
	}
	
    private Long orderRequestDetailId;

	public Long getOrderRequestDetailId() {
		return orderRequestDetailId;
	}

	public void setOrderRequestDetailId(Long orderRequestDetailId) {
		this.orderRequestDetailId = orderRequestDetailId;
	}
    
	private String orderBranchCode;

	public String getOrderBranchCode() {
		return orderBranchCode;
	}

	public void setOrderBranchCode(String orderBranchCode) {
		this.orderBranchCode = orderBranchCode;
	}
	
    
    //huy-end
}
