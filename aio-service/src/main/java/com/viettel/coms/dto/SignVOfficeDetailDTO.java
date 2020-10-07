package com.viettel.coms.dto;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "SIGN_VOFFICE_DETAILBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class SignVOfficeDetailDTO {

    private java.lang.String fullName;
    private java.lang.String email;
    private java.lang.String phoneNumber;
    private java.lang.String orderName;
    private java.lang.String roleName;

    public java.lang.String getFullName() {
        return fullName;
    }

    public void setFullName(java.lang.String fullName) {
        this.fullName = fullName;
    }

    public java.lang.String getEmail() {
        return email;
    }

    public void setEmail(java.lang.String email) {
        this.email = email;
    }

    public java.lang.String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(java.lang.String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public java.lang.String getOrderName() {
        return orderName;
    }

    public void setOrderName(java.lang.String orderName) {
        this.orderName = orderName;
    }

    public java.lang.String getRoleName() {
        return roleName;
    }

    public void setRoleName(java.lang.String roleName) {
        this.roleName = roleName;
    }

}
