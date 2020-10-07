
package com.viettel.vps.webservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for updateDomainData complex type.
 *
 * <p>The following schema fragment specifies the expected content contained within this class.
 *
 * <pre>
 * &lt;complexType name="updateDomainData">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="dataId" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="parentId" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="dataCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="dataName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="domainType" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="path" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="fullPath" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="status" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "updateDomainData", propOrder = {
        "dataId",
        "parentId",
        "dataCode",
        "dataName",
        "domainType",
        "path",
        "fullPath",
        "status"
})
public class UpdateDomainData {

    protected Long dataId;
    protected Long parentId;
    protected String dataCode;
    protected String dataName;
    protected String domainType;
    protected String path;
    protected String fullPath;
    protected Long status;

    /**
     * Gets the value of the dataId property.
     *
     * @return possible object is
     * {@link Long }
     */
    public Long getDataId() {
        return dataId;
    }

    /**
     * Sets the value of the dataId property.
     *
     * @param value allowed object is
     *              {@link Long }
     */
    public void setDataId(Long value) {
        this.dataId = value;
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
     * Gets the value of the dataCode property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getDataCode() {
        return dataCode;
    }

    /**
     * Sets the value of the dataCode property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setDataCode(String value) {
        this.dataCode = value;
    }

    /**
     * Gets the value of the dataName property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getDataName() {
        return dataName;
    }

    /**
     * Sets the value of the dataName property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setDataName(String value) {
        this.dataName = value;
    }

    /**
     * Gets the value of the domainType property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getDomainType() {
        return domainType;
    }

    /**
     * Sets the value of the domainType property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setDomainType(String value) {
        this.domainType = value;
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

}
