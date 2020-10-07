
package com.viettel.vps.webservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;
import java.util.ArrayList;
import java.util.List;


/**
 * <p>Java class for authorizedData complex type.
 *
 * <p>The following schema fragment specifies the expected content contained within this class.
 *
 * <pre>
 * &lt;complexType name="authorizedData">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="businessUserPermissions" type="{http://webservice.vps.viettel.com/}userPermissionBO" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="domainDataList" type="{http://webservice.vps.viettel.com/}domainDataBO" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="errorCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="functionList" type="{http://webservice.vps.viettel.com/}sysFunctionBO" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="grantedMenus" type="{http://webservice.vps.viettel.com/}menuBO" maxOccurs="unbounded" minOccurs="0"/>
 *         &lt;element name="user" type="{http://webservice.vps.viettel.com/}sysUserBO" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "authorizedData", propOrder = {
        "businessUserPermissions",
        "domainDataList",
        "errorCode",
        "functionList",
        "grantedMenus",
        "user"
})
public class AuthorizedData {

    @XmlElement(nillable = true)
    protected List<UserPermissionBO> businessUserPermissions;
    @XmlElement(nillable = true)
    protected List<DomainDataBO> domainDataList;
    protected String errorCode;
    @XmlElement(nillable = true)
    protected List<SysFunctionBO> functionList;
    @XmlElement(nillable = true)
    protected List<MenuBO> grantedMenus;
    protected SysUserBO user;

    /**
     * Gets the value of the businessUserPermissions property.
     *
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the businessUserPermissions property.
     *
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getBusinessUserPermissions().add(newItem);
     * </pre>
     *
     *
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link UserPermissionBO }
     */
    public List<UserPermissionBO> getBusinessUserPermissions() {
        if (businessUserPermissions == null) {
            businessUserPermissions = new ArrayList<UserPermissionBO>();
        }
        return this.businessUserPermissions;
    }

    /**
     * Gets the value of the domainDataList property.
     *
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the domainDataList property.
     *
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getDomainDataList().add(newItem);
     * </pre>
     *
     *
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link DomainDataBO }
     */
    public List<DomainDataBO> getDomainDataList() {
        if (domainDataList == null) {
            domainDataList = new ArrayList<DomainDataBO>();
        }
        return this.domainDataList;
    }

    /**
     * Gets the value of the errorCode property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getErrorCode() {
        return errorCode;
    }

    /**
     * Sets the value of the errorCode property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setErrorCode(String value) {
        this.errorCode = value;
    }

    /**
     * Gets the value of the functionList property.
     *
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the functionList property.
     *
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getFunctionList().add(newItem);
     * </pre>
     *
     *
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link SysFunctionBO }
     */
    public List<SysFunctionBO> getFunctionList() {
        if (functionList == null) {
            functionList = new ArrayList<SysFunctionBO>();
        }
        return this.functionList;
    }

    /**
     * Gets the value of the grantedMenus property.
     *
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the grantedMenus property.
     *
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getGrantedMenus().add(newItem);
     * </pre>
     *
     *
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link MenuBO }
     */
    public List<MenuBO> getGrantedMenus() {
        if (grantedMenus == null) {
            grantedMenus = new ArrayList<MenuBO>();
        }
        return this.grantedMenus;
    }

    /**
     * Gets the value of the user property.
     *
     * @return possible object is
     * {@link SysUserBO }
     */
    public SysUserBO getUser() {
        return user;
    }

    /**
     * Sets the value of the user property.
     *
     * @param value allowed object is
     *              {@link SysUserBO }
     */
    public void setUser(SysUserBO value) {
        this.user = value;
    }

}
