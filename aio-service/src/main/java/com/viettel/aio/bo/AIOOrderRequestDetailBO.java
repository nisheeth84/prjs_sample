package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOOrderRequestDetailDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190819_start
@Entity
@Table(name = "AIO_ORDER_REQUEST_DETAIL")
public class AIOOrderRequestDetailBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_ORDER_REQUEST_DETAIL_SEQ")})
    @Column(name = "ORDER_REQUEST_DETAIL_ID", length = 10)
    private Long orderRequestDetailId;
    @Column(name = "ORDER_REQUEST_ID", length = 10)
    private Long orderRequestId;
    @Column(name = "STATUS", length = 1)
    private Long status;
    //    @Column(name = "CANCEL_DESCRIPTION_BRANCH", length = 1000)
//    private String cancelDescriptionBranch;
//    @Column(name = "CANCEL_DESCRIPTION_COMPANY", length = 1000)
//    private String cancelDescriptionCompany;
    @Column(name = "DESCRIPTION_COMPANY", length = 1000)
    private String descriptionCompany;
    @Column(name = "GOODS_ID", length = 10)
    private Long goodsId;
    @Column(name = "GOODS_CODE", length = 200)
    private String goodsCode;
    @Column(name = "GOODS_NAME", length = 1000)
    private String goodsName;
    @Column(name = "TYPE", length = 1)
    private Long type;
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
    @Column(name = "AMOUNT_APPROVED", length = 15)
    private Double amountApproved;
    @Column(name = "TOTAL_AMOUNT_APPROVED", length = 15)
    private Long totalAmountApproved;
    @Column(name = "IS_PROVINCE_BOUGHT", length = 15)
    private Long isProvinceBought;
    @Column(name = "ORDER_DATE", length = 22)
    private Date orderDate;
    @Column(name = "UPDATE_USER", length = 10)
    private Long updateUser;
    @Column(name = "UPDATE_DATE", length = 22)
    private Date updateDate;

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

    public Long getOrderRequestDetailId() {
        return orderRequestDetailId;
    }

    public void setOrderRequestDetailId(Long orderRequestDetailId) {
        this.orderRequestDetailId = orderRequestDetailId;
    }

    public Long getOrderRequestId() {
        return orderRequestId;
    }

    public void setOrderRequestId(Long orderRequestId) {
        this.orderRequestId = orderRequestId;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public String getDescriptionCompany() {
        return descriptionCompany;
    }

    public void setDescriptionCompany(String descriptionCompany) {
        this.descriptionCompany = descriptionCompany;
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

    public Long getIsProvinceBought() {
        return isProvinceBought;
    }

    public void setIsProvinceBought(Long isProvinceBought) {
        this.isProvinceBought = isProvinceBought;
    }

    public Long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(Long goodId) {
        this.goodsId = goodId;
    }

    public String getGoodsCode() {
        return goodsCode;
    }

    public void setGoodsCode(String goodCode) {
        this.goodsCode = goodCode;
    }

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodName) {
        this.goodsName = goodName;
    }

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
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

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOOrderRequestDetailDTO dto = new AIOOrderRequestDetailDTO();
        dto.setOrderRequestDetailId(this.getOrderRequestDetailId());
        dto.setOrderRequestId(this.getOrderRequestId());
        dto.setStatus(this.getStatus());
        dto.setGoodsId(this.getGoodsId());
        dto.setGoodsCode(this.getGoodsCode());
        dto.setGoodsName(this.getGoodsName());
        dto.setType(this.getType());
        dto.setManufacturerName(this.getManufacturerName());
        dto.setProducingCountryName(this.getProducingCountryName());
        dto.setGoodsUnitName(this.getGoodsUnitName());
        dto.setGoodsUnitId(this.getGoodsUnitId());
        dto.setSpecifications(this.getSpecifications());
        dto.setDescription(this.getDescription());
        dto.setAmount(this.getAmount());
        dto.setOrderDate(this.getOrderDate());
        dto.setDescriptionCompany(this.getDescriptionCompany());
        dto.setAmountApproved(this.getAmountApproved());
        dto.setTotalAmountApproved(this.getTotalAmountApproved());
        dto.setIsProvinceBought(this.getIsProvinceBought());
        dto.setUpdateDate(this.getUpdateDate());
        dto.setUpdateUser(this.getUpdateUser());
        return dto;
    }
}
