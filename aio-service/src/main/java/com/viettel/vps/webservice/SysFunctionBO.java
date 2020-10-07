
package com.viettel.vps.webservice;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for sysFunctionBO complex type.
 *
 * <p>The following schema fragment specifies the expected content contained within this class.
 *
 * <pre>
 * &lt;complexType name="sysFunctionBO">
 *   &lt;complexContent>
 *     &lt;extension base="{http://webservice.vps.viettel.com/}basicBO">
 *       &lt;sequence>
 *         &lt;element name="actionPath" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="applicationId" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="applicationName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="isSaveLog" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *         &lt;element name="name" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="sysFunctionId" type="{http://www.w3.org/2001/XMLSchema}long" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/extension>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "sysFunctionBO", propOrder = {
        "actionPath",
        "applicationId",
        "applicationName",
        "isSaveLog",
        "name",
        "sysFunctionId"
})
public class SysFunctionBO
        extends BasicBO {

    protected String actionPath;
    protected Long applicationId;
    protected String applicationName;
    protected Long isSaveLog;
    protected String name;
    protected Long sysFunctionId;

    /**
     * Gets the value of the actionPath property.
     *
     * @return possible object is
     * {@link String }
     */
    public String getActionPath() {
        return actionPath;
    }

    /**
     * Sets the value of the actionPath property.
     *
     * @param value allowed object is
     *              {@link String }
     */
    public void setActionPath(String value) {
        this.actionPath = value;
    }

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
     * Gets the value of the isSaveLog property.
     *
     * @return possible object is
     * {@link Long }
     */
    public Long getIsSaveLog() {
        return isSaveLog;
    }

    /**
     * Sets the value of the isSaveLog property.
     *
     * @param value allowed object is
     *              {@link Long }
     */
    public void setIsSaveLog(Long value) {
        this.isSaveLog = value;
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
     * Gets the value of the sysFunctionId property.
     *
     * @return possible object is
     * {@link Long }
     */
    public Long getSysFunctionId() {
        return sysFunctionId;
    }

    /**
     * Sets the value of the sysFunctionId property.
     *
     * @param value allowed object is
     *              {@link Long }
     */
    public void setSysFunctionId(Long value) {
        this.sysFunctionId = value;
    }

}
