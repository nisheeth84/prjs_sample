package com.viettel.aio.dto;

import com.viettel.service.base.model.BaseFWModelImpl;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import java.util.Date;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIORevenueAndRemainDTO extends ComsBaseFWDTO {

    private Long contractRemain;
    private Long contractRemainExpired;
    private Integer flag;
    private Integer isList;
    private Long count;
    private List<String> listGroupId;
    private Long sysGroupId;
    private Long revenueTotalMonth;
    private Long revenuePerformMonth;
    private Double revenueDaily;
    private List<AIORevenueAndRemainDTO> list;
    private Long revenuePerformDaily;
    private String performerName;

    private Long contractId;
    private String contractCode;
    private String customerName;
    private String performerPhone;
    private Date createdDate;
    private String createdDateStr;
    private Long timeRemain;
    private String groupName;

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }

    public String getContractCode() {
        return contractCode;
    }

    public void setContractCode(String contractCode) {
        this.contractCode = contractCode;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getPerformerPhone() {
        return performerPhone;
    }

    public void setPerformerPhone(String performerPhone) {
        this.performerPhone = performerPhone;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public String getCreatedDateStr() {
        return createdDateStr;
    }

    public void setCreatedDateStr(String createdDateStr) {
        this.createdDateStr = createdDateStr;
    }

    public Long getTimeRemain() {
        return timeRemain;
    }

    public void setTimeRemain(Long timeRemain) {
        this.timeRemain = timeRemain;
    }

    public Long getRevenuePerformDaily() {
        return revenuePerformDaily;
    }

    public void setRevenuePerformDaily(Long revenuePerformDaily) {
        this.revenuePerformDaily = revenuePerformDaily;
    }

    public String getPerformerName() {
        return performerName;
    }

    public void setPerformerName(String performerName) {
        this.performerName = performerName;
    }

    public List<AIORevenueAndRemainDTO> getList() {
        return list;
    }

    public void setList(List<AIORevenueAndRemainDTO> list) {
        this.list = list;
    }

    public Integer getIsList() {
        return isList;
    }

    public void setIsList(Integer isList) {
        this.isList = isList;
    }

    public Long getRevenueTotalMonth() {
        return revenueTotalMonth;
    }

    public void setRevenueTotalMonth(Long revenueTotalMonth) {
        this.revenueTotalMonth = revenueTotalMonth;
    }

    public Long getRevenuePerformMonth() {
        return revenuePerformMonth;
    }

    public void setRevenuePerformMonth(Long revenuePerformMonth) {
        this.revenuePerformMonth = revenuePerformMonth;
    }

    public void setRevenueDaily(Double revenueDaily) {
        this.revenueDaily = revenueDaily;
    }

    public Double getRevenueDaily() {
        return revenueDaily;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public List<String> getListGroupId() {
        return listGroupId;
    }

    public void setListGroupId(List<String> listGroupId) {
        this.listGroupId = listGroupId;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public Long getContractRemain() {
        return contractRemain;
    }

    public void setContractRemain(Long contractRemain) {
        this.contractRemain = contractRemain;
    }

    public Long getContractRemainExpired() {
        return contractRemainExpired;
    }

    public void setContractRemainExpired(Long contractRemainExpired) {
        this.contractRemainExpired = contractRemainExpired;
    }

    @Override
    public BaseFWModelImpl toModel() {
        return null;
    }

    @Override
    public Long getFWModelId() {
        return null;
    }

    @Override
    public String catchName() {
        return null;
    }
}
