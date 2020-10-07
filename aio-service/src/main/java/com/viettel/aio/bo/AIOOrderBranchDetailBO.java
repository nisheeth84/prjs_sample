package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOOrderBranchDetailDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190824_start
@Entity
@Table(name = "AIO_ORDER_BRANCH_DETAIL")
public class AIOOrderBranchDetailBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_ORDER_BRANCH_DETAIL_SEQ")})
    @Column(name = "ORDER_BRANCH_DETAIL_ID", length = 10)
    private Long orderBranchDetailId;
    @Column(name = "AMOUNT", length = 15)
    private Double amount;
    @Column(name = "AMOUNT_APPROVED", length = 15)
    private Double amountApproved;
    @Column(name = "DESCRIPTION")
    private String description;
    @Column(name = "GOODS_CODE")
    private String goodsCode;
    @Column(name = "GOODS_ID")
    private Long goodsId;
    @Column(name = "GOODS_NAME")
    private String goodsName;
    @Column(name = "GOODS_UNIT_ID")
    private Long goodsUnitId;
    @Column(name = "GOODS_UNIT_NAME")
    private String goodsUnitName;
    @Column(name = "MANUFACTURER_NAME")
    private String manufacturerName;
    @Column(name = "ORDER_BRANCH_ID", length = 10)
    private Long orderBranchId;
    @Column(name = "ORDER_DATE", length = 22)
    private Date orderDate;
    @Column(name = "PRODUCING_COUNTRY_NAME")
    private String producingCountryName;
    @Column(name = "SPECIFICATIONS")
    private String specifications;
    @Column(name = "STATUS", length = 1)
    private Long status;
    @Column(name = "SUPPLIER")
    private String supplier;
    @Column(name = "TOTAL_AMOUNT", length = 30)
    private Long totalAmount;
    @Column(name = "TOTAL_AMOUNT_APPROVED", length = 30)
    private Long totalAmountApproved;
    @Column(name = "TYPE", length = 1)
    private Long type;
    @Column(name = "UPDATE_DATE", length = 22)
    private Date updateDate;
    @Column(name = "UPDATE_DESCRIPTION")
    private String updateDescription;
    @Column(name = "UPDATE_USER", length = 10)
    private Long updateUser;
    

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

    public Double getAmountApproved() {
		return amountApproved;
	}

	public void setAmountApproved(Double amountApproved) {
		this.amountApproved = amountApproved;
	}

	public Long getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(Long totalAmount) {
		this.totalAmount = totalAmount;
	}

	public Long getTotalAmountApproved() {
		return totalAmountApproved;
	}

	public void setTotalAmountApproved(Long totalAmountApproved) {
		this.totalAmountApproved = totalAmountApproved;
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

	public Long getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(Long updateUser) {
		this.updateUser = updateUser;
	}

	@Override
    public BaseFWDTOImpl toDTO() {
        AIOOrderBranchDetailDTO dto = new AIOOrderBranchDetailDTO();
        dto.setAmount(this.getAmount());
        dto.setAmountApproved(this.getAmountApproved());
        dto.setDescription(this.getDescription());
        dto.setGoodsCode(this.getGoodsCode());
        dto.setGoodsId(this.getGoodsId());
        dto.setGoodsName(this.getGoodsName());
        dto.setGoodsUnitId(this.getGoodsUnitId());
        dto.setGoodsUnitName(this.getGoodsUnitName());
        dto.setManufacturerName(this.getManufacturerName());
        dto.setOrderBranchDetailId(this.getOrderBranchDetailId());
        dto.setOrderBranchId(this.getOrderBranchId());
        dto.setOrderDate(this.getOrderDate());
        dto.setProducingCountryName(this.getProducingCountryName());
        dto.setSpecifications(this.getSpecifications());
        dto.setStatus(this.getStatus());
        dto.setSupplier(this.getSupplier());
        dto.setTotalAmount(this.getTotalAmount());
        dto.setTotalAmountApproved(this.getTotalAmountApproved());
        dto.setType(this.getType());
        dto.setUpdateDate(this.getUpdateDate());
        dto.setUpdateDescription(this.getUpdateDescription());
        dto.setUpdateUser(this.getUpdateUser());
        return dto;
    }

	public void setOrderDate(Date orderDate) {
		this.orderDate = orderDate;
	}
	
	
}
