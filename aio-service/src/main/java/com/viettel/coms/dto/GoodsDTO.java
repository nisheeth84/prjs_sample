package com.viettel.coms.dto;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.viettel.coms.bo.GoodsBO;
import com.viettel.utils.CustomJsonDateDeserializer;
import com.viettel.utils.CustomJsonDateSerializer;

@SuppressWarnings("serial")
@XmlRootElement(name = "GOODSBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class GoodsDTO extends ComsBaseFWDTO<GoodsBO> {

	private java.lang.Long goodsId;
	private java.lang.String code;
	private java.lang.String name;
	private java.lang.String status;
	private java.lang.Long unitType;
	private java.lang.String goodsType;
	private java.lang.String isSerial;
	private java.lang.Double originPrice;
	private java.lang.Double originSize;
	private java.lang.Double weight;
	private java.lang.Double volumeOrigin;
	private java.lang.Double volumeReal;
	private java.lang.String description;
	private java.lang.Long manufacturerId;
	private java.lang.String manufacturerName;
	private java.lang.Long producingCountryId;
	private java.lang.String producingCountryName;

	private java.lang.Long createdBy;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date createdDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date createdDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date createdDateTo;
	private java.lang.Long updatedBy;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date updatedDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date updatedDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date updatedDateTo;
	private java.lang.String unitTypeName;
	private int start;
	private int maxResult;
    private boolean isSize;
    private Long goodsUnitId;
    
    public Long getGoodsUnitId() {
		return goodsUnitId;
	}
	public void setGoodsUnitId(Long goodsUnitId) {
		this.goodsUnitId = goodsUnitId;
	}
	public boolean getIsSize() {
        return isSize;
    }
    public void setIsSize(boolean isSize) {
        this.isSize = isSize;
    }

    @Override
    public GoodsBO toModel() {
        GoodsBO goodsBO = new GoodsBO();
        goodsBO.setGoodsId(this.goodsId);
        goodsBO.setCode(this.code);
        goodsBO.setName(this.name);
        goodsBO.setStatus(this.status);
        goodsBO.setUnitType(this.unitType);
        goodsBO.setGoodsType(this.goodsType);
        goodsBO.setIsSerial(this.isSerial);
		if (this.isSerial == null || "".equalsIgnoreCase(this.isSerial) || "0".equalsIgnoreCase(this.isSerial)) {
			goodsBO.setIsSerial("0");
		} else {
			goodsBO.setIsSerial("1");
		}
        goodsBO.setOriginPrice(this.originPrice);
        goodsBO.setOriginSize(this.originSize);
        goodsBO.setWeight(this.weight);
        goodsBO.setVolumeOrigin(this.volumeOrigin);
        goodsBO.setVolumeReal(this.volumeReal);
        goodsBO.setDescription(this.description);
        goodsBO.setManufacturerId(this.manufacturerId);
        goodsBO.setProducingCountryId(this.producingCountryId);
        goodsBO.setManufacturerName(this.manufacturerName);
        goodsBO.setProducingCountryName(this.producingCountryName);
        goodsBO.setCreatedBy(this.createdBy);
        goodsBO.setCreatedDate(this.createdDate);
        goodsBO.setUpdatedBy(this.updatedBy);
        goodsBO.setUpdatedDate(this.updatedDate);
        goodsBO.setUnitTypeName(this.unitTypeName);
        return goodsBO;
    }

    @Override
     public Long getFWModelId() {
        return goodsId;
    }
   
    @Override
    public String catchName() {
        return getGoodsId().toString();
    }
	
	@JsonProperty("goodsId")
    public java.lang.Long getGoodsId(){
		return goodsId;
    }
	
    public void setGoodsId(java.lang.Long goodsId){
		this.goodsId = goodsId;
    }	
	
	@JsonProperty("code")
    public java.lang.String getCode(){
		return code;
    }
	
    public void setCode(java.lang.String code){
		this.code = code;
    }	
	
	@JsonProperty("name")
    public java.lang.String getName(){
		return name;
    }
	
    public void setName(java.lang.String name){
		this.name = name;
    }	
	
	@JsonProperty("status")
    public java.lang.String getStatus(){
		return status;
    }
	
    public void setStatus(java.lang.String status){
		this.status = status;
    }	
	
	@JsonProperty("unitType")
    public java.lang.Long getUnitType(){
		return unitType;
    }
	
    public void setUnitType(java.lang.Long unitType){
		this.unitType = unitType;
    }	
	
	@JsonProperty("goodsType")
    public java.lang.String getGoodsType(){
		return goodsType;
    }
	
    public void setGoodsType(java.lang.String goodsType){
		this.goodsType = goodsType;
    }	
	
	@JsonProperty("isSerial")
    public java.lang.String getIsSerial(){
		return isSerial;
    }
	
    public void setIsSerial(java.lang.String isSerial){
		this.isSerial = isSerial;
    }	
	
	@JsonProperty("originPrice")
    public java.lang.Double getOriginPrice(){
		return originPrice;
    }
	
    public void setOriginPrice(java.lang.Double originPrice){
		this.originPrice = originPrice;
    }	
	
	@JsonProperty("originSize")
    public java.lang.Double getOriginSize(){
		return originSize;
    }
	
    public void setOriginSize(java.lang.Double originSize){
		this.originSize = originSize;
    }	
	
	@JsonProperty("weight")
    public java.lang.Double getWeight(){
		return weight;
    }
	
    public void setWeight(java.lang.Double weight){
		this.weight = weight;
    }	
	
	@JsonProperty("volumeOrigin")
    public java.lang.Double getVolumeOrigin(){
		return volumeOrigin;
    }
	
    public void setVolumeOrigin(java.lang.Double volumeOrigin){
		this.volumeOrigin = volumeOrigin;
    }	
	
	@JsonProperty("volumeReal")
    public java.lang.Double getVolumeReal(){
		return volumeReal;
    }
	
    public void setVolumeReal(java.lang.Double volumeReal){
		this.volumeReal = volumeReal;
    }	
	
	@JsonProperty("description")
    public java.lang.String getDescription(){
		return description;
    }
	
    public void setDescription(java.lang.String description){
		this.description = description;
    }	
	
	@JsonProperty("manufacturerId")
    public java.lang.Long getManufacturerId(){
		return manufacturerId;
    }
	
    public void setManufacturerId(java.lang.Long manufacturerId){
		this.manufacturerId = manufacturerId;
    }	
	
	@JsonProperty("manufacturerName")
    public java.lang.String getManufacturerName(){
		return manufacturerName;
    }
	
    public void setManufacturerName(java.lang.String manufacturerName){
		this.manufacturerName = manufacturerName;
    }	
	
	@JsonProperty("producingCountryId")
    public java.lang.Long getProducingCountryId(){
		return producingCountryId;
    }
	
    public void setProducingCountryId(java.lang.Long producingCountryId){
		this.producingCountryId = producingCountryId;
    }	
	
	@JsonProperty("producingCountryName")
    public java.lang.String getProducingCountryName(){
		return producingCountryName;
    }
	
    public void setProducingCountryName(java.lang.String producingCountryName){
		this.producingCountryName = producingCountryName;
    }		
	
	@JsonProperty("createdBy")
    public java.lang.Long getCreatedBy(){
		return createdBy;
    }
	
    public void setCreatedBy(java.lang.Long createdBy){
		this.createdBy = createdBy;
    }	
	
	@JsonProperty("createdDate")
    public java.util.Date getCreatedDate(){
		return createdDate;
    }
	
    public void setCreatedDate(java.util.Date createdDate){
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
	
	@JsonProperty("updatedBy")
    public java.lang.Long getUpdatedBy(){
		return updatedBy;
    }
	
    public void setUpdatedBy(java.lang.Long updatedBy){
		this.updatedBy = updatedBy;
    }	
	
	@JsonProperty("updatedDate")
    public java.util.Date getUpdatedDate(){
		return updatedDate;
    }
	
    public void setUpdatedDate(java.util.Date updatedDate){
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
	
	@JsonProperty("unitTypeName")
    public java.lang.String getUnitTypeName(){
		return unitTypeName;
    }
	
    public void setUnitTypeName(java.lang.String unitTypeName){
		this.unitTypeName = unitTypeName;
    }	
	
	@JsonProperty("start")
	public int getStart() {
		return start;
	}

	public void setStart(int start) {
		this.start = start;
	}

	@JsonProperty("maxResult")
	public int getMaxResult() {
		return maxResult;
	}

	public void setMaxResult(int maxResult) {
		this.maxResult = maxResult;
	}
	
	//Huypq-20190922-start
	private List<String> listGoodsCode;

	public List<String> getListGoodsCode() {
		return listGoodsCode;
	}
	public void setListGoodsCode(List<String> listGoodsCode) {
		this.listGoodsCode = listGoodsCode;
	}
	//huy-end
}
