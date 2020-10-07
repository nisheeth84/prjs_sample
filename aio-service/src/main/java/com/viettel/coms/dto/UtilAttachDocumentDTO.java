/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.UtilAttachDocumentBO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "UTIL_ATTACH_DOCUMENTBO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class UtilAttachDocumentDTO extends ComsBaseFWDTO<UtilAttachDocumentBO> {

    private java.lang.Long utilAttachDocumentId;
    private java.lang.Long objectId;
    private java.lang.String type;
    private java.lang.String appParamCode;
    private java.lang.String code;
    private java.lang.String name;
    private java.lang.String encrytName;
    private java.lang.String description;
    private java.lang.String status;
    private java.lang.String filePath;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date createdDate;
    private java.lang.Long createdUserId;
    private java.lang.String createdUserName;
    private java.lang.Double longtitude;
    private java.lang.Double latitude;
    private String base64String;
    private String appParamName;
    //hungnx 20180705 start
    private String confirm;
//hungnx 20180705 end
    //VietNT_30/07/2019_start
    // mobile
    private String imageName;
    //VietNT_end
    //tatph-start -11/12/2019
    private String productName;
    private String productPromotion;
    private String productInfo;
    private Double productPrice;
    private String productCode;
    private Long groupProductId;
    private Long key;
    //tatph-end -11/12/2019

    @Override
    public UtilAttachDocumentBO toModel() {
        UtilAttachDocumentBO utilAttachDocumentBO = new UtilAttachDocumentBO();
        utilAttachDocumentBO.setUtilAttachDocumentId(this.utilAttachDocumentId);
        utilAttachDocumentBO.setObjectId(this.objectId);
        utilAttachDocumentBO.setType(this.type);
        utilAttachDocumentBO.setAppParamCode(this.appParamCode);
        utilAttachDocumentBO.setCode(this.code);
        utilAttachDocumentBO.setName(this.name);
        utilAttachDocumentBO.setEncrytName(this.encrytName);
        utilAttachDocumentBO.setDescription(this.description);
        utilAttachDocumentBO.setStatus(this.status);
        utilAttachDocumentBO.setFilePath(this.filePath);
        utilAttachDocumentBO.setCreatedDate(this.createdDate);
        utilAttachDocumentBO.setCreatedUserId(this.createdUserId);
        utilAttachDocumentBO.setCreatedUserName(this.createdUserName);
        utilAttachDocumentBO.setLatitude(this.latitude);
        utilAttachDocumentBO.setLongtitude(this.longtitude);
        return utilAttachDocumentBO;
    }

    public Long getKey() {
        return key;
    }

    public void setKey(Long key) {
        this.key = key;
    }

    @Override
    public Long getFWModelId() {
        return utilAttachDocumentId;
    }

    @Override
    public String catchName() {
        return getUtilAttachDocumentId().toString();
    }

    public String getAppParamName() {
        return appParamName;
    }

    public void setAppParamName(String appParamName) {
        this.appParamName = appParamName;
    }

    public String getBase64String() {
        return base64String;
    }

    public void setBase64String(String base64String) {
        this.base64String = base64String;
    }

    public java.lang.Long getUtilAttachDocumentId() {
        return utilAttachDocumentId;
    }

    public void setUtilAttachDocumentId(java.lang.Long utilAttachDocumentId) {
        this.utilAttachDocumentId = utilAttachDocumentId;
    }

    public java.lang.Long getObjectId() {
        return objectId;
    }

    public void setObjectId(java.lang.Long objectId) {
        this.objectId = objectId;
    }

    public java.lang.String getType() {
        return type;
    }

    public void setType(java.lang.String type) {
        this.type = type;
    }

    public java.lang.String getAppParamCode() {
        return appParamCode;
    }

    public void setAppParamCode(java.lang.String appParamCode) {
        this.appParamCode = appParamCode;
    }

    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
    }

    public java.lang.String getEncrytName() {
        return encrytName;
    }

    public void setEncrytName(java.lang.String encrytName) {
        this.encrytName = encrytName;
    }

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    public java.lang.String getFilePath() {
        return filePath;
    }

    public void setFilePath(java.lang.String filePath) {
        this.filePath = filePath;
    }

    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    public java.lang.Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(java.lang.Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    public java.lang.String getCreatedUserName() {
        return createdUserName;
    }

    public void setCreatedUserName(java.lang.String createdUserName) {
        this.createdUserName = createdUserName;
    }

    public java.lang.Double getLongtitude() {
        return longtitude;
    }

    public void setLongtitude(java.lang.Double longtitude) {
        this.longtitude = longtitude;
    }

    public java.lang.Double getLatitude() {
        return latitude;
    }

    public void setLatitude(java.lang.Double latitude) {
        this.latitude = latitude;
    }

    public String getConfirm() {
        return confirm;
    }

    public void setConfirm(String confirm) {
        this.confirm = confirm;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public Long getGroupProductId() {
        return groupProductId;
    }

    public void setGroupProductId(Long groupProductId) {
        this.groupProductId = groupProductId;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getProductPromotion() {
        return productPromotion;
    }

    public void setProductPromotion(String productPromotion) {
        this.productPromotion = productPromotion;
    }

    public String getProductInfo() {
        return productInfo;
    }

    public void setProductInfo(String productInfo) {
        this.productInfo = productInfo;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Double getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(Double productPrice) {
        this.productPrice = productPrice;
    }
}
