package com.viettel.coms.bo;

import com.viettel.coms.dto.CatStationDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.coms.bo.CatStationBO")
@Table(name = "CAT_STATION")
/**
 *
 * @author: hailh10
 */
public class CatStationBO extends BaseFWModelImpl {

    @Column(name = "TYPE", length = 4)
    private java.lang.String type;
    @Column(name = "IS_SYNONIM", length = 4)
    private java.lang.String isSynonim;
    @Column(name = "DESCRIPTION", length = 2000)
    private java.lang.String description;
    @Column(name = "CR_NUMBER", length = 200)
    private java.lang.String crNumber;
    @Column(name = "LATITUDE", length = 22)
    private java.lang.Double latitude;
    @Column(name = "LONGITUDE", length = 22)
    private java.lang.Double longitude;
    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "CAT_STATION_SEQ")})
    @Column(name = "CAT_STATION_ID", length = 22)
    private java.lang.Long catStationId;
    @Column(name = "NAME", length = 400)
    private java.lang.String name;
    @Column(name = "CODE", length = 200)
    private java.lang.String code;
    @Column(name = "ADDRESS", length = 2000)
    private java.lang.String address;
    @Column(name = "STATUS", length = 4)
    private java.lang.String status;
    @Column(name = "START_POINT_ID", length = 22)
    private java.lang.Long startPointId;
    @Column(name = "END_POINT_ID", length = 22)
    private java.lang.Long endPointId;
    @Column(name = "LINE_TYPE_ID", length = 22)
    private java.lang.Long lineTypeId;
    @Column(name = "LINE_LENGTH", length = 22)
    private java.lang.Long lineLength;
    @Column(name = "EMISSION_DATE", length = 7)
    private java.util.Date emissionDate;
    @Column(name = "SCOPE", length = 22)
    private java.lang.Long scope;
    @Column(name = "SCOPE_NAME", length = 100)
    private java.lang.String scopeName;
    @Column(name = "START_POINT_TYPE", length = 2)
    private java.lang.String startPointType;
    @Column(name = "END_POINT_TYPE", length = 2)
    private java.lang.String endPointType;
    @Column(name = "PARENT_ID", length = 22)
    private java.lang.Long parentId;
    @Column(name = "DISTANCE_ODD", length = 22)
    private java.lang.Long distanceOdd;
    @Column(name = "AREA_LOCATION", length = 200)
    private java.lang.String areaLocation;
    @Column(name = "CREATED_DATE", length = 7)
    private java.util.Date createdDate;
    @Column(name = "UPDATED_DATE", length = 7)
    private java.util.Date updatedDate;
    @Column(name = "CREATED_USER", length = 22)
    private java.lang.Long createdUser;
    @Column(name = "UPDATED_USER", length = 22)
    private java.lang.Long updatedUser;
    @Column(name = "CAT_STATION_TYPE_ID", length = 22)
    private java.lang.Long catStationTypeId;
    @Column(name = "CAT_PROVINCE_ID", length = 22)
    private java.lang.Long catProvinceId;
    @Column(name = "CAT_STATION_HOUSE_ID", length = 22)
    private java.lang.Long catStationHouseId;

    public java.lang.String getType() {
        return type;
    }

    public void setType(java.lang.String type) {
        this.type = type;
    }

    public java.lang.String getIsSynonim() {
        return isSynonim;
    }

    public void setIsSynonim(java.lang.String isSynonim) {
        this.isSynonim = isSynonim;
    }

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    public java.lang.String getCrNumber() {
        return crNumber;
    }

    public void setCrNumber(java.lang.String crNumber) {
        this.crNumber = crNumber;
    }

    public java.lang.Double getLatitude() {
        return latitude;
    }

    public void setLatitude(java.lang.Double latitude) {
        this.latitude = latitude;
    }

    public java.lang.Double getLongitude() {
        return longitude;
    }

    public void setLongitude(java.lang.Double longitude) {
        this.longitude = longitude;
    }

    public java.lang.Long getCatStationId() {
        return catStationId;
    }

    public void setCatStationId(java.lang.Long catStationId) {
        this.catStationId = catStationId;
    }

    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
    }

    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    public java.lang.String getAddress() {
        return address;
    }

    public void setAddress(java.lang.String address) {
        this.address = address;
    }

    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    public java.lang.Long getStartPointId() {
        return startPointId;
    }

    public void setStartPointId(java.lang.Long startPointId) {
        this.startPointId = startPointId;
    }

    public java.lang.Long getEndPointId() {
        return endPointId;
    }

    public void setEndPointId(java.lang.Long endPointId) {
        this.endPointId = endPointId;
    }

    public java.lang.Long getLineTypeId() {
        return lineTypeId;
    }

    public void setLineTypeId(java.lang.Long lineTypeId) {
        this.lineTypeId = lineTypeId;
    }

    public java.lang.Long getLineLength() {
        return lineLength;
    }

    public void setLineLength(java.lang.Long lineLength) {
        this.lineLength = lineLength;
    }

    public java.util.Date getEmissionDate() {
        return emissionDate;
    }

    public void setEmissionDate(java.util.Date emissionDate) {
        this.emissionDate = emissionDate;
    }

    public java.lang.Long getScope() {
        return scope;
    }

    public void setScope(java.lang.Long scope) {
        this.scope = scope;
    }

    public java.lang.String getScopeName() {
        return scopeName;
    }

    public void setScopeName(java.lang.String scopeName) {
        this.scopeName = scopeName;
    }

    public java.lang.String getStartPointType() {
        return startPointType;
    }

    public void setStartPointType(java.lang.String startPointType) {
        this.startPointType = startPointType;
    }

    public java.lang.String getEndPointType() {
        return endPointType;
    }

    public void setEndPointType(java.lang.String endPointType) {
        this.endPointType = endPointType;
    }

    public java.lang.Long getParentId() {
        return parentId;
    }

    public void setParentId(java.lang.Long parentId) {
        this.parentId = parentId;
    }

    public java.lang.Long getDistanceOdd() {
        return distanceOdd;
    }

    public void setDistanceOdd(java.lang.Long distanceOdd) {
        this.distanceOdd = distanceOdd;
    }

    public java.lang.String getAreaLocation() {
        return areaLocation;
    }

    public void setAreaLocation(java.lang.String areaLocation) {
        this.areaLocation = areaLocation;
    }

    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    public java.util.Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(java.util.Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public java.lang.Long getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(java.lang.Long createdUser) {
        this.createdUser = createdUser;
    }

    public java.lang.Long getUpdatedUser() {
        return updatedUser;
    }

    public void setUpdatedUser(java.lang.Long updatedUser) {
        this.updatedUser = updatedUser;
    }

    public java.lang.Long getCatStationTypeId() {
        return catStationTypeId;
    }

    public void setCatStationTypeId(java.lang.Long catStationTypeId) {
        this.catStationTypeId = catStationTypeId;
    }

    public java.lang.Long getCatProvinceId() {
        return catProvinceId;
    }

    public void setCatProvinceId(java.lang.Long catProvinceId) {
        this.catProvinceId = catProvinceId;
    }

    public java.lang.Long getCatStationHouseId() {
        return catStationHouseId;
    }

    public void setCatStationHouseId(java.lang.Long catStationHouseId) {
        this.catStationHouseId = catStationHouseId;
    }

    @Override
    public CatStationDTO toDTO() {
        CatStationDTO catStationDTO = new CatStationDTO();
        catStationDTO.setType(this.type);
        catStationDTO.setIsSynonim(this.isSynonim);
        catStationDTO.setDescription(this.description);
        catStationDTO.setCrNumber(this.crNumber);
        catStationDTO.setLatitude(this.latitude);
        catStationDTO.setLongitude(this.longitude);
        catStationDTO.setCatStationId(this.catStationId);
        catStationDTO.setName(this.name);
        catStationDTO.setCode(this.code);
        catStationDTO.setAddress(this.address);
        catStationDTO.setStatus(this.status);
        catStationDTO.setStartPointId(this.startPointId);
        catStationDTO.setEndPointId(this.endPointId);
        catStationDTO.setLineTypeId(this.lineTypeId);
        catStationDTO.setLineLength(this.lineLength);
        catStationDTO.setEmissionDate(this.emissionDate);
        catStationDTO.setScope(this.scope);
        catStationDTO.setScopeName(this.scopeName);
        catStationDTO.setStartPointType(this.startPointType);
        catStationDTO.setEndPointType(this.endPointType);
        catStationDTO.setParentId(this.parentId);
        catStationDTO.setDistanceOdd(this.distanceOdd);
        catStationDTO.setAreaLocation(this.areaLocation);
        catStationDTO.setCreatedDate(this.createdDate);
        catStationDTO.setUpdatedDate(this.updatedDate);
        catStationDTO.setCreatedUser(this.createdUser);
        catStationDTO.setUpdatedUser(this.updatedUser);
        catStationDTO.setCatStationTypeId(this.catStationTypeId);
        catStationDTO.setCatProvinceId(this.catProvinceId);
        catStationDTO.setCatStationHouseId(this.catStationHouseId);
        return catStationDTO;
    }
}
