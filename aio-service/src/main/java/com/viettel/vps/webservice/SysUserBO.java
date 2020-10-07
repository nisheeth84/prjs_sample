
package com.viettel.vps.webservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for sysUserBO complex type.
 *
 * <p>The following schema fragment specifies the expected content contained within this class.
 *
 * <pre>
 * &lt;complexType name="sysUserBO">
 *   &lt;complexContent>
 *     &lt;extension base="{http://webservice.vps.viettel.com/}basicBO">
 *       &lt;sequence>
 *         &lt;element name="changePasswordDate" type="{http://www.w3.org/2001/XMLSchema}dateTime" minOccurs="0"/>
 *         &lt;element name="email" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="employeeCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="fullName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="loginName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="needChangePassword" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="password" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="phoneNumber" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="referenceNum" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="status" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="sysUserId" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "sysUserBO", propOrder = {
        "changePasswordDate",
        "email",
        "employeeCode",
        "fullName",
        "loginName",
        "needChangePassword",
        "password",
        "phoneNumber",
        "referenceNum",
        "status",
        "sysUserId"
})
public class SysUserBO
        extends BasicBO {

    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar changePasswordDate;
    protected String email;
    protected String employeeCode;
    protected String fullName;
    protected String loginName;
    protected Long needChangePassword;
    protected String password;
    protected String phoneNumber;
    protected Long referenceNum;
    protected Long status;
    protected Long sysUserId;

    /**
     * Gets the value of the changePasswordDate property.
     *
     * @return possible object is
     * {@link XMLGregorianCalendar }
     */
    public XMLGregorianCalendar getChangePasswordDate() {
        return changePasswordDate;
    }

    /**
     * Sets the value of the changePasswordDate property.
     *
     * @param value allowed object is
     *              {@link XMLGregorianCalendar }
     */
    public void setChangePasswordDate(XMLGregorianCalendar value) {
        this.changePasswordDate = value;
    }

    /**
     * Gets the value of the email property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets the value of the email property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setEmail(String value) {
        this.email = value;
    }

    /**
     * Gets the value of the employeeCode property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getEmployeeCode() {
        return employeeCode;
    }

    /**
     * Sets the value of the employeeCode property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setEmployeeCode(String value) {
        this.employeeCode = value;
    }

    /**
     * Gets the value of the fullName property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getFullName() {
        return fullName;
    }

    /**
     * Sets the value of the fullName property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setFullName(String value) {
        this.fullName = value;
    }

    /**
     * Gets the value of the loginName property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getLoginName() {
        return loginName;
    }

    /**
     * Sets the value of the loginName property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setLoginName(String value) {
        this.loginName = value;
    }

    /**
     * Gets the value of the needChangePassword property.
     *
     * @return possible object is
     * {@link Long }
     */
    public Long getNeedChangePassword() {
        return needChangePassword;
    }

    /**
     * Sets the value of the needChangePassword property.
     *
     * @param value allowed object is
     *              {@link Long }
     */
    public void setNeedChangePassword(Long value) {
        this.needChangePassword = value;
    }

    /**
     * Gets the value of the password property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getPassword() {
        return password;
    }

    /**
     * Sets the value of the password property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setPassword(String value) {
        this.password = value;
    }

    /**
     * Gets the value of the phoneNumber property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getPhoneNumber() {
        return phoneNumber;
    }

    /**
     * Sets the value of the phoneNumber property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setPhoneNumber(String value) {
        this.phoneNumber = value;
    }

    /**
     * Gets the value of the referenceNum property.
     *
     * @return possible object is
     * {@link Long }
     */
    public Long getReferenceNum() {
        return referenceNum;
    }

    /**
     * Sets the value of the referenceNum property.
     *
     * @param value allowed object is
     *              {@link Long }
     */
    public void setReferenceNum(Long value) {
        this.referenceNum = value;
    }

    /**
     * Gets the value of the status property.
     *
     * @return possible object is
     * {@link Long }
     */
    public Long getStatus() {
        return status;
    }

    /**
     * Sets the value of the status property.
     *
     * @param value allowed object is
     *              {@link Long }
     */
    public void setStatus(Long value) {
        this.status = value;
    }

    /**
     * Gets the value of the sysUserId property.
     *
     * @return possible object is
     * {@link Long }
     */
    public Long getSysUserId() {
        return sysUserId;
    }

    /**
     * Sets the value of the sysUserId property.
     *
     * @param value allowed object is
     *              {@link Long }
     */
    public void setSysUserId(Long value) {
        this.sysUserId = value;
    }

}
