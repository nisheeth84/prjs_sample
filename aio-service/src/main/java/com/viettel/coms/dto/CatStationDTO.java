package com.viettel.coms.dto;

import com.viettel.coms.bo.CatStationBO;
import com.viettel.erp.utils.CustomJsonDateDeserializer;
import com.viettel.erp.utils.CustomJsonDateSerializer;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author hailh10
 */
@SuppressWarnings("serial")
@XmlRootElement(name = "CAT_STATIONBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CatStationDTO extends ComsBaseFWDTO<CatStationBO> {

    private java.lang.String type;
    private java.lang.String isSynonim;
    private java.lang.String description;
    private java.lang.String crNumber;
    private java.lang.Double latitude;
    private java.lang.Double longitude;
    private java.lang.Long catStationId;
    private java.lang.String name;
    private java.lang.String code;
    private java.lang.String address;
    private java.lang.String status;
    private java.lang.Long startPointId;
    private java.lang.String startPointName;
    private java.lang.Long endPointId;
    private java.lang.String endPointName;
    private java.lang.Long lineTypeId;
    private java.lang.String lineTypeName;
    private java.lang.Long lineLength;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date emissionDate;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date emissionDateFrom;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date emissionDateTo;
    private java.lang.Long scope;
    private java.lang.String scopeName;
    private java.lang.String startPointType;
    private java.lang.String endPointType;
    private java.lang.Long parentId;
    private java.lang.String parentName;
    private java.lang.Long distanceOdd;
    private java.lang.String areaLocation;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date createdDate;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date createdDateFrom;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date createdDateTo;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date updatedDate;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date updatedDateFrom;
    @JsonDeserialize(using = CustomJsonDateDeserializer.class)
    @JsonSerialize(using = CustomJsonDateSerializer.class)
    private java.util.Date updatedDateTo;
    private java.lang.Long createdUser;
    private java.lang.Long updatedUser;
    private java.lang.Long catStationTypeId;
    private java.lang.String catStationTypeName;
    private java.lang.Long catProvinceId;
    private java.lang.String catProvinceName;
    private java.lang.Long catStationHouseId;
    private java.lang.String catStationHouseName;
    private String text;
    private int start;
    private int maxResult;

    @Override
    public CatStationBO toModel() {
        CatStationBO catStationBO = new CatStationBO();
        catStationBO.setType(this.type);
        catStationBO.setIsSynonim(this.isSynonim);
        if (this.isSynonim == null || "".equalsIgnoreCase(this.isSynonim) || "N".equalsIgnoreCase(this.isSynonim)) {
            catStationBO.setIsSynonim("N");
        } else {
            catStationBO.setIsSynonim("Y");
        }
        catStationBO.setDescription(this.description);
        catStationBO.setCrNumber(this.crNumber);
        catStationBO.setLatitude(this.latitude);
        catStationBO.setLongitude(this.longitude);
        catStationBO.setCatStationId(this.catStationId);
        catStationBO.setName(this.name);
        catStationBO.setCode(this.code);
        catStationBO.setAddress(this.address);
        catStationBO.setStatus(this.status);
        catStationBO.setStartPointId(this.startPointId);
        catStationBO.setEndPointId(this.endPointId);
        catStationBO.setLineTypeId(this.lineTypeId);
        catStationBO.setLineLength(this.lineLength);
        catStationBO.setEmissionDate(this.emissionDate);
        catStationBO.setScope(this.scope);
        catStationBO.setScopeName(this.scopeName);
        catStationBO.setStartPointType(this.startPointType);
        catStationBO.setEndPointType(this.endPointType);
        catStationBO.setParentId(this.parentId);
        catStationBO.setDistanceOdd(this.distanceOdd);
        catStationBO.setAreaLocation(this.areaLocation);
        catStationBO.setCreatedDate(this.createdDate);
        catStationBO.setUpdatedDate(this.updatedDate);
        catStationBO.setCreatedUser(this.createdUser);
        catStationBO.setUpdatedUser(this.updatedUser);
        catStationBO.setCatStationTypeId(this.catStationTypeId);
        catStationBO.setCatProvinceId(this.catProvinceId);
        catStationBO.setCatStationHouseId(this.catStationHouseId);
        return catStationBO;
    }

    @JsonProperty("type")
    public java.lang.String getType() {
        return type;
    }

    public void setType(java.lang.String type) {
        this.type = type;
    }

    @JsonProperty("isSynonim")
    public java.lang.String getIsSynonim() {
        return isSynonim;
    }

    public void setIsSynonim(java.lang.String isSynonim) {
        this.isSynonim = isSynonim;
    }

    @JsonProperty("description")
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @JsonProperty("crNumber")
    public java.lang.String getCrNumber() {
        return crNumber;
    }

    public void setCrNumber(java.lang.String crNumber) {
        this.crNumber = crNumber;
    }

    @JsonProperty("latitude")
    public java.lang.Double getLatitude() {
        return latitude;
    }

    public void setLatitude(java.lang.Double latitude) {
        this.latitude = latitude;
    }

    @JsonProperty("longitude")
    public java.lang.Double getLongitude() {
        return longitude;
    }

    public void setLongitude(java.lang.Double longitude) {
        this.longitude = longitude;
    }

    @Override
    public Long getFWModelId() {
        return catStationId;
    }

    @Override
    public String catchName() {
        return getCatStationId().toString();
    }

    @JsonProperty("catStationId")
    public java.lang.Long getCatStationId() {
        return catStationId;
    }

    public void setCatStationId(java.lang.Long catStationId) {
        this.catStationId = catStationId;
    }

    @JsonProperty("name")
    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
    }

    @JsonProperty("code")
    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    @JsonProperty("address")
    public java.lang.String getAddress() {
        return address;
    }

    public void setAddress(java.lang.String address) {
        this.address = address;
    }

    @JsonProperty("status")
    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    @JsonProperty("startPointId")
    public java.lang.Long getStartPointId() {
        return startPointId;
    }

    public void setStartPointId(java.lang.Long startPointId) {
        this.startPointId = startPointId;
    }

    @JsonProperty("startPointName")
    public java.lang.String getStartPointName() {
        return startPointName;
    }

    public void setStartPointName(java.lang.String startPointName) {
        this.startPointName = startPointName;
    }

    @JsonProperty("endPointId")
    public java.lang.Long getEndPointId() {
        return endPointId;
    }

    public void setEndPointId(java.lang.Long endPointId) {
        this.endPointId = endPointId;
    }

    @JsonProperty("endPointName")
    public java.lang.String getEndPointName() {
        return endPointName;
    }

    public void setEndPointName(java.lang.String endPointName) {
        this.endPointName = endPointName;
    }

    @JsonProperty("lineTypeId")
    public java.lang.Long getLineTypeId() {
        return lineTypeId;
    }

    public void setLineTypeId(java.lang.Long lineTypeId) {
        this.lineTypeId = lineTypeId;
    }

    @JsonProperty("lineTypeName")
    public java.lang.String getLineTypeName() {
        return lineTypeName;
    }

    public void setLineTypeName(java.lang.String lineTypeName) {
        this.lineTypeName = lineTypeName;
    }

    @JsonProperty("lineLength")
    public java.lang.Long getLineLength() {
        return lineLength;
    }

    public void setLineLength(java.lang.Long lineLength) {
        this.lineLength = lineLength;
    }

    @JsonProperty("emissionDate")
    public java.util.Date getEmissionDate() {
        return emissionDate;
    }

    public void setEmissionDate(java.util.Date emissionDate) {
        this.emissionDate = emissionDate;
    }

    public java.util.Date getEmissionDateFrom() {
        return emissionDateFrom;
    }

    public void setEmissionDateFrom(java.util.Date emissionDateFrom) {
        this.emissionDateFrom = emissionDateFrom;
    }

    public java.util.Date getEmissionDateTo() {
        return emissionDateTo;
    }

    public void setEmissionDateTo(java.util.Date emissionDateTo) {
        this.emissionDateTo = emissionDateTo;
    }

    @JsonProperty("scope")
    public java.lang.Long getScope() {
        return scope;
    }

    public void setScope(java.lang.Long scope) {
        this.scope = scope;
    }

    @JsonProperty("scopeName")
    public java.lang.String getScopeName() {
        return scopeName;
    }

    public void setScopeName(java.lang.String scopeName) {
        this.scopeName = scopeName;
    }

    @JsonProperty("startPointType")
    public java.lang.String getStartPointType() {
        return startPointType;
    }

    public void setStartPointType(java.lang.String startPointType) {
        this.startPointType = startPointType;
    }

    @JsonProperty("endPointType")
    public java.lang.String getEndPointType() {
        return endPointType;
    }

    public void setEndPointType(java.lang.String endPointType) {
        this.endPointType = endPointType;
    }

    @JsonProperty("parentId")
    public java.lang.Long getParentId() {
        return parentId;
    }

    public void setParentId(java.lang.Long parentId) {
        this.parentId = parentId;
    }

    @JsonProperty("parentName")
    public java.lang.String getParentName() {
        return parentName;
    }

    public void setParentName(java.lang.String parentName) {
        this.parentName = parentName;
    }

    @JsonProperty("distanceOdd")
    public java.lang.Long getDistanceOdd() {
        return distanceOdd;
    }

    public void setDistanceOdd(java.lang.Long distanceOdd) {
        this.distanceOdd = distanceOdd;
    }

    @JsonProperty("areaLocation")
    public java.lang.String getAreaLocation() {
        return areaLocation;
    }

    public void setAreaLocation(java.lang.String areaLocation) {
        this.areaLocation = areaLocation;
    }

    @JsonProperty("createdDate")
    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    public java.util.Date getCreatedDateFrom() {
        return createdDateFrom;
    }

    public void setCreatedDateFrom(java.util.Date createdDateFrom) {
        this.createdDateFrom = createdDateFrom;
    }

    public java.util.Date getCreatedDateTo() {
        return createdDateTo;
    }

    public void setCreatedDateTo(java.util.Date createdDateTo) {
        this.createdDateTo = createdDateTo;
    }

    @JsonProperty("updatedDate")
    public java.util.Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(java.util.Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public java.util.Date getUpdatedDateFrom() {
        return updatedDateFrom;
    }

    public void setUpdatedDateFrom(java.util.Date updatedDateFrom) {
        this.updatedDateFrom = updatedDateFrom;
    }

    public java.util.Date getUpdatedDateTo() {
        return updatedDateTo;
    }

    public void setUpdatedDateTo(java.util.Date updatedDateTo) {
        this.updatedDateTo = updatedDateTo;
    }

    @JsonProperty("createdUser")
    public java.lang.Long getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(java.lang.Long createdUser) {
        this.createdUser = createdUser;
    }

    @JsonProperty("updatedUser")
    public java.lang.Long getUpdatedUser() {
        return updatedUser;
    }

    public void setUpdatedUser(java.lang.Long updatedUser) {
        this.updatedUser = updatedUser;
    }

    @JsonProperty("catStationTypeId")
    public java.lang.Long getCatStationTypeId() {
        return catStationTypeId;
    }

    public void setCatStationTypeId(java.lang.Long catStationTypeId) {
        this.catStationTypeId = catStationTypeId;
    }

    @JsonProperty("catStationTypeName")
    public java.lang.String getCatStationTypeName() {
        return catStationTypeName;
    }

    public void setCatStationTypeName(java.lang.String catStationTypeName) {
        this.catStationTypeName = catStationTypeName;
    }

    @JsonProperty("catProvinceId")
    public java.lang.Long getCatProvinceId() {
        return catProvinceId;
    }

    public void setCatProvinceId(java.lang.Long catProvinceId) {
        this.catProvinceId = catProvinceId;
    }

    @JsonProperty("catProvinceName")
    public java.lang.String getCatProvinceName() {
        return catProvinceName;
    }

    public void setCatProvinceName(java.lang.String catProvinceName) {
        this.catProvinceName = catProvinceName;
    }

    @JsonProperty("catStationHouseId")
    public java.lang.Long getCatStationHouseId() {
        return catStationHouseId;
    }

    public void setCatStationHouseId(java.lang.Long catStationHouseId) {
        this.catStationHouseId = catStationHouseId;
    }

    @JsonProperty("catStationHouseName")
    public java.lang.String getCatStationHouseName() {
        return catStationHouseName;
    }

    public void setCatStationHouseName(java.lang.String catStationHouseName) {
        this.catStationHouseName = catStationHouseName;
    }

}
