
package com.viettel.vps.webservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for getAuthorizedDataResponse complex type.
 *
 * <p>The following schema fragment specifies the expected content contained within this class.
 *
 * <pre>
 * &lt;complexType name="getAuthorizedDataResponse">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="return" type="{http://webservice.vps.viettel.com/}authorizedData" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "getAuthorizedDataResponse", propOrder = {
        "_return"
})
public class GetAuthorizedDataResponse {

    @XmlElement(name = "return")
    protected AuthorizedData _return;

    /**
     * Gets the value of the return property.
     *
     * @return possible object is
     * {@link AuthorizedData }
     */
    public AuthorizedData getReturn() {
        return _return;
    }

    /**
     * Sets the value of the return property.
     *
     * @param value allowed object is
     *              {@link AuthorizedData }
     */
    public void setReturn(AuthorizedData value) {
        this._return = value;
    }

}
