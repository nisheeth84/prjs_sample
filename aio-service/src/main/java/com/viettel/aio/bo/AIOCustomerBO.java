package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOCustomerDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190313_start
@Entity
@Table(name = "AIO_CUSTOMER")
public class AIOCustomerBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_CUSTOMER_SEQ")})
    @Column(name = "CUSTOMER_ID", length = 10)
    private Long customerId;
    @Column(name = "CODE", length = 50)
    private String code;
    @Column(name = "NAME", length = 20)
    private String name;
    @Column(name = "PHONE", length = 30)
    private String phone;
    @Column(name = "BIRTH", length = 22)
    private Date birth;
    @Column(name = "TAX_CODE", length = 50)
    private String taxCode;
    @Column(name = "SURROGATE", length = 20)
    private String surrogate;
    @Column(name = "POSITION", length = 20)
    private String position;
    @Column(name = "PASSPORT", length = 30)
    private String passport;
    @Column(name = "ISSUED_BY", length = 50)
    private String issuedBy;
    @Column(name = "PURVEY_DATE", length = 22)
    private Date purveyDate;
    @Column(name = "GENDER", length = 1)
    private Long gender;
    @Column(name = "ADDRESS", length = 50)
    private String address;
    @Column(name = "EMAIL", length = 50)
    private String email;
    @Column(name = "TYPE", length = 1)
    private Long type;
    @Column(name = "CREATED_DATE", length = 22)
    private Date createdDate;
    @Column(name = "CREATED_USER", length = 10)
    private Long createdUser;
    @Column(name = "CREATED_GROUP_ID", length = 10)
    private Long createdGroupId;
    @Column(name = "AIO_AREA_ID", length = 10)
    private Long aioAreaId;

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOCustomerDTO dto = new AIOCustomerDTO();
        dto.setCustomerId(this.getCustomerId());
        dto.setCode(this.getCode());
        dto.setName(this.getName());
        dto.setPhone(this.getPhone());
        dto.setBirth(this.getBirth());
        dto.setTaxCode(this.getTaxCode());
        dto.setSurrogate(this.getSurrogate());
        dto.setPosition(this.getPosition());
        dto.setPassport(this.getPassport());
        dto.setIssuedBy(this.getIssuedBy());
        dto.setPurveyDate(this.getPurveyDate());
        dto.setGender(this.getGender());
        dto.setAddress(this.getAddress());
        dto.setEmail(this.getEmail());
        dto.setType(this.getType());
        dto.setCreatedDate(this.getCreatedDate());
        dto.setCreatedUser(this.getCreatedUser());
        dto.setCreatedGroupId(this.getCreatedGroupId());
        dto.setAioAreaId(this.getAioAreaId());
        return dto;
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
}
