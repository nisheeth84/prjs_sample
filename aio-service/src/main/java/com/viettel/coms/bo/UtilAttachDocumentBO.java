/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "CTCT_CAT_OWNER.UTIL_ATTACH_DOCUMENT")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class UtilAttachDocumentBO extends BaseFWModelImpl {

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
    private java.util.Date createdDate;
    private java.lang.Long createdUserId;
    private java.lang.String createdUserName;
    private java.lang.Double longtitude;
    private java.lang.Double latitude;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "CTCT_CAT_OWNER.UTIL_ATTACH_DOCUMENT_SEQ")})
    @Column(name = "UTIL_ATTACH_DOCUMENT_ID", length = 22)
    public java.lang.Long getUtilAttachDocumentId() {
        return utilAttachDocumentId;
    }

    public void setUtilAttachDocumentId(java.lang.Long utilAttachDocumentId) {
        this.utilAttachDocumentId = utilAttachDocumentId;
    }

    @Column(name = "OBJECT_ID", length = 22)
    public java.lang.Long getObjectId() {
        return objectId;
    }

    public void setObjectId(java.lang.Long objectId) {
        this.objectId = objectId;
    }

    @Column(name = "TYPE", length = 2)
    public java.lang.String getType() {
        return type;
    }

    public void setType(java.lang.String type) {
        this.type = type;
    }

    @Column(name = "APP_PARAM_CODE", length = 400)
    public java.lang.String getAppParamCode() {
        return appParamCode;
    }

    public void setAppParamCode(java.lang.String appParamCode) {
        this.appParamCode = appParamCode;
    }

    @Column(name = "CODE", length = 200)
    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    @Column(name = "NAME", length = 2000)
    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
    }

    @Column(name = "ENCRYT_NAME", length = 400)
    public java.lang.String getEncrytName() {
        return encrytName;
    }

    public void setEncrytName(java.lang.String encrytName) {
        this.encrytName = encrytName;
    }

    @Column(name = "DESCRIPTION", length = 2000)
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @Column(name = "STATUS", length = 2)
    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    @Column(name = "FILE_PATH", length = 2000)
    public java.lang.String getFilePath() {
        return filePath;
    }

    public void setFilePath(java.lang.String filePath) {
        this.filePath = filePath;
    }

    @Column(name = "CREATED_DATE", length = 7)
    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    @Column(name = "CREATED_USER_ID", length = 22)
    public java.lang.Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(java.lang.Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    @Column(name = "CREATED_USER_NAME", length = 2000)
    public java.lang.String getCreatedUserName() {
        return createdUserName;
    }

    public void setCreatedUserName(java.lang.String createdUserName) {
        this.createdUserName = createdUserName;
    }

    @Column(name = "LONGTITUDE", length = 38)
    public java.lang.Double getLongtitude() {
        return longtitude;
    }

    public void setLongtitude(java.lang.Double longtitude) {
        this.longtitude = longtitude;
    }

    @Column(name = "LATITUDE", length = 38)
    public java.lang.Double getLatitude() {
        return latitude;
    }

    public void setLatitude(java.lang.Double latitude) {
        this.latitude = latitude;
    }

    @Override
    public UtilAttachDocumentDTO toDTO() {
        UtilAttachDocumentDTO utilAttachDocumentDTO = new UtilAttachDocumentDTO();
        // set cac gia tri
        utilAttachDocumentDTO.setUtilAttachDocumentId(this.utilAttachDocumentId);
        utilAttachDocumentDTO.setObjectId(this.objectId);
        utilAttachDocumentDTO.setType(this.type);
        utilAttachDocumentDTO.setAppParamCode(this.appParamCode);
        utilAttachDocumentDTO.setCode(this.code);
        utilAttachDocumentDTO.setName(this.name);
        utilAttachDocumentDTO.setEncrytName(this.encrytName);
        utilAttachDocumentDTO.setDescription(this.description);
        utilAttachDocumentDTO.setStatus(this.status);
        utilAttachDocumentDTO.setFilePath(this.filePath);
        utilAttachDocumentDTO.setCreatedDate(this.createdDate);
        utilAttachDocumentDTO.setCreatedUserId(this.createdUserId);
        utilAttachDocumentDTO.setCreatedUserName(this.createdUserName);
        utilAttachDocumentDTO.setLongtitude(this.longtitude);
        utilAttachDocumentDTO.setLatitude(this.latitude);
        return utilAttachDocumentDTO;
    }
}
