package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOOrderRequestDetailBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

//VietNT_20190819_create
@XmlRootElement(name = "AIO_ORDER_REQUEST_DETAILBO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIOOrderRequestDetailDTO extends ComsBaseFWDTO<AIOOrderRequestDetailBO> {
    private Long orderRequestDetailId;
    private Long orderRequestId;
    private Long status;
//    private String cancelDescriptionBranch;
//    private String cancelDescriptionCompany;
    private String descriptionCompany;
    private Long goodsId;
    private String goodsCode;
    private String goodsName;
    private Long type;
    private String manufacturerName;
    private String producingCountryName;
    private String goodsUnitName;
    private Long goodsUnitId;
    private String specifications;
    private String description;
    private Double amount;
    private Double amountApproved;
    private Long totalAmountApproved;
    private Long isProvinceBought;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date orderDate;
    private Long updateUser;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date updateDate;

    //dto
    private Long statusOrder;

    public Long getStatusOrder() {
        return statusOrder;
    }

    public void setStatusOrder(Long statusOrder) {
        this.statusOrder = statusOrder;
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
    public AIOOrderRequestDetailBO toModel() {
        AIOOrderRequestDetailBO bo = new AIOOrderRequestDetailBO();
        bo.setOrderRequestDetailId(this.getOrderRequestDetailId());
        bo.setOrderRequestId(this.getOrderRequestId());
        bo.setStatus(this.getStatus());
        bo.setGoodsId(this.getGoodsId());
        bo.setGoodsCode(this.getGoodsCode());
        bo.setGoodsName(this.getGoodsName());
        bo.setType(this.getType());
        bo.setManufacturerName(this.getManufacturerName());
        bo.setProducingCountryName(this.getProducingCountryName());
        bo.setGoodsUnitName(this.getGoodsUnitName());
        bo.setGoodsUnitId(this.getGoodsUnitId());
        bo.setSpecifications(this.getSpecifications());
        bo.setDescription(this.getDescription());
        bo.setAmount(this.getAmount());
        bo.setOrderDate(this.getOrderDate());
        bo.setDescriptionCompany(this.getDescriptionCompany());
        bo.setAmountApproved(this.getAmountApproved());
        bo.setTotalAmountApproved(this.getTotalAmountApproved());
        bo.setIsProvinceBought(this.getIsProvinceBought());
        bo.setUpdateDate(this.getUpdateDate());
        bo.setUpdateUser(this.getUpdateUser());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return orderRequestDetailId;
    }

    @Override
    public String catchName() {
        return orderRequestDetailId.toString();
    }
}
