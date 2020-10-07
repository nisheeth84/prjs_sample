
package com.viettel.vps.webservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for menuBO complex type.
 *
 * <p>The following schema fragment specifies the expected content contained within this class.
 *
 * <pre>
 * &lt;complexType name="menuBO">
 *   &lt;complexContent>
 *     &lt;extension base="{http://webservice.vps.viettel.com/}basicBO">
 *       &lt;sequence>
 *         &lt;element name="applicationId" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="applicationName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="childrenNum" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="code" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="description" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="fullPath" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="key" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="menuId" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="name" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="parentId" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="path" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="referenceNum" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="sortOrder" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="status" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="url" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "menuBO", propOrder = {
        "applicationId",
        "applicationName",
        "childrenNum",
        "code",
        "description",
        "fullPath",
        "key",
        "menuId",
        "name",
        "parentId",
        "path",
        "referenceNum",
        "sortOrder",
        "status",
        "url"
})
public class MenuBO
        extends BasicBO {

    protected Long applicationId;
    protected String applicationName;
    protected Long childrenNum;
    protected String code;
    protected String description;
    protected String fullPath;
    protected Long key;
    protected Long menuId;
    protected String name;
    protected Long parentId;
    protected String path;
    protected Long referenceNum;
    protected Long sortOrder;
    protected Long status;
    protected String url;

    /**
     * Gets the value of the applicationId property.
     *
     * @return possible object is
     * {@link Long }
     */
    public Long getApplicationId() {
        return applicationId;
    }

    /**
     * Sets the value of the applicationId property.
     *
     * @param value allowed object is
     *              {@link Long }
     */
    public void setApplicationId(Long value) {
        this.applicationId = value;
    }

    /**
     * Gets the value of the applicationName property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getApplicationName() {
        return applicationName;
    }

    /**
     * Sets the value of the applicationName property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setApplicationName(String value) {
        this.applicationName = value;
    }

    /**
     * Gets the value of the childrenNum property.
     *
     * @return possible object is
     * {@link Long }
     */
    public Long getChildrenNum() {
        return childrenNum;
    }

    /**
     * Sets the value of the childrenNum property.
     *
     * @param value allowed object is
     *              {@link Long }
     */
    public void setChildrenNum(Long value) {
        this.childrenNum = value;
    }

    /**
     * Gets the value of the code property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getCode() {
        return code;
    }

    /**
     * Sets the value of the code property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setCode(String value) {
        this.code = value;
    }

    /**
     * Gets the value of the description property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets the value of the description property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setDescription(String value) {
        this.description = value;
    }

    /**
     * Gets the value of the fullPath property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getFullPath() {
        return fullPath;
    }

    /**
     * Sets the value of the fullPath property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setFullPath(String value) {
        this.fullPath = value;
    }

    /**
     * Gets the value of the key property.
     *
     * @return possible object is
     * {@link Long }
     */
    public Long getKey() {
        return key;
    }

    /**
     * Sets the value of the key property.
     *
     * @param value allowed object is
     *              {@link Long }
     */
    public void setKey(Long value) {
        this.key = value;
    }

    /**
     * Gets the value of the menuId property.
     *
     * @return possible object is
     * {@link Long }
     */
    public Long getMenuId() {
        return menuId;
    }

    /**
     * Sets the value of the menuId property.
     *
     * @param value allowed object is
     *              {@link Long }
     */
    public void setMenuId(Long value) {
        this.menuId = value;
    }

    /**
     * Gets the value of the name property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the value of the name property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setName(String value) {
        this.name = value;
    }

    /**
     * Gets the value of the parentId property.
     *
     * @return possible object is
     * {@link Long }
     */
    public Long getParentId() {
        return parentId;
    }

    /**
     * Sets the value of the parentId property.
     *
     * @param value allowed object is
     *              {@link Long }
     */
    public void setParentId(Long value) {
        this.parentId = value;
    }

    /**
     * Gets the value of the path property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getPath() {
        return path;
    }

    /**
     * Sets the value of the path property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setPath(String value) {
        this.path = value;
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
     * Gets the value of the sortOrder property.
     *
     * @return possible object is
     * {@link Long }
     */
    public Long getSortOrder() {
        return sortOrder;
    }

    /**
     * Sets the value of the sortOrder property.
     *
     * @param value allowed object is
     *              {@link Long }
     */
    public void setSortOrder(Long value) {
        this.sortOrder = value;
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
     * Gets the value of the url property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getUrl() {
        return url;
    }

    /**
     * Sets the value of the url property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setUrl(String value) {
        this.url = value;
    }

}
