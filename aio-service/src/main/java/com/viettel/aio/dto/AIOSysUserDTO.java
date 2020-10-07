package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOSysUserBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

//VietNT_20190917_create
@XmlRootElement(name = "SYS_USERBO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIOSysUserDTO extends ComsBaseFWDTO<AIOSysUserBO> {

    public static final Long STATUS_INACTIVE = new Long(0);
    public static final Long STATUS_WAIT_APPROVE = new Long(2);
    public static final Long STATUS_APPROVED = new Long(1);
    public static final Long STATUS_REJECTED = new Long(3);

    public AIOSysUserDTO() {
        sysGroupIds = new ArrayList<>();
    }

    private Long sysUserId;
    private String loginName;
    private String fullName;
    private String password;
    private String employeeCode;
    private String email;
    private String phoneNumber;
    private Long status;
    private Long newId;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date changePasswordDate;
    private Long needChangePassword;
    private Long sysGroupId;
    private String saleChannel;
    private Long parentUserId;
    private Long typeUser;
    private String address;
    private String taxCode;
    private String occupation;

    // dto
    private String sysUserName;
    private String passwordNew;
    private String sysGroupName;
    private String sysGroupLv2Code;
    private List<Long> sysGroupIds;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date createdDate;

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public String getPasswordNew() {
        return passwordNew;
    }

    public void setPasswordNew(String passwordNew) {
        this.passwordNew = passwordNew;
    }

    public String getSysUserName() {
        return sysUserName;
    }

    public void setSysUserName(String sysUserName) {
        this.sysUserName = sysUserName;
    }

    public Long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(Long sysUserId) {
        this.sysUserId = sysUserId;
    }

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getNewId() {
        return newId;
    }

    public void setNewId(Long newId) {
        this.newId = newId;
    }

    public Date getChangePasswordDate() {
        return changePasswordDate;
    }

    public void setChangePasswordDate(Date changePasswordDate) {
        this.changePasswordDate = changePasswordDate;
    }

    public Long getNeedChangePassword() {
        return needChangePassword;
    }

    public void setNeedChangePassword(Long needChangePassword) {
        this.needChangePassword = needChangePassword;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    public String getSaleChannel() {
        return saleChannel;
    }

    public void setSaleChannel(String saleChannel) {
        this.saleChannel = saleChannel;
    }

    public Long getParentUserId() {
        return parentUserId;
    }

    public void setParentUserId(Long parentUserId) {
        this.parentUserId = parentUserId;
    }

    public Long getTypeUser() {
        return typeUser;
    }

    public void setTypeUser(Long typeUser) {
        this.typeUser = typeUser;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getTaxCode() {
        return taxCode;
    }

    public void setTaxCode(String taxCode) {
        this.taxCode = taxCode;
    }

    public List<Long> getSysGroupIds() {
        return sysGroupIds;
    }

    public void setSysGroupIds(List<Long> sysGroupIds) {
        this.sysGroupIds = sysGroupIds;
    }

    public String getSysGroupLv2Code() {
        return sysGroupLv2Code;
    }

    public void setSysGroupLv2Code(String sysGroupLv2Code) {
        this.sysGroupLv2Code = sysGroupLv2Code;
    }

    @Override
    public AIOSysUserBO toModel() {
        AIOSysUserBO bo = new AIOSysUserBO();
        bo.setSysUserId(this.getSysUserId());
        bo.setLoginName(this.getLoginName());
        bo.setFullName(this.getFullName());
        bo.setPassword(this.getPassword());
        bo.setEmployeeCode(this.getEmployeeCode());
        bo.setEmail(this.getEmail());
        bo.setPhoneNumber(this.getPhoneNumber());
        bo.setStatus(this.getStatus());
        bo.setNewId(this.getNewId());
        bo.setChangePasswordDate(this.getChangePasswordDate());
        bo.setNeedChangePassword(this.getNeedChangePassword());
        bo.setSysGroupId(this.getSysGroupId());
        bo.setSaleChannel(this.getSaleChannel());
        bo.setParentUserId(this.getParentUserId());
        bo.setTypeUser(this.getTypeUser());
        bo.setAddress(this.getAddress());
        bo.setTaxCode(this.getTaxCode());
        bo.setOccupation(this.getOccupation());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return sysUserId;
    }

    @Override
    public String catchName() {
        return sysUserId.toString();
    }
}
