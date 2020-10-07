
package com.viettel.vps.webservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for lockUserByStaffCodeResponse complex type.
 *
 * <p>The following schema fragment specifies the expected content contained within this class.
 *
 * <pre>
 * &lt;complexType name="lockUserByStaffCodeResponse">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="return" type="{http://webservice.vps.viettel.com/}lockUserResult" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "lockUserByStaffCodeResponse", propOrder = {
        "_return"
})
public class LockUserByStaffCodeResponse {

    @XmlElement(name = "return")
    protected LockUserResult _return;

    /**
     * Gets the value of the return property.
     *
     * @return possible object is
     * {@link LockUserResult }
     */
    public LockUserResult getReturn() {
        return _return;
    }

    /**
     * Sets the value of the return property.
     *
     * @param value allowed object is
     *              {@link LockUserResult }
     */
    public void setReturn(LockUserResult value) {
        this._return = value;
    }

}
