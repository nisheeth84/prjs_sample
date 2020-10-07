package com.viettel.coms.dto;

import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CNTContractDTO {
    private java.lang.String code;
    private java.lang.String name;
    private java.lang.String orderName;
    private java.lang.String outContract;
    private java.lang.Long status;
    private java.lang.Long type;
    private java.lang.Long constructionId;
    private java.lang.String partnerName;
    private java.lang.String sysGroupName;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date signDate;
    private java.lang.Double price;
    private java.lang.Long page;
    private java.lang.Integer pageSize;
    private java.lang.Integer total;
    private java.lang.Integer totalRecord;

    public java.lang.Integer getTotalRecord() {
        return totalRecord;
    }

    public void setTotalRecord(java.lang.Integer totalRecord) {
        this.totalRecord = totalRecord;
    }

    public java.lang.Long getPage() {
        return page;
    }

    public void setPage(java.lang.Long page) {
        this.page = page;
    }

    public java.lang.Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(java.lang.Integer pageSize) {
        this.pageSize = pageSize;
    }

    public java.lang.Integer getTotal() {
        return total;
    }

    public void setTotal(java.lang.Integer total) {
        this.total = total;
    }

    public java.lang.Long getType() {
        return type;
    }

    public void setType(java.lang.Long type) {
        this.type = type;
    }

    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    public java.lang.String getOutContract() {
        return outContract;
    }

    public void setOutContract(java.lang.String outContract) {
        this.outContract = outContract;
    }

    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
    }

    public java.lang.String getOrderName() {
        return orderName;
    }

    public void setOrderName(java.lang.String orderName) {
        this.orderName = orderName;
    }

    public java.lang.Long getStatus() {
        return status;
    }

    public void setStatus(java.lang.Long status) {
        this.status = status;
    }

    public java.lang.String getPartnerName() {
        return partnerName;
    }

    public void setPartnerName(java.lang.String partnerName) {
        this.partnerName = partnerName;
    }

    public java.lang.String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(java.lang.String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    public java.util.Date getSignDate() {
        return signDate;
    }

    public void setSignDate(java.util.Date signDate) {
        this.signDate = signDate;
    }

    public java.lang.Double getPrice() {
        return price;
    }

    public void setPrice(java.lang.Double price) {
        this.price = price;
    }

    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

}
