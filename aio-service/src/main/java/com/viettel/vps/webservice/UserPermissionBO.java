
package com.viettel.vps.webservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for userPermissionBO complex type.
 *
 * <p>The following schema fragment specifies the expected content contained within this class.
 *
 * <pre>
 * &lt;complexType name="userPermissionBO">
 *   &lt;complexContent>
 *     &lt;extension base="{http://webservice.vps.viettel.com/}basicBO">
 *       &lt;sequence>
 *         &lt;element name="defaultId" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="domainDataList" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="permissionCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="permissionId" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="permissionName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="sysUserId" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="userPermissionId" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "userPermissionBO", propOrder = {
        "defaultId",
        "domainDataList",
        "permissionCode",
        "permissionId",
        "permissionName",
        "sysUserId",
        "userPermissionId"
})
public class UserPermissionBO
        extends BasicBO {

    protected Long defaultId;
    protected String domainDataList;
    protected String permissionCode;
    protected Long permissionId;
    protected String permissionName;
    protected Long sysUserId;
    protected Long userPermissionId;

    /**
     * Gets the value of the defaultId property.
     *
     * @return possible object is
     * {@link Long }
     */
    public Long getDefaultId() {
        return defaultId;
    }

    /**
     * Sets the value of the defaultId property.
     *
     * @param value allowed object is
     *              {@link Long }
     */
    public void setDefaultId(Long value) {
        this.defaultId = value;
    }

    /**
     * Gets the value of the domainDataList property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getDomainDataList() {
        return domainDataList;
    }

    /**
     * Sets the value of the domainDataList property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setDomainDataList(String value) {
        this.domainDataList = value;
    }

    /**
     * Gets the value of the permissionCode property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getPermissionCode() {
        return permissionCode;
    }

    /**
     * Sets the value of the permissionCode property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setPermissionCode(String value) {
        this.permissionCode = value;
    }

    /**
     * Gets the value of the permissionId property.
     *
     * @return possible object is
     * {@link Long }
     */
    public Long getPermissionId() {
        return permissionId;
    }

    /**
     * Sets the value of the permissionId property.
     *
     * @param value allowed object is
     *              {@link Long }
     */
    public void setPermissionId(Long value) {
        this.permissionId = value;
    }

    /**
     * Gets the value of the permissionName property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getPermissionName() {
        return permissionName;
    }

    /**
     * Sets the value of the permissionName property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setPermissionName(String value) {
        this.permissionName = value;
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

    /**
     * Gets the value of the userPermissionId property.
     *
     * @return possible object is
     * {@link Long }
     */
    public Long getUserPermissionId() {
        return userPermissionId;
    }

    /**
     * Sets the value of the userPermissionId property.
     *
     * @param value allowed object is
     *              {@link Long }
     */
    public void setUserPermissionId(Long value) {
        this.userPermissionId = value;
    }

}
