package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOWoGoodsBO;
import com.viettel.erp.utils.CustomJsonDateDeserializer;
import com.viettel.erp.utils.CustomJsonDateSerializer;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

/**
 * @author hailh10
 */
@SuppressWarnings("serial")
@XmlRootElement(name = "AIO_WO_GOODSBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOWoGoodsDTO extends ComsBaseFWDTO<AIOWoGoodsBO> {
    public static final Long STATUS_NEW = 1L;
    public static final String SEQUENCE_NAME = "AIO_WO_GOODS_SEQ";

    private java.lang.Long woGoodsId;
    private java.lang.String woGoodsName;
    private java.lang.String code;
    private java.lang.Long industryId;
    private java.lang.String industryName;
    private java.lang.String industryCode;
    private java.lang.Long createdUser;
    private java.lang.String createdUserName;
    private java.lang.String phoneNumber;
    private java.lang.Long performerId;
    private java.lang.String performerName;
    private java.lang.String customerName;
    private java.lang.String customerAddress;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date createdDate;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date createdDateFrom;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date createdDateTo;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date startDate;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date startDateFrom;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date startDateTo;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date endDate;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date endDateFrom;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date endDateTo;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date actualEndDate;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date actualEndDateFrom;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date actualEndDateTo;
    private java.lang.Long status;
    private java.lang.Long performerGroupId;
    private java.lang.String performerGroupName;
    private java.lang.Long kpi;
    private java.lang.Long formGuaranteeId;
    private java.lang.String formGuaranteeName;
    private java.lang.String reason;
    private java.lang.String performerGroupCode;
    private int start;
    private int maxResult;
    private String createdUserText;
    private String performerText;

    @Override
    public AIOWoGoodsBO toModel() {
        AIOWoGoodsBO aioWoGoodsBO = new AIOWoGoodsBO();
        aioWoGoodsBO.setWoGoodsId(this.woGoodsId);
        aioWoGoodsBO.setCode(this.code);
        aioWoGoodsBO.setIndustryId(this.industryId);
        aioWoGoodsBO.setIndustryCode(this.industryCode);
        aioWoGoodsBO.setCreatedUser(this.createdUser);
        aioWoGoodsBO.setPerformerId(this.performerId);
        aioWoGoodsBO.setCustomerName(this.customerName);
        aioWoGoodsBO.setCustomerAddress(this.customerAddress);
        aioWoGoodsBO.setCreatedDate(this.createdDate);
        aioWoGoodsBO.setStartDate(this.startDate);
        aioWoGoodsBO.setEndDate(this.endDate);
        aioWoGoodsBO.setActualEndDate(this.actualEndDate);
        aioWoGoodsBO.setStatus(this.status);
        aioWoGoodsBO.setPerformerGroupId(this.performerGroupId);
        aioWoGoodsBO.setKpi(this.kpi);
        aioWoGoodsBO.setFormGuaranteeId(this.formGuaranteeId);
        aioWoGoodsBO.setFormGuaranteeName(this.formGuaranteeName);
        aioWoGoodsBO.setReason(this.reason);
        aioWoGoodsBO.setPhoneNumber(this.phoneNumber);
        aioWoGoodsBO.setIndustryName(this.industryName);
        aioWoGoodsBO.setPerformerGroupCode(this.performerGroupCode);
        aioWoGoodsBO.setCreatedUserName(this.createdUserName);

        return aioWoGoodsBO;
    }

    public String getPerformerGroupCode() {
        return performerGroupCode;
    }

    public void setPerformerGroupCode(String performerGroupCode) {
        this.performerGroupCode = performerGroupCode;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getCreatedUserName() {
        return createdUserName;
    }

    public void setCreatedUserName(String createdUserName) {
        this.createdUserName = createdUserName;
    }

    @JsonProperty("woGoodsId")
    public java.lang.Long getWoGoodsId() {
        return woGoodsId;
    }

    public void setWoGoodsId(java.lang.Long woGoodsId) {
        this.woGoodsId = woGoodsId;
    }

    @JsonProperty("woGoodsName")
    public java.lang.String getWoGoodsName() {
        return woGoodsName;
    }

    public void setWoGoodsName(java.lang.String woGoodsName) {
        this.woGoodsName = woGoodsName;
    }

    @JsonProperty("code")
    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    @JsonProperty("industryId")
    public java.lang.Long getIndustryId() {
        return industryId;
    }

    public void setIndustryId(java.lang.Long industryId) {
        this.industryId = industryId;
    }

    @JsonProperty("industryName")
    public java.lang.String getIndustryName() {
        return industryName;
    }

    public void setIndustryName(java.lang.String industryName) {
        this.industryName = industryName;
    }

    @JsonProperty("industryCode")
    public java.lang.String getIndustryCode() {
        return industryCode;
    }

    public void setIndustryCode(java.lang.String industryCode) {
        this.industryCode = industryCode;
    }

    @JsonProperty("createdUser")
    public java.lang.Long getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(java.lang.Long createdUser) {
        this.createdUser = createdUser;
    }

    @JsonProperty("performerId")
    public java.lang.Long getPerformerId() {
        return performerId;
    }

    public void setPerformerId(java.lang.Long performerId) {
        this.performerId = performerId;
    }

    @JsonProperty("performerName")
    public java.lang.String getPerformerName() {
        return performerName;
    }

    public void setPerformerName(java.lang.String performerName) {
        this.performerName = performerName;
    }

    @JsonProperty("customerName")
    public java.lang.String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(java.lang.String customerName) {
        this.customerName = customerName;
    }

    @JsonProperty("customerAddress")
    public java.lang.String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(java.lang.String customerAddress) {
        this.customerAddress = customerAddress;
    }

    @JsonProperty("createdDate")
    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    public java.util.Date getCreatedDateFrom() {
        return createdDateFrom;
    }

    public void setCreatedDateFrom(java.util.Date createdDateFrom) {
        this.createdDateFrom = createdDateFrom;
    }

    public java.util.Date getCreatedDateTo() {
        return createdDateTo;
    }

    public void setCreatedDateTo(java.util.Date createdDateTo) {
        this.createdDateTo = createdDateTo;
    }

    @JsonProperty("startDate")
    public java.util.Date getStartDate() {
        return startDate;
    }

    public void setStartDate(java.util.Date startDate) {
        this.startDate = startDate;
    }

    public java.util.Date getStartDateFrom() {
        return startDateFrom;
    }

    public void setStartDateFrom(java.util.Date startDateFrom) {
        this.startDateFrom = startDateFrom;
    }

    public java.util.Date getStartDateTo() {
        return startDateTo;
    }

    public void setStartDateTo(java.util.Date startDateTo) {
        this.startDateTo = startDateTo;
    }

    @JsonProperty("endDate")
    public java.util.Date getEndDate() {
        return endDate;
    }

    public void setEndDate(java.util.Date endDate) {
        this.endDate = endDate;
    }

    public java.util.Date getEndDateFrom() {
        return endDateFrom;
    }

    public void setEndDateFrom(java.util.Date endDateFrom) {
        this.endDateFrom = endDateFrom;
    }

    public java.util.Date getEndDateTo() {
        return endDateTo;
    }

    public void setEndDateTo(java.util.Date endDateTo) {
        this.endDateTo = endDateTo;
    }

    @JsonProperty("actualEndDate")
    public java.util.Date getActualEndDate() {
        return actualEndDate;
    }

    public void setActualEndDate(java.util.Date actualEndDate) {
        this.actualEndDate = actualEndDate;
    }

    public java.util.Date getActualEndDateFrom() {
        return actualEndDateFrom;
    }

    public void setActualEndDateFrom(java.util.Date actualEndDateFrom) {
        this.actualEndDateFrom = actualEndDateFrom;
    }

    public java.util.Date getActualEndDateTo() {
        return actualEndDateTo;
    }

    public void setActualEndDateTo(java.util.Date actualEndDateTo) {
        this.actualEndDateTo = actualEndDateTo;
    }

    @JsonProperty("status")
    public java.lang.Long getStatus() {
        return status;
    }

    public void setStatus(java.lang.Long status) {
        this.status = status;
    }

    @JsonProperty("performerGroupId")
    public java.lang.Long getPerformerGroupId() {
        return performerGroupId;
    }

    public void setPerformerGroupId(java.lang.Long performerGroupId) {
        this.performerGroupId = performerGroupId;
    }

    @JsonProperty("performerGroupName")
    public java.lang.String getPerformerGroupName() {
        return performerGroupName;
    }

    public void setPerformerGroupName(java.lang.String performerGroupName) {
        this.performerGroupName = performerGroupName;
    }

    @JsonProperty("kpi")
    public java.lang.Long getKpi() {
        return kpi;
    }

    public void setKpi(java.lang.Long kpi) {
        this.kpi = kpi;
    }

    @JsonProperty("formGuaranteeId")
    public java.lang.Long getFormGuaranteeId() {
        return formGuaranteeId;
    }

    public void setFormGuaranteeId(java.lang.Long formGuaranteeId) {
        this.formGuaranteeId = formGuaranteeId;
    }

    @JsonProperty("formGuaranteeName")
    public java.lang.String getFormGuaranteeName() {
        return formGuaranteeName;
    }

    public void setFormGuaranteeName(java.lang.String formGuaranteeName) {
        this.formGuaranteeName = formGuaranteeName;
    }


    @JsonProperty("reason")
    public java.lang.String getReason() {
        return reason;
    }

    public void setReason(java.lang.String reason) {
        this.reason = reason;
    }

    @JsonProperty("start")
    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    @JsonProperty("maxResult")
    public int getMaxResult() {
        return maxResult;
    }

    public void setMaxResult(int maxResult) {
        this.maxResult = maxResult;
    }

    @Override
    public String catchName() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Long getFWModelId() {
        // TODO Auto-generated method stub
        return null;
    }

    public String getPerformerText() {
        return performerText;
    }

    public void setPerformerText(String performerText) {
        this.performerText = performerText;
    }

    public String getCreatedUserText() {
        return createdUserText;
    }

    public void setCreatedUserText(String createdUserText) {
        this.createdUserText = createdUserText;
    }
}
