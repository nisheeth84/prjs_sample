package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOOrderCompanyDetailDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190903_start
@Entity
@Table(name = "AIO_ORDER_COMPANY_DETAIL")
public class AIOOrderCompanyDetailBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_ORDER_COMPANY_DETAIL_SEQ")})
    @Column(name = "ORDER_COMPANY_DETAIL_ID", length = 10)
    private Long orderCompanyDetailId;
    @Column(name = "ORDER_COMPANY_ID", length = 10)
    private Long orderCompanyId;
    @Column(name = "ORDER_BRANCH_DETAIL_ID", length = 10)
    private Long orderBranchDetailId;
//    @Column(name = "ORDER_REQUEST_DETAIL_ID", length = 10)
//    private Long orderRequestDetailId;
    @Column(name = "TYPE", length = 1)
    private Long type;
    @Column(name = "IS_PROVINCE_BOUGHT", length = 1)
    private Long isProvinceBought;
    @Column(name = "STATUS", length = 1)
    private Long status;
    @Column(name = "GOODS_ID", length = 10)
    private Long goodsId;
    @Column(name = "GOODS_CODE", length = 500)
    private String goodsCode;
    @Column(name = "GOODS_NAME", length = 1000)
    private String goodsName;
    @Column(name = "MANUFACTURER_NAME", length = 1000)
    private String manufacturerName;
    @Column(name = "PRODUCING_COUNTRY_NAME", length = 1000)
    private String producingCountryName;
    @Column(name = "GOODS_UNIT_NAME", length = 1000)
    private String goodsUnitName;
    @Column(name = "GOODS_UNIT_ID", length = 10)
    private Long goodsUnitId;
    @Column(name = "SPECIFICATIONS", length = 1000)
    private String specifications;
    @Column(name = "DESCRIPTION", length = 1000)
    private String description;
    @Column(name = "AMOUNT", length = 15)
    private Double amount;
    @Column(name = "ORDER_DATE", length = 22)
    private Date orderDate;
//    @Column(name = "CANCEL_USER_ID", length = 10)
//    private Long cancelUserId;
//    @Column(name = "CANCEL_DESCRIPTION", length = 1000)
//    private String cancelDescription;
//    @Column(name = "ORDER_COMPANY_CODE", length = 1000)
//    private String orderCompanyCode;
//    @Column(name = "ORDER_REQUEST_CODE", length = 1000)
//    private String orderRequestCode;
//    @Column(name = "ORDER_BRANCH_CODE", length = 1000)
//    private String orderBranchCode;
    @Column(name = "ORDER_BRANCH_ID", length = 10)
    private Long orderBranchId;
    
    @Column(name = "AMOUNT_TOTAL", length = 10)
    private Long amountTotal;
    
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

    

    public Long getOrderBranchId() {
		return orderBranchId;
	}

	public void setOrderBranchId(Long orderBranchId) {
		this.orderBranchId = orderBranchId;
	}

	@Override
    public BaseFWDTOImpl toDTO() {
        AIOOrderCompanyDetailDTO dto = new AIOOrderCompanyDetailDTO();
        dto.setOrderCompanyDetailId(this.getOrderCompanyDetailId());
        dto.setOrderCompanyId(this.getOrderCompanyId());
        dto.setOrderBranchDetailId(this.getOrderBranchDetailId());
//        dto.setOrderRequestDetailId(this.getOrderRequestDetailId());
        dto.setType(this.getType());
        dto.setIsProvinceBought(this.getIsProvinceBought());
        dto.setStatus(this.getStatus());
        dto.setGoodsId(this.getGoodsId());
        dto.setGoodsCode(this.getGoodsCode());
        dto.setGoodsName(this.getGoodsName());
        dto.setManufacturerName(this.getManufacturerName());
        dto.setProducingCountryName(this.getProducingCountryName());
        dto.setGoodsUnitName(this.getGoodsUnitName());
        dto.setGoodsUnitId(this.getGoodsUnitId());
        dto.setSpecifications(this.getSpecifications());
        dto.setDescription(this.getDescription());
        dto.setAmount(this.getAmount());
        dto.setOrderDate(this.getOrderDate());
//        dto.setCancelUserId(this.getCancelUserId());
//        dto.setCancelDescription(this.getCancelDescription());
//        dto.setOrderCompanyCode(this.getOrderCompanyCode());
//        dto.setOrderRequestCode(this.getOrderRequestCode());
//        dto.setOrderBranchCode(this.getOrderBranchCode());
        dto.setAmountTotal(this.amountTotal);
        return dto;
    }
}
