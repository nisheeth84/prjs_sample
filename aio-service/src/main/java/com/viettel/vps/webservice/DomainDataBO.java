
package com.viettel.vps.webservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for domainDataBO complex type.
 *
 * <p>The following schema fragment specifies the expected content contained within this class.
 *
 * <pre>
 * &lt;complexType name="domainDataBO">
 *   &lt;complexContent>
 *     &lt;extension base="{http://webservice.vps.viettel.com/}basicBO">
 *       &lt;sequence>
 *         &lt;element name="dataCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="dataId" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="dataName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="domainDataId" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="domainTypeId" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="domainTypeName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="endDate" type="{http://www.w3.org/2001/XMLSchema}dateTime" minOccurs="0"/>
 *         &lt;element name="fullPath" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="isActive" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="parentId" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="path" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="pathLevel" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="startDate" type="{http://www.w3.org/2001/XMLSchema}dateTime" minOccurs="0"/>
 *         &lt;element name="status" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "domainDataBO", propOrder = {
        "dataCode",
        "dataId",
        "dataName",
        "domainDataId",
        "domainTypeId",
        "domainTypeName",
        "endDate",
        "fullPath",
        "isActive",
        "parentId",
        "path",
        "pathLevel",
        "startDate",
        "status"
})
public class DomainDataBO
        extends BasicBO {

    protected String dataCode;
    protected Long dataId;
    protected String dataName;
    protected Long domainDataId;
    protected Long domainTypeId;
    protected String domainTypeName;
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar endDate;
    protected String fullPath;
    protected Long isActive;
    protected Long parentId;
    protected String path;
    protected Long pathLevel;
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar startDate;
    protected Long status;

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
     * Gets the value of the domainDataId property.
     *
     * @return possible object is
     * {@link Long }
     */
    public Long getDomainDataId() {
        return domainDataId;
    }

    /**
     * Sets the value of the domainDataId property.
     *
     * @param value allowed object is
     *              {@link Long }
     */
    public void setDomainDataId(Long value) {
        this.domainDataId = value;
    }

    /**
     * Gets the value of the domainTypeId property.
     *
     * @return possible object is
     * {@link Long }
     */
    public Long getDomainTypeId() {
        return domainTypeId;
    }

    /**
     * Sets the value of the domainTypeId property.
     *
     * @param value allowed object is
     *              {@link Long }
     */
    public void setDomainTypeId(Long value) {
        this.domainTypeId = value;
    }

    /**
     * Gets the value of the domainTypeName property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getDomainTypeName() {
        return domainTypeName;
    }

    /**
     * Sets the value of the domainTypeName property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setDomainTypeName(String value) {
        this.domainTypeName = value;
    }

    /**
     * Gets the value of the endDate property.
     *
     * @return possible object is
     * {@link XMLGregorianCalendar }
     */
    public XMLGregorianCalendar getEndDate() {
        return endDate;
    }

    /**
     * Sets the value of the endDate property.
     *
     * @param value allowed object is
     *              {@link XMLGregorianCalendar }
     */
    public void setEndDate(XMLGregorianCalendar value) {
        this.endDate = value;
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
     * Gets the value of the isActive property.
     *
     * @return possible object is
     * {@link Long }
     */
    public Long getIsActive() {
        return isActive;
    }

    /**
     * Sets the value of the isActive property.
     *
     * @param value allowed object is
     *              {@link Long }
     */
    public void setIsActive(Long value) {
        this.isActive = value;
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
     * Gets the value of the pathLevel property.
     *
     * @return possible object is
     * {@link Long }
     */
    public Long getPathLevel() {
        return pathLevel;
    }

    /**
     * Sets the value of the pathLevel property.
     *
     * @param value allowed object is
     *              {@link Long }
     */
    public void setPathLevel(Long value) {
        this.pathLevel = value;
    }

    /**
     * Gets the value of the startDate property.
     *
     * @return possible object is
     * {@link XMLGregorianCalendar }
     */
    public XMLGregorianCalendar getStartDate() {
        return startDate;
    }

    /**
     * Sets the value of the startDate property.
     *
     * @param value allowed object is
     *              {@link XMLGregorianCalendar }
     */
    public void setStartDate(XMLGregorianCalendar value) {
        this.startDate = value;
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
