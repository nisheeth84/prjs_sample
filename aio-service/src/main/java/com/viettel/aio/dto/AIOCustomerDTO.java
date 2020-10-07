package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOCustomerBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

//VietNT_20190313_create
@XmlRootElement(name = "AIO_CUSTOMERBO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIOCustomerDTO extends ComsBaseFWDTO<AIOCustomerBO> {

    private Long customerId;
    private String code;
    private String name;
    private String phone;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date birth;
    private String taxCode;
    private String surrogate;
    private String position;
    private String passport;
    private String issuedBy;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date purveyDate;
    private Long gender;
    private String address;
    private String email;
    private Long type;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date createdDate;
    private Long createdUser;
    private Long createdGroupId;
    private Long aioAreaId;

    //hienvd: ADD 13/8/2019
    private String packageName;
    private Double amount;
    private String performerCode;
    private String performerName;
    private Date startDate;
    private Date endDate;
    private String goodCode;
    private String goodName;
    private String goodUnitName;
    private Double quantity;
    private String serial;
    private String quaranteeTypeName;
    private String dateGuTime;
    private Long contractId;
    private Long provinceId;

    private Long acceptanceRecordsId;

    public Long getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(Long provinceId) {
        this.provinceId = provinceId;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }


    public String getPerformerCode() {
        return performerCode;
    }

    public void setPerformerCode(String performerCode) {
        this.performerCode = performerCode;
    }

    public String getPerformerName() {
        return performerName;
    }

    public void setPerformerName(String performerName) {
        this.performerName = performerName;
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

    public String getGoodCode() {
        return goodCode;
    }

    public void setGoodCode(String goodCode) {
        this.goodCode = goodCode;
    }

    public String getGoodName() {
        return goodName;
    }

    public void setGoodName(String goodName) {
        this.goodName = goodName;
    }

    public String getGoodUnitName() {
        return goodUnitName;
    }

    public void setGoodUnitName(String goodUnitName) {
        this.goodUnitName = goodUnitName;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public String getSerial() {
        return serial;
    }

    public void setSerial(String serial) {
        this.serial = serial;
    }

    public String getQuaranteeTypeName() {
        return quaranteeTypeName;
    }

    public void setQuaranteeTypeName(String quaranteeTypeName) {
        this.quaranteeTypeName = quaranteeTypeName;
    }

    public String getDateGuTime() {
        return dateGuTime;
    }

    public void setDateGuTime(String dateGuTime) {
        this.dateGuTime = dateGuTime;
    }

    public Long getAcceptanceRecordsId() {
        return acceptanceRecordsId;
    }

    public void setAcceptanceRecordsId(Long acceptanceRecordsId) {
        this.acceptanceRecordsId = acceptanceRecordsId;
    }

    //hienvd: END 13/8/2019


    @Override
    public AIOCustomerBO toModel() {
        AIOCustomerBO bo = new AIOCustomerBO();
        bo.setCustomerId(this.getCustomerId());
        bo.setCode(this.getCode());
        bo.setName(this.getName());
        bo.setPhone(this.getPhone());
        bo.setBirth(this.getBirth());
        bo.setTaxCode(this.getTaxCode());
        bo.setSurrogate(this.getSurrogate());
        bo.setPosition(this.getPosition());
        bo.setPassport(this.getPassport());
        bo.setIssuedBy(this.getIssuedBy());
        bo.setPurveyDate(this.getPurveyDate());
        bo.setGender(this.getGender());
        bo.setAddress(this.getAddress());
        bo.setEmail(this.getEmail());
        bo.setType(this.getType());
        bo.setCreatedDate(this.getCreatedDate());
        bo.setCreatedUser(this.getCreatedUser());
        bo.setCreatedGroupId(this.getCreatedGroupId());
        bo.setAioAreaId(this.getAioAreaId());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return customerId;
    }

    @Override
    public String catchName() {
        return customerId.toString();
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Date getBirth() {
        return birth;
    }

    public void setBirth(Date birth) {
        this.birth = birth;
    }

    public String getTaxCode() {
        return taxCode;
    }

    public void setTaxCode(String taxCode) {
        this.taxCode = taxCode;
    }

    public String getSurrogate() {
        return surrogate;
    }

    public void setSurrogate(String surrogate) {
        this.surrogate = surrogate;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getPassport() {
        return passport;
    }

    public void setPassport(String passport) {
        this.passport = passport;
    }

    public String getIssuedBy() {
        return issuedBy;
    }

    public void setIssuedBy(String issuedBy) {
        this.issuedBy = issuedBy;
    }

    public Date getPurveyDate() {
        return purveyDate;
    }

    public void setPurveyDate(Date purveyDate) {
        this.purveyDate = purveyDate;
    }

    public Long getGender() {
        return gender;
    }

    public void setGender(Long gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Long getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(Long createdUser) {
        this.createdUser = createdUser;
    }

    public Long getCreatedGroupId() {
        return createdGroupId;
    }

    public void setCreatedGroupId(Long createdGroupId) {
        this.createdGroupId = createdGroupId;
    }

    public Long getAioAreaId() {
        return aioAreaId;
    }

    public void setAioAreaId(Long aioAreaId) {
        this.aioAreaId = aioAreaId;
    }

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }
}
