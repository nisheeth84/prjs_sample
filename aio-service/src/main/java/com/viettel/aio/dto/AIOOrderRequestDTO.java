package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOOrderRequestBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

//VietNT_20190819_create
@XmlRootElement(name = "AIO_ORDER_REQUESTBO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIOOrderRequestDTO extends ComsBaseFWDTO<AIOOrderRequestBO> {
    private Long orderRequestId;
    private String requestCode;
    private Long status;
    private Long sysGroupId;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date createdDate;
    private Long createBy;
    private Long sysGroupLevel3;

    // dto only
    private List<AIOOrderRequestDetailDTO> requestDetails;
    private String sysGroupName;
    private List<AIOOrderRequestDetailDTO> goodsList;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date startDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDate;
    private String createdDateStr;
    private String sysUserName;
    private List<Long> orderRequestIds;
    private List<AIOOrderRequestDetailDTO> unitList;
    private String goodsCode;
    private String goodsName;
    private Double amount;
    private Double amountApproved;
    private String sysGroupNameLevel3;

    public Long getSysGroupLevel3() {
        return sysGroupLevel3;
    }

    public void setSysGroupLevel3(Long sysGroupLevel3) {
        this.sysGroupLevel3 = sysGroupLevel3;
    }

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

    public List<AIOOrderRequestDetailDTO> getUnitList() {
        return unitList;
    }

    public void setUnitList(List<AIOOrderRequestDetailDTO> unitList) {
        this.unitList = unitList;
    }

    public List<Long> getOrderRequestIds() {
        return orderRequestIds;
    }

    public void setOrderRequestIds(List<Long> orderRequestIds) {
        this.orderRequestIds = orderRequestIds;
    }

    public String getCreatedDateStr() {
        return createdDateStr;
    }

    public void setCreatedDateStr(String createdDateStr) {
        this.createdDateStr = createdDateStr;
    }

    public String getSysUserName() {
        return sysUserName;
    }

    public void setSysUserName(String sysUserName) {
        this.sysUserName = sysUserName;
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

    public List<AIOOrderRequestDetailDTO> getGoodsList() {
        return goodsList;
    }

    public void setGoodsList(List<AIOOrderRequestDetailDTO> goodsList) {
        this.goodsList = goodsList;
    }

    public List<AIOOrderRequestDetailDTO> getRequestDetails() {
        return requestDetails;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    public void setRequestDetails(List<AIOOrderRequestDetailDTO> requestDetails) {
        this.requestDetails = requestDetails;
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

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Long getCreateBy() {
        return createBy;
    }

    public void setCreateBy(Long createBy) {
        this.createBy = createBy;
    }

    @Override
    public AIOOrderRequestBO toModel() {
        AIOOrderRequestBO bo = new AIOOrderRequestBO();
        bo.setOrderRequestId(this.getOrderRequestId());
        bo.setRequestCode(this.getRequestCode());
        bo.setStatus(this.getStatus());
        bo.setSysGroupId(this.getSysGroupId());
        bo.setCreatedDate(this.getCreatedDate());
        bo.setCreateBy(this.getCreateBy());
        bo.setSysGroupLevel3(this.getSysGroupLevel3());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return orderRequestId;
    }

    @Override
    public String catchName() {
        return orderRequestId.toString();
    }
}
