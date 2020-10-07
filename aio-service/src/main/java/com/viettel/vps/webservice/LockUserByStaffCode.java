
package com.viettel.vps.webservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for lockUserByStaffCode complex type.
 *
 * <p>The following schema fragment specifies the expected content contained within this class.
 *
 * <pre>
 * &lt;complexType name="lockUserByStaffCode">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="actor" type="{http://webservice.vps.viettel.com/}vpsActor" minOccurs="0"/>
 *         &lt;element name="staffCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="description" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "lockUserByStaffCode", propOrder = {
        "actor",
        "staffCode",
        "description"
})
public class LockUserByStaffCode {

    protected VpsActor actor;
    protected String staffCode;
    protected String description;

    /**
     * Gets the value of the actor property.
     *
     * @return possible object is
     * {@link VpsActor }
     */
    public VpsActor getActor() {
        return actor;
    }

    /**
     * Sets the value of the actor property.
     *
     * @param value allowed object is
     *              {@link VpsActor }
     */
    public void setActor(VpsActor value) {
        this.actor = value;
    }

    /**
     * Gets the value of the staffCode property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getStaffCode() {
        return staffCode;
    }

    /**
     * Sets the value of the staffCode property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setStaffCode(String value) {
        this.staffCode = value;
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

}
